process.env.NODE_ENV = "test";

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

let server;
let baseUrl;
let prisma;
let disconnectDatabase;
let setTestDispatchInterceptor;

const suffix = Date.now().toString().slice(-6);
const createdIds = {
  userIds: [],
  tpsContactIds: [],
  wastePointIds: [],
  educationIds: [],
  reportGroupIds: [],
};

async function api(path, { method = "GET", token = null, body = null } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== null) headers["Content-Type"] = "application/json";

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body !== null ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  return { status: res.status, body: json };
}

describe("Fase 3 — End-to-End Core Workflow & Security Tests", () => {
  let operatorToken;
  let kaderToken;
  let tpsContactId;
  let wastePoints = [];
  let inactiveWastePointId;
  let publishedSlug;
  let draftSlug;

  before(async () => {
    const [{ default: app }, dbMod, waMod] = await Promise.all([
      import("../src/app.js"),
      import("../src/config/database.js"),
      import("../src/services/whatsapp.service.js"),
    ]);

    prisma = dbMod.prisma;
    disconnectDatabase = dbMod.disconnectDatabase;
    setTestDispatchInterceptor = waMod.setTestDispatchInterceptor;

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        baseUrl = `http://127.0.0.1:${server.address().port}`;
        resolve();
      });
    });

    // Login Operator
    const loginOp = await api("/api/v1/auth/login", {
      method: "POST",
      body: {
        username: process.env.SEED_OPERATOR_USERNAME || "operator",
        password: process.env.SEED_OPERATOR_PASSWORD || "ChangeMe123!",
      },
    });
    assert.equal(loginOp.status, 200);
    operatorToken = loginOp.body.data.accessToken;
  });

  after(async () => {
    if (setTestDispatchInterceptor) setTestDispatchInterceptor(null);

    // Cleanup data uji secara berurutan sesuai foreign key
    if (prisma) {
      if (createdIds.reportGroupIds.length > 0) {
        const reports = await prisma.report.findMany({
          where: { groupId: { in: createdIds.reportGroupIds } },
          select: { id: true },
        });
        const reportIds = reports.map((r) => r.id);
        const tasks = await prisma.collectionTask.findMany({
          where: { groupId: { in: createdIds.reportGroupIds } },
          select: { id: true },
        });
        const taskIds = tasks.map((t) => t.id);

        if (reportIds.length > 0) {
          await prisma.reportStatusHistory.deleteMany({ where: { reportId: { in: reportIds } } });
          await prisma.reportPhoto.deleteMany({ where: { reportId: { in: reportIds } } });
          await prisma.report.deleteMany({ where: { id: { in: reportIds } } });
        }
        if (taskIds.length > 0) {
          await prisma.whatsappLog.deleteMany({ where: { collectionTaskId: { in: taskIds } } });
          await prisma.collectionTask.deleteMany({ where: { id: { in: taskIds } } });
        }
        await prisma.reportGroup.deleteMany({ where: { id: { in: createdIds.reportGroupIds } } });
      }

      if (createdIds.educationIds.length > 0) {
        await prisma.educationContent.deleteMany({ where: { id: { in: createdIds.educationIds } } });
      }
      if (createdIds.wastePointIds.length > 0) {
        await prisma.wastePoint.deleteMany({ where: { id: { in: createdIds.wastePointIds } } });
      }
      if (createdIds.tpsContactIds.length > 0) {
        await prisma.tpsContact.deleteMany({ where: { id: { in: createdIds.tpsContactIds } } });
      }
      if (createdIds.userIds.length > 0) {
        await prisma.activityLog.deleteMany({ where: { userId: { in: createdIds.userIds } } });
        await prisma.user.deleteMany({ where: { id: { in: createdIds.userIds } } });
      }
    }

    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    if (disconnectDatabase) {
      await disconnectDatabase();
    }
  });

  it("1. Operator menyiapkan Kader, kontak TPS, titik sampah, & edukasi; RBAC menolak lintas role", async () => {
    // Buat akun Kader
    const kaderUsername = `kader_test_${suffix}`;
    const createKader = await api("/api/v1/operator/users", {
      method: "POST",
      token: operatorToken,
      body: {
        name: "Kader Uji",
        username: kaderUsername,
        password: "KaderPassword123!",
      },
    });
    assert.equal(createKader.status, 201);
    assert.equal(createKader.body.data.role, "KADER");
    assert.equal(createKader.body.data.passwordHash, undefined);
    createdIds.userIds.push(createKader.body.data.id);

    // Login sebagai Kader
    const loginKader = await api("/api/v1/auth/login", {
      method: "POST",
      body: { username: kaderUsername, password: "KaderPassword123!" },
    });
    assert.equal(loginKader.status, 200);
    kaderToken = loginKader.body.data.accessToken;

    // RBAC: Kader dilarang akses Operator dashboard & master data
    const kaderToOp = await api("/api/v1/operator/dashboard", { token: kaderToken });
    assert.equal(kaderToOp.status, 403);

    // Warga tanpa login dilarang membuat laporan
    const wargaCreate = await api("/api/v1/kader/report-groups", {
      method: "POST",
      body: { items: [] },
    });
    assert.equal(wargaCreate.status, 401);

    // Buat kontak TPS aktif
    const createTps = await api("/api/v1/operator/tps-contacts", {
      method: "POST",
      token: operatorToken,
      body: {
        name: `TPS Uji ${suffix}`,
        phoneNumber: `62812${suffix}99`,
      },
    });
    assert.equal(createTps.status, 201);
    tpsContactId = createTps.body.data.id;
    createdIds.tpsContactIds.push(tpsContactId);

    // Buat 3 titik sampah aktif & 1 nonaktif
    for (let i = 1; i <= 3; i += 1) {
      const wp = await api("/api/v1/operator/waste-points", {
        method: "POST",
        token: operatorToken,
        body: {
          name: `Pos Uji RT 0${i} (${suffix})`,
          address: `Jl. Uji No. ${i}`,
          latitude: -6.2 - i * 0.001,
          longitude: 106.8 + i * 0.001,
        },
      });
      assert.equal(wp.status, 201);
      wastePoints.push(wp.body.data);
      createdIds.wastePointIds.push(wp.body.data.id);
    }

    const inactiveWp = await api("/api/v1/operator/waste-points", {
      method: "POST",
      token: operatorToken,
      body: {
        name: `Pos Nonaktif (${suffix})`,
        address: "Jl. Nonaktif",
        isActive: false,
      },
    });
    assert.equal(inactiveWp.status, 201);
    inactiveWastePointId = inactiveWp.body.data.id;
    createdIds.wastePointIds.push(inactiveWastePointId);

    // Buat 1 edukasi PUBLISHED & 1 DRAFT
    const eduPub = await api("/api/v1/operator/education", {
      method: "POST",
      token: operatorToken,
      body: {
        title: `Pilah Sampah ${suffix}`,
        content: "Panduan lengkap memilah sampah organik dan anorganik di rumah tangga.",
        category: "Pemilahan",
        status: "PUBLISHED",
      },
    });
    assert.equal(eduPub.status, 201);
    publishedSlug = eduPub.body.data.slug;
    createdIds.educationIds.push(eduPub.body.data.id);

    const eduDraft = await api("/api/v1/operator/education", {
      method: "POST",
      token: operatorToken,
      body: {
        title: `Draft Edukasi ${suffix}`,
        content: "Konten draft internal yang belum boleh tampil di halaman warga.",
        status: "DRAFT",
      },
    });
    assert.equal(eduDraft.status, 201);
    draftSlug = eduDraft.body.data.slug;
    createdIds.educationIds.push(eduDraft.body.data.id);

    // Kader hanya melihat titik sampah aktif
    const kaderWpList = await api(`/api/v1/kader/waste-points?search=${suffix}`, {
      token: kaderToken,
    });
    assert.equal(kaderWpList.status, 200);
    assert.equal(kaderWpList.body.data.length, 3);
    assert.ok(kaderWpList.body.data.every((p) => p.isActive === true));
  });

  it("2. Kader membuat grup 3 laporan (fallback TPS, 1 WA teks+link, anti duplikasi, Public DTO aman) dan TPS menyelesaikan secara paralel", async () => {
    const dispatchedMessages = [];
    setTestDispatchInterceptor(async (payload) => {
      dispatchedMessages.push(payload);
      return { providerMessageId: `test_msg_${dispatchedMessages.length}` };
    });

    // Kader mengirim 3 titik sampah dalam 1 grup tanpa tpsContactId (fallback kontak aktif)
    const createGroup = await api("/api/v1/kader/report-groups", {
      method: "POST",
      token: kaderToken,
      body: {
        items: wastePoints.map((wp, idx) => ({
          wastePointId: wp.id,
          category: "Sampah Rumah Tangga",
          description: `Tumpukan titik ${idx + 1}`,
        })),
      },
    });

    assert.equal(createGroup.status, 201);
    const groupData = createGroup.body.data;
    createdIds.reportGroupIds.push(groupData.id);

    assert.match(groupData.groupCode, /^GRP-\d{4}-\d{3,}$/);
    assert.equal(groupData.reports.length, 3);
    assert.ok(groupData.reports.every((r) => r.status === "PENDING"));
    assert.equal(groupData.collectionTask.status, "ACTIVE");
    assert.equal(groupData.collectionTask.tokenHash, undefined, "tokenHash tidak boleh terekspos");
    assert.equal(groupData.whatsappNotification.status, "SENT");

    // Verifikasi hanya 1 pesan WA dikirim, berupa teks + link, tanpa foto
    assert.equal(dispatchedMessages.length, 1);
    const waMsg = dispatchedMessages[0];
    assert.ok(waMsg.rawToken && waMsg.rawToken.length === 64);
    assert.match(waMsg.messageBody, /Jumlah titik: 3/);
    assert.ok(waMsg.messageBody.includes(`/collection/${waMsg.rawToken}`));
    assert.ok(!waMsg.redactedMessage.includes(waMsg.rawToken), "Log WA tidak boleh menyimpan raw token");

    // Verifikasi durasi kedaluwarsa ~48 jam
    const hoursDiff =
      (new Date(groupData.collectionTask.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60);
    assert.ok(hoursDiff > 47.5 && hoursDiff <= 48.1, `Expiry harus ~48 jam, dapat ${hoursDiff}`);

    // Cegah duplikasi laporan aktif pada titik sampah yang sama
    const duplicateAttempt = await api("/api/v1/kader/report-groups", {
      method: "POST",
      token: kaderToken,
      body: {
        items: [{ wastePointId: wastePoints[0].id }],
      },
    });
    assert.equal(duplicateAttempt.status, 409);
    assert.equal(duplicateAttempt.body.error.code, "CONFLICT");

    // Public API — Warga membaca laporan & edukasi tanpa kebocoran data pribadi
    const pubReport = await api(`/api/v1/public/reports/${groupData.reports[0].reportCode}`);
    assert.equal(pubReport.status, 200);
    assert.equal(pubReport.body.data.status, "PENDING");
    assert.equal(pubReport.body.data.statusLabel, "Dalam Antrean");
    assert.equal(pubReport.body.data.createdBy, undefined);
    assert.equal(pubReport.body.data.group, undefined);

    const pubEduOk = await api(`/api/v1/public/education/${publishedSlug}`);
    assert.equal(pubEduOk.status, 200);
    const pubEduDraft = await api(`/api/v1/public/education/${draftSlug}`);
    assert.equal(pubEduDraft.status, 404);
    const pubInactiveWp = await api(`/api/v1/public/waste-points/${inactiveWastePointId}`);
    assert.equal(pubInactiveWp.status, 404);

    // --- ALUR TPS ---
    const token = waMsg.rawToken;

    // 1. GET tugas TPS tidak boleh mengubah status PENDING -> IN_PROGRESS
    const getTask = await api(`/api/v1/collection/tasks/${token}`);
    assert.equal(getTask.status, 200);
    assert.equal(getTask.body.data.totalPoints, 3);
    assert.ok(getTask.body.data.reports.every((r) => r.status === "PENDING"));

    // 2. POST /open pertama kali -> semua menjadi IN_PROGRESS
    const open1 = await api(`/api/v1/collection/tasks/${token}/open`, { method: "POST" });
    assert.equal(open1.status, 200);
    assert.equal(open1.body.data.alreadyOpened, false);
    assert.ok(open1.body.data.task.reports.every((r) => r.status === "IN_PROGRESS"));

    // 3. POST /open kedua kali -> idempoten, tidak menambah riwayat ganda
    const open2 = await api(`/api/v1/collection/tasks/${token}/open`, { method: "POST" });
    assert.equal(open2.status, 200);
    assert.equal(open2.body.data.alreadyOpened, true);

    const historiesCount = await prisma.reportStatusHistory.count({
      where: { reportId: groupData.reports[0].id, newStatus: "IN_PROGRESS" },
    });
    assert.equal(historiesCount, 1, "Pembukaan ulang tidak boleh menduplikasi status history");

    // 4. TPS menyelesaikan titik pertama
    const complete1 = await api(
      `/api/v1/collection/tasks/${token}/reports/${groupData.reports[0].id}`,
      { method: "PATCH" }
    );
    assert.equal(complete1.status, 200);
    assert.equal(complete1.body.data.report.status, "COMPLETED");
    assert.equal(complete1.body.data.taskCompleted, false);
    assert.equal(complete1.body.data.remainingPoints, 2);

    // 5. Race condition test: TPS menyelesaikan titik 2 & 3 secara bersamaan
    const [complete2, complete3] = await Promise.all([
      api(`/api/v1/collection/tasks/${token}/reports/${groupData.reports[1].id}`, {
        method: "PATCH",
      }),
      api(`/api/v1/collection/tasks/${token}/reports/${groupData.reports[2].id}`, {
        method: "PATCH",
      }),
    ]);

    assert.equal(complete2.status, 200);
    assert.equal(complete3.status, 200);
    // Tepat salah satu dari dua request paralel harus menutup task sebagai COMPLETED
    const completedFlags = [complete2.body.data.taskCompleted, complete3.body.data.taskCompleted];
    assert.equal(completedFlags.filter(Boolean).length, 1);

    // 6. Setelah seluruh titik selesai, token tidak boleh bisa digunakan kembali
    const reuseFinishedToken = await api(`/api/v1/collection/tasks/${token}`);
    assert.equal(reuseFinishedToken.status, 401);
  });

  it("3. Kegagalan WA tetap menyimpan laporan + retry tanpa duplikasi, cegah akses lintas grup, dan tolak token kedaluwarsa", async () => {
    const tokens = {};

    // Simulasi kegagalan WA untuk Grup A
    setTestDispatchInterceptor(async () => {
      throw new Error("Simulated WA Gateway Timeout");
    });

    const groupA = await api("/api/v1/operator/report-groups", {
      method: "POST",
      token: operatorToken,
      body: {
        tpsContactId,
        items: [{ wastePointId: wastePoints[0].id, description: "Grup A" }],
      },
    });
    assert.equal(groupA.status, 201, "Laporan harus tetap tersimpan meski WA gagal");
    assert.equal(groupA.body.data.whatsappNotification.status, "FAILED");
    createdIds.reportGroupIds.push(groupA.body.data.id);

    // Retry WA untuk Grup A -> sukses tanpa membuat grup/task baru
    setTestDispatchInterceptor(async (payload) => {
      tokens.groupA = payload.rawToken;
      return { providerMessageId: "retry_ok_1" };
    });

    const retryRes = await api(
      `/api/v1/operator/collection-tasks/${groupA.body.data.collectionTask.id}/resend-whatsapp`,
      { method: "POST", token: operatorToken }
    );
    assert.equal(retryRes.status, 200);
    assert.equal(retryRes.body.data.whatsappNotification.status, "SENT");
    assert.equal(retryRes.body.data.whatsappNotification.attemptCount, 2);

    // Buat Grup B (normal)
    setTestDispatchInterceptor(async (payload) => {
      tokens.groupB = payload.rawToken;
      return { providerMessageId: "group_b_ok" };
    });

    const groupB = await api("/api/v1/operator/report-groups", {
      method: "POST",
      token: operatorToken,
      body: {
        tpsContactId,
        items: [{ wastePointId: wastePoints[1].id, description: "Grup B" }],
      },
    });
    assert.equal(groupB.status, 201);
    createdIds.reportGroupIds.push(groupB.body.data.id);

    // Isolasi lintas grup: token Grup A mencoba menyelesaikan laporan milik Grup B -> ditolak 404
    const crossGroup = await api(
      `/api/v1/collection/tasks/${tokens.groupA}/reports/${groupB.body.data.reports[0].id}`,
      { method: "PATCH" }
    );
    assert.equal(crossGroup.status, 404);

    // Token kedaluwarsa: paksa expiresAt Grup B ke masa lalu
    await prisma.collectionTask.update({
      where: { id: groupB.body.data.collectionTask.id },
      data: { expiresAt: new Date(Date.now() - 60_000) },
    });

    const expiredAccess = await api(`/api/v1/collection/tasks/${tokens.groupB}`);
    assert.equal(expiredAccess.status, 401);

    const updatedTaskB = await prisma.collectionTask.findUnique({
      where: { id: groupB.body.data.collectionTask.id },
      select: { status: true },
    });
    assert.equal(updatedTaskB.status, "EXPIRED");

    // Dashboard, Collection Tasks, dan Activity Logs Operator
    const [dashRes, tasksRes, logsRes] = await Promise.all([
      api("/api/v1/operator/dashboard", { token: operatorToken }),
      api("/api/v1/operator/collection-tasks", { token: operatorToken }),
      api("/api/v1/operator/activity-logs?actorType=TPS", { token: operatorToken }),
    ]);

    assert.equal(dashRes.status, 200);
    assert.ok(dashRes.body.data.summary.reports.total >= 5);
    assert.equal(tasksRes.status, 200);
    assert.equal(logsRes.status, 200);
    assert.ok(logsRes.body.data.length >= 1, "Aktivitas TPS harus tercatat di activity_logs");
  });
});

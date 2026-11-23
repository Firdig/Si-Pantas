import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";
import { disconnectDatabase } from "../src/config/database.js";
import { authorize } from "../src/middlewares/authorize.js";
import { ForbiddenError } from "../src/utils/app-error.js";

let server;
let baseUrl;

function extractRefreshCookie(res) {
  const setCookie = res.headers.getSetCookie ? res.headers.getSetCookie() : [res.headers.get("set-cookie")].filter(Boolean);
  const refreshCookie = setCookie.find((c) => c.startsWith("sipantas_refresh_token="));
  assert.ok(refreshCookie, "Cookie sipantas_refresh_token harus ada pada Set-Cookie");
  return {
    rawHeader: refreshCookie,
    cookiePair: refreshCookie.split(";")[0],
  };
}

describe("Fase 2 — Auth & Middleware Integration Tests", () => {
  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        baseUrl = `http://127.0.0.1:${server.address().port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDatabase();
  });

  it("menolak login dengan body kosong (400 VALIDATION_ERROR)", async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "", password: "" }),
    });
    const body = await res.json();

    assert.equal(res.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "VALIDATION_ERROR");
  });

  it("menolak login dengan password salah (401 UNAUTHORIZED)", async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "operator", password: "salahpassword" }),
    });
    const body = await res.json();

    assert.equal(res.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "UNAUTHORIZED");
  });

  it("berhasil login, mengakses /auth/me, rotasi refresh token, mendeteksi token reuse, dan logout", async () => {
    const username = process.env.SEED_OPERATOR_USERNAME || "operator";
    const password = process.env.SEED_OPERATOR_PASSWORD || "ChangeMe123!";

    // 1. Login
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const loginBody = await loginRes.json();

    assert.equal(loginRes.status, 200);
    assert.equal(loginBody.success, true);
    assert.ok(loginBody.data.accessToken);
    assert.equal(loginBody.data.user.role, "OPERATOR");
    assert.equal(loginBody.data.user.passwordHash, undefined);

    const cookie1 = extractRefreshCookie(loginRes);
    assert.match(cookie1.rawHeader, /HttpOnly/i);
    assert.match(cookie1.rawHeader, /Path=\/api\/v1\/auth/i);

    // 2. Akses /auth/me tanpa token -> 401
    const meNoAuth = await fetch(`${baseUrl}/api/v1/auth/me`);
    assert.equal(meNoAuth.status, 401);

    // 3. Akses /auth/me dengan access token -> 200
    const meRes = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${loginBody.data.accessToken}` },
    });
    const meBody = await meRes.json();
    assert.equal(meRes.status, 200);
    assert.equal(meBody.data.user.username, username);
    assert.equal(meBody.data.user.role, "OPERATOR");

    // 4. Refresh token rotation
    const refreshRes = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookie1.cookiePair },
    });
    const refreshBody = await refreshRes.json();
    assert.equal(refreshRes.status, 200);
    assert.ok(refreshBody.data.accessToken);

    const cookie2 = extractRefreshCookie(refreshRes);
    assert.notEqual(cookie2.cookiePair, cookie1.cookiePair, "Refresh token harus dirotasi");

    // 5. Token reuse detection: memakai cookie1 yang sudah dicabut harus ditolak & mencabut cookie2
    const reuseRes = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookie1.cookiePair },
    });
    assert.equal(reuseRes.status, 401);

    const afterReuseRes = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookie2.cookiePair },
    });
    assert.equal(afterReuseRes.status, 401, "Sesi aktif lainnya harus dicabut saat reuse terdeteksi");

    // 6. Login ulang & Logout
    const loginRes2 = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const cookie3 = extractRefreshCookie(loginRes2);

    const logoutRes = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: "POST",
      headers: { Cookie: cookie3.cookiePair },
    });
    const logoutBody = await logoutRes.json();
    assert.equal(logoutRes.status, 200);
    assert.equal(logoutBody.success, true);

    // 7. Refresh setelah logout harus gagal
    const refreshAfterLogout = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookie3.cookiePair },
    });
    assert.equal(refreshAfterLogout.status, 401);
  });

  it("middleware authorize() memblokir role yang tidak diizinkan dengan 403 ForbiddenError", () => {
    const kaderOnly = authorize("KADER");
    let capturedErr = null;
    kaderOnly({ user: { id: "u1", role: "OPERATOR" } }, {}, (err) => {
      capturedErr = err;
    });
    assert.ok(capturedErr instanceof ForbiddenError);
    assert.equal(capturedErr.statusCode, 403);

    const operatorOnly = authorize("OPERATOR");
    let okErr = "not-called";
    operatorOnly({ user: { id: "u1", role: "OPERATOR" } }, {}, (err) => {
      okErr = err;
    });
    assert.equal(okErr, undefined);
  });
});

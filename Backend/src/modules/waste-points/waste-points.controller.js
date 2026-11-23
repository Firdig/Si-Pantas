import * as wastePointsService from "./waste-points.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function listForOperator(req, res) {
  const { items, meta } = await wastePointsService.listWastePoints(req.validated.query);
  return sendSuccess(res, {
    message: "Daftar titik sampah berhasil diambil",
    data: items,
    meta,
  });
}

export async function listForKader(req, res) {
  const { items, meta } = await wastePointsService.listWastePoints(req.validated.query, {
    onlyActive: true,
  });
  return sendSuccess(res, {
    message: "Daftar titik sampah aktif berhasil diambil",
    data: items,
    meta,
  });
}

export async function create(req, res) {
  const point = await wastePointsService.createWastePoint(req.validated.body, req.user.id);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Titik sampah berhasil dibuat",
    data: point,
  });
}

export async function update(req, res) {
  const point = await wastePointsService.updateWastePoint(
    req.validated.params.id,
    req.validated.body,
    req.user.id
  );
  return sendSuccess(res, {
    message: "Titik sampah berhasil diperbarui",
    data: point,
  });
}

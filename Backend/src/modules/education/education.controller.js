import * as educationService from "./education.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function list(req, res) {
  const { items, meta } = await educationService.listEducation(req.validated.query);
  return sendSuccess(res, {
    message: "Daftar konten edukasi berhasil diambil",
    data: items,
    meta,
  });
}

export async function create(req, res) {
  const item = await educationService.createEducation(req.validated.body, req.user.id);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Konten edukasi berhasil dibuat",
    data: item,
  });
}

export async function update(req, res) {
  const item = await educationService.updateEducation(
    req.validated.params.id,
    req.validated.body,
    req.user.id
  );
  return sendSuccess(res, {
    message: "Konten edukasi berhasil diperbarui",
    data: item,
  });
}

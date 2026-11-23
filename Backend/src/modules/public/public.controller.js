import * as publicService from "./public.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function listWastePoints(req, res) {
  const { items, meta } = await publicService.listPublicWastePoints(req.validated.query);
  return sendSuccess(res, {
    message: "Daftar titik sampah publik berhasil diambil",
    data: items,
    meta,
  });
}

export async function getWastePoint(req, res) {
  const item = await publicService.getPublicWastePointById(req.validated.params.id);
  return sendSuccess(res, {
    message: "Detail titik sampah berhasil diambil",
    data: item,
  });
}

export async function listReports(req, res) {
  const { items, meta } = await publicService.listPublicReports(req.validated.query);
  return sendSuccess(res, {
    message: "Daftar laporan publik berhasil diambil",
    data: items,
    meta,
  });
}

export async function getReportByCode(req, res) {
  const item = await publicService.getPublicReportByCode(req.validated.params.code);
  return sendSuccess(res, {
    message: "Detail laporan berhasil diambil",
    data: item,
  });
}

export async function listEducation(req, res) {
  const { items, meta } = await publicService.listPublicEducation(req.validated.query);
  return sendSuccess(res, {
    message: "Daftar konten edukasi berhasil diambil",
    data: items,
    meta,
  });
}

export async function getEducationBySlug(req, res) {
  const item = await publicService.getPublicEducationBySlug(req.validated.params.slug);
  return sendSuccess(res, {
    message: "Detail konten edukasi berhasil diambil",
    data: item,
  });
}

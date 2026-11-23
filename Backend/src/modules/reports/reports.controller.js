import * as reportsService from "./reports.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function createGroup(req, res) {
  const result = await reportsService.createReportGroup(req.validated.body, req.user);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Grup laporan berhasil dibuat",
    data: result,
  });
}

export async function list(req, res) {
  const { items, meta } = await reportsService.listReports(req.validated.query);
  return sendSuccess(res, {
    message: "Daftar laporan berhasil diambil",
    data: items,
    meta,
  });
}

export async function detail(req, res) {
  const report = await reportsService.getReportById(req.validated.params.id);
  return sendSuccess(res, {
    message: "Detail laporan berhasil diambil",
    data: report,
  });
}

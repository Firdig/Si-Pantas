import * as activityLogsService from "./activity-logs.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function list(req, res) {
  const { items, meta } = await activityLogsService.listActivityLogs(req.validated.query);
  return sendSuccess(res, {
    message: "Daftar log aktivitas berhasil diambil",
    data: items,
    meta,
  });
}

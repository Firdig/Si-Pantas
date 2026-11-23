import * as dashboardService from "./dashboard.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function getDashboard(_req, res) {
  const data = await dashboardService.getOperatorDashboard();
  return sendSuccess(res, {
    message: "Data dashboard Operator berhasil diambil",
    data,
  });
}

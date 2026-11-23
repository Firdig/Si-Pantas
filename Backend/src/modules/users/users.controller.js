import * as usersService from "./users.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function list(req, res) {
  const { items, meta } = await usersService.listUsers(req.validated.query);
  return sendSuccess(res, {
    message: "Daftar akun berhasil diambil",
    data: items,
    meta,
  });
}

export async function create(req, res) {
  const user = await usersService.createKader(req.validated.body, req.user.id);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Akun Kader berhasil dibuat",
    data: user,
  });
}

export async function update(req, res) {
  const user = await usersService.updateUser(req.validated.params.id, req.validated.body, req.user.id);
  return sendSuccess(res, {
    message: "Akun berhasil diperbarui",
    data: user,
  });
}

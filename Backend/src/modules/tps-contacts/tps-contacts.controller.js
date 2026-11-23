import * as tpsContactsService from "./tps-contacts.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function list(req, res) {
  const { items, meta } = await tpsContactsService.listTpsContacts(req.validated.query);
  return sendSuccess(res, {
    message: "Daftar kontak TPS berhasil diambil",
    data: items,
    meta,
  });
}

export async function create(req, res) {
  const contact = await tpsContactsService.createTpsContact(req.validated.body, req.user.id);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Kontak TPS berhasil ditambahkan",
    data: contact,
  });
}

export async function update(req, res) {
  const contact = await tpsContactsService.updateTpsContact(
    req.validated.params.id,
    req.validated.body,
    req.user.id
  );
  return sendSuccess(res, {
    message: "Kontak TPS berhasil diperbarui",
    data: contact,
  });
}

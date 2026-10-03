import { Response } from "express";

export function sendLegacy(res: Response, data: unknown, code = 20000, msg = "") {
  res.json({ code, data, message: msg });
}

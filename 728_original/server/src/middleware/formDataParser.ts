import { Request, Response, NextFunction } from "express";

// 原平台 POST body: data={JSON}
export function formDataParser(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object" && "data" in req.body && typeof req.body.data === "string") {
    try {
      const parsed = JSON.parse(req.body.data);
      req.body = parsed;
    } catch {
      // keep raw
    }
  }
  next();
}

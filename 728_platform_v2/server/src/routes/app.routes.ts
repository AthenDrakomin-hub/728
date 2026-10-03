import { Router } from "express";
import { db } from "@/db";
import { systemConfig } from "@/db/schema";
import { and, inArray } from "drizzle-orm";
import { audit } from "../lib/audit";

const router = Router();

// 获取APP版本信息
router.get("/version", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(systemConfig)
      .where(
        inArray(
          systemConfig.key,
          ["app_version", "app_wgt_url", "app_wgt_force", "app_changelog"]
        )
      );

    const config: Record<string, string> = {};
    rows.forEach((row) => {
      config[row.key] = row.value || "";
    });

    res.json({
      version: config.app_version || "1.0.0",
      wgtUrl: config.app_wgt_url || null,
      forceUpdate: config.app_wgt_force === "1",
      changelog: config.app_changelog || "",
    });
  } catch (err: any) {
    console.error("获取APP版本失败:", err);
    res.status(500).json({ error: err.message });
  }
});

// APP错误上报接口
router.post("/error", async (req, res) => {
  try {
    const {
      platform,
      version,
      device,
      osVersion,
      errorType,
      errorMessage,
      stackTrace,
      page,
      timestamp,
      additional,
    } = req.body;

    console.error(`[APP ERROR] ${new Date().toISOString()}`, {
      platform,
      version,
      device,
      osVersion,
      errorType,
      errorMessage,
      stackTrace: stackTrace?.slice(0, 500),
      page,
      ip: req.ip,
    });

    // 记录到审计日志（只传detail字段）
    audit.warn("app_error", {
      detail: JSON.stringify({
        platform,
        version,
        device,
        errorType,
        errorMessage: errorMessage?.slice(0, 500),
        stackTrace: stackTrace?.slice(0, 1000),
        page,
      }),
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error("处理错误上报失败:", err);
    res.status(500).json({ error: err.message });
  }
});

export const appRouter = router;

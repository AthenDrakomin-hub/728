import { initDatabase } from "./sqliteDb.js";
import * as schema from "./schema.js";

// 启动时初始化数据库（执行 schema.sql 建表 + 初始数据）
initDatabase();

export const db = schema;
export type DB = typeof db;

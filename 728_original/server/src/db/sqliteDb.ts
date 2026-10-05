/**
 * SQLite 数据库层 — 与 jsonDb.ts 保持相同 API 接口
 * 底层使用 better-sqlite3，数据持久化到文件
 * 调用方代码零改动
 */
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

type Row = Record<string, any>;

// 字段名映射: camelCase -> snake_case (DB列名)
function toSnake(key: string): string {
  return key.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
}

// 行数据转换: snake_case -> camelCase
function toCamelRow(row: Row): Row {
  if (!row) return row;
  const out: Row = {};
  for (const [k, v] of Object.entries(row)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    // JSON 字段反序列化
    if (typeof v === "string" && (v.startsWith("{") || v.startsWith("["))) {
      try { out[camel] = JSON.parse(v); } catch { out[camel] = v; }
    } else {
      out[camel] = v;
    }
  }
  return out;
}

// SQLite 绑定值归一化: boolean→0/1, undefined→null, 对象→JSON
function normalizeValue(v: any): any {
  if (v === undefined) return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "object" && v !== null) return JSON.stringify(v);
  return v;
}

// 全局数据库实例
let db: Database.Database | null = null;
let dbPath = "";

export function initDatabase(dbFilePath?: string): Database.Database {
  if (db) return db;
  dbPath = dbFilePath || process.env.DB_PATH || path.join(process.cwd(), "data", "728.db");
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  // 执行 schema.sql 建表 + 初始数据
  let schemaSql = "";
  const candidates = [
    path.join(process.cwd(), "dist", "schema.sql"),           // 生产: dist/
    path.join(process.cwd(), "src", "db", "schema.sql"),       // 开发: src/db/
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) { schemaSql = fs.readFileSync(p, "utf-8"); break; }
  }
  if (schemaSql) {
    db.exec(schemaSql);
    console.log(`[db] initialized at ${dbPath}`);
  } else {
    console.warn("[db] schema.sql not found in candidates:", candidates);
  }
  return db;
}

export function getDb(): Database.Database {
  if (!db) return initDatabase();
  return db;
}

// 查询操作符（与 jsonDb 兼容）
const ops = {
  eq: (a: any, b: any) => a === b,
  ne: (a: any, b: any) => a !== b,
  gt: (a: any, b: any) => a > b,
  gte: (a: any, b: any) => a >= b,
  lt: (a: any, b: any) => a < b,
  lte: (a: any, b: any) => a <= b,
  like: (a: string, b: string) => (a || "").includes(b),
  inArray: (a: any, b: any[]) => b.includes(a),
  and: (...conds: boolean[]) => conds.every(Boolean),
  or: (...conds: boolean[]) => conds.some(Boolean),
  not: (cond: boolean) => !cond,
};

export { ops };
export const { eq, and, or, inArray, like } = ops;

/**
 * Table 类 — 与 jsonDb.Table 相同 API
 * 内部用 better-sqlite3 预编译语句
 */
export class Table<T extends Row> {
  private tableName: string;
  private columns: string[] = [];
  private insertStmt: Database.Statement | null = null;
  private allStmt: Database.Statement | null = null;

  constructor(name: string, _initial: T[] = []) {
    this.tableName = name;
    // 延迟初始化列信息（首次查询时从 PRAGMA 获取）
  }

  private ensureColumns(): string[] {
    if (this.columns.length > 0) return this.columns;
    const d = getDb();
    const pragma = d.prepare(`PRAGMA table_info(${this.tableName})`).all() as any[];
    this.columns = pragma.map((c) => c.name);
    return this.columns;
  }

  private buildInsert(values: Row): { sql: string; params: any[] } {
    const cols = this.ensureColumns();
    const keys = Object.keys(values).filter((k) => cols.includes(toSnake(k)) || cols.includes(k));
    const placeholders = keys.map(() => "?").join(", ");
    const colNames = keys.map((k) => (cols.includes(k) ? k : toSnake(k))).join(", ");
    const params = keys.map((k) => normalizeValue(values[k]));
    return { sql: `INSERT INTO ${this.tableName} (${colNames}) VALUES (${placeholders})`, params };
  }

  insert(values: Omit<T, "id"> & Partial<{ id: number }>): T {
    const d = getDb();
    const { sql, params } = this.buildInsert(values as Row);
    const info = d.prepare(sql).run(...params);
    const row = d.prepare(`SELECT * FROM ${this.tableName} WHERE rowid = ?`).get(info.lastInsertRowid) as Row;
    return toCamelRow(row) as T;
  }

  insertMany(valuesArr: Partial<T>[]): T[] {
    const d = getDb();
    const results: T[] = [];
    const tx = d.transaction((items: Partial<T>[]) => {
      for (const v of items) {
        const { sql, params } = this.buildInsert(v as Row);
        const info = d.prepare(sql).run(...params);
        const row = d.prepare(`SELECT * FROM ${this.tableName} WHERE rowid = ?`).get(info.lastInsertRowid) as Row;
        results.push(toCamelRow(row) as T);
      }
    });
    tx(valuesArr);
    return results;
  }

  select(): { where: (fn: (row: T, o: typeof ops) => boolean) => { limit: (n: number) => T[]; all: () => T[] } } {
    const d = getDb();
    const rows = (d.prepare(`SELECT * FROM ${this.tableName}`).all() as Row[]).map(toCamelRow) as T[];
    return {
      where: (fn) => ({
        limit: (n) => rows.filter((r) => fn(r, ops)).slice(0, n),
        all: () => rows.filter((r) => fn(r, ops)),
      }),
    };
  }

  findFirst(fn: (row: T, o: typeof ops) => boolean): T | undefined {
    const d = getDb();
    const rows = (d.prepare(`SELECT * FROM ${this.tableName}`).all() as Row[]).map(toCamelRow) as T[];
    return rows.find((r) => fn(r, ops));
  }

  findById(id: number): T | undefined {
    const d = getDb();
    const row = d.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`).get(id) as Row;
    return row ? (toCamelRow(row) as T) : undefined;
  }

  update(set: Partial<T>): { where: (fn: (row: T, o: typeof ops) => boolean) => number } {
    const d = getDb();
    const cols = this.ensureColumns();
    const setKeys = Object.keys(set).filter((k) => cols.includes(toSnake(k)) || cols.includes(k));
    const setClause = setKeys.map((k) => `${cols.includes(k) ? k : toSnake(k)} = ?`).join(", ");
    const setValues = setKeys.map((k) => normalizeValue((set as any)[k]));

    return {
      where: (fn) => {
        const allRows = (d.prepare(`SELECT * FROM ${this.tableName}`).all() as Row[]).map(toCamelRow) as T[];
        const matched = allRows.filter((r) => fn(r, ops));
        let count = 0;
        const tx = d.transaction(() => {
          for (const row of matched) {
            d.prepare(`UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`).run(...setValues, (row as any).id);
            count++;
          }
        });
        tx();
        return count;
      },
    };
  }

  delete(): { where: (fn: (row: T, o: typeof ops) => boolean) => number } {
    const d = getDb();
    return {
      where: (fn) => {
        const allRows = (d.prepare(`SELECT * FROM ${this.tableName}`).all() as Row[]).map(toCamelRow) as T[];
        const matched = allRows.filter((r) => fn(r, ops));
        let count = 0;
        const tx = d.transaction(() => {
          for (const row of matched) {
            d.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`).run((row as any).id);
            count++;
          }
        });
        tx();
        return count;
      },
    };
  }

  all(): T[] {
    const d = getDb();
    return (d.prepare(`SELECT * FROM ${this.tableName}`).all() as Row[]).map(toCamelRow) as T[];
  }

  count(): number {
    const d = getDb();
    const row = d.prepare(`SELECT COUNT(*) as c FROM ${this.tableName}`).get() as Row;
    return row.c as number;
  }

  countWhere(fn: (row: T, o: typeof ops) => boolean): number {
    return this.all().filter((r) => fn(r, ops)).length;
  }

  // 原生 SQL 查询（扩展能力）
  query(sql: string, ...params: any[]): T[] {
    const d = getDb();
    return (d.prepare(sql).all(...params) as Row[]).map(toCamelRow) as T[];
  }

  execute(sql: string, ...params: any[]): number {
    const d = getDb();
    const info = d.prepare(sql).run(...params);
    return info.changes;
  }
}

import fs from "fs";
import path from "path";

type Row = Record<string, any>;

class Table<T extends Row> {
  private rows: T[] = [];
  private idSeq = 1;

  constructor(private name: string, initial: T[] = []) {
    this.rows = initial.map((r) => ({ ...r }));
    this.idSeq = this.rows.reduce((m, r) => Math.max(m, (r.id as number) || 0), 0) + 1;
  }

  private clone(row: T): T {
    return JSON.parse(JSON.stringify(row));
  }

  insert(values: Omit<T, "id"> & Partial<{ id: number }>): T {
    const row = this.clone(values as T);
    if (!row.id) row.id = this.idSeq++;
    else this.idSeq = Math.max(this.idSeq, row.id + 1);
    this.rows.push(row);
    return this.clone(row);
  }

  insertMany(valuesArr: Partial<T>[]): T[] {
    return valuesArr.map((v) => this.insert(v as any));
  }

  select(): { where: (fn: (row: T, ops: typeof ops) => boolean) => { limit: (n: number) => T[] } } {
    return {
      where: (fn) => ({
        limit: (n) => this.rows.filter((r) => fn(r, ops)).slice(0, n).map((r) => this.clone(r)),
      }),
    };
  }

  findFirst(fn: (row: T, ops: typeof ops) => boolean): T | undefined {
    const row = this.rows.find((r) => fn(r, ops));
    return row ? this.clone(row) : undefined;
  }

  update(set: Partial<T>): { where: (fn: (row: T, ops: typeof ops) => boolean) => void } {
    return {
      where: (fn) => {
        this.rows.forEach((r) => {
          if (fn(r, ops)) Object.assign(r, this.clone(set as T));
        });
      },
    };
  }

  delete(): { where: (fn: (row: T, ops: typeof ops) => boolean) => void } {
    return {
      where: (fn) => {
        this.rows = this.rows.filter((r) => !fn(r, ops));
      },
    };
  }

  all(): T[] {
    return this.rows.map((r) => this.clone(r));
  }

  count(): number {
    return this.rows.length;
  }

  countWhere(fn: (row: T, ops: typeof ops) => boolean): number {
    return this.rows.filter((r) => fn(r, ops)).length;
  }
}

const ops = {
  eq: (a: any, b: any) => a === b,
  ne: (a: any, b: any) => a !== b,
  gt: (a: any, b: any) => a > b,
  gte: (a: any, b: any) => a >= b,
  lt: (a: any, b: any) => a < b,
  lte: (a: any, b: any) => a <= b,
  like: (a: string, b: string) => (a || "").includes(b),
  inArray: (a: any, b: any[]) => b.includes(a),
  sql: (strings: TemplateStringsArray, ...values: any[]) => (row: Row) => true,
  and: (...conds: boolean[]) => conds.every(Boolean),
  or: (...conds: boolean[]) => conds.some(Boolean),
  not: (cond: boolean) => !cond,
  desc: (a: any, b: any) => 0,
};

const eq = ops.eq;
const and = ops.and;
const or = ops.or;
const inArray = ops.inArray;
const like = ops.like;
const sql = ops.sql;
const desc = ops.desc;

export { eq, and, or, inArray, like, sql, desc, ops };
export { Table };

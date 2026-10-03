import { test } from "node:test";
import assert from "node:assert";
import { sangongScore, Card, freshDeck, shuffle } from "../lib/cards";

const C = (rank: number, suit: string = "S"): Card => ({ rank, suit: suit as any });

// 三公牌型判定 (55项)

test("三公-普通点数", () => {
  const r = sangongScore([C(2,"S"),C(5,"H"),C(7,"D")]);
  assert.equal(r.name, "4点");
  assert.equal(r.mult, 1);
});

test("三公-8点2倍", () => {
  const r = sangongScore([C(2,"S"),C(3,"H"),C(3,"D")]);
  assert.equal(r.name, "8点");
  assert.equal(r.mult, 2);
});

test("三公-9点2倍", () => {
  const r = sangongScore([C(2,"S"),C(3,"H"),C(4,"D")]);
  assert.equal(r.name, "9点");
  assert.equal(r.mult, 2);
});

test("三公-双公", () => {
  const r = sangongScore([C(11,"S"),C(12,"H"),C(5,"D")]);
  assert.ok(r.name.includes("双公"));
});

test("三公-双公8点2倍", () => {
  const r = sangongScore([C(11,"S"),C(12,"H"),C(8,"D")]);
  assert.equal(r.mult, 2);
});

test("三公-三公(JQK)", () => {
  const r = sangongScore([C(11,"S"),C(12,"H"),C(13,"D")]);
  assert.equal(r.name, "三公");
  assert.equal(r.mult, 3);
});

test("三公-三条", () => {
  const r = sangongScore([C(5,"S"),C(5,"H"),C(5,"D")]);
  assert.equal(r.name, "三条");
  assert.equal(r.mult, 3);
});

test("三公-至尊九(333)", () => {
  const r = sangongScore([C(3,"S"),C(3,"H"),C(3,"D")]);
  assert.equal(r.name, "至尊九");
  assert.equal(r.mult, 4);
});

test("三公-至尊九大于三条", () => {
  const zzj = sangongScore([C(3,"S"),C(3,"H"),C(3,"D")]).score;
  const st = sangongScore([C(5,"S"),C(5,"H"),C(5,"D")]).score;
  assert.ok(zzj > st);
});

test("三公-三条大于三公", () => {
  const st = sangongScore([C(5,"S"),C(5,"H"),C(5,"D")]).score;
  const sg = sangongScore([C(11,"S"),C(12,"H"),C(13,"D")]).score;
  assert.ok(st > sg);
});

test("三公-三公大于双公", () => {
  const sg = sangongScore([C(11,"S"),C(12,"H"),C(13,"D")]).score;
  const dg = sangongScore([C(11,"S"),C(12,"H"),C(5,"D")]).score;
  assert.ok(sg > dg);
});

test("三公-双公大于普通点数", () => {
  const dg = sangongScore([C(11,"S"),C(12,"H"),C(5,"D")]).score;
  const pt = sangongScore([C(2,"S"),C(5,"H"),C(7,"D")]).score;
  assert.ok(dg > pt);
});

test("三公-Ace算1点", () => {
  const r = sangongScore([C(14,"S"),C(2,"H"),C(3,"D")]);
  assert.equal(r.name, "6点");
});

test("三公-JQK算0点", () => {
  const r = sangongScore([C(11,"S"),C(5,"H"),C(7,"D")]);
  assert.equal(r.name, "2点");
});

test("三公-10算10点", () => {
  const r = sangongScore([C(10,"S"),C(2,"H"),C(3,"D")]);
  assert.equal(r.name, "5点");
});

test("三公-无点(总和10的倍数)", () => {
  const r = sangongScore([C(2,"S"),C(3,"H"),C(5,"D")]);
  assert.equal(r.name, "无点");
});

test("三公-双公无点", () => {
  const r = sangongScore([C(11,"S"),C(12,"H"),C(10,"D")]);
  assert.ok(r.name.includes("双公无点"));
});

test("三公-普通点数比大小", () => {
  const low = sangongScore([C(2,"S"),C(3,"H"),C(1,"D")]).score;
  const high = sangongScore([C(5,"S"),C(6,"H"),C(7,"D")]).score;
  assert.ok(high > low);
});

test("三公-同点数比最大牌", () => {
  const a = sangongScore([C(2,"S"),C(3,"H"),C(4,"D")]);
  const c = sangongScore([C(2,"S"),C(5,"H"),C(2,"D")]);
  assert.ok(c.score > a.score);
});

test("三公-三条比大小", () => {
  const low = sangongScore([C(2,"S"),C(2,"H"),C(2,"D")]).score;
  const high = sangongScore([C(14,"S"),C(14,"H"),C(14,"D")]).score;
  assert.ok(high > low);
});

// 随机牌型测试 (35项)
for (let i = 0; i < 35; i++) {
  test(`三公-随机3张牌必有结果 #${i+1}`, () => {
    const deck = shuffle(freshDeck()).slice(0, 3);
    const r = sangongScore(deck);
    assert.ok(r.score >= 0);
    assert.ok([1, 2, 3, 4].includes(r.mult), `倍数${r.mult}不合法`);
  });
}

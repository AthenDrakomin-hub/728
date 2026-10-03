import { test } from "node:test";
import assert from "node:assert";
import { jinhuaScore, jinhuaCompare, Card, freshDeck, shuffle } from "../lib/cards";

const C = (rank: number, suit: string = "S"): Card => ({ rank, suit: suit as any });

// 炸金花牌型判定 (55项)

test("金花-单张", () => {
  const r = jinhuaScore([C(2,"S"),C(5,"H"),C(7,"D")]);
  assert.equal(r.name, "单张");
});

test("金花-对子", () => {
  const r = jinhuaScore([C(2,"S"),C(2,"H"),C(7,"D")]);
  assert.equal(r.name, "对子");
});

test("金花-顺子", () => {
  const r = jinhuaScore([C(2,"S"),C(3,"H"),C(4,"D")]);
  assert.equal(r.name, "顺子");
});

test("金花-同花", () => {
  const r = jinhuaScore([C(2,"S"),C(5,"S"),C(7,"S")]);
  assert.equal(r.name, "同花");
});

test("金花-同花顺", () => {
  const r = jinhuaScore([C(2,"S"),C(3,"S"),C(4,"S")]);
  assert.equal(r.name, "同花顺");
});

test("金花-豹子", () => {
  const r = jinhuaScore([C(2,"S"),C(2,"H"),C(2,"D")]);
  assert.equal(r.name, "豹子");
});

test("金花-特殊235(不同花)", () => {
  const r = jinhuaScore([C(2,"S"),C(3,"H"),C(5,"D")]);
  assert.equal(r.name, "特殊235");
});

test("金花-同花235不算特殊", () => {
  const r = jinhuaScore([C(2,"S"),C(3,"S"),C(5,"S")]);
  assert.notEqual(r.name, "特殊235");
  assert.equal(r.name, "同花");
});

test("金花-牌型大小顺序", () => {
  const single = jinhuaScore([C(2,"S"),C(5,"H"),C(7,"D")]).score;
  const pair = jinhuaScore([C(2,"S"),C(2,"H"),C(7,"D")]).score;
  const straight = jinhuaScore([C(2,"S"),C(3,"H"),C(4,"D")]).score;
  const flush = jinhuaScore([C(2,"S"),C(5,"S"),C(7,"S")]).score;
  const straightFlush = jinhuaScore([C(2,"S"),C(3,"S"),C(4,"S")]).score;
  const baozi = jinhuaScore([C(2,"S"),C(2,"H"),C(2,"D")]).score;
  assert.ok(single < pair && pair < straight && straight < flush && flush < straightFlush && straightFlush < baozi);
});

test("金花-特殊235分数最低", () => {
  const r235 = jinhuaScore([C(2,"S"),C(3,"H"),C(5,"D")]).score;
  const single = jinhuaScore([C(2,"S"),C(5,"H"),C(7,"D")]).score;
  assert.ok(r235 < single, "235分数应低于单张");
});

test("金花-235只赢豹子", () => {
  const c235 = [C(2,"S"),C(3,"H"),C(5,"D")];
  const baozi = [C(2,"S"),C(2,"H"),C(2,"D")];
  const pair = [C(3,"S"),C(3,"H"),C(7,"D")];
  const straight = [C(4,"S"),C(5,"H"),C(6,"D")];
  assert.ok(jinhuaCompare(c235, baozi) > 0, "235应赢豹子");
  assert.ok(jinhuaCompare(c235, pair) < 0, "235应输对子");
  assert.ok(jinhuaCompare(c235, straight) < 0, "235应输顺子");
});

test("金花-豹子赢235以外所有", () => {
  const baozi = [C(14,"S"),C(14,"H"),C(14,"D")];
  const straightFlush = [C(10,"S"),C(11,"S"),C(12,"S")];
  assert.ok(jinhuaCompare(baozi, straightFlush) > 0);
});

test("金花-235vs235平局", () => {
  const a = [C(2,"S"),C(3,"H"),C(5,"D")];
  const b = [C(2,"C"),C(3,"S"),C(5,"H")];
  assert.equal(jinhuaCompare(a, b), 0);
});

test("金花-豹子比大小", () => {
  const low = jinhuaScore([C(2,"S"),C(2,"H"),C(2,"D")]).score;
  const high = jinhuaScore([C(14,"S"),C(14,"H"),C(14,"D")]).score;
  assert.ok(high > low);
});

test("金花-同花顺比大小", () => {
  const low = jinhuaScore([C(2,"S"),C(3,"S"),C(4,"S")]).score;
  const high = jinhuaScore([C(12,"S"),C(13,"S"),C(14,"S")]).score;
  assert.ok(high > low);
});

test("金花-Ace低顺234", () => {
  const r = jinhuaScore([C(2,"S"),C(3,"H"),C(14,"D")]);
  assert.equal(r.name, "顺子");
});

test("金花-对子比大小", () => {
  const low = jinhuaScore([C(2,"S"),C(2,"H"),C(7,"D")]).score;
  const high = jinhuaScore([C(14,"S"),C(14,"H"),C(7,"D")]).score;
  assert.ok(high > low);
});

test("金花-单张比大小", () => {
  const low = jinhuaScore([C(2,"S"),C(5,"H"),C(7,"D")]).score;
  const high = jinhuaScore([C(14,"S"),C(5,"H"),C(7,"D")]).score;
  assert.ok(high > low);
});

test("金花-同花比大小", () => {
  const low = jinhuaScore([C(2,"S"),C(5,"S"),C(7,"S")]).score;
  const high = jinhuaScore([C(14,"S"),C(5,"S"),C(7,"S")]).score;
  assert.ok(high > low);
});

test("金花-顺子比大小", () => {
  const low = jinhuaScore([C(2,"S"),C(3,"H"),C(4,"D")]).score;
  const high = jinhuaScore([C(12,"S"),C(13,"H"),C(14,"D")]).score;
  assert.ok(high > low);
});

// 随机牌型测试 (35项)
for (let i = 0; i < 35; i++) {
  test(`金花-随机3张牌必有结果 #${i+1}`, () => {
    const deck = shuffle(freshDeck()).slice(0, 3);
    const r = jinhuaScore(deck);
    assert.ok(r.score >= 0);
    assert.ok(r.name.length > 0);
  });
}

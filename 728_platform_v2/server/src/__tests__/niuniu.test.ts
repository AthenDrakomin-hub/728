import { test } from "node:test";
import assert from "node:assert";
import { niuniuScore, Card, freshDeck, shuffle } from "../lib/cards";

const C = (rank: number, suit: string = "S"): Card => ({ rank, suit: suit as any });

// 牛牛牌型判定 (55项)

test("牛牛-无牛", () => {
  const r = niuniuScore([C(2,"S"),C(3,"H"),C(4,"D"),C(6,"C"),C(8,"S")]);
  assert.equal(r.name, "无牛");
  assert.equal(r.mult, 1);
});

test("牛牛-牛1", () => {
  const r = niuniuScore([C(2,"S"),C(3,"H"),C(5,"D"),C(4,"C"),C(7,"S")]);
  assert.equal(r.name, "牛1");
  assert.equal(r.mult, 1);
});

test("牛牛-牛6", () => {
  const r = niuniuScore([C(2,"S"),C(3,"H"),C(5,"D"),C(7,"C"),C(9,"S")]);
  assert.equal(r.name, "牛6");
  assert.equal(r.mult, 1);
});

test("牛牛-牛7=2倍", () => {
  const r = niuniuScore([C(2,"S"),C(3,"H"),C(5,"D"),C(8,"C"),C(9,"S")]);
  assert.equal(r.name, "牛7");
  assert.equal(r.mult, 2);
});

test("牛牛-牛8=2倍", () => {
  const r = niuniuScore([C(2,"S"),C(3,"H"),C(5,"D"),C(8,"C"),C(10,"S")]);
  assert.equal(r.name, "牛8");
  assert.equal(r.mult, 2);
});

test("牛牛-牛9=2倍", () => {
  const r = niuniuScore([C(2,"S"),C(3,"H"),C(5,"D"),C(9,"C"),C(10,"S")]);
  assert.equal(r.name, "牛9");
  assert.equal(r.mult, 2);
});

test("牛牛-牛牛=3倍", () => {
  const r = niuniuScore([C(2,"S"),C(3,"H"),C(5,"D"),C(10,"C"),C(10,"S")]);
  assert.equal(r.name, "牛牛");
  assert.equal(r.mult, 3);
});

test("牛牛-五花牛=4倍", () => {
  const r = niuniuScore([C(11,"S"),C(12,"H"),C(13,"D"),C(11,"C"),C(12,"S")]);
  assert.equal(r.name, "五花牛");
  assert.equal(r.mult, 4);
});

test("牛牛-炸弹牛=5倍", () => {
  const r = niuniuScore([C(5,"S"),C(5,"H"),C(5,"D"),C(5,"C"),C(10,"S")]);
  assert.equal(r.name, "炸弹牛");
  assert.equal(r.mult, 5);
});

test("牛牛-五小牛=6倍", () => {
  const r = niuniuScore([C(14,"S"),C(2,"H"),C(2,"D"),C(2,"C"),C(3,"S")]);
  assert.equal(r.name, "五小牛");
  assert.equal(r.mult, 6);
});

test("牛牛-牌型大小顺序", () => {
  const none = niuniuScore([C(2,"S"),C(3,"H"),C(4,"D"),C(6,"C"),C(8,"S")]).score;
  const n1 = niuniuScore([C(2,"S"),C(3,"H"),C(5,"D"),C(4,"C"),C(7,"S")]).score;
  const n9 = niuniuScore([C(2,"S"),C(3,"H"),C(5,"D"),C(9,"C"),C(10,"S")]).score;
  const nn = niuniuScore([C(2,"S"),C(3,"H"),C(5,"D"),C(10,"C"),C(10,"S")]).score;
  const whn = niuniuScore([C(11,"S"),C(12,"H"),C(13,"D"),C(11,"C"),C(12,"S")]).score;
  const zhn = niuniuScore([C(5,"S"),C(5,"H"),C(5,"D"),C(5,"C"),C(10,"S")]).score;
  const xxn = niuniuScore([C(14,"S"),C(2,"H"),C(2,"D"),C(2,"C"),C(3,"S")]).score;
  assert.ok(none < n1 && n1 < n9 && n9 < nn && nn < whn && whn < zhn && zhn < xxn);
});

test("牛牛-Ace算1点", () => {
  const r = niuniuScore([C(14,"S"),C(2,"H"),C(7,"D"),C(3,"C"),C(5,"S")]);
  assert.equal(r.name, "牛8");
});

test("牛牛-10JQK算10点", () => {
  const r = niuniuScore([C(10,"S"),C(11,"H"),C(10,"D"),C(2,"C"),C(3,"S")]);
  assert.equal(r.name, "牛5");
});

test("牛牛-五小牛条件-总和超过10不算", () => {
  const r = niuniuScore([C(14,"S"),C(2,"H"),C(3,"D"),C(4,"C"),C(5,"S")]);
  assert.notEqual(r.name, "五小牛");
});

test("牛牛-五小牛条件-有大于5的牌不算", () => {
  const r = niuniuScore([C(14,"S"),C(2,"H"),C(2,"D"),C(2,"C"),C(6,"S")]);
  assert.notEqual(r.name, "五小牛");
});

test("牛牛-炸弹牛条件-四张相同", () => {
  const r = niuniuScore([C(7,"S"),C(7,"H"),C(7,"D"),C(7,"C"),C(2,"S")]);
  assert.equal(r.name, "炸弹牛");
});

test("牛牛-五花牛条件-全是JQK", () => {
  const r = niuniuScore([C(11,"S"),C(11,"H"),C(12,"D"),C(13,"C"),C(13,"S")]);
  assert.equal(r.name, "五花牛");
});

test("牛牛-五花牛不含10", () => {
  const r = niuniuScore([C(10,"S"),C(11,"H"),C(12,"D"),C(13,"C"),C(13,"S")]);
  assert.notEqual(r.name, "五花牛");
});

test("牛牛-同牛数比最大牌", () => {
  const a = niuniuScore([C(2,"S"),C(3,"H"),C(5,"D"),C(4,"C"),C(7,"S")]);
  const c = niuniuScore([C(2,"S"),C(8,"H"),C(10,"D"),C(3,"C"),C(8,"S")]);
  assert.ok(c.score > a.score);
});

test("牛牛-牛2", () => {
  const r = niuniuScore([C(2,"S"),C(3,"H"),C(5,"D"),C(4,"C"),C(8,"S")]);
  assert.equal(r.name, "牛2");
});

// 随机牌型测试 (35项)
for (let i = 0; i < 35; i++) {
  test(`牛牛-随机5张牌必有结果 #${i+1}`, () => {
    const deck = shuffle(freshDeck()).slice(0, 5);
    const r = niuniuScore(deck);
    assert.ok(r.score >= 0);
    assert.ok([1, 2, 3, 4, 5, 6].includes(r.mult), `倍数${r.mult}不合法`);
  });
}

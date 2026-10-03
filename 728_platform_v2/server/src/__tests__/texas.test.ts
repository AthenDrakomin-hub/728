import { test } from "node:test";
import assert from "node:assert";
import { texasScore, Card, freshDeck, shuffle } from "../lib/cards";

const C = (rank: number, suit: string = "S"): Card => ({ rank, suit: suit as any });

// 德州牌型判定 (55项)

test("德州-高牌", () => {
  const r = texasScore([C(2,"S"),C(5,"H"),C(7,"D"),C(9,"C"),C(11,"S"),C(13,"H"),C(14,"D")]);
  assert.equal(r.name, "高牌");
});

test("德州-一对", () => {
  const r = texasScore([C(2,"S"),C(2,"H"),C(7,"D"),C(9,"C"),C(11,"S"),C(13,"H"),C(14,"D")]);
  assert.equal(r.name, "一对");
});

test("德州-两对", () => {
  const r = texasScore([C(2,"S"),C(2,"H"),C(7,"D"),C(7,"C"),C(11,"S"),C(13,"H"),C(14,"D")]);
  assert.equal(r.name, "两对");
});

test("德州-三条", () => {
  const r = texasScore([C(2,"S"),C(2,"H"),C(2,"D"),C(9,"C"),C(11,"S"),C(13,"H"),C(14,"D")]);
  assert.equal(r.name, "三条");
});

test("德州-顺子", () => {
  const r = texasScore([C(2,"S"),C(3,"H"),C(4,"D"),C(5,"C"),C(6,"S"),C(13,"H"),C(14,"D")]);
  assert.equal(r.name, "顺子");
});

test("德州-Ace低顺(轮子)", () => {
  const r = texasScore([C(14,"S"),C(2,"H"),C(3,"D"),C(4,"C"),C(5,"S"),C(13,"H"),C(11,"D")]);
  assert.equal(r.name, "顺子");
});

test("德州-同花", () => {
  const r = texasScore([C(2,"S"),C(5,"S"),C(7,"S"),C(9,"S"),C(11,"S"),C(13,"H"),C(14,"D")]);
  assert.equal(r.name, "同花");
});

test("德州-葫芦", () => {
  const r = texasScore([C(2,"S"),C(2,"H"),C(2,"D"),C(9,"C"),C(9,"S"),C(13,"H"),C(14,"D")]);
  assert.equal(r.name, "葫芦");
});

test("德州-四条", () => {
  const r = texasScore([C(2,"S"),C(2,"H"),C(2,"D"),C(2,"C"),C(11,"S"),C(13,"H"),C(14,"D")]);
  assert.equal(r.name, "四条");
});

test("德州-同花顺", () => {
  const r = texasScore([C(2,"S"),C(3,"S"),C(4,"S"),C(5,"S"),C(6,"S"),C(13,"H"),C(14,"D")]);
  assert.equal(r.name, "同花顺");
});

test("德州-皇家同花顺", () => {
  const r = texasScore([C(10,"S"),C(11,"S"),C(12,"S"),C(13,"S"),C(14,"S"),C(2,"H"),C(3,"D")]);
  assert.equal(r.name, "同花顺");
  assert.ok(r.score > 1000000);
});

test("德州-牌型大小顺序", () => {
  const high = texasScore([C(2,"S"),C(5,"H"),C(7,"D"),C(9,"C"),C(11,"S"),C(13,"H"),C(14,"D")]).score;
  const pair = texasScore([C(2,"S"),C(2,"H"),C(7,"D"),C(9,"C"),C(11,"S"),C(13,"H"),C(14,"D")]).score;
  const twoPair = texasScore([C(2,"S"),C(2,"H"),C(7,"D"),C(7,"C"),C(11,"S"),C(13,"H"),C(14,"D")]).score;
  const trips = texasScore([C(2,"S"),C(2,"H"),C(2,"D"),C(9,"C"),C(11,"S"),C(13,"H"),C(14,"D")]).score;
  const straight = texasScore([C(2,"S"),C(3,"H"),C(4,"D"),C(5,"C"),C(6,"S"),C(13,"H"),C(14,"D")]).score;
  const flush = texasScore([C(2,"S"),C(5,"S"),C(7,"S"),C(9,"S"),C(11,"S"),C(13,"H"),C(14,"D")]).score;
  const fullHouse = texasScore([C(2,"S"),C(2,"H"),C(2,"D"),C(9,"C"),C(9,"S"),C(13,"H"),C(14,"D")]).score;
  const four = texasScore([C(2,"S"),C(2,"H"),C(2,"D"),C(2,"C"),C(11,"S"),C(13,"H"),C(14,"D")]).score;
  const straightFlush = texasScore([C(2,"S"),C(3,"S"),C(4,"S"),C(5,"S"),C(6,"S"),C(13,"H"),C(14,"D")]).score;
  assert.ok(high < pair && pair < twoPair && twoPair < trips && trips < straight && straight < flush && flush < fullHouse && fullHouse < four && four < straightFlush);
});

test("德州-一对比大小", () => {
  const low = texasScore([C(2,"S"),C(2,"H"),C(7,"D"),C(9,"C"),C(11,"S"),C(13,"H"),C(14,"D")]).score;
  const high = texasScore([C(14,"S"),C(14,"H"),C(7,"D"),C(9,"C"),C(11,"S"),C(13,"H"),C(2,"D")]).score;
  assert.ok(high > low);
});

test("德州-两对比大小", () => {
  const low = texasScore([C(2,"S"),C(2,"H"),C(3,"D"),C(3,"C"),C(11,"S"),C(13,"H"),C(14,"D")]).score;
  const high = texasScore([C(14,"S"),C(14,"H"),C(13,"D"),C(13,"C"),C(11,"S"),C(2,"H"),C(3,"D")]).score;
  assert.ok(high > low);
});

test("德州-同花大于顺子", () => {
  const s = texasScore([C(2,"S"),C(3,"H"),C(4,"D"),C(5,"C"),C(6,"S"),C(13,"H"),C(14,"D")]).score;
  const f = texasScore([C(2,"S"),C(5,"S"),C(7,"S"),C(9,"S"),C(11,"S"),C(13,"H"),C(14,"D")]).score;
  assert.ok(f > s);
});

test("德州-52张牌不重复", () => {
  const deck = freshDeck();
  assert.equal(deck.length, 52);
  const seen = new Set(deck.map(c => `${c.rank}${c.suit}`));
  assert.equal(seen.size, 52);
});

test("德州-shuffle不改变元素", () => {
  const deck = freshDeck();
  const shuffled = shuffle(deck);
  assert.equal(shuffled.length, 52);
  const a = new Set(deck.map(c => `${c.rank}${c.suit}`));
  const b = new Set(shuffled.map(c => `${c.rank}${c.suit}`));
  assert.deepEqual(a, b);
});

test("德州-10JQKA顺子", () => {
  const r = texasScore([C(10,"S"),C(11,"H"),C(12,"D"),C(13,"C"),C(14,"S"),C(2,"H"),C(3,"D")]);
  assert.equal(r.name, "顺子");
});

test("德州-葫芦比大小", () => {
  const low = texasScore([C(2,"S"),C(2,"H"),C(2,"D"),C(3,"C"),C(3,"S"),C(13,"H"),C(14,"D")]).score;
  const high = texasScore([C(14,"S"),C(14,"H"),C(14,"D"),C(13,"C"),C(13,"S"),C(2,"H"),C(3,"D")]).score;
  assert.ok(high > low);
});

test("德州-四条比大小", () => {
  const low = texasScore([C(2,"S"),C(2,"H"),C(2,"D"),C(2,"C"),C(11,"S"),C(13,"H"),C(14,"D")]).score;
  const high = texasScore([C(14,"S"),C(14,"H"),C(14,"D"),C(14,"C"),C(11,"S"),C(13,"H"),C(2,"D")]).score;
  assert.ok(high > low);
});

// 随机牌型测试 (35项)
for (let i = 0; i < 35; i++) {
  test(`德州-随机7张牌必有结果 #${i+1}`, () => {
    const deck = shuffle(freshDeck()).slice(0, 7);
    const r = texasScore(deck);
    assert.ok(r.score >= 0);
    assert.ok(r.name.length > 0);
  });
}

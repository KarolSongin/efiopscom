import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { calculatePlan } from '../src/lib/planning.mjs';
const scenarios = JSON.parse(fs.readFileSync('src/data/scenarios.json', 'utf8'));
test('capacity decisions use handling time and available staff hours', () => {
  const base = calculatePlan(1200);
  assert.equal(base.requiredHours, 80);
  assert.equal(base.availableHours, 96);
  assert.equal(base.balance, 16);
  assert.equal(base.capacityUnits, 1440);
  assert.equal(calculatePlan(1500).balance, -4);
  assert.equal(calculatePlan(1800).balance, -24);
  assert.equal(calculatePlan(1800, 4).balance, 8);
  assert.equal(
    scenarios.planning.daily.reduce((a, b) => a + b, 0),
    base.units,
  );
});
test('invalid planning inputs do not produce misleading numbers', () => {
  for (const args of [[-1], [Infinity], [1200, 3, 32, 0], [1200, NaN]])
    assert.throws(() => calculatePlan(...args), RangeError);
});
test('sales channels reconcile to daily sales, total costs and order counts', () => {
  const { all, online, store } = scenarios.sales;
  for (const key of ['revenue', 'costs', 'orders'])
    assert.equal(online[key] + store[key], all[key]);
  for (const channel of [all, online, store])
    assert.equal(
      channel.daily.reduce((a, b) => a + b, 0),
      channel.revenue,
    );
  all.daily.forEach((v, i) => assert.equal(v, online.daily[i] + store.daily[i]));
  assert.equal(all.revenue - all.costs, 10750);
});

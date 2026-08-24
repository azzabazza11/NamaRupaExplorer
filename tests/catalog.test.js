import assert from "node:assert/strict";
import {
  GROUPS,
  FACTORS,
  PHENOMENA,
  THREADS,
  SUTTAS,
  groupById,
  factorById,
  phenomenonById,
  suttaById,
  factorsInGroup,
  searchCatalog,
  totalsOk,
} from "../js/data.js";

const expected = { magga: 8, bojjhanga: 7, indriya: 5, bala: 5, satipatthana: 4, padhana: 4, iddhipada: 4 };

assert.equal(GROUPS.length, 7);
assert.equal(FACTORS.length, 37);
assert.equal(GROUPS.reduce((n, g) => n + g.n, 0), 37);
assert.deepEqual(
  GROUPS.map((g) => g.n),
  [8, 7, 5, 5, 4, 4, 4],
);

const totals = totalsOk();
assert.deepEqual(totals.byGroup, expected);
assert.equal(totals.sum, 37);

const ids = new Set();
for (const f of FACTORS) {
  assert.ok(groupById(f.group), `missing group ${f.group}`);
  assert.ok(!ids.has(f.id), `duplicate factor ${f.id}`);
  ids.add(f.id);
  for (const sid of f.suttas) assert.ok(suttaById(sid), `bad sutta ${sid} on ${f.id}`);
  for (const pid of f.phenomena) assert.ok(phenomenonById(pid), `bad phenomenon ${pid} on ${f.id}`);
  for (const tid of f.threads) assert.ok(THREADS.some((t) => t.id === tid), `bad thread ${tid} on ${f.id}`);
  for (const oid of f.sameAs) assert.ok(factorById(oid), `bad sameAs ${oid} on ${f.id}`);
}

for (const g of GROUPS) {
  assert.equal(factorsInGroup(g.id).length, expected[g.id], g.id);
  for (const sid of g.suttas) assert.ok(suttaById(sid), `bad group sutta ${sid}`);
}

for (const p of PHENOMENA) {
  for (const fid of p.factors) assert.ok(factorById(fid), `bad factor ${fid} on phenomenon ${p.id}`);
  for (const rid of p.related) assert.ok(phenomenonById(rid), `bad related ${rid} on ${p.id}`);
}

assert.ok(Object.keys(SUTTAS).length >= 20);
assert.ok(searchCatalog("sati").factors.length >= 4);
assert.ok(searchCatalog("MN 10").suttas.length >= 1);
assert.ok(searchCatalog("craving").phenomena.length >= 1);

console.log("catalog ok", totals);

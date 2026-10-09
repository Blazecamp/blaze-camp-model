// tests/invariants/invariants.test.mjs - the coach's hard rules as invariants (CONTRACTS §1.7, §8). Owner: B4.
//
// Corpora: the 8 sample intakes on the fixture model (strict) and on the compiled model/ when present, plus - with the real
// B2 / B3 modules - 300 seeded random intakes, one competitive athlete per picker sport (52) and one "stay athletic and active"
// client per activity (26). For each corpus: generate() returns status ok; every error check of validatePlan passes (one test
// per check id); and every hard rule H01-H22 is re-checked by an independent property function written here (not by calling
// validate.mjs), so a bug in the validator cannot hide a broken plan.
//
// KNOWN_*: genuine defects of other modules found by this suite during the Phase 0 build (see engine/CONTRACT_REQUESTS.md,
// B4 entries). Their tests run as `todo` - reported, never silently skipped. Delete an entry when the owner fixes it.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generate, generateWith, adapt, adaptWith, realModulesStatus } from '../../engine/generate.mjs';
import { validatePlan, CHECK_IDS } from '../../engine/validate.mjs';
import { forbiddenKeys, canonicalJSON } from '../../engine/util.mjs';
import { STUB_DEPS } from '../helpers/stub-modules.mjs';
import { loadFixtureModel, loadCompiledModel, allSamples } from '../helpers/models.mjs';
import { randomIntake, sportIntake, activityIntake } from '../helpers/random-intake.mjs';

const REAL = realModulesStatus().ready;
const LABEL = REAL ? 'real modules' : 'stub modules';
const gen = (intake, model) => (REAL ? generate(intake, model) : generateWith(STUB_DEPS, intake, model));
const N_RANDOM = 300;

// v1.2 review round (samples/REVIEW_LOG.md, 'deferred'): the stricter checks added for the coach's reviews pass on the 8
// samples but still find these engine limits in the random corpus. Each runs as `todo` until fixed:
const KNOWN_RANDOM = {
  V27: '2 of 378: wall-ball / sit-up throws are dosed at fixed reps, so a small weekly throw target can be exceeded (samples/REVIEW_LOG.md)',
  H21: '9 of 378: a muscle whose only day sits at its per-session cap (6-day crossfit / athletic templates) stays flat; sport-45 flips a hinge work slot to a glute bridge at a block change (samples/REVIEW_LOG.md)',
  H10: '1 of 378: a 2 x 30 min plan adds a bonus slot and a set at an exercise-block boundary (+14 %)',
  V15: '1 of 378: same case as H10'
};
// Fixed by B2 / B3 during the build (were todo here): V13 recovery week over the athlete cap, V14 / H08 added-slot id
// collision, V18 rear-delt station, V23 / H18 lone rear-delt station / limited kits, H05 empty core slot, H21 direct sets drop.
// Fixed in the integration step: V19 (AP_TRIPLE_EXT dropped in 4 of 378 intakes; 0 of 1,578 fail on the fixture and on model/
// after the select relaxed step, the front-raise catalogue fix and same-day dedupe of added slots).
const KNOWN_COMPILED = {};   // 02-football chest-sets drop at week 9 (H21) was fixed by B2 / B3 during the build

// ------------------------------------------------------------------------------------------------------------- corpora

function corpus(model, intakes) {
  return intakes.map(({ name, intake }) => {
    let plan = null, error = null;
    try { plan = gen(intake, model); } catch (e) { error = e; }
    return { name, intake, plan, error, model };
  });
}
const fixture = loadFixtureModel();
const compiled = loadCompiledModel();
const CORPORA = [{ label: 'samples / fixture', known: {}, runs: corpus(fixture, allSamples()) }];
if (compiled) CORPORA.push({ label: 'samples / compiled model', known: KNOWN_COMPILED, runs: corpus(compiled, allSamples()) });
if (REAL) {
  const intakes = [
    ...Array.from({ length: N_RANDOM }, (_, i) => ({ name: 'random-' + i, intake: randomIntake(i, fixture) })),
    ...fixture.profiles.picker.sports.map((s, k) => ({ name: 'sport-' + s.id, intake: sportIntake(k, fixture) })),
    ...fixture.profiles.picker.activities.map((a, k) => ({ name: 'activity-' + a.id, intake: activityIntake(k, fixture) }))
  ];
  CORPORA.push({ label: `random ${N_RANDOM} + every sport + every activity / fixture`, known: KNOWN_RANDOM, runs: corpus(fixture, intakes) });
}

const okPlans = (runs) => runs.filter(r => r.plan && r.plan.status === 'ok');
const show = (list) => list.slice(0, 8).join('\n') + (list.length > 8 ? `\n… ${list.length - 8} more` : '');

// ------------------------------------------------------------------------------------------------------------- helpers

const BAND_RE = /\b(band|bands|banded|chain|chains|weight[- _]?releasers?)\b/i;
const rows = (p) => p.weeks.flatMap(w => w.days.flatMap(d => { let i = 0; return d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it, i: i++ }))); }));
const dayRows = (w, d) => { let i = 0; return d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it, i: i++ }))); };
const ex = (m, id) => (id && m.hasEx(id) ? m.ex(id) : null);
const at = (r) => `w${r.w.n} ${r.d.weekday} ${r.it.slot_id}`;
const isRes = (m, it) => { try { return !!it.exercise_id && (['resistance', 'isolation', 'focus'].includes(m.bucket(it.bucket).kind) || it.origin === 'bonus'); } catch { return false; } };
const older = (p, m) => (p.meta.derived && p.meta.derived.age) >= m.rules.population.older.from_age;

// Independent property checks: each returns a list of violation strings for one plan.
const P = {
  H01(p, m) {
    const out = [];
    for (const r of rows(p)) for (const id of [r.it.exercise_id, ...r.it.swaps].filter(Boolean)) if (BAND_RE.test(id) || (ex(m, id) && BAND_RE.test(m.t('en', ex(m, id).name_key)))) out.push(at(r) + ' ' + id);
    for (const t of p.meta.kit.tokens) if (BAND_RE.test(t) || m.rules.equipment.banned_tokens.includes(t)) out.push('kit ' + t);
    return out;
  },
  H02(p, m) {
    return rows(p).filter(r => /^RP_/.test(r.it.bucket) && r.it.effort && r.it.effort.type === 'rir').flatMap(r => {
      const e = r.it.effort, x = ex(m, r.it.exercise_id);
      const bad = [];
      if (!(e.min >= 1)) bad.push(at(r) + ' RIR ' + e.min);
      if (e.last_set === 'max') bad.push(at(r) + ' MAX on a compound');
      if (e.last_set === 'myo' && !(x && x.constraint >= 4)) bad.push(at(r) + ' MYO on a free-weight compound');
      return bad;
    });
  },
  H03(p) {
    const out = [];
    for (const w of p.weeks) for (const d of w.days) {
      const rs = dayRows(w, d), s = rs.find(r => r.b.kind === 'strength');
      if (s) for (const r of rs) if (['athletic', 'power'].includes(r.b.kind) && r.i > s.i) out.push(at(r));
    }
    return out;
  },
  H04(p) {
    const out = [];
    for (const w of p.weeks) for (const d of w.days) {
      const rs = dayRows(w, d);
      for (const [h, v] of [['RP_HPULL', 'RP_VPULL'], ['RP_HPUSH', 'RP_VPUSH']]) {
        const H = rs.find(r => r.it.bucket === h), Vv = rs.find(r => r.it.bucket === v);
        if (H && Vv && Vv.i < H.i && Vv.it.role !== 'work') out.push(at(Vv) + ' ' + v + ' before ' + h);
      }
    }
    return out;
  },
  H05(p, m) {
    const out = [], pos = (p.meta.derived.prefs || {}).core_position || 'start';
    for (const w of p.weeks) for (const d of w.days) {
      if (d.kind !== 'main' || !d.blocks.length) continue;
      const ci = d.blocks.findIndex(b => b.kind === 'core');
      if (ci < 0) { out.push(`w${w.n} ${d.weekday} no core block`); continue; }
      if (pos === 'start' && d.blocks.slice(0, ci).some(b => !['warmup', 'aerobic'].includes(b.kind))) out.push(`w${w.n} ${d.weekday} core not first`);
      const need = d.minutes_limit >= 45 ? m.rules.core_block.exercises : 1;
      if (w.block_type === 'stairway' && d.blocks[ci].items.length < need) out.push(`w${w.n} ${d.weekday} core block of ${d.blocks[ci].items.length}`);
    }
    return out;
  },
  H06(p, m) {
    const out = [], Pr = m.rules.pairing;
    if (p.meta.template.variant && Pr.not_for_variants.includes(p.meta.template.variant)) return out;
    for (const w of p.weeks) for (const d of w.days) {
      if (d.kind !== 'main') continue;
      const groups = {};
      for (const r of dayRows(w, d)) if (r.it.superset && isRes(m, r.it)) (groups[r.it.superset] = groups[r.it.superset] || []).push(r.it.bucket);
      for (const [g, bs] of Object.entries(groups)) {
        const ups = bs.filter(b => [...Pr.hip_with, ...Pr.knee_with].includes(b));
        if (bs.some(b => Pr.hip_buckets.includes(b)) && ups.some(b => !Pr.hip_with.includes(b))) out.push(`w${w.n} ${d.weekday} ${g}: hip lift with ${ups.join('/')}`);
        if (bs.some(b => Pr.knee_buckets.includes(b)) && ups.some(b => !Pr.knee_with.includes(b))) out.push(`w${w.n} ${d.weekday} ${g}: knee lift with ${ups.join('/')}`);
      }
    }
    return out;
  },
  H07(p, m) {
    const out = [];
    for (const w of p.weeks) {
      const c = { squat: [], hinge: [] };
      for (const r of rows(p).filter(x => x.w === w)) { const x = ex(m, r.it.exercise_id); if (x && x.axial) c[x.axial_pattern].push(r.d.weekday); }
      if (c.squat.length > 1 || c.hinge.length > 1) out.push(`w${w.n} counted squats ${c.squat.join(',')} hinges ${c.hinge.join(',')}`);
      if (c.squat.some(d => c.hinge.includes(d))) out.push(`w${w.n} heavy squat and heavy hinge on the same day`);
    }
    return out;
  },
  H08(p, m) {
    const out = [];
    for (const r of rows(p)) {
      const x = ex(m, r.it.exercise_id);
      for (const [mu, v] of Object.entries(r.it.credits)) {
        const ok = v === 1 || v === m.rules.credit.helper || (x && x.credit_class === 'DIPS' && v === 0.5) || (x && x.credit_class === 'THRUSTER' && mu === 'front_delts' && v === 0.5);
        if (!ok) out.push(`${at(r)} ${mu} ${v}`);
      }
      if (x && x.tags.some(t => m.rules.credit.never_credit_tags.includes(t)) && Object.keys(r.it.credits).length) out.push(at(r) + ' KB swing / wall ball credited');
      if (x && x.credit_class === 'THRUSTER' && Object.keys(r.it.credits).length && canonicalJSON(r.it.credits) !== canonicalJSON({ quads: 1, front_delts: 0.5, glutes: 0.25 })) out.push(at(r) + ' thruster credits');
    }
    for (const w of p.weeks) {
      const sum = {};
      for (const r of rows(p).filter(x => x.w === w)) for (const [mu, v] of Object.entries(r.it.credits)) sum[mu] = (sum[mu] || 0) + (r.it.sets || 0) * v;
      for (const mu of new Set([...Object.keys(sum), ...Object.keys(w.weekly_sets_by_muscle)])) if (Math.abs((sum[mu] || 0) - (w.weekly_sets_by_muscle[mu] || 0)) > 0.006) out.push(`w${w.n} ${mu} items ${sum[mu] || 0} vs claimed ${w.weekly_sets_by_muscle[mu] || 0}`);
    }
    return out;
  },
  H09(p, m) {
    return rows(p).filter(r => m.rules.credit.athletic_slot_buckets.includes(r.it.bucket) && Object.keys(r.it.credits).length).map(at);
  },
  H10(p, m) {
    const out = [], L = m.rules.stairway.limits;
    for (const w of p.weeks) for (const [mu, s] of Object.entries(w.step_by_muscle)) if (s > L.planned_step_max + 1e-9) out.push(`w${w.n} ${mu} step ${s}`);
    for (let i = 1; i < p.weeks.length; i++) {
      const a = p.weeks[i - 1], b = p.weeks[i];
      if (a.block_type === 'stairway' && b.block_type === 'stairway' && a.training_block === b.training_block && !(b.total_resistance_sets < (1 + L.total_weekly_ceiling) * a.total_resistance_sets - 1e-9)) out.push(`w${b.n} total ${a.total_resistance_sets} -> ${b.total_resistance_sets}`);
    }
    return out;
  },
  H11(p, m) {
    const out = [];
    for (const r of rows(p)) {
      if (r.it.load && r.it.load.type === 'medball_lb' && r.it.load.max > m.rules.medball.max_lb) out.push(at(r) + ' ' + r.it.load.max + ' lb');
      const x = ex(m, r.it.exercise_id);
      if (p.meta.goal === 'muscle' && x && (x.tags.includes('medball') || x.medball) && r.b.kind !== 'warmup') out.push(at(r) + ' medball in aesthetics main work');
    }
    return out;
  },
  H12(p, m) {
    if (!older(p, m)) return [];
    const O = m.rules.population.older, never = [...O.never_tags, ...O.never_tags_phase0_even_with_opt_in], out = [];
    const optIn = !!(p.meta.derived.prefs && p.meta.derived.prefs.older_athletic_opt_in);
    for (const r of rows(p)) for (const id of [r.it.exercise_id, ...r.it.swaps].filter(Boolean)) {
      const x = ex(m, id);
      if (!x) continue;
      for (const t of never) if (x.tags.includes(t)) out.push(`${at(r)} ${id} (${t})`);
      if (!optIn && x.athletic && ['plyometric', 'olympic'].includes(x.athletic.quality)) out.push(`${at(r)} ${id} (${x.athletic.quality} without opt-in)`);
      if (!optIn && x.tags.includes('loaded_jump')) out.push(`${at(r)} ${id} (loaded jump without opt-in)`);
    }
    return out;
  },
  H13(p) { return forbiddenKeys(p).filter(k => /(^|\.)(sex|gender)$/i.test(k.replace(/\[\d+\]/g, ''))); },
  H14(p) { const c = p.validation.checks.find(x => x.id === 'H14'); return c.pass ? [] : c.violations.map(v => JSON.stringify(v.args)); },
  H15(p) {
    const out = [];
    for (const tb of p.shape.training_blocks.filter(t => t.type === 'stairway')) for (const w of p.weeks) if (w.n >= tb.weeks[0] && w.n <= tb.weeks[1] && w.block_type !== 'stairway') out.push(`w${w.n} ${w.block_type} inside stairway ${tb.weeks.join('-')}`);
    return out;
  },
  H16(p) { return [...forbiddenKeys(p), ...p.meta.input_audit.forbidden_found]; },
  H17(p, m) {
    const out = [], floor = m.rules.volume.floor.value, t = p.meta.targets;
    const warned = new Set(p.meta.warnings.filter(w => w.key === 'warning.floor_schedule').flatMap(w => String(w.args && w.args.muscles || '').split(/\s*,\s*/).map(x => x.replace(/^muscle\./, ''))));
    for (const w of p.weeks.filter(x => x.block_type === 'stairway' && !x.circuit)) for (const mu of t.floored) {
      if (warned.has(mu) || t.pain_muscles.includes(mu) || t.credit_only.includes(mu)) continue;
      if (!(w.weekly_sets_by_muscle[mu] >= floor - 1e-9)) out.push(`w${w.n} ${mu} ${w.weekly_sets_by_muscle[mu]}`);
    }
    return out;
  },
  H18(p, m) {
    const G = m.rules.session.exercises_per_group, out = [];
    if (G.exempt_families.includes(p.meta.family)) return out;
    for (const w of p.weeks) for (const d of w.days) {
      if (d.kind !== 'main' || d.format === 'circuit') continue; // 2-4 per group is a full-body / split rule, not a timed circuit's (V23)
      const n = {};
      for (const r of dayRows(w, d)) if (isRes(m, r.it)) { const g = r.it.group; if (g) n[g] = (n[g] || 0) + 1; }
      for (const [g, c] of Object.entries(n)) if (!G.exempt_groups.includes(g) && (c < 2 || (d.full_body && c > 4))) out.push(`w${w.n} ${d.weekday} ${g}: ${c}`);
    }
    return out;
  },
  H19(p, m) {
    const out = [];
    const after = new Set(), zero = new Set();
    const add = (s, v) => { if (typeof v === 'string') s.add(v); else if (Array.isArray(v)) v.forEach(x => s.add(x)); else if (v && typeof v === 'object') Object.values(v).forEach(x => add(s, x)); };
    for (const t of Object.values(m.rules.tests.catalogue)) { add(after, t.after_completed_block); add(zero, t.from_zero); }
    for (const w of p.weeks) {
      const tb = p.shape.training_blocks.find(t => t.n === w.training_block);
      if (w.test && !(w.block_type === 'stairway' && ((w.test.type === 'baseline' && w.stair_week === 1) || (w.test.type === 'end' && w.stair_week === tb.stair_N)))) out.push(`w${w.n} ${w.test.type} test at stair week ${w.stair_week} (${w.block_type})`);
      for (const r of rows(p).filter(x => x.w === w && x.it.test)) if (w.test && w.test.from_zero && after.has(r.it.test.test) && !zero.has(r.it.test.test)) out.push(at(r) + ' ' + r.it.test.test + ' from zero');
    }
    return out;
  },
  H20(p, m) {
    const d = p.meta.derived, want = d.age < m.rules.levels.youth_age ? 'release.minor' : p.meta.health.role === 'client' ? 'release.coach' : 'release.client';
    return p.release_stamp && p.release_stamp.version === want ? [] : [`release ${p.release_stamp && p.release_stamp.version} (want ${want})`];
  },
  H21(p, m) {
    const out = [];
    for (const tb of p.shape.training_blocks.filter(t => t.type === 'stairway')) {
      const ws = p.weeks.filter(w => w.training_block === tb.n);
      const target = Object.entries(p.meta.targets.fill).filter(([, f]) => f === 'target').map(([mu]) => mu);
      for (let i = 1; i < ws.length; i++) {
        for (const mu of target) if ((ws[i].direct_sets_by_muscle[mu] || 0) < (ws[i - 1].direct_sets_by_muscle[mu] || 0)) out.push(`w${ws[i].n} ${mu} direct sets drop`);
        if (!(ws[i].stair_level > ws[i - 1].stair_level)) out.push(`w${ws[i].n} stair level ${ws[i].stair_level}`);
        if (ws[i].planned_rir.min > ws[i - 1].planned_rir.min || ws[i].planned_rir.max > ws[i - 1].planned_rir.max) out.push(`w${ws[i].n} planned RIR rises`);
      }
      const tot = ws.map(w => w.total_resistance_sets);
      if (Math.max(...tot) > tot[tot.length - 1]) out.push(`block ${tb.n}: last week ${tot[tot.length - 1]} < max ${Math.max(...tot)}`);
      if (ws.length === 12 && Math.min(...tot.slice(8)) < Math.max(...tot.slice(0, 8))) out.push(`block ${tb.n}: last 4 weeks are not the 4 hardest`);
    }
    return out;
  },
  H22(p) {
    const c = p.validation.checks.find(x => x.id === 'H22');
    // v1.2 (D-67): schedule offers made at build time (the start was sized to the minutes; longer sessions / one more day) are
    // not adaptations; any other offer needs a check-in
    const SCHEDULE = ['offer.lower_start', 'offer.longer_sessions', 'offer.more_days'];
    return [...(c.pass ? [] : c.violations.map(v => JSON.stringify(v.args))), ...(p.offers.some(o => !SCHEDULE.includes(o.key)) ? ['offers without check-ins'] : [])];
  }
};
const H_IDS = CHECK_IDS.filter(id => id.startsWith('H'));

// ------------------------------------------------------------------------------------------------------------- tests

for (const C of CORPORA) {
  describe(`${C.label} (${C.runs.length} intakes, ${LABEL})`, () => {
    test('generate() returns status ok for every intake (no throw, no refer, no invalid)', () => {
      const bad = C.runs.filter(r => r.error || !r.plan || r.plan.status !== 'ok').map(r => r.name + ': ' + (r.error ? r.error.message : r.plan.status + ' ' + JSON.stringify(r.plan.errors || r.plan.refer)));
      assert.equal(bad.length, 0, show(bad));
    });

    const errorChecks = fixture.rules.validation.checks.filter(c => c.severity === 'error').map(c => c.id).concat(H_IDS);
    for (const id of errorChecks) {
      test(`validatePlan ${id} passes on every plan`, { todo: C.known[id] || false }, () => {
        const bad = okPlans(C.runs).filter(r => !r.plan.validation.checks.find(c => c.id === id).pass)
          .map(r => r.name + ': ' + JSON.stringify(r.plan.validation.checks.find(c => c.id === id).violations.slice(0, 2)));
        assert.equal(bad.length, 0, show(bad));
      });
    }

    for (const h of H_IDS) {
      test(`property ${h} (independent re-check)`, { todo: C.known[h] || false }, () => {
        const bad = okPlans(C.runs).flatMap(r => P[h](r.plan, r.model).slice(0, 2).map(v => r.name + ': ' + v));
        assert.equal(bad.length, 0, show(bad));
      });
    }

    // integration-step properties (contracts/1.1.1): what a coach reading the plan would flag at once
    test('no day lists the identical exercise twice (same exercise and same detail) while a variation axis is left (D-48)', () => {
      // a kit with a single option for a group (e.g. field kit without a pull-up bar: table rows only) may repeat an exercise
      // once all its variation axes are used that day; the plan then carries the V7 buy list
      const bad = okPlans(C.runs).flatMap(r => r.plan.weeks.flatMap(w => w.days.flatMap(d => {
        const seen = new Map(), out = [];
        for (const b of d.blocks) for (const it of b.items) {
          if (!it.exercise_id || b.kind === 'warmup') continue;
          const axes = seen.get(it.exercise_id) || new Set();
          const k = it.detail ? it.detail.axis : '';
          const left = (r.model.ex(it.exercise_id).variation_axes || []).filter(a => !axes.has(a));
          if (axes.has(k) && left.length) out.push(`${r.name}: w${w.n} ${d.weekday} ${it.exercise_id}|${k}`);
          axes.add(k);
          seen.set(it.exercise_id, axes);
        }
        return out;
      })));
      assert.equal(bad.length, 0, show(bad));
    });

    test('strength rep-max tests sit on bilateral compound lifts (D-46)', () => {
      const cat = fixture.rules.tests.catalogue.strength;
      const strength = new Set([...Object.values(cat.from_zero), ...Object.values(cat.after_completed_block), cat.older, cat.pro]);
      const bad = okPlans(C.runs).flatMap(r => rows(r.plan).filter(x => x.it.test && strength.has(x.it.test.test)).filter(x => {
        const ex = r.model.ex(x.it.exercise_id);
        return ex.laterality !== 'bilateral' || ex.exercise_class !== 'compound';
      }).map(x => `${r.name}: w${x.w.n} ${x.d.weekday} ${x.it.exercise_id} ${x.it.test.test}`));
      assert.equal(bad.length, 0, show(bad));
    });

    test('the stored validation equals a fresh validatePlan run', () => {
      for (const r of okPlans(C.runs).slice(0, 40)) {
        const { validation, ...rest } = r.plan;
        assert.equal(JSON.stringify(validatePlan({ ...rest, validation: null }, r.model)), JSON.stringify(validation), r.name);
      }
    });
  });
}

describe(`no lifestyle or sex input is ever accepted (H13, H16) (${LABEL})`, () => {
  const base = allSamples()[0].intake;
  for (const key of ['sleep', 'stress', 'recovery', 'job', 'hard_job_or_other_sport', 'life', 'energy', 'sex', 'gender']) {
    test(`intake with "${key}" (top level and nested) is invalid`, () => {
      for (const intake of [{ ...structuredClone(base), [key]: 'x' }, { ...structuredClone(base), prefs: { ...base.prefs, [key]: 1 } }]) {
        const p = gen(intake, fixture);
        assert.equal(p.status, 'invalid');
        assert.deepEqual(p.weeks, []);
      }
    });
  }
});

test(`no check-in = no change: adapt(plan, []) is byte-identical to generate for every sample (H22) (${LABEL})`, () => {
  for (const { name, intake } of allSamples()) {
    const p = gen(intake, fixture);
    const a = REAL ? adapt(p, [], intake, fixture) : adaptWith(STUB_DEPS, p, [], intake, fixture);
    assert.equal(JSON.stringify(a), JSON.stringify(p), name);
  }
});

test('coverage of the random corpus (CONTRACTS §8 axes)', { skip: REAL ? false : 'random corpus runs with the real modules only' }, () => {
  const R = CORPORA[CORPORA.length - 1].runs.map(r => r.intake);
  const has = (f) => new Set(R.map(f).flat().filter(x => x !== null && x !== undefined));
  assert.deepEqual([...has(i => i.goal)].sort(), ['active', 'athletic', 'fat_loss', 'general', 'hybrid', 'muscle', 'strength']);
  assert.deepEqual([...has(i => i.schedule.days_per_week)].sort(), [2, 3, 4, 5, 6]);
  for (const m of [30, 45, 60, 75, 90]) assert.ok(has(i => i.schedule.session_minutes).has(m), 'minutes ' + m);
  assert.equal(has(i => i.equipment.profile).size, fixture.rules.equipment.intake_profiles.length);
  for (const a of [15, 16, 52, 61, 70]) assert.ok(has(i => i.age).has(a), 'age ' + a);
  assert.equal(has(i => i.pain.map(p => p.area)).size, 10);
  assert.equal(has(i => (i.sport && i.sport.sport) || []).size, fixture.profiles.picker.sports.length);
  assert.ok(has(i => (i.sport && i.sport.sport) || []).has('swimming'));
  const acts = has(i => (i.activity && i.activity.ids) || []);
  assert.equal(acts.size, fixture.profiles.picker.activities.length);
  assert.ok(acts.has('rec_pickleball') && acts.has('hyrox_fitness'));
  assert.deepEqual([...has(i => i.plan.mode)].sort(), ['fixed_12', 'fixed_8', 'maintenance_4_6', 'week_by_week', 'year']);
  assert.ok(R.some(i => i.plan.mode === 'week_by_week' && i.output_mode !== 'plan_only'));
  assert.ok(R.every(i => i.plan.mode !== 'year' || !(i.sport && i.sport.competitive === 'competitive')));
  assert.ok(R.some(i => i.age >= 60 && i.prefs.older_athletic_opt_in) && R.some(i => i.age >= 60 && !i.prefs.older_athletic_opt_in));
});

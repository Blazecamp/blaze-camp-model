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
import { generate, generateWith, realModulesStatus } from '../../engine/generate.mjs';
import { validatePlan, CHECK_IDS } from '../../engine/validate.mjs';
import { forbiddenKeys, canonicalJSON } from '../../engine/util.mjs';
import { variationValues } from '../../engine/select.mjs';
import { STUB_DEPS } from '../helpers/stub-modules.mjs';
import { loadFixtureModel, loadCompiledModel, allSamples } from '../helpers/models.mjs';
import { randomIntake, sportIntake, activityIntake } from '../helpers/random-intake.mjs';

const REAL = realModulesStatus().ready;
const LABEL = REAL ? 'real modules' : 'stub modules';
const gen = (intake, model) => (REAL ? generate(intake, model) : generateWith(STUB_DEPS, intake, model));
const N_RANDOM = 300;

// v1.2 review round (samples/REVIEW_LOG.md, 'deferred'); counts re-measured for engine 0.4.0 (stage B1). The stricter checks
// pass on the 8 samples but still find these engine limits in the random corpus. Each runs as `todo` until fixed:
const KNOWN_RANDOM = {};
// v0.4 stage B2: V27 (wall-ball / sit-up throws over a small throw target, 3 of 378) is fixed - the station trim reads each
// station's own minimum dose (athletic.perSetBounds) and the reactive / ballistic jumps share one budget; V27 now also checks
// the athletic stairway (under the goal, drops inside a block, stage and jump exercises held for the exercise block, stage-3
// single-response drills, sport-only COD drills) and passes on the whole corpus.
// v0.4 (stage B1): H10 / V15 (a 2 x 30 min plan adding a bonus slot at an exercise-block boundary) and H21 (flat muscles at a
// per-session cap) pass on the corpus - the time check sizes every trained group's climb (R3-SES-02) and the independent H10
// property allows the one whole set a week the validator allows (12 v1.2 §3.7.4).
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
// v0.4 B4 (E-64): the class model's kept work lift (rules.session.time_fit.keep_work_lift) of a group listed 'class_lift'
const classLift = (p, m, it) => { const K = m.rules.session.time_fit && m.rules.session.time_fit.keep_work_lift; return !!(K && K.families.includes(p.meta.family) && K.roles.includes(it.role) && !['bonus', 'focus_added'].includes(it.origin)); };

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
        // a rep-max test's top set (role 'test') is the same lift's work-up, not a second counted lift (R2-PER-07)
      for (const r of rows(p).filter(x => x.w === w && x.it.role !== 'test')) { const x = ex(m, r.it.exercise_id); if (x && x.axial) c[x.axial_pattern].push(r.d.weekday); }
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
    // one whole set may always be added in a week (12 v1.2 §3.7.4: a 10-set week could otherwise never climb)
    for (let i = 1; i < p.weeks.length; i++) {
      const a = p.weeks[i - 1], b = p.weeks[i];
      if (a.block_type === 'stairway' && b.block_type === 'stairway' && a.training_block === b.training_block && b.total_resistance_sets > a.total_resistance_sets + 1 + 1e-9 && !(b.total_resistance_sets < (1 + L.total_weekly_ceiling) * a.total_resistance_sets - 1e-9)) out.push(`w${b.n} total ${a.total_resistance_sets} -> ${b.total_resistance_sets}`);
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
  // v0.4 (R2-VOL-06 + R3-VOL-01 / R3-SES-01 / R3-SES-02): the floor is on the FOCUS groups (hips = glutes + hamstrings, shoulders =
  // front + side + rear delts + traps), counted on main days with group credit (a set counts at most 1.0 to a group); a group the
  // time check leaves to compound credit is listed in plan.time_check and has no direct exercise; no warning exempts a trained group
  H17(p, m) {
    const out = [], R = m.rules, floor = R.volume.floor.value, t = p.meta.targets;
    const members = R.muscles.groups.members, groupOfMuscle = {};
    for (const [g, ms] of Object.entries(members)) if (g !== 'core') for (const mu of ms) groupOfMuscle[mu] = g;
    const tc = p.time_check || {};
    const blockTc = (n) => (tc.by_block || []).find(b => b.training_block === n) || tc;
    const lineOf = {};
    for (const [l, d] of Object.entries((R.muscles.lines && R.muscles.lines.defs) || {})) for (const mu of d.members) lineOf[mu] = l;
    const linesOfGroup = (g) => (t.lines || []).filter(l => members[g].some(mu => lineOf[mu] === l));
    const maxIso = R.placement.max_sets_isolation, climbC = R.stairway.min_climb.calves, perLeg = R.volume.calves.per_leg_day.L1;
    for (const w of p.weeks.filter(x => x.block_type === 'stairway')) {
      const b = blockTc(w.training_block);
      const listed = new Set((b.not_trained_directly || []).map(x => x.group));
      const kept = new Set((b.not_trained_directly || []).filter(x => x.reason === 'class_lift').map(x => x.group));
      const below = new Set((b.trained_below_floor || []).filter(x => x.reason === 'work_lift_time' || x.reason === 'circuit_time').map(x => x.group));
      const sets = {}, direct = {};
      let legDays = 0;
      for (const d of w.days.filter(x => x.kind === 'main')) {
        const rs = dayRows(w, d);
        if (rs.some(r => isRes(m, r.it) && ex(m, r.it.exercise_id) && ex(m, r.it.exercise_id).credit_class === 'ISO_CALF')) legDays++;
        for (const r of rs) {
          const gc = {};
          for (const [mu, v] of Object.entries(r.it.credits)) { const g = groupOfMuscle[mu]; if (g) gc[g] = (gc[g] || 0) + v; }
          for (const [g, v] of Object.entries(gc)) sets[g] = (sets[g] || 0) + (r.it.sets || 0) * Math.min(1, v);
          // trained directly: the group is the exercise's main mover (a full set of group credit)
          // (fix round 2 / F1, E-145: a pattern station of a group not trained directly is not direct training)
          if (isRes(m, r.it) && r.it.group && r.it.origin !== 'pattern_kept' && (gc[r.it.group] || 0) >= 1 - 1e-9 && !(kept.has(r.it.group) && classLift(p, m, r.it))) direct[r.it.group] = (direct[r.it.group] || 0) + 1;
        }
      }
      for (const g of listed) if (direct[g]) out.push(`w${w.n} ${g} listed as not trained directly but has ${direct[g]} exercises`);
      if (w.circuit) continue;
      // v0.4 fix round 2 / F1 (E-139, BRAIN V5b): below rules.volume.calves.optional_slot_below_leg_days main leg days the optional day's
      // Calves slot counts toward the calves' floor
      const OSB = R.volume.calves.optional_slot_below_leg_days;
      if (typeof OSB === 'number' && legDays < OSB) for (const d of w.days.filter(x => x.kind !== 'main')) for (const r of dayRows(w, d)) {
        const e = ex(m, r.it.exercise_id);
        if (isRes(m, r.it) && e && e.credit_class === 'ISO_CALF' && r.it.origin !== 'pattern_kept') sets.calves = (sets.calves || 0) + (r.it.sets || 0) * Math.min(1, r.it.credits.calves || 0);
      }
      for (const g of t.floor_groups || []) {
        const ls = linesOfGroup(g);
        if (!ls.length || listed.has(g) || below.has(g) || ls.some(l => t.pain_muscles.includes(l)) || ls.every(l => t.credit_only.includes(l))) continue;
        const need = g === 'calves' ? Math.max(perLeg * legDays, Math.min(R.volume.calves.weekly_floor, maxIso * legDays - climbC)) : floor;
        if ((sets[g] || 0) < need - 1e-6) out.push(`w${w.n} ${g} ${Math.round((sets[g] || 0) * 100) / 100} < ${need}`);
      }
    }
    return out;
  },
  H18(p, m) {
    const G = m.rules.session.exercises_per_group, out = [];
    if (G.exempt_families.includes(p.meta.family)) return out;
    for (const w of p.weeks) for (const d of w.days) {
      if (d.kind !== 'main') continue;
      // (fix round 2 / F1, E-150: a circuit day trains a group with 0 or 2+ stations; no maximum for a whole-body round)
      const circuitDay = d.format === 'circuit';
      const n = {}, lone = {};
      for (const r of dayRows(w, d)) if (isRes(m, r.it)) { const g = r.it.group; if (g) { n[g] = (n[g] || 0) + 1; lone[g] = r.it; } }
      // v0.4 B4 (E-64): a class model's day work lift may stand alone for its group (the day's named class lift)
      for (const [g, c] of Object.entries(n)) if (!G.exempt_groups.includes(g) && !(c === 1 && (classLift(p, m, lone[g]) || lone[g].origin === 'pattern_kept')) && (c < 2 || (!circuitDay && d.full_body && c > 4))) out.push(`w${w.n} ${d.weekday} ${g}: ${c}`);
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
  // v0.4 (R3-SES-02 'never flat', R3-VOL-04): every trained group climbs by the minimum climb over the block (group credit, all
  // days, recomputed from the items) and never drops a set week over week; each line's planned target never drops; the last
  // week is the hardest; stair level rises; planned RIR never rises
  H21(p, m) {
    const out = [], R = m.rules, t = p.meta.targets, MC = R.stairway.min_climb;
    const members = R.muscles.groups.members, groupOfMuscle = {};
    for (const [g, ms] of Object.entries(members)) if (g !== 'core') for (const mu of ms) groupOfMuscle[mu] = g;
    const lineOf = {};
    for (const [l, d] of Object.entries((R.muscles.lines && R.muscles.lines.defs) || {})) for (const mu of d.members) lineOf[mu] = l;
    const tc = p.time_check || {};
    const circuit = p.weeks.some(w => w.circuit);
    const fixed = R.session.exercises_per_group.exempt_families.includes(p.meta.family);
    const groupSets = (w) => {
      const s = {};
      for (const r of rows(p).filter(x => x.w === w)) {
        const gc = {};
        for (const [mu, v] of Object.entries(r.it.credits)) { const g = groupOfMuscle[mu]; if (g) gc[g] = (gc[g] || 0) + v; }
        for (const [g, v] of Object.entries(gc)) s[g] = (s[g] || 0) + (r.it.sets || 0) * Math.min(1, v);
      }
      return s;
    };
    for (const tb of p.shape.training_blocks.filter(x => x.type === 'stairway')) {
      const ws = p.weeks.filter(w => w.training_block === tb.n);
      if (ws.length < 2) continue;
      const b = (tc.by_block || []).find(x => x.training_block === tb.n) || tc;
      const listed = new Set((b.not_trained_directly || []).map(x => x.group));
      const target = (t.lines || []).filter(l => t.fill[l] === 'target');
      for (let i = 1; i < ws.length; i++) {
        for (const l of target) if ((ws[i].target_by_muscle[l] || 0) < (ws[i - 1].target_by_muscle[l] || 0) - 1e-9) out.push(`w${ws[i].n} ${l} target drops`);
        if (!(ws[i].stair_level > ws[i - 1].stair_level)) out.push(`w${ws[i].n} stair level ${ws[i].stair_level}`);
        if (ws[i].planned_rir.min > ws[i - 1].planned_rir.min || ws[i].planned_rir.max > ws[i - 1].planned_rir.max) out.push(`w${ws[i].n} planned RIR rises`);
      }
      if (!circuit && !fixed) {
        const gs = ws.map(groupSets);
        ws.forEach((w, i) => { for (const g of Object.keys(w.weekly_sets_by_group)) if (Math.abs((gs[i][g] || 0) - w.weekly_sets_by_group[g]) > 0.006) out.push(`w${w.n} ${g} items ${gs[i][g] || 0} vs claimed ${w.weekly_sets_by_group[g]}`); });
        for (const g of t.floor_groups || []) {
          const ls = target.filter(l => members[g].some(mu => lineOf[mu] === l));
          if (!ls.length || listed.has(g) || ls.some(l => t.pain_muscles.includes(l))) continue;
          // v0.4 fix round 1 (E-81): a big mover kept below its floor climbs at least one set
          const belowG = new Set((b.trained_below_floor || []).map(x => x.group));
          const v = gs.map(x => x[g] || 0), need = g === 'calves' || belowG.has(g) ? MC.calves : (MC.short_block && ws.length <= MC.short_block.max_N ? MC.short_block.group : MC.group);
          // a year plan's flat-sets quarter holds its starts (COACH-R2 R2-PER-01 'sets stay at the starting level')
          if (!(tb.factor && tb.factor.flat_sets) && v[v.length - 1] - v[0] < need - 0.5 - 1e-9) out.push(`block ${tb.n}: ${g} flat ${v[0]} -> ${v[v.length - 1]}`);
          for (let i = 1; i < v.length; i++) if (v[i] < v[i - 1] - 0.5 - 1e-9) out.push(`w${ws[i].n} ${g} drops ${v[i - 1]} -> ${v[i]}`);
        }
      }
      const tot = ws.map(w => w.total_resistance_sets);
      if (Math.max(...tot) > tot[tot.length - 1]) out.push(`block ${tb.n}: last week ${tot[tot.length - 1]} < max ${Math.max(...tot)}`);
      if (ws.length === 12 && Math.min(...tot.slice(8)) < Math.max(...tot.slice(0, 8))) out.push(`block ${tb.n}: last 4 weeks are not the 4 hardest`);
    }
    return out;
  },
  H22(p) {
    const c = p.validation.checks.find(x => x.id === 'H22');
    // v0.4 (R3-VOL-02 / R3-VOL-04): no check-ins, nothing adapts; the only offers are the time check's, made up front at build time
    // (R3-SES-02: one more day / longer sessions / keep the time)
    // (fix round 2 / F1, E-143: offer.block_on - a block the time check switched off can be switched back on)
    const TIME = ['offer.more_days', 'offer.more_days_min', 'offer.longer_sessions', 'offer.keep_time', 'offer.keep_time_lower_peak', 'offer.block_on', 'offer.optional_day', 'offer.longer_sessions_some', 'offer.longer_sessions_peak', 'offer.block_off'];
    return [...(c.pass ? [] : c.violations.map(v => JSON.stringify(v.args))), ...p.offers.filter(o => !TIME.includes(o.key)).map(o => 'offer ' + o.key)];
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
    test('no day lists the identical exercise twice (same exercise and same detail) while a variation is left (D-48; B3 concrete values)', () => {
      // a kit with a single option for a group (e.g. field kit without a pull-up bar: table rows only) may repeat an exercise
      // once all its concrete variations are used that day; the plan then carries the V7 buy list. A rep-max test item and the
      // lift's planned sets are the same lift on purpose (R2-PER-07), never a 'variation' of it (B3, RECHECK 01 / 02 / 07)
      const bad = okPlans(C.runs).flatMap(r => r.plan.weeks.flatMap(w => w.days.flatMap(d => {
        const seen = new Map(), out = [];
        const kit = r.plan.meta.kit.tokens, pain = (r.plan.meta.derived.pain || []).map(p => p.area);
        for (const b of d.blocks) for (const it of b.items) {
          if (!it.exercise_id || b.kind === 'warmup' || it.role === 'test') continue;
          const vals = seen.get(it.exercise_id) || new Set();
          const k = it.detail ? (it.detail.value || it.detail.axis) : '';
          const left = variationValues(r.model, r.model.ex(it.exercise_id), kit, pain).filter(v => !vals.has(v.value));
          if (vals.has(k) && left.length) out.push(`${r.name}: w${w.n} ${d.weekday} ${it.exercise_id}|${k}`);
          if (it.detail) assert.ok(!/^detail\.(grip|stance|range|implement|hand|box)$/.test(it.detail.key), `${r.name} placeholder detail ${it.detail.key}`);
          vals.add(k);
          seen.set(it.exercise_id, vals);
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

test(`check-ins are retired: a check-in output mode plans the same weeks as plan-only for every sample (R3-VOL-02, H22) (${LABEL})`, () => {
  for (const { name, intake } of allSamples()) {
    const p = gen(intake, fixture);
    const q = gen({ ...structuredClone(intake), output_mode: 'checkin' }, fixture);
    assert.equal(JSON.stringify(q.weeks), JSON.stringify(p.weeks), name);
    assert.ok(!q.offers.some(o => o.key === 'block.cannot_finish'), name);
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

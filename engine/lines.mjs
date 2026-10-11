// engine/lines.mjs - lines and groups (COACH-R3 R3-VOL-01, R3-SES-01). Shared by volume.mjs (targets, allocation), edit.mjs and
// validate.mjs. (engine 0.5.0: split out of the retired timefit.mjs; the time ESTIMATE lives in estimate.mjs.)
// Pure: no I/O, no clock, no randomness. Every number comes from model.rules.
//
// Lines: the stairway runs on lines (quads, hamstrings, glutes, chest, back, shoulders, biceps, triceps, calves). Side, rear and
// front delts are one shoulders line (R3-VOL-01 "I wouldn't categorize the rear delt as an individual muscle").
// Groups: the weekly stairway, the floor of 10 and the 2-4-exercises rule read the coach's FOCUS groups (hips = glutes + hamstrings,
// shoulders = front + side + rear delts; R3-SES-01). A set counts at most 1.0 to a line or a group (group credit, 12 v1.2 §3.3,
// PROPOSED): credit = min(1, sum of the member muscles' credits).
import { EPS } from './util.mjs';

const CACHE = new WeakMap();

/**
 * Lines and groups of a model (cached per model object).
 * @param {object} model
 * @returns {{order:string[], defs:Object<string,object>, lineOf:Object<string,string>, groupOfLine:Object<string,string>,
 *            groups:string[], groupMembers:Object<string,string[]>, groupOfMuscle:Object<string,string>, linesOfGroup:Object<string,string[]>}}
 */
export function linesOf(model) {
  if (CACHE.has(model)) return CACHE.get(model);
  const R = model.rules;
  const LX = R.muscles.lines;
  let order, defs;
  if (LX && Array.isArray(LX.order)) { order = LX.order.slice(); defs = LX.defs; }
  else { // pre-v1.3 models: every target muscle is its own line
    order = R.muscles.order.filter(m => R.muscles.defs[m].target);
    defs = Object.fromEntries(order.map(m => [m, { members: [m], class: R.muscles.defs[m].class, region: R.muscles.defs[m].region, group: R.muscles.defs[m].group, per_leg_day: !!R.muscles.defs[m].per_leg_day }]));
  }
  const lineOf = {};
  for (const l of order) for (const m of defs[l].members) lineOf[m] = l;
  const groupOfLine = Object.fromEntries(order.map(l => [l, defs[l].group]));
  const groups = R.muscles.groups.order.filter(g => g !== 'core');
  const groupMembers = R.muscles.groups.members;
  const groupOfMuscle = {};
  for (const g of R.muscles.groups.order) for (const m of groupMembers[g] || []) groupOfMuscle[m] = g;
  const linesOfGroup = {};
  for (const l of order) (linesOfGroup[groupOfLine[l]] = linesOfGroup[groupOfLine[l]] || []).push(l);
  const out = Object.freeze({ order, defs, lineOf, groupOfLine, groups, groupMembers, groupOfMuscle, linesOfGroup });
  CACHE.set(model, out);
  return out;
}

/** per-set line credits of a muscle-credit map: min(1, sum of member credits) @returns {Object<string,number>} */
export function lineCredits(model, cr) {
  const X = linesOf(model);
  const out = {};
  if (!cr) return out;
  for (const [m, v] of Object.entries(cr)) { const l = X.lineOf[m]; if (l) out[l] = (out[l] || 0) + v; }
  for (const l of Object.keys(out)) out[l] = Math.min(1, out[l]);
  return out;
}

/** per-set group credits of a muscle-credit map: min(1, sum of member credits) (core excluded) @returns {Object<string,number>} */
export function groupCredits(model, cr) {
  const X = linesOf(model);
  const out = {};
  if (!cr) return out;
  for (const [m, v] of Object.entries(cr)) { const g = X.groupOfMuscle[m]; if (g && g !== 'core') out[g] = (out[g] || 0) + v; }
  for (const g of Object.keys(out)) out[g] = Math.min(1, out[g]);
  return out;
}

/**
 * Lines an exercise drives as a main mover (a member credit of 1.0; dips drive triceps, LIB-16).
 * @param {object} model @param {object|null} ex catalog record @param {Object<string,number>|null} cr its credits in the slot
 * @returns {string[]}
 */
export function primeLines(model, ex, cr) {
  if (!cr) return [];
  const X = linesOf(model);
  const out = [];
  for (const [m, v] of Object.entries(cr)) { const l = X.lineOf[m]; if (l && v >= 1 - EPS && !out.includes(l)) out.push(l); }
  if (ex && ex.credit_class === 'DIPS' && cr.triceps && !out.includes('triceps')) out.push('triceps');
  return X.order.filter(l => out.includes(l));
}

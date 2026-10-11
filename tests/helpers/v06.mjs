// tests/helpers/v06.mjs - engine 0.6 selection package (DECISIONS G-135): the compiled model with the bootcamp's cardio-first rule
// (rules.selection.s6.circuit_cardio_first) switched off. The B2 ballistic circuit station (rules.athletic.circuit_ballistic) is
// reachable only there, so the older tests of that machinery read this model (converted, one line each in DECISIONS G).
import { loadModel } from '../../engine/model.mjs';
import { readModelDir, readFixtureRaw } from './models.mjs';

const cached = {};
/** @param {'model'|'fixture'} [which] @returns {object} Model (compiled when present, else the fixture) without
 *  rules.selection.s6.circuit_cardio_first */
export function ballisticCircuitModel(which = 'model') {
  if (cached[which]) return cached[which];
  const raw = JSON.parse(JSON.stringify(which === 'fixture' ? readFixtureRaw() : (readModelDir() || readFixtureRaw())));
  if (raw.rules.selection && raw.rules.selection.s6) delete raw.rules.selection.s6.circuit_cardio_first;
  cached[which] = loadModel(raw);
  return cached[which];
}

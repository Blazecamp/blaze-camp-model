// tools/brand-legal.mjs - the legal party wording of a brand, applied by tools/build-site.mjs to the built site's copy of the
// model's words (site/model/i18n/*.json) and to the brand's disclaimer pages (site/disclaimer.html, site/disclaimer.es.html).
// The repository's model/ files and DISCLAIMER*.md are never changed. It runs at build time, so the brand's site carries no
// trace of the other brand's name in its code. Tested by tests/app-brand.test.mjs.
//
// Coach's decision (2026-10-13): the corporation is always BFit Studios Corp., "doing business as" the brand; Lalo Vera stays in
// the released parties (the owner's legal information). A brand's `legal` block (app/brands/<id>.js) gives:
//   business  {en, es}  the business name ("Son Hábitos")
//   parties   {en, es}  the released parties ("Lalo Vera and BFit Studios Corp., doing business as Son Hábitos")
//   gym       (white-label brands only, CH7-11) the gym that offers the tool under license:
//             {brand, legal_name, state, legal_name_confirmed, legal_name_source}. With it, the parties name the gym's company too
//             (whiteLabelParties), the disclaimer pages get a section "How this tool is provided" (addendumMd), and the release text
//             and the short release line get one sentence on the gym's own waiver (brandModelRaw). PROPOSED until the attorney decides.
// A brand with `legal: null` (Blaze Camp) keeps the model's words exactly; a brand without `gym` (Son Hábitos) is unchanged.

const FROM = 'Blaze Camp';

/** the exact phrases replaced, in this order, then the three-party list, then any other "Blaze Camp" (the business name) */
export function legalRules(legal, lang) {
  const biz = legal.business[lang], parties = legal.parties[lang];
  if (lang === 'es') {
    return [
      [`Lalo Vera, que opera comercialmente como ${FROM}, y BFit Studios Corp., una corporación de Florida (en conjunto, "${FROM}")`,
        legal.gym ? `Lalo Vera y BFit Studios Corp., una corporación de Florida, y ${gymParty(legal.gym, 'es', true)} (en conjunto, "${biz}")`
          : `Lalo Vera y BFit Studios Corp., una corporación de Florida, que opera como ${biz} (en conjunto, "${biz}")`],
      [`Lalo Vera, ${FROM}, BFit Studios Corp. y a sus`, `${parties}, y a sus`]
    ];
  }
  return [
    [`Lalo Vera, doing business as ${FROM}, and BFit Studios Corp., a Florida corporation (together, "${FROM}")`,
      legal.gym ? `Lalo Vera and BFit Studios Corp., a Florida corporation, and ${gymParty(legal.gym, 'en', true)} (together, "${biz}")`
        : `Lalo Vera and BFit Studios Corp., a Florida corporation, doing business as ${biz} (together, "${biz}")`],
    [`Lalo Vera, ${FROM}, BFit Studios Corp., and their`, `${parties}, and their`],
    [`${FROM}'s release`, `The ${biz} release`],
    [`${FROM}'s total liability`, `the total liability of ${biz}`]
  ];
}
const PARTIES = { en: /Lalo Vera, Blaze Camp and BFit Studios Corp\.(\s*)(\S?)/g, es: /Lalo Vera, Blaze Camp y BFit Studios Corp\.(\s*)(\S?)/g };

/**
 * The brand's legal wording over a text in `lang` (unchanged without a legal block):
 *   1. legalRules(): exact phrases (the disclaimer's owner line and its other forms; "Blaze Camp's release" ...);
 *   2. "Lalo Vera, Blaze Camp and BFit Studios Corp." (ES "... y ...") -> parties, then "," when the sentence goes on (a lower-case
 *      word follows) or "." when it ends;
 *   3. any other "Blaze Camp" -> business.
 */
export function legalSub(s, lang, legal) {
  if (!legal || typeof s !== 'string') return s;
  const L = lang === 'es' ? 'es' : 'en';
  let out = s;
  for (const [a, b] of legalRules(legal, L)) out = out.split(a).join(b);
  // "..., doing business as X, from all liability": the comma closes the "doing business as" phrase; a gym's parties end in its
  // name or a closing bracket, so the sentence goes on without one
  out = out.replace(PARTIES[L], (m, ws, next) => legal.parties[L] + (next && /\p{Ll}/u.test(next) ? (legal.gym ? '' : ',') : (legal.gym && /\.$/.test(legal.parties[L]) ? '' : '.')) + ws + next);
  return out.split(FROM).join(legal.business[L]);
}

/** a model i18n table (en.json / es.json) with the brand's legal wording on every string; the keys it changed */
export function brandI18n(table, lang, legal) {
  const out = {}, changed = [];
  for (const [k, v] of Object.entries(table)) {
    const n = typeof v === 'string' ? legalSub(v, lang, legal) : v;
    if (n !== v) changed.push(k);
    out[k] = n;
  }
  return { table: out, changed };
}

/** every legal text that names the owner after the substitution (the parties and the disclaimer's owner line): the only places the
 *  owner's name may appear on the brand's site */
export function legalPartyTexts(legal) {
  const out = [];
  for (const lang of ['en', 'es']) {
    out.push(legalRules(legal, lang)[0][1].split(' (')[0], legal.parties[lang]);   // the owner line without its quoted part (HTML escapes it)
    if (legal.gym) out.push(ADDENDUM_OWNER[lang]);
  }
  return out;
}

// ------------------------------------------------------------------------------------------------- white-label gyms (CH7-11)

/** the one phrase of the addendum that names the owner (allowed by the leak check, like the parties) */
export const ADDENDUM_OWNER = { en: 'Lalo Vera or BFit Studios Corp.', es: 'a Lalo Vera ni a BFit Studios Corp.' };

/** the gym as a party: "Iron Temple LLC (doing business as Iron Temple Gym)", or just its name when its legal name is the same;
 *  withState adds the state it is registered in ("Iron Temple LLC, registered in FL, doing business as ...") */
export function gymParty(gym, lang, withState = false) {
  const brand = String(gym.brand).trim(), legalName = String(gym.legal_name || '').trim() || brand;
  const same = legalName.toLowerCase() === brand.toLowerCase();
  const st = withState && gym.state ? (lang === 'es' ? `, registrada en ${gym.state}` : `, registered in ${gym.state}`) : '';
  if (same) return legalName + st;
  return lang === 'es' ? `${legalName}${st} (que opera como ${brand})` : `${legalName}${st} (doing business as ${brand})`;
}

/** the released parties of a white-label brand: "Lalo Vera, BFit Studios Corp. and <legal name> (doing business as <brand>)" */
export function whiteLabelParties(gym) {
  return { en: `Lalo Vera, BFit Studios Corp. and ${gymParty(gym, 'en')}`, es: `Lalo Vera, BFit Studios Corp. y ${gymParty(gym, 'es')}` };
}

/** "Iron Temple Gym (Iron Temple LLC)", or the name alone when the legal name is the same */
function gymWithLegal(gym) {
  const brand = String(gym.brand).trim(), ln = String(gym.legal_name || '').trim();
  return ln && ln.toLowerCase() !== brand.toLowerCase() ? `${brand} (${ln}${gym.state ? ', ' + gym.state : ''})` : brand + (gym.state ? ` (${gym.state})` : '');
}

/** the disclaimer section "How this tool is provided" (Markdown), plain words; PROPOSED, [LEGAL REVIEW] */
export function addendumMd(legal, lang) {
  const g = legal.gym, b = String(g.brand).trim(), who = gymWithLegal(g);
  if (lang === 'es') return `## Cómo se ofrece esta herramienta
${who} ofrece este creador de planes a sus miembros y clientes con una licencia de BFit Studios Corp. [REVISIÓN LEGAL]
- El creador de planes es un programa de computadora. Da información general de acondicionamiento físico.
- ${b} es responsable de su propia evaluación de salud. También es responsable de que cada miembro o cliente firme la exención de responsabilidad de ${b} antes de entrenar. Esto aplica si la persona crea su propio plan o si un entrenador de ${b} lo crea para ella.
- Los términos de este sitio web no reemplazan la exención de responsabilidad de ${b}. Tampoco pasan ninguna responsabilidad de ${b} ${ADDENDUM_OWNER.es}
`;
  return `## How this tool is provided
${who} provides this plan builder to its members and clients under license from BFit Studios Corp. [LEGAL REVIEW]
- The plan builder is software. It gives general fitness information.
- ${b} is responsible for its own health screening. It is also responsible for having every member or client sign the ${b} liability waiver before training. This is true whether the person builds the plan themselves or a coach at ${b} builds it for them.
- The terms of this website do not replace the ${b} liability waiver. They also do not move any responsibility of ${b} to ${ADDENDUM_OWNER.en}
`;
}

/** a disclaimer (Markdown, already in the brand's party wording) with the gym's section before section 1; unchanged without a gym */
export function withAddendum(md, lang, legal) {
  if (!legal || !legal.gym) return md;
  const at = md.search(/^## 1\./m);
  const add = addendumMd(legal, lang === 'es' ? 'es' : 'en') + '\n';
  return at < 0 ? md.replace(/\n*$/, '\n\n') + add : md.slice(0, at) + add + md.slice(at);
}

/** the one sentence added to the release text (before its link) and the short release line of a white-label brand */
export function releaseAddendum(legal, lang) {
  const g = legal.gym, b = String(g.brand).trim();
  return lang === 'es'
    ? { release: `${b} ofrece esta herramienta con una licencia de BFit Studios Corp. ${b} es responsable de su propia evaluación de salud y de su exención de responsabilidad, y estos términos no la reemplazan.`,
        line: `También aplica la exención de responsabilidad de ${b}.` }
    : { release: `${b} provides this tool under license from BFit Studios Corp. ${b} is responsible for its own health screening and liability waiver, and these terms do not replace it.`,
        line: `The ${b} liability waiver also applies.` };
}
const RELEASE_KEYS = ['release.client', 'release.coach'];
const LINE_KEYS = ['ui.plan.release_line', 'ui.plan.release_line_coach', 'ui.plan.release_line_minor'];
/** a model i18n table with the gym's sentence in the release texts (before "[Read the full ...]") and on the release lines */
function gymI18n(table, lang, legal) {
  const out = { ...table }, add = releaseAddendum(legal, lang);
  const link = typeof table['release.full_text_link'] === 'string' ? ` [${table['release.full_text_link']}]` : null;
  for (const k of RELEASE_KEYS) {
    if (typeof out[k] !== 'string') continue;
    const at = link ? out[k].indexOf(link) : -1;
    out[k] = at >= 0 ? out[k].slice(0, at) + ' ' + add.release + out[k].slice(at) : out[k] + ' ' + add.release;
  }
  for (const k of LINE_KEYS) if (typeof out[k] === 'string') out[k] = out[k] + ' ' + add.line;
  return out;
}

/** a JSON value with the brand's legal wording on every string (es_review.json and the like) */
export function deepLegalSub(v, lang, legal) {
  if (typeof v === 'string') return legalSub(v, lang, legal);
  if (Array.isArray(v)) return v.map(x => deepLegalSub(x, lang, legal));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deepLegalSub(x, lang, legal)]));
  return v;
}

/**
 * The raw model (before loadModel) as a brand's site serves it: the one place that says what a brand changes in the model's
 * words. Used by tools/build-site.mjs (the site's copy of model/) and by the agent tools (agent/core.mjs: CLI, MCP server, API),
 * so a plan built by an agent carries exactly the words of that brand's web tool. The input is never changed.
 *   * a brand with a `legal` block: the legal party wording on the i18n tables and es_review, rules.legal.owner, and
 *     rules.legal.disclaimer_url pointing at the brand's own disclaimer pages under `siteUrl`;
 *   * every brand: its display words (brand.model_words) over the i18n tables.
 * @param {object} raw {manifest, catalog, rules, templates, profiles, i18n: {en, es, es_review}}
 * @param {object} brand app/brands/<id>.js > BRAND
 * @param {{siteUrl?: string}} [opts] the brand's site (absolute); required for a brand with its own disclaimer pages
 */
export function brandModelRaw(raw, brand, opts = {}) {
  const LEGAL = (brand && brand.legal) || null;
  const mw = (brand && brand.model_words) || {};
  const i18n = { ...raw.i18n };
  for (const lang of ['en', 'es']) {
    if (!raw.i18n || !raw.i18n[lang]) continue;
    let out = LEGAL ? brandI18n(raw.i18n[lang], lang, LEGAL).table : { ...raw.i18n[lang] };
    if (LEGAL && LEGAL.gym) out = gymI18n(out, lang, LEGAL);
    for (const [k, v] of Object.entries(mw[lang] || {})) if (k in out) out[k] = v;
    i18n[lang] = out;
  }
  if (LEGAL && raw.i18n && raw.i18n.es_review) i18n.es_review = deepLegalSub(raw.i18n.es_review, 'es', LEGAL);
  let rules = raw.rules;
  if (LEGAL && rules && rules.legal) {
    if (!opts.siteUrl) throw new Error(`brand ${brand.id}: its release links its own disclaimer pages, so its site address is needed (siteUrl)`);
    const host = String(opts.siteUrl).replace(/\/?$/, '/');
    const legal = { ...rules.legal };
    legal.owner = legalSub(String(legal.owner || '').replace(/^Lalo Vera \/ Blaze Camp \/ BFit Studios Corp\.$/, 'Lalo Vera, Blaze Camp and BFit Studios Corp.'), 'en', LEGAL).replace(/\.$/, '');
    legal.disclaimer_url = { ...legal.disclaimer_url, en: new URL(LEGAL.disclaimer.en, host).href, es: new URL(LEGAL.disclaimer.es, host).href };
    rules = { ...rules, legal };
  }
  return { ...raw, i18n, rules };
}

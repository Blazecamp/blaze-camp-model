// tools/brand-legal.mjs - the legal party wording of a brand, applied by tools/build-site.mjs to the built site's copy of the
// model's words (site/model/i18n/*.json) and to the brand's disclaimer pages (site/disclaimer.html, site/disclaimer.es.html).
// The repository's model/ files and DISCLAIMER*.md are never changed. It runs at build time, so the brand's site carries no
// trace of the other brand's name in its code. Tested by tests/app-brand.test.mjs.
//
// Coach's decision (2026-10-13): the corporation is always BFit Studios Corp., "doing business as" the brand; Lalo Vera stays in
// the released parties (the owner's legal information). A brand's `legal` block (app/brands/<id>.js) gives:
//   business  {en, es}  the business name ("Son Hábitos")
//   parties   {en, es}  the released parties ("Lalo Vera and BFit Studios Corp., doing business as Son Hábitos")
// A brand with `legal: null` (Blaze Camp) keeps the model's words exactly.

const FROM = 'Blaze Camp';

/** the exact phrases replaced, in this order, then the three-party list, then any other "Blaze Camp" (the business name) */
export function legalRules(legal, lang) {
  const biz = legal.business[lang], parties = legal.parties[lang];
  if (lang === 'es') {
    return [
      [`Lalo Vera, que opera comercialmente como ${FROM}, y BFit Studios Corp., una corporación de Florida (en conjunto, "${FROM}")`,
        `Lalo Vera y BFit Studios Corp., una corporación de Florida, que opera como ${biz} (en conjunto, "${biz}")`],
      [`Lalo Vera, ${FROM}, BFit Studios Corp. y a sus`, `${parties}, y a sus`]
    ];
  }
  return [
    [`Lalo Vera, doing business as ${FROM}, and BFit Studios Corp., a Florida corporation (together, "${FROM}")`,
      `Lalo Vera and BFit Studios Corp., a Florida corporation, doing business as ${biz} (together, "${biz}")`],
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
  out = out.replace(PARTIES[L], (m, ws, next) => legal.parties[L] + (next && /\p{Ll}/u.test(next) ? ',' : '.') + ws + next);
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
  }
  return out;
}

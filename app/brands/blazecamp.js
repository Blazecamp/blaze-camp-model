// app/brands/blazecamp.js - the Blaze Camp brand (the default build). One codebase, two brands: every brand file has the same
// shape (tests/app-brand.test.mjs checks it). tools/build-site.mjs picks one brand (--brand <id> or env BRAND), writes
// site/brand.js to re-export it, fills index.html's <head> and logo from it and copies only that brand's assets.
// Blaze Camp keeps the model's words exactly (model_words empty, legal null).

export const BRAND = {
  id: 'blazecamp',
  name: 'Blaze Camp',
  short: 'BLAZE CAMP',
  site_url: 'https://blaze-camp-model.vercel.app',                    // the brand's public site (https://...), for agents' prefilled links and the release link;
                                       // null = unknown: pass --site / env SITE_URL (agent/README.md). The web page never reads it.
  lang_default: 'en',
  // agent/packs.mjs: the agent pack's words for this brand (agent/packs/<id>/); credit as the coach gave it (R5-PUB-02)
  agent: { credit: { en: 'Model by Coach Lalo (Gerardo Vera), Master NASM coach. Blaze Camp · BFit Studios Corp.', es: 'Modelo del Coach Lalo (Gerardo Vera), Master NASM coach. Blaze Camp · BFit Studios Corp.' },
    client: { en: 'the client', es: 'el cliente' }, coach: { en: 'the coach', es: 'el coach' } },
  follow_browser_lang: true,           // no saved choice: Spanish when the browser is Spanish, else English
  storage_key: 'bc.lang',              // the only thing the app keeps (the language choice; R3-GEN-01)
  meta: {
    en: { title: 'Blaze Camp - Plan Builder', description: 'Build a complete training plan from Coach Lalo\'s Blaze Camp model, in English or Spanish. Nothing you enter is saved.' },
    es: { title: 'Blaze Camp - Creador de planes', description: 'Crea un plan de entrenamiento completo con el modelo Blaze Camp del Coach Lalo, en inglés o en español. Nada de lo que escribes se guarda.' }
  },
  html: {
    theme_color: '#0e0e10',
    icons: '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'%3E%3Crect width=\'32\' height=\'32\' rx=\'7\' fill=\'%230e0e10\'/%3E%3Cpath d=\'M17 4c1 5 6 7 6 14a7 7 0 0 1-14 0c0-4 2-6 4-8 0 3 1 4 2 5 1-4 1-7 2-11z\' fill=\'%23ff6a2b\'/%3E%3C/svg%3E">',
    css: null,                         // no extra stylesheet: app/styles.css is the Blaze Camp look
    logo: '\n    <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="#1d1d22"/><path d="M17 4c1 5 6 7 6 14a7 7 0 0 1-14 0c0-4 2-6 4-8 0 3 1 4 2 5 1-4 1-7 2-11z" fill="#ff6a2b"/><path d="M16 15c.6 3 3 4 3 7a3 3 0 0 1-6 0c0-2 1-3 2-4 0 1 .5 1.6 1 2 .3-1.6 0-3.2 0-5z" fill="#ffd2b8"/></svg>\n    <span><span class="brand-word">BLAZE CAMP</span><span class="brand-sub" id="brand-sub">Plan Builder</span></span>\n  '
  },
  assets: [],                          // files under app/brands/<id>/ that the build copies
  pdf: {
    file_prefix: 'Blaze-Camp-plan',    // Blaze-Camp-plan-<goal>-<start date>.pdf
    author: 'Blaze Camp',
    creator: 'Blaze Camp Plan Builder',
    logo: null,                        // a PNG under the site (drawn on the cover), or null for the brand word
    colors: null                       // null = pdf.js's own colours
  },
  image_prefix: 'blaze-camp',          // Save image: blaze-camp-week<n>-<day>.png
  // the brand's own words (over the shared words in app/i18n.js)
  words: {
    en: {
      'app.title': 'Blaze Camp - Plan Builder',
      'app.brand': 'BLAZE CAMP',
      'app.credit': 'Model by Coach Lalo (Gerardo Vera), Master NASM coach',
      'plan.share_title': 'Blaze Camp - {day}',
      'print.generated': 'Built with the Blaze Camp Plan Builder'
    },
    es: {
      'app.title': 'Blaze Camp - Creador de planes',
      'app.brand': 'BLAZE CAMP',
      'app.credit': 'Modelo del Coach Lalo (Gerardo Vera), Master NASM coach',
      'plan.share_title': 'Blaze Camp - {day}',
      'print.generated': 'Creado con el Creador de planes de Blaze Camp'
    }
  },
  model_words: { en: {}, es: {} },     // display overrides of model words (never legal copy)
  legal: null                          // null: the model's legal words and disclaimer link as they are
};
export default BRAND;

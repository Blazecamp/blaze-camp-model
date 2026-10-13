// app/brands/sonhabitos.js - the Son Hábitos brand (Nati Vera): same app, same engine, same model; Spanish first, its own look
// (app/brands/sonhabitos/brand.css), its own logo and words. Built with `node tools/build-site.mjs --brand sonhabitos` (or env
// BRAND=sonhabitos on its Vercel project). Coach's decision: the site shows only Son Hábitos / Nati Vera branding. The only place
// the model's owner is named is the legal party text (`legal.parties`), which the coach approved: the corporation is always
// BFit Studios Corp., "doing business as" the brand.

export const BRAND = {
  id: 'sonhabitos',
  name: 'Son Hábitos',
  short: 'SON HÁBITOS',
  site_url: 'https://son-habitos.vercel.app',                    // its public site (https://...): agent links and its disclaimer pages; null = pass --site / SITE_URL
  lang_default: 'es',
  follow_browser_lang: false,          // no saved choice: always Spanish first (the EN | ES toggle stays)
  storage_key: 'sh.lang',
  meta: {
    en: { title: 'Son Hábitos - Your exercise plan', description: 'Build your complete exercise plan in a few taps, in Spanish or English. Nothing you enter is saved.' },
    es: { title: 'Son Hábitos - Tu plan de ejercicio', description: 'Crea tu plan de ejercicio completo en pocos pasos, en español o en inglés. Nada de lo que escribes se guarda.' }
  },
  html: {
    theme_color: '#ffffff',
    icons: '<link rel="icon" type="image/svg+xml" href="brands/sonhabitos/favicon.svg">\n<link rel="icon" type="image/png" sizes="64x64" href="brands/sonhabitos/favicon-64.png">\n<link rel="apple-touch-icon" href="brands/sonhabitos/icon-180.png">',
    css: 'brands/sonhabitos/brand.css',
    logo: '\n    <img class="brand-logo" src="brands/sonhabitos/logo.png" width="78" height="48" alt="Son Hábitos">\n    <span class="brand-sub" id="brand-sub">Tu plan de ejercicio</span>\n  '
  },
  assets: ['brand.css', 'logo.png', 'logo-flat.png', 'favicon.svg', 'favicon-64.png', 'icon-180.png'],
  pdf: {
    file_prefix: 'Son-Habitos-plan',
    author: 'Son Hábitos',
    creator: 'Son Hábitos',
    logo: { src: 'brands/sonhabitos/logo-flat.png', w: 195, h: 120 },   // PNG pixels (drawn about 39 x 24 mm on the cover)
    colors: { brand: [212, 0, 90], accent: [10, 140, 148], ink: [23, 61, 64] }
  },
  image_prefix: 'son-habitos',
  // the app's own words (app/i18n.js) that change for this brand
  words: {
    en: {
      'app.title': 'Son Hábitos - Your exercise plan',
      'app.brand': 'SON HÁBITOS',
      'app.sub': 'Your exercise plan',
      'app.credit': 'Son Hábitos · Nati Vera',
      'app.eyebrow': 'Son Hábitos · Exercise',
      'app.welcome': 'A few short steps and your complete exercise plan is ready. Let\'s go one step at a time.',
      'app.loading': 'Getting your plan builder ready...',
      'about.intro': 'A few short steps and your complete exercise plan is ready.',
      'build.title_weeks': 'Creating your {n}-week plan…',
      'build.title': 'Creating your plan…',
      'build.calm': 'This can take a few seconds. Everything happens on this device.',
      'build.msg.1': 'Reading the training templates',
      'build.msg.4': 'Checking every rule',
      'build.slow': 'Muscle-building plans take a little longer: every set is placed with care. Almost there.',
      'week.split.default': 'Full-body days',
      'plan.share_title': 'Son Hábitos - {day}',
      'print.generated': 'Made with the Son Hábitos plan builder'
    },
    es: {
      'app.title': 'Son Hábitos - Tu plan de ejercicio',
      'app.brand': 'SON HÁBITOS',
      'app.sub': 'Tu plan de ejercicio',
      'app.credit': 'Son Hábitos · Nati Vera',
      'app.eyebrow': 'Son Hábitos · Ejercicio',
      'app.welcome': 'Unos pocos pasos y tu plan de ejercicio completo está listo. Vamos paso a paso.',
      'app.loading': 'Preparando tu creador de planes...',
      'about.intro': 'Unos pocos pasos y tu plan de ejercicio completo está listo.',
      'build.title_weeks': 'Creando tu plan de {n} semanas…',
      'build.title': 'Creando tu plan…',
      'build.calm': 'Puede tardar unos segundos. Todo ocurre en este dispositivo.',
      'build.msg.1': 'Leyendo las plantillas de entrenamiento',
      'build.msg.4': 'Revisando cada regla',
      'build.slow': 'Los planes para ganar músculo tardan un poco más: cada serie se coloca con cuidado. Ya casi.',
      'week.split.default': 'Días de cuerpo completo',
      'plan.share_title': 'Son Hábitos - {day}',
      'print.generated': 'Creado con el creador de planes de Son Hábitos'
    }
  },
  // display overrides of model words that name the other brand (never legal copy: that goes through `legal`)
  model_words: {
    en: { 'instruction.5': '*****If you have any questions, just ask us.' },
    es: { 'instruction.5': '*****Si tienes alguna pregunta, solo pregúntanos.' }
  },
  // the legal party wording (coach's decision 2026-10-13): BFit Studios Corp., doing business as the brand; the owner stays in
  // the released parties. tools/build-site.mjs applies it (tools/brand-legal.mjs) to the site's copy of the model's words and
  // writes the brand's disclaimer pages from DISCLAIMER.md / DISCLAIMER.es.md; the page links to those pages.
  legal: {
    business: { en: 'Son Hábitos', es: 'Son Hábitos' },
    parties: { en: 'Lalo Vera and BFit Studios Corp., doing business as Son Hábitos', es: 'Lalo Vera y BFit Studios Corp., que opera como Son Hábitos' },
    disclaimer: { en: 'disclaimer.html', es: 'disclaimer.es.html' }
  }
};
export default BRAND;

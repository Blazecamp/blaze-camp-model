#!/usr/bin/env node
// agent/packs.mjs - one ready-made instruction pack per brand, for any AI agent that gets the plan builder's API or MCP:
// agent/packs/<brand>/ holds AGENTS.md (the brand's own language first), AGENTS.<other language>.md, the questions in both
// languages, an example body for POST /api/plan, check.sh (is the API alive?) and a README. Built from the brand files
// (app/brands/<id>.js: name, site, language, credit, the legal pages) and the live question list (agent/questions.mjs), so a
// new brand gets its pack by running this once. The flow is the coach's (CH7-10): all the questions in one message with the
// answers proposed, the release word for word with its legal links in a second, then one delivery message with the PDF.
//   node agent/packs.mjs            writes agent/packs/<brand>/ for every brand
//   node agent/packs.mjs --check    exits 1 when a pack is out of date (tests/agent-packs.test.mjs)
//   node agent/packs.mjs --brand <id> [--out <dir>]   one brand's pack only (tools/new-brand.mjs), into <dir>/<id>/ instead of
//                                   agent/packs/<id>/ (tools/export-brand.mjs; a trial brand from env BC_BRANDS_DIR)
import fs from 'node:fs';
import path from 'node:path';
import { brandIds, loadBrand, siteUrlFor, ROOT } from './core.mjs';
import { buildQuestions, questionsInLang } from './questions.mjs';

const GITHUB_RAW = 'https://raw.githubusercontent.com/Blazecamp/blaze-camp-model/main';
const OTHER = { en: 'es', es: 'en' };

/** the brand's legal links: its own disclaimer pages, or the model's (GitHub) pages, and the PAR-Q */
function legalLinks(brand, site, q) {
  const parq = (q.questions.find(x => x.id === 'health') || {}).notes?.parq || 'https://eparmedx.com/';
  if (brand.legal && brand.legal.disclaimer) return { en: site + brand.legal.disclaimer.en, es: site + brand.legal.disclaimer.es, parq };
  const u = q.release.full_text || {};
  return { en: u.en, es: u.es, parq };
}

const W = {
  en: {
    title: (b) => `# ${b} plan builder: how to build a plan`,
    intro: (b) => `Instructions for any agent that gets a request for a **training plan, workout, routine or program** (for someone on the team or for a client). The plan comes from the ${b} API or it does not come at all: **never invent a workout**.`,
    api: 'The API',
    base: (site, b) => `- Base: \`${site}\` (${b} only: its logo, colors and legal line are on every plan and PDF)`,
    q: (l) => `- Questions: \`GET /api/questions?lang=${l}\` (\`${OTHER[l]}\` if the person writes in ${l === 'en' ? 'Spanish' : 'English'})`,
    plan: '- Build the plan: `POST /api/plan`',
    oa: '- API description: `GET /api/openapi`',
    pb: `- How to talk to people: ${GITHUB_RAW}/AGENT_PLAYBOOK.md`,
    rd: `- Agent setup and MCP: ${GITHUB_RAW}/agent/README.md`,
    qcopy: (f) => `- All questions in one read (a copy): \`${f}\``,
    legal: 'The legal links (ALWAYS sent with the release)',
    les: (u) => `- Spanish: ${u} (section 5 is the part for coaches, the one that applies when the plan is for a client)`,
    len: (u) => `- English: ${u}`,
    parq: (u) => `- PAR-Q (the 5 health questions come from here): ${u}`,
    fwd: (c, cl) => `They are sent so ${c} can forward them to ${cl} as they are, and ${cl} **confirms by text** that they accept. The agent never accepts for anyone.`,
    flow: 'The flow, in TWO messages',
    m1: (cl) => `**Message 1: all the questions together.** Not one by one. Each one with its proposed answer already filled in (age, weight and whether they are new come from what you already know about ${cl}; the default is 3 days), and the person corrects what is wrong. The order:`,
    list: [
      'who it is for (me / a client)',
      'if it is for a client: the health check, run the PAR-Q now or skip it because the coach screens with their own process',
      'age · weight · units · years training consistently',
      'goal and its details (muscle: focus muscles · fat loss or general: gym or bootcamp · sport: sport, position, season, level, practices · stay active: activity, play days, event)',
      'days per week and which days',
      'where they train (full gym, basic gym, home gym, dumbbells and bench, kettlebells, bodyweight, hotel gym, field or track)',
      'options (split, supersets, plan length, start date, tests, extra equipment)',
      'anything that hurts (optional): area and mild / moderate / severe',
      'the 5 health questions (unless the health check was skipped)'
    ],
    never: 'What is not asked keeps its default. **Never ask** sex or gender, sleep, stress, job, life, energy or session length: the engine refuses them.',
    c1: '**End message 1 with a clear question, on its own line:** "Is everything right? Reply **YES** to continue, or tell me what to change." Do not go on until the person says yes, go ahead, or similar. If they change something, show the updated answers and ask again.',
    m2: '**Message 2: the release, with its links.** Show the release text **word for word** (`release.versions` from `/api/questions`), with the two links above, plus a one-line summary of the answers.',
    acc: (c, cl) => `Only with an **explicit "I accept" in that conversation** (or "Acepto") send \`accepted: true\`. Never assume it, never pre-tick it, and never accept for someone who is not in the chat. With clients, ${c} accepts; ${cl} confirms by text. A "yes" on health does not stop the plan: it comes with the warning to see a professional first, and never say which answer caused it.`,
    c2: '**End message 2 with a clear question, on its own line:** "Do you accept the terms and the release of liability? Reply **I ACCEPT** (or YES) and I will build the plan." Build only after that answer. No plan is ever built without a clear YES to message 1 AND a clear acceptance of message 2.',
    build: 'Build and deliver',
    b1: (l) => `- \`POST /api/plan\` with \`{"answers": {...}, "lang": "${l}", "format": "md"}\`. From the reply keep only \`summary\` and \`link\`: **do not send the plan as text**.`,
    b2: '- 422 → read the `problems` list and ask for that.',
    b3: '- Repeat the POST with `"format": "pdf"` and save the file with the name in the `Content-Disposition` header.',
    b4: '- **One delivery message**: a 3-5 line summary (goal, days, weeks, start date and the health warning if there is one), the PDF attached (every exercise has its ▶ that opens YouTube) and the link (opens the plan in the web tool to edit it or download the PDF again).',
    b5: () => '- If the plan is for a client who is not in the chat: send the **prefilled link**; they accept the release on the page and tap Build. The PDF only if asked.',
    rules: 'Rules',
    r: [
      'Nothing is stored: the answers are not kept after the plan is delivered.',
      'Never change the plan\'s numbers by hand: edits happen in the web tool through the link (swap, sets +/-, remove, add, link exercises into supersets). An agent with the MCP server can make the same edits with `edit_plan`.',
      'It is general fitness information, not medical advice, and it does not prevent injuries. Say it once, in the delivery.',
      'Talk in plain words: short sentences, common words.',
      'If the API fails, say the error. Never invent a plan.'
    ],
    readme: (b) => `# ${b} plan builder: agent pack`,
    rintro: 'An agent that gets this pack knows what to do when someone asks for a training plan: **read `AGENTS.md`** and follow it. The plan comes from the API, never invented.',
    files: 'What is here', fcol: '| File | What |',
    f: (main, other, qa, qb) => [[main, 'The full instructions. Read this first.'], [other, 'The same in the other language.'], [qa, 'Every question with its choices, defaults and when it applies (a copy; the live list is `/api/questions`).'], [qb, 'The same in the other language.'], ['answers.example.json', 'An example body for `POST /api/plan`.'], ['check.sh', 'Checks that the API is alive.']],
    glance: 'The API at a glance',
    post: '`POST` takes `{"answers": {...}, "lang": "en"|"es", "format": "md"|"json"|"pdf"}`. Without `accepted: true` (or without the health check when it applies) it answers **422** with the `problems` list and the prefilled link.',
    gen: 'Generated by `node agent/packs.mjs` from the brand file and the live questions. Do not edit by hand.',
    qtitle: (b, v) => `# ${b} plan builder questions (model ${v})`,
    qintro: (l) => `Generated from \`GET /api/questions?lang=${l}\`. **Always fetch the live list before asking**: this is only a copy to read in one go.\n\n\`when\` = ask it only when this holds. What is not asked keeps its default.`,
    k: { when: 'when', type: 'type', opts: 'choices', def: 'default', req: 'required', from: 'choices from' }
  },
  es: {
    title: (b) => `# Plan builder de ${b}: cómo armar un plan`,
    intro: (b) => `Instrucciones para cualquier agente que reciba un pedido de **plan de entrenamiento, rutina o programa** (para alguien del equipo o para un cliente). El plan sale de la API de ${b} o no sale: **nunca se inventa un entrenamiento**.`,
    api: 'La API',
    base: (site, b) => `- Base: \`${site}\` (solo ${b}: su logo, sus colores y su línea legal van en el plan y en el PDF)`,
    q: (l) => `- Preguntas: \`GET /api/questions?lang=${l}\` (\`${OTHER[l]}\` si la persona escribe en ${l === 'es' ? 'inglés' : 'español'})`,
    plan: '- Armar el plan: `POST /api/plan`',
    oa: '- Descripción de la API: `GET /api/openapi`',
    pb: `- Cómo hablar con la gente: ${GITHUB_RAW}/AGENT_PLAYBOOK.md`,
    rd: `- Detalle para agentes y MCP: ${GITHUB_RAW}/agent/README.md`,
    qcopy: (f) => `- Preguntas de un tirón (copia): \`${f}\``,
    legal: 'Los links legales (van SIEMPRE con la liberación)',
    les: (u) => `- Español: ${u} (su §5 es la parte de entrenadores, que es la que aplica cuando el plan es para un cliente)`,
    len: (u) => `- Inglés: ${u}`,
    parq: (u) => `- PAR-Q (las 5 preguntas de salud salen de aquí): ${u}`,
    fwd: (c, cl) => `Se mandan para que ${c} se los reenvíe a ${cl} tal cual, y ${cl} **confirme por texto** que acepta. El agente no acepta por nadie.`,
    flow: 'El flujo, en DOS mensajes',
    m1: (cl) => `**Mensaje 1: todas las preguntas juntas.** No se van de una en una. Cada una con su propuesta ya puesta (edad, peso y si es nuevo salen de lo que ya sabes de ${cl}; los días por defecto son 3), y la persona corrige lo que esté mal. El orden:`,
    list: [
      'para quién es (yo / un cliente)',
      'si es para un cliente: revisión de salud, se corre el PAR-Q ahora o se omite porque el coach evalúa con su propio proceso',
      'edad · peso · unidades · años entrenando constante',
      'objetivo y sus detalles (músculo: músculos foco · grasa o general: gimnasio o bootcamp · deporte: deporte, posición, temporada, nivel, prácticas · activo: actividad, días de juego, evento)',
      'días por semana y qué días',
      'dónde entrena (gimnasio completo, básico, casa, mancuernas y banco, kettlebells, peso corporal, gimnasio de hotel, campo o pista)',
      'opciones (split, superseries, duración, fecha de inicio, tests, equipo extra)',
      'si le duele algo (opcional): zona y leve / moderado / severo',
      'las 5 preguntas de salud (si no se omitió la revisión)'
    ],
    never: 'Lo que no se pregunte queda en su default. **Nunca se pregunta** sexo o género, sueño, estrés, trabajo, vida, energía ni duración de sesión: el motor las rechaza.',
    c1: '**Termina el mensaje 1 con una pregunta clara, en su propia línea:** «¿Todo está bien? Responde **SÍ** para seguir, o dime qué cambiar.» No sigas hasta que la persona diga sí, adelante o algo parecido. Si cambia algo, muestra las respuestas actualizadas y vuelve a preguntar.',
    m2: '**Mensaje 2: la liberación, con sus links.** El texto de la liberación se muestra **palabra por palabra** (`release.versions` de `/api/questions`), con los dos links de arriba, más el resumen de una línea de las respuestas.',
    acc: (c, cl) => `Solo con el **«Acepto» explícito en esa conversación** (o «I accept») se manda \`accepted: true\`. Nunca se asume, nunca se premarca, y el agente no acepta por alguien que no está en el chat. Con clientes acepta ${c}; ${cl} confirma por texto. Un «sí» en salud no frena el plan: sale con el aviso de ver a un profesional primero, y nunca se dice qué respuesta lo causó.`,
    c2: '**Termina el mensaje 2 con una pregunta clara, en su propia línea:** «¿Aceptas los términos y la liberación de responsabilidad? Responde **ACEPTO** (o SÍ) y armo el plan.» Solo se arma después de esa respuesta. Nunca se arma un plan sin un SÍ claro al mensaje 1 Y una aceptación clara del mensaje 2.',
    build: 'Armar y entregar',
    b1: (l) => `- \`POST /api/plan\` con \`{"answers": {...}, "lang": "${l}", "format": "md"}\`. Del reply se guardan solo \`summary\` y \`link\`: **el plan no se manda como texto**.`,
    b2: '- 422 → se lee la lista `problems` y se pregunta eso.',
    b3: '- Se repite el POST con `"format": "pdf"` y el archivo se guarda con el nombre del header `Content-Disposition`.',
    b4: '- **Un solo mensaje de entrega**: resumen de 3-5 líneas (objetivo, días, semanas, fecha de inicio y el aviso de salud si lo hay), el PDF adjunto (cada ejercicio trae su ▶ que abre YouTube) y el link (abre el plan en la herramienta para editarlo o bajar el PDF otra vez).',
    b5: (cl) => `- Si el plan es para ${cl} y no está en el chat: se le manda el **link prellenado**, acepta la liberación en la página y le da Build. El PDF solo si lo piden.`,
    rules: 'Reglas',
    r: [
      'Nada se guarda: las respuestas no se conservan después de entregar el plan.',
      'Los números del plan no se cambian a mano: se edita en la herramienta por el link (cambiar, series +/-, quitar, agregar, unir ejercicios en superseries). Un agente con el servidor MCP puede hacer los mismos cambios con `edit_plan`.',
      'Es información general de acondicionamiento físico, no consejo médico, y no previene lesiones. Se dice una vez, en la entrega.',
      'Habla en palabras sencillas: frases cortas, palabras comunes.',
      'Si la API falla, se dice el error. No se inventa un plan.'
    ],
    readme: (b) => `# Plan builder de ${b}: paquete para agentes`,
    rintro: 'Un agente que reciba este paquete ya sabe qué hacer cuando alguien pide un plan de entrenamiento: **lee `AGENTS.md`** y lo sigue. El plan sale de la API, nunca inventado.',
    files: 'Qué hay aquí', fcol: '| Archivo | Qué es |',
    f: (main, other, qa, qb) => [[main, 'Las instrucciones completas. Es lo que se lee primero.'], [other, 'Lo mismo en el otro idioma.'], [qa, 'Todas las preguntas con sus opciones, defaults y cuándo aplican (copia; la lista viva es `/api/questions`).'], [qb, 'Lo mismo en el otro idioma.'], ['answers.example.json', 'Cuerpo de ejemplo para `POST /api/plan`.'], ['check.sh', 'Comprueba que la API esté viva.']],
    glance: 'La API, de un vistazo',
    post: '`POST` acepta `{"answers": {...}, "lang": "es"|"en", "format": "md"|"json"|"pdf"}`. Sin `accepted: true` (o sin la revisión de salud cuando toca) devuelve **422** con la lista `problems` y el link prellenado.',
    gen: 'Generado con `node agent/packs.mjs` desde el archivo de la marca y las preguntas vivas. No se edita a mano.',
    qtitle: (b, v) => `# Preguntas del plan builder de ${b} (modelo ${v})`,
    qintro: (l) => `Generado desde \`GET /api/questions?lang=${l}\`. **Siempre pide la lista viva antes de preguntar**: esto es solo una copia para leer de un tirón.\n\n\`when\` = solo se pregunta si se cumple. Lo que no se pregunte queda en su default.`,
    k: { when: 'when', type: 'tipo', opts: 'opciones', def: 'default', req: 'obligatoria', from: 'opciones de' }
  }
};

const qFile = (l) => (l === 'es' ? 'preguntas.es.md' : 'questions.en.md');
const agentsFile = (l, main) => (l === main ? 'AGENTS.md' : `AGENTS.${l}.md`);

function agentsMd(brand, l, site, links) {
  const w = W[l], b = brand.name, A = brand.agent || {};
  const c = (A.coach || {})[l] || (l === 'es' ? 'el coach' : 'the coach');
  const cl = (A.client || {})[l] || (l === 'es' ? 'el cliente' : 'the client');
  const out = [
    w.title(b), '', w.intro(b), '',
    `## ${w.api}`, '', w.base(site, b), w.q(l), w.plan, w.oa, w.pb, w.rd, w.qcopy(qFile(l)), '',
    `## ${w.legal}`, '', w.les(links.es), w.len(links.en), w.parq(links.parq), '', w.fwd(c, cl), '',
    `## ${w.flow}`, '', w.m1(cl), '', ...w.list.map((x, i) => `${i + 1}. ${x}`), '', w.never, '', w.c1, '', w.m2, '', w.acc(c, cl), '', w.c2, '',
    `## ${w.build}`, '', w.b1(l), w.b2, w.b3, w.b4, w.b5(cl), '',
    `## ${w.rules}`, '', ...w.r.map(x => `- ${x}`), '',
    '---', '', `${(A.credit || {})[l] || b}`, '', `_${w.gen}_`, ''
  ];
  return out.join('\n');
}

const fmt = (v) => JSON.stringify(v);
function questionsMd(brand, l, q) {
  const w = W[l], k = w.k;
  const Q = questionsInLang(q, l);
  const out = [w.qtitle(brand.name, q.model_version), '', w.qintro(l), ''];
  for (const x of Q.questions) {
    const label = typeof x.prompt === 'string' ? x.prompt : (x.prompt && (x.prompt.text || '')) || '';
    out.push(`## \`${x.id}\` · ${label}`);
    if (x.when) out.push(`- *${k.when}*: \`${x.when}\``);
    out.push(`- *${k.type}*: ${x.type}`);
    // sports and activities read A to Z in this language's words (coach, 2026-10-14)
    if (['sport.id', 'activity.id'].includes(x.id) && Array.isArray(x.choices)) {
      const key = (o) => String(typeof o.label === 'string' ? o.label : (o.label && o.label.text) || o.value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      x.choices = [...x.choices].sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));
    }
    if (Array.isArray(x.choices) && x.choices.length) out.push(`- *${k.opts}*: ` + x.choices.map(o => `${typeof o.label === 'string' ? o.label : (o.label && o.label.text) || o.value} (\`${o.value}\`)`).join(' · '));
    if (x.choices_from) out.push(`- *${k.from}*: \`${x.choices_from}\``);
    if (x.questions) for (const s of x.questions) out.push(`  - \`${s.key}\`: ${typeof s.prompt === 'string' ? s.prompt : s.prompt.text}`);
    if (x.default !== undefined && x.default !== null) out.push(`- *${k.def}*: \`${fmt(x.default)}\``);
    if (x.required) out.push(`- *${k.req}*`);
    const n = x.notes;
    if (typeof n === 'string' && n) out.push(`- ${n}`);
    else if (n && typeof n === 'object' && typeof n.text === 'string' && n.text) out.push(`- ${n.text}`);
    out.push('');
  }
  return out.join('\n');
}

function example(brand) {
  const l = brand.lang_default;
  return JSON.stringify({ answers: { role: 'client', health_route: 'coach_screen', age: 34, weight: 150, unit: 'lb', years: 1, goal: 'fat_loss', format: 'gym', days: 3, weekdays: ['Mon', 'Wed', 'Fri'], equipment: 'FULL_GYM', weeks: 12, pain: [], health: 'none', accepted: true }, lang: l, format: 'md' }, null, 2) + '\n';
}

function checkSh(brand, site, links) {
  const l = brand.lang_default;
  return `#!/usr/bin/env bash
# ${brand.name}: is the plan builder API alive? Usage: bash check.sh   (generated by agent/packs.mjs)
set -u
BASE="${site.replace(/\/$/, '')}"
for u in "$BASE/api/openapi" "$BASE/api/questions?lang=${l}" "$BASE/api/questions?lang=${OTHER[l]}" "${links[l]}"; do
  printf '%-70s ' "$u"
  curl -sS -L --max-time 25 -o /dev/null -w 'HTTP %{http_code}\\n' "$u" || echo 'NO ANSWER'
done
`;
}

function readme(brand, site, links) {
  const l = brand.lang_default, o = OTHER[l], w = W[l];
  const base = site.replace(/\/$/, '');
  return [w.readme(brand.name), '', w.rintro, '', `## ${w.files}`, '', w.fcol, '|---|---|',
    ...w.f('AGENTS.md', agentsFile(o, l), qFile(l), qFile(o)).map(([a, b]) => `| \`${a}\` | ${b} |`), '',
    `## ${w.glance}`, '', '```', `GET  ${base}/api/questions?lang=${l}`, `POST ${base}/api/plan`, `GET  ${base}/api/openapi`, '```', '', w.post, '',
    `## ${w.legal}`, '', w.les(links.es), w.len(links.en), w.parq(links.parq), '', '---', '', (brand.agent && brand.agent.credit && brand.agent.credit[l]) || brand.name, ''].join('\n');
}

/** every file of every brand's pack (or only `opts.brand`'s): {relative path: content} */
export async function buildPacks(opts = {}) {
  const files = {};
  for (const id of brandIds().filter(x => !opts.brand || x === opts.brand)) {
    const brand = await loadBrand(id);
    const site = siteUrlFor(brand).replace(/\/?$/, '/');
    const q = await buildQuestions({ brand: id, site });
    const links = legalLinks(brand, site, q);
    const main = brand.lang_default, dir = `agent/packs/${id}/`;
    for (const l of ['en', 'es']) {
      files[dir + agentsFile(l, main)] = agentsMd(brand, l, site.replace(/\/$/, ''), links);
      files[dir + qFile(l)] = questionsMd(brand, l, q);
    }
    files[dir + 'answers.example.json'] = example(brand);
    files[dir + 'check.sh'] = checkSh(brand, site, links);
    files[dir + 'README.md'] = readme(brand, site, links);
  }
  return files;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
  const only = arg('--brand'), out = arg('--out');
  if (only && !brandIds().includes(only)) { console.error(`unknown brand '${only}' (known: ${brandIds().join(', ')})`); process.exit(1); }
  const files = await buildPacks({ brand: only });
  const check = process.argv.includes('--check');
  let stale = 0;
  for (const [rel, content] of Object.entries(files)) {
    const p = out ? path.join(path.resolve(out), rel.replace(/^agent\/packs\//, '')) : path.join(ROOT, rel);
    const cur = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
    if (cur === content) continue;
    if (check) { console.log('out of date: ' + rel); stale++; continue; }
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
    if (rel.endsWith('.sh')) fs.chmodSync(p, 0o755);
    console.log('wrote ' + (out ? p : rel));
  }
  if (check && stale) process.exit(1);
}

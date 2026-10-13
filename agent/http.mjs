// agent/http.mjs - the HTTP API of the plan builder, for agents that call web services (a ChatGPT custom GPT Action, scripts).
// Served by the same Vercel deployment as the web tool (api/plan.mjs, api/questions.mjs, api/openapi.mjs), so every brand's
// project has it: the brand comes from the deployment's env BRAND (default blazecamp), the site address from env SITE_URL, else
// the request's own host, else the brand file's site_url (the same deployment serves the web tool and its disclaimer pages).
//
//   GET  /api/questions?lang=en|es        the questions to ask (agent/questions.mjs), the health questions and the release texts
//   POST /api/plan                         {answers | intake, lang?, format?: 'json'|'md'|'pdf', view?, weeks?}
//   GET  /api/openapi                      the OpenAPI 3.1 description (for a custom GPT Action)
//
// Rules: no plan without the accepted release (H20; the engine checks it first, else 422); nothing is stored or logged - no request
// body is written anywhere, every response says Cache-Control: no-store. Open like the web tool (coach's decision 2026-10-13); no
// rate limit yet (a platform firewall rule can add one). Plain Node req / res: works on Vercel and in tests/agent-api.test.mjs.
import * as C from './core.mjs';
import { buildQuestions, questionsInLang } from './questions.mjs';

const MAX_BODY = 256 * 1024;

function send(res, status, body, type = 'application/json; charset=utf-8', extra = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [k, v] of Object.entries(extra)) res.setHeader(k, v);
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

/** the request body as JSON (Vercel may have parsed it already into req.body) */
async function readBody(req) {
  if (req.body !== undefined && req.body !== null && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString('utf8'));
  let size = 0;
  const chunks = [];
  for await (const c of req) {
    size += c.length;
    if (size > MAX_BODY) throw Object.assign(new Error('body too large'), { status: 413 });
    chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
  }
  const s = Buffer.concat(chunks).toString('utf8');
  return s ? JSON.parse(s) : {};
}

const header = (req, k) => { const v = req.headers && req.headers[k]; return Array.isArray(v) ? v[0] : v; };
/** the address this deployment serves the web tool from */
function siteOf(req, brand) {
  // env SITE_URL first; then the request's own host (each deployment links to itself, custom domains included); then the brand file
  if (process.env.SITE_URL) return C.siteUrlFor(brand);
  const host = header(req, 'x-forwarded-host') || header(req, 'host');
  if (!host || !/^[a-z0-9.:-]+$/i.test(host)) return C.siteUrlFor(brand);
  const proto = header(req, 'x-forwarded-proto') || (/^(localhost|127\.)/.test(host) ? 'http' : 'https');
  return `${proto === 'http' ? 'http' : 'https'}://${host}/`;
}
const queryOf = (req) => new URL(req.url || '/', 'http://x').searchParams;

/** one handler for every route (route = 'plan' | 'questions' | 'openapi') */
export async function handle(req, res, route) {
  try {
    const brand = await C.loadBrand(process.env.BRAND);
    const site = siteOf(req, brand);
    if (route === 'questions') {
      if (req.method !== 'GET') return send(res, 405, { error: 'use GET' }, undefined, { Allow: 'GET' });
      const lang = queryOf(req).get('lang');
      const q = await buildQuestions({ brand: brand.id, site });
      return send(res, 200, C.LANGS.includes(lang) ? questionsInLang(q, lang) : q);
    }
    if (route === 'openapi') {
      if (req.method !== 'GET') return send(res, 405, { error: 'use GET' }, undefined, { Allow: 'GET' });
      return send(res, 200, openapi(site || 'https://example.org/', brand));
    }
    if (route !== 'plan') return send(res, 404, { error: 'not found' });
    if (req.method !== 'POST') return send(res, 405, { error: 'use POST with a JSON body' }, undefined, { Allow: 'POST' });
    let body;
    try { body = await readBody(req); } catch (e) { return send(res, e.status || 400, { error: e.status === 413 ? 'the body is too large' : 'the body must be JSON' }); }
    if (!body || typeof body !== 'object' || (!body.answers && !body.intake)) return send(res, 400, { error: 'send {answers} (see GET /api/questions) or {intake}' });
    const format = body.format || 'json';
    if (!['json', 'md', 'pdf'].includes(format)) return send(res, 400, { error: 'format must be json, md or pdf' });
    const r = await C.buildPlan({ answers: body.answers, intake: body.intake, brand: brand.id, lang: body.lang, site });
    if (r.status === 'needs_answers') return send(res, 422, { status: 'needs_answers', problems: r.problems.map(p => p.message), link: r.link || null });
    if (r.status === 'invalid') return send(res, 422, { status: 'invalid', errors: r.errors });
    const summary = C.planSummary(r.plan, r.model, r.lang);
    if (format === 'pdf') {
      const name = C.fileBase(r.plan, r.brand, r.lang) + '.pdf';
      return send(res, 200, C.planPdf(r.plan, r.model, r.lang, r.brand), 'application/pdf', { 'Content-Disposition': `attachment; filename="${name}"` });
    }
    if (format === 'md') {
      const md = C.planMarkdown(r.plan, r.model, r.lang, r.brand, { view: body.view || 'overview', weeks: Array.isArray(body.weeks) && body.weeks.length ? body.weeks : undefined });
      if (/text\/markdown/.test(header(req, 'accept') || '')) return send(res, 200, md, 'text/markdown; charset=utf-8');
      return send(res, 200, { status: 'ok', lang: r.lang, summary, link: r.link || null, markdown: md });
    }
    return send(res, 200, { status: 'ok', lang: r.lang, summary, link: r.link || null, plan: r.plan });
  } catch (e) {
    // no request content in the reply or anywhere else
    return send(res, e instanceof C.AgentError ? 400 : 500, { error: e instanceof C.AgentError ? e.message : 'the plan could not be built' });
  }
}

/** the OpenAPI description of this deployment's API (brand-neutral words; the server address is the deployment's) */
export function openapi(site, brand) {
  const url = site.replace(/\/$/, '');
  const gate = 'LIABILITY GATE: before calling, show the person the release text from GET /api/questions (release.versions) and get an explicit "I accept" in the conversation; only then send answers.accepted = true. Never assume it. A health-check yes does not stop the plan: it carries a health warning. Never ask sex, gender, sleep, stress, job, life or energy, or a session length. Nothing is stored or logged; do not keep the answers. When the person is not the one in the conversation, give them the prefilled `link` instead: they accept the release on the web page themselves.';
  return {
    openapi: '3.1.0',
    info: { title: `${brand.name} plan builder API`, version: '1.0.0', description: `Builds a complete, editable training plan (EN or ES) from a few answers. General fitness information, not medical advice. ${gate}` },
    servers: [{ url }],
    paths: {
      '/api/questions': {
        get: {
          operationId: 'getQuestions', summary: 'The questions to ask, in order, with choices, the health questions and the release texts',
          parameters: [{ name: 'lang', in: 'query', required: false, schema: { type: 'string', enum: ['en', 'es'] } }],
          responses: { 200: { description: 'questions', content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } } } }
        }
      },
      '/api/plan': {
        post: {
          operationId: 'buildPlan', summary: 'Build the plan from the answers', description: gate,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    answers: { type: 'object', additionalProperties: true, description: 'answers keyed by the question ids (dotted ids are nested: sport.id -> {"sport": {"id": ...}}); include health ("none" | "some" + safety) and accepted (true only after an explicit "I accept")' },
                    intake: { type: 'object', additionalProperties: true, description: 'a full intake/2 instead of answers' },
                    lang: { type: 'string', enum: ['en', 'es'] },
                    format: { type: 'string', enum: ['md', 'json', 'pdf'], description: 'md (default for agents): a summary, the link and the plan as Markdown; json: the plan JSON (large); pdf: the PDF file' },
                    view: { type: 'string', enum: ['overview', 'week', 'day', 'block', 'full'], description: 'Markdown view (default overview; full can be several hundred KB)' },
                    weeks: { type: 'array', items: { type: 'integer' }, description: 'the weeks for the week / day views' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'the plan', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, summary: { type: 'object', additionalProperties: true }, link: { type: ['string', 'null'], description: 'the web tool with these answers filled in' }, markdown: { type: 'string' }, plan: { type: 'object', additionalProperties: true } } } } } },
            422: { description: 'answers missing (problems, plus the prefilled link) or the intake is invalid (errors)', content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } } }
          }
        }
      }
    }
  };
}

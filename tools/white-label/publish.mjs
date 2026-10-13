// tools/white-label/publish.mjs - tools/new-brand.mjs --publish: the preview link right away (coach CH7-13, "I need the actual link
// to the preview right away"). It commits ONLY the new brand's files on top of origin/main (a temporary index, so nothing else in the
// working copy or the current branch is ever committed or pushed), pushes that commit to main (retries 2 s, 4 s, 8 s, 16 s, fetching
// again each time), then, with the GitHub CLI (`gh`, or env BC_GH), waits up to about 5 minutes for the commit status
// "Vercel – white-label-previews" and reports "live" or "building".
//   publishBrand({id, name, previewUrl, dryRun, wait, log}) -> {lines: [the link, the state], commit?, pushed}
// --dry-run prints the git commands it would run and the link, and touches nothing.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const STATUS_CONTEXT = /vercel/i;
export const STATUS_PROJECT = /white-label-previews/i;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/** the repository paths of one brand: the only paths --publish ever commits */
export const brandPaths = (id) => [`app/brands/${id}.js`, `app/brands/${id}`, `agent/packs/${id}`];

function git(args, { env = {}, cwd = ROOT } = {}) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ...env } }).trim();
}
const errText = (e) => String((e && (e.stderr || e.message)) || e).trim().split('\n').slice(-2).join(' ');

/** a commit of the brand's files on top of `parent`, built in a temporary index (the real index and working copy are untouched) */
function brandCommit(id, name, parent) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'publish-index-'));
  const env = { GIT_INDEX_FILE: path.join(dir, 'index') };
  try {
    git(['read-tree', parent], { env });
    git(['add', '-A', '-f', '--', ...brandPaths(id)], { env });
    const tree = git(['write-tree'], { env });
    if (tree === git(['rev-parse', `${parent}^{tree}`])) return { sha: null, tree };
    const msg = `White-label preview: ${name} (${id})\n\nMade by tools/new-brand.mjs --publish. Only the brand's files: ${brandPaths(id).join(', ')}.`;
    return { sha: git(['commit-tree', tree, '-p', parent, '-m', msg]), tree };
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

/** owner/repo from the origin URL (https, ssh or a proxy path ending in /<owner>/<repo>) */
export function repoSlug(url) {
  const m = /[:/]([^/:]+)\/([^/]+?)(?:\.git)?\/?$/.exec(String(url).trim());
  return m ? `${m[1]}/${m[2]}` : null;
}

function ghBin() {
  if (process.env.BC_GH) return fs.existsSync(process.env.BC_GH) ? process.env.BC_GH : null;
  for (const dir of String(process.env.PATH || '').split(path.delimiter)) {
    const p = path.join(dir, 'gh');
    try { fs.accessSync(p, fs.constants.X_OK); return p; } catch { /* not here */ }
  }
  return null;
}

/** the Vercel status of the previews project on a commit: 'success' | 'pending' | 'failure' | 'error' | null (none yet) */
function vercelState(gh, slug, sha) {
  const out = execFileSync(gh, ['api', `repos/${slug}/commits/${sha}/status`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const s = (JSON.parse(out).statuses || []).find(x => STATUS_CONTEXT.test(x.context || '') && STATUS_PROJECT.test(x.context || ''));
  return s ? { state: s.state, url: s.target_url || null } : null;
}

export async function publishBrand({ id, name, previewUrl, dryRun = false, wait = true, log = () => {} }) {
  const paths = brandPaths(id);
  if (dryRun) {
    return {
      pushed: false,
      commands: [
        'git fetch origin main',
        'GIT_INDEX_FILE=<temp> git read-tree origin/main',
        `GIT_INDEX_FILE=<temp> git add -A -f -- ${paths.join(' ')}`,
        `git commit-tree $(GIT_INDEX_FILE=<temp> git write-tree) -p origin/main -m "White-label preview: ${name} (${id})"`,
        'git push origin <that commit>:main   (retries after 2 s, 4 s, 8 s, 16 s)',
        `gh api repos/<owner>/<repo>/commits/<that commit>/status   (waits for "Vercel – white-label-previews", up to ~5 min)`
      ],
      lines: [previewUrl, 'dry run: nothing committed or pushed']
    };
  }
  for (const p of paths) if (!fs.existsSync(path.join(ROOT, p))) throw new Error(`--publish: ${p} is missing`);
  const waits = [0, 2000, 4000, 8000, 16000];
  let commit = null, lastErr = null;
  for (const [i, ms] of waits.entries()) {
    if (ms) { log(`push failed (${lastErr}); trying again in ${ms / 1000} s`); await sleep(ms); }
    try {
      git(['fetch', '-q', 'origin', 'main']);
      const parent = git(['rev-parse', 'origin/main']);
      const c = brandCommit(id, name, parent);
      if (!c.sha) { commit = parent; log(`main already has these files (${parent.slice(0, 7)}); nothing to push`); break; }
      git(['push', '-q', 'origin', `${c.sha}:refs/heads/main`]);
      commit = c.sha;
      log(`pushed ${c.sha.slice(0, 7)} to main (only ${paths.join(', ')})`);
      // the local main follows, when it was exactly the commit this one is built on
      try {
        if (git(['rev-parse', '--abbrev-ref', 'HEAD']) === 'main' && git(['rev-parse', 'HEAD']) === parent) git(['reset', '-q', c.sha]);
        else log('your current branch is unchanged (the brand is on origin/main)');
      } catch { /* the push is what matters */ }
      break;
    } catch (e) { lastErr = errText(e); if (i === waits.length - 1) throw new Error(`could not push to main after ${waits.length} tries: ${lastErr}`); }
  }

  const gh = wait ? ghBin() : null;
  let slug = null;
  try { slug = repoSlug(git(['remote', 'get-url', 'origin'])); } catch { /* no remote URL */ }
  if (!gh || !slug) return { pushed: true, commit, lines: [previewUrl, 'building, ready in ~1-2 min'] };
  const limit = Number(process.env.BC_PUBLISH_WAIT_S || 300) * 1000, every = Number(process.env.BC_PUBLISH_POLL_S || 10) * 1000;
  const t0 = Date.now();
  while (Date.now() - t0 < limit) {
    let s = null;
    try { s = vercelState(gh, slug, commit); } catch (e) { log(`gh: ${errText(e)}`); }
    if (s && s.state === 'success') return { pushed: true, commit, lines: [previewUrl, 'live'] };
    if (s && (s.state === 'failure' || s.state === 'error')) return { pushed: true, commit, lines: [previewUrl, `the preview build failed: ${s.url || 'see the Vercel project white-label-previews'}`], failed: true };
    await sleep(every);
  }
  return { pushed: true, commit, lines: [previewUrl, 'building, ready in ~1-2 min'] };
}

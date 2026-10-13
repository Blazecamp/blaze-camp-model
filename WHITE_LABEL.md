# White-label brands: the steps for the coach's agent

This is the one file to give your AI agent (it needs GitHub, Vercel and a browser). Follow it step by step.

## What white-label means here

A gym gets **its own copy of the plan builder**: their name, their logo, their colours, their words. The plans are the
coach's model, the same engine and the same rules as Blaze Camp. Only the look changes.

- Each brand is one file, `app/brands/<id>.js`, plus a folder `app/brands/<id>/` (logo, icons, colours).
- One preview site shows every white-label brand at its own link: `https://white-label-previews.vercel.app/<id>/`.
  (Blaze Camp and Son Hábitos have their own sites and are not on it.)
- When the gym pays, you hand them their copy (a zip, or a site on their own domain).

## Step 1: make the brand from their website

```sh
node tools/new-brand.mjs --from-website https://theirgym.com
```

It reads their site: the name, the logo, the colours and the language. It prints what it **found** and what it
**guessed**. Then it makes the brand, its agent pack, and a trial build.

If something is wrong, run it again with `--force` and the flag that fixes it (flags always win):

```sh
node tools/new-brand.mjs --from-website https://theirgym.com --id iron-temple --name "Iron Temple Gym" \
  --lang en --colors "#c8102e,#0e7c86" --logo https://theirgym.com/images/logo.png --force
```

| Flag | What it is |
|---|---|
| `--id` | the short name in the link (letters, numbers, dashes): `iron-temple` |
| `--name` | the gym's name as it should show |
| `--lang` | `en` or `es`: the language the site opens in |
| `--logo` | a PNG, SVG or JPG (a file or an `https://` link). A PNG also gives the icons and the PDF cover logo |
| `--colors` | `"main,accent"` or `"main,accent,text"` as hex. They are darkened a little if text would be hard to read |
| `--short`, `--tagline-en`, `--tagline-es`, `--credit`, `--icon` | optional words and icon |
| `--site` | their own address, once they have one: `https://plan.theirgym.com` |

No website? Give the flags yourself: `node tools/new-brand.mjs --id <id> --name "<Name>" --lang es --logo logo.png --colors "#hex,#hex"`.

**Check the result.** Open the trial build it prints (`python3 -m http.server -d <folder> 8000`, then
`http://localhost:8000/`) and take a phone-size screenshot (390 x 844). Look at the logo, the colours and the name. Fix
with flags and `--force` if they look off.

With Playwright you can let a script do the check and the screenshots (it builds a plan, downloads the PDF and fails on
any error or on another brand's name): `BC_QA_URLS=http://localhost:8000/ BC_QA_NAME="<Name>" BC_QA_OUT=shots/ node tools/app-qa/white-label.mjs`.
Screenshots of a demo brand made this way: [reviews/white-label-demo/](reviews/white-label-demo/).

## Step 2: publish the preview and send the link

1. Commit **only** the new brand's files and push to `main`:
   `app/brands/<id>.js`, `app/brands/<id>/`, `agent/packs/<id>/`.
2. The previews site rebuilds by itself (about 1 minute).
3. Send the gym: `https://white-label-previews.vercel.app/<id>/`

The preview pages are hidden from search engines. The previews site's home page shows nothing, so one gym never sees
another. The previews site has no API (agents use it after step 3).

## Step 3: when they pay, hand it over

Ask where it will live (for example `https://plan.theirgym.com`). Then:

```sh
node tools/export-brand.mjs --brand <id> --out ../<id>-export --site https://plan.theirgym.com --zip
```

This makes a folder and a zip with **only their brand**: `website/` (the site), a README in English and Spanish ("how to
put this on your website"), `LICENSE` (MIT: it stays with the files) and the disclaimer. It works on any web host.
Then either:

- **Give them the zip.** Their web person uploads `website/` (or points a subdomain at it). The README says how.
- **Or deploy it for them** on their Vercel (or Netlify): a new project from the `website/` folder, then
  [connect their domain](#connect-a-custom-domain).

Do they want AI agents to build plans for their clients? Export with the API instead:

```sh
node tools/export-brand.mjs --brand <id> --out ../<id>-api --site https://plan.theirgym.com --with-api --zip
```

That folder is a ready Vercel project (site + `/api/questions`, `/api/plan`, `/api/openapi`). Put it in a new GitHub
repository, import it in Vercel (*Framework Preset: Other*), then [connect their domain](#connect-a-custom-domain).

## Step 4 (optional): their agent pack

`agent/packs/<id>/AGENTS.md` tells any AI agent how to build a plan with their API: the questions in one message,
the release with its links in a second, then the plan. Give it to them with the `--with-api` export (it is inside).
After their domain is live, update `site_url` (see "after the domain" below) so the pack points to it.

## Connect a custom domain

Give this to a browser agent (for example the Claude extension in Chrome), with `<domain>` and the Vercel project filled in:

> Connect the domain `<domain>` (for example `plan.theirgym.com`) to the Vercel project `<project>`.
> Rules: change nothing except the one record below. No purchases. Never change nameservers. Never edit or delete any
> other DNS record, and never touch `@` or `www`.
> 1. In Vercel: project `<project>` → *Settings* → *Domains* → *Add* → `<domain>`. Copy the exact record Vercel shows
>    (usually a **CNAME** named like `plan` with a value like `xxxx.vercel-dns-xxx.com`; sometimes also a **TXT** named
>    `_vercel` to verify).
> 2. Open the DNS settings where the domain is managed (GoDaddy, Namecheap, Squarespace, Cloudflare ...). **Take a
>    screenshot of the existing records first.**
> 3. **Stop and report** if a record with that name already exists, or if the DNS is managed somewhere else than you
>    expected (for example the nameservers point to another provider).
> 4. Add **only** that CNAME (and the TXT `_vercel` if Vercel asked for it), exactly as Vercel shows it. On Cloudflare,
>    set it to "DNS only" (grey cloud).
> 5. Back in Vercel, wait until the domain says **Valid Configuration** (can take a few minutes).
> 6. Test: `https://<domain>/` opens the plan builder; `https://<domain>/api/questions?lang=en` answers (only for a
>    project with the API); and their main website still works.
> 7. Report back: the record you added (type, name, value) and the screenshots.

**After the domain works** (the same for every brand):

1. In `app/brands/<id>.js`, set `site_url` to the new address, for example `"https://plan.theirgym.com/"`.
   (For a white-label brand you can also run `node tools/new-brand.mjs ... --site https://plan.theirgym.com --force`.)
2. Run `node agent/packs.mjs` (the agent pack now points to the new address).
3. Run the brand tests: `node --test tests/app-brand.test.mjs tests/agent-packs.test.mjs tests/white-label.test.mjs`.
4. Commit the brand file and its pack, push to `main`.

Worked example: **Son Hábitos** (done 2026-10-13). `plan.sonhabitos.com` was connected to the `son-habitos` Vercel
project with one CNAME; then `site_url` in `app/brands/sonhabitos.js` became `https://plan.sonhabitos.com`,
`node agent/packs.mjs` updated its pack and legal links, the brand tests passed, and it was pushed. (Son Hábitos was made
by hand, so its file is edited directly; never run `new-brand` on it.)

## One-time setup: the previews project

**Done (2026-10-13).** The Vercel project `white-label-previews` exists (team puestario), built from this repository with
`BRAND=previews`, at **https://white-label-previews.vercel.app**. Every white-label brand on `main` shows up there by
itself. Until the first white-label brand is pushed, the site is only the "Nothing here" page. The steps, for reference:

1. Vercel → *Add New…* → *Project* → import `Blazecamp/blaze-camp-model`.
2. *Project Name*: `white-label-previews`. *Framework Preset*: **Other**. Leave the build command and output folder
   (they come from `vercel.json`).
3. *Environment Variables*: `BRAND` = `previews` (Production and Preview).
4. *Deploy*. Production branch: `main`.
5. Check: `https://white-label-previews.vercel.app/` says "Nothing here"; after the first brand,
   `https://white-label-previews.vercel.app/<id>/` opens its tool.

If a previews project ever gets another address, pass it to new brands with
`--previews-url https://<that address>` (or set env `PREVIEWS_URL`).

## Guardrails

- **Never** edit the engine (`engine/`), the model (`model/`), the coach's answer files, or another brand's files.
  `new-brand --force` only replaces brands it made itself.
- **Nothing is stored**: no accounts, no data, no logs. Do not add any.
- **No other brand on their site.** The build fails if "Blaze Camp", "Son Hábitos", another client's name, or the
  owner's name shows up anywhere, except the legal line below.
- **The legal line is PROPOSED.** Every white-label site says the release covers "Lalo Vera and BFit Studios Corp., doing
  business as <Name>" (Spanish: "Lalo Vera y BFit Studios Corp., que opera como <Name>"). This is the coach's pattern
  (CH7-03) and is waiting for his attorney. Tell the coach before the first paid hand-off.
- **The license is MIT** and the repository is public: keep `LICENSE` in every export. Anyone can copy the code; what
  the gym pays for is the set-up, the brand and the hand-off.

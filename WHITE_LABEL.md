# White-label brands: the steps for the coach's agent

This is the one file to give your AI agent (it needs GitHub, Vercel and a browser). Follow it step by step.

## What white-label means here

A gym gets **its own copy of the plan builder**: their name, their logo, their colours, their words. The plans are the
coach's model, the same engine and the same rules as Blaze Camp. Only the look changes.

- Each brand is one file, `app/brands/<id>.js`, plus a folder `app/brands/<id>/` (logo, icons, colours).
- One preview site shows every white-label brand at its own link: `https://white-label-previews.vercel.app/<id>/`.
  (Blaze Camp and Son Hábitos have their own sites and are not on it.)
- When the gym pays, you hand them their copy (a zip, or a site on their own domain).

## Steps 1-2: make the brand and send the preview link (one command)

```sh
node tools/new-brand.mjs --from-website https://theirgym.com --publish
```

It reads their site: the name, the logo, the colours, the language and the gym's company name (its **legal name**). It
prints what it **found** and what it **guessed** (on stderr). It makes the brand, its agent pack and a trial build, runs the
checks (the leak check, the build, the colour contrast), commits **only** the new brand's files to `main`
(`app/brands/<id>.js`, `app/brands/<id>/`, `agent/packs/<id>/`), waits for the previews site, and then prints only this:

```
https://white-label-previews.vercel.app/<id>/
live
```

(or `building, ready in ~1-2 min` when the site is still building). **Send the coach that link as soon as it prints.** No
screenshots are needed. Do not ask the coach for anything unless their website gives no name or logo at all (with no logo,
a wordmark of the gym's name is made, so the link still goes out).

Want to see first what it would do? Add `--dry-run`: it prints the git commands and the link, and pushes nothing.

**The logo is always a PNG** (the coach: "remake the logo for a PNG"). Whatever the site has (PNG, SVG, JPG, WEBP, GIF, ICO,
an inline SVG) is drawn by a browser, trimmed, at most 512 px wide, transparent where an SVG is empty, and used everywhere
(the top bar, the PDF cover, the icons). The browser is Playwright (env `BC_PLAYWRIGHT` = its `index.mjs`, `BC_CHROMIUM` =
a Chrome or Chromium) or a Chrome on the PATH. No browser? Make the PNG with your own image tools (open the logo, export it
as PNG with a transparent background, about 512 px wide) and run again with `--logo logo.png`. No usable logo at all?
`--logo-text` makes a clean wordmark of the gym's name in its main colour.

**Fix anything** by running it again with `--force --publish` and only the flag that fixes it (flags always win; the rest is
kept from the brand):

```sh
node tools/new-brand.mjs --id iron-temple --logo https://theirgym.com/images/logo.svg --force --publish
node tools/new-brand.mjs --id iron-temple --colors "#c8102e,#0e7c86" --name "Iron Temple Gym" --force --publish
```

| Flag | What it is |
|---|---|
| `--id` | the short name in the link (letters, numbers, dashes): `iron-temple` |
| `--name` | the gym's name as it should show |
| `--lang` | `en` or `es`: the language the site opens in |
| `--logo` | any image (a file or an `https://` link): PNG, SVG, JPG, WEBP, GIF, ICO. It becomes a PNG |
| `--logo-text` | a wordmark of the name (or of the words you give: `--logo-text "IRON TEMPLE"`) instead of a logo |
| `--colors` | `"main,accent"` or `"main,accent,text"` as hex. They are darkened a little if text would be hard to read |
| `--legal-name` | the gym's company, as registered: `"Iron Temple Fitness, LLC"` (see below) |
| `--legal-state` | optional: where it is registered, `FL` |
| `--legal-name-confirmed` | the company name really is the gym's name (no LLC or Inc. to add) |
| `--short`, `--tagline-en`, `--tagline-es`, `--credit`, `--icon` | optional words and icon |
| `--site` | their own address, once they have one: `https://plan.theirgym.com` |
| `--publish` | commit only this brand, push to `main`, print the link (`--dry-run`: show, do not push; `--no-wait`: do not wait for the site) |

No website? Give the flags yourself: `node tools/new-brand.mjs --id <id> --name "<Name>" --lang es --logo logo.png --colors "#hex,#hex" --legal-name "<Gym LLC>" --publish`.

The previews site rebuilds by itself from `main` (about 1 minute). The preview pages are hidden from search engines. Its
home page shows nothing, so one gym never sees another. It has no API (agents use it after step 3).

**Internal check (optional).** The trial build folder is printed on stderr. With Playwright a script can build a plan in it,
download the PDF and fail on any error or on another brand's name: `python3 -m http.server -d <folder> 8000`, then
`BC_QA_URLS=http://localhost:8000/ BC_QA_NAME="<Name>" BC_QA_OUT=shots/ node tools/app-qa/white-label.mjs`.

## Find the gym's legal name

Every white-label site releases "Lalo Vera, BFit Studios Corp. and **<the gym's legal name>** (doing business as <the gym>)",
so the gym's company must be right before the hand-off (the coach: "The agent needs to go find out who it is").

1. `--from-website` looks for it first: the footer copyright line ("© 2026 Iron Temple Fitness, LLC"), a company ending
   (LLC, Inc., Corp., PLLC, S.A. de C.V., S. de R.L., S.A.S. ...), and the terms, privacy and legal pages linked from the
   home page. It prints what it found and where (for example `legal name: Iron Temple Fitness, LLC [found: .../terms: "..."]`).
   Check that it is the gym, not their web designer or booking app.
2. **Not found?** The brand is still made and the preview link still goes out, with the gym's name in the legal line and
   `legal_name_confirmed: false`. `tools/export-brand.mjs` refuses the hand-off until you fix it. Look it up:
   - **Florida:** open https://search.sunbiz.org/Inquiry/CorporationSearch/ByName, search the gym's name (also try the
     owner's name under *Officer/Registered Agent*, and the fictitious names search: a "d/b/a" points to the company behind
     it). Take the exact name of the **Active** company (for example `IRON TEMPLE FITNESS, LLC`).
   - **Another US state:** search "<state> secretary of state business search", then the gym's name, the same way.
   - **Mexico or Latin America:** the "razón social" is usually on the site's *aviso de privacidad* or on an invoice; ask
     the gym if it is not.
   - **Still unsure?** Ask the gym (or the coach) once: "What is the exact legal name of the company that owns the gym?"
3. Set it, and publish again:
   `node tools/new-brand.mjs --id <id> --legal-name "Iron Temple Fitness, LLC" --legal-state FL --force --publish`.
   If the company name really is the gym's name, use `--legal-name-confirmed` instead.

## Step 3: when they pay, hand it over

Check that the gym's legal name is confirmed (the export refuses if it is not: [Find the gym's legal name](#find-the-gyms-legal-name)).
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

## Update all previews

When the look of the white-label sites changes (for example the light / dark theme, coach CH7-15, 2026-10-14), make every
white-label brand again with the new look, from its own inputs:

```sh
node tools/new-brand.mjs --refresh-all
BC_PLAYWRIGHT=... BC_CHROMIUM=... node tools/app-qa/themes.mjs     # every brand, light and dark (screenshots in reviews/theme-<date>/)
git add app/brands agent/packs && git commit -m "White-label previews: refreshed" && git push
```

It remakes, for every brand with `white_label: true` that this tool made: `brand.css` (light and dark), the logo plate
(`logo_plate`), the icons and the agent pack. It keeps the name, colours, logo (`logo-src.png`), legal name and site exactly as
they are and reads no website again; a logo or icon whose pixels did not change keeps its bytes. Blaze Camp and Son Hábitos are
not touched (they are edited by hand).

**Light and dark (CH7-15).** Every site has a sun / moon button next to EN | ES; with no choice it follows the phone. A brand
colour that would vanish is shown in a shade that stands out (black on the dark page becomes the brand's other colour or a light
grey; white on the light page a dark grey; any other colour a lighter or darker shade of its own hue). A logo that would not
show on a page sits on a rounded plate there (`logo_plate: {light, dark}` in the brand file; new-brand chooses it from the
logo's pixels). Print, the PDF and Save image stay light.

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
- **The legal line is PROPOSED** (general information, not legal advice). Every white-label site says the release covers
  "Lalo Vera, BFit Studios Corp. and <Gym legal name> (doing business as <Gym>)" (Spanish: "Lalo Vera, BFit Studios Corp. y
  <razón social> (que opera como <Gym>)"; the name once when it is the same). Its disclaimer pages add a section "How this
  tool is provided" / "Cómo se ofrece esta herramienta": the gym gets the tool under license from BFit Studios Corp., does
  its own health screening and has every member or client sign the gym's own liability waiver, whether they build the plan
  or a coach at the gym does; the site's terms do not replace that waiver or move the gym's responsibility to Lalo Vera or
  BFit Studios Corp. This is the coach's answer (CH7-03, CH7-11) and is waiting for his attorney. Tell the coach before the
  first paid hand-off.
- **The license is MIT** and the repository is public: keep `LICENSE` in every export. Anyone can copy the code; what
  the gym pays for is the set-up, the brand and the hand-off.

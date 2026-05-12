# Metonym Website — `metonym.health`

Static HTML site for the patent-pending Metonym methodology. Designed to be pushed to GitHub and hosted free via GitHub Pages — same setup Laura already uses for `walshpsychology.com` (repo: `Laura3578/laura3578.github.io`).

**Primary domain:** metonym.health
**Backup domain:** metonym.app (can be pointed at the same repo or used as a redirect)
**Brand relationship:** Metonym LLC is a separate entity from Walsh Psychology, founded by Dr. Laura L. Walsh, PsyD to commercialize the clinical AI evaluation methodology. Walsh Psychology continues to operate the clinical practice and forensic consulting. The Metonym site cross-links to walshpsychology.com because the same principal is behind both, but the two operate as separate businesses.

Built 2026-05-12 — v02 (verified bio + correct domain).

---

## What's in this folder

| File | What it is |
|------|------------|
| `index.html` | Homepage |
| `methodology.html` | Methodology overview (SDM + MSS + the four high-risk states) |
| `about.html` | Dr. Laura L. Walsh, PsyD bio — pulled from walshpsychology.com/about, verified |
| `style.css` | Shared stylesheet (clinical navy + warm ivory palette) |
| `images/headshot.webp` | Your square headshot, copied locally so the Metonym site has no dependency on walshpsychology.com staying up |
| `images/headshot-action.webp` | Spare second photo (laura_photo2.webp), not used by default — available if you want to swap |
| `CNAME` | Tells GitHub Pages this site lives at `metonym.health` |
| `.nojekyll` | Tells GitHub Pages not to process files with Jekyll |
| `README.md` | This file |

---

## Preview locally (right now, no internet needed)

Double-click `index.html`. It opens in your default browser. All three pages link to each other.

---

## Publish on GitHub Pages

Since you already run `walshpsychology.com` from `Laura3578/laura3578.github.io`, you know this drill. Quick version:

### Step 1 — Create a new repository
1. Logged in as **Laura3578** at github.com, click the **+** icon top-right → **New repository**
2. Name: `metonym` (or `metonym-site` — whatever you prefer; it won't show publicly once you connect the domain)
3. Set to **Public**
4. Do NOT add a README — we already have one
5. Click **Create repository**

### Step 2 — Upload these files
1. On the empty repo page, click "**uploading an existing file**"
2. Open this folder (`2026-05-12-metonym-website/`) in Finder
3. Select everything inside (Cmd-A)
4. Drag it all into GitHub's upload area
5. Click **Commit changes**

**Important:** make sure `.nojekyll` uploads. Press **Cmd-Shift-.** in Finder to show hidden files if it's not visible.

### Step 3 — Turn on GitHub Pages
1. In the repo, click **Settings** → **Pages** (left sidebar)
2. Source: **Deploy from a branch** → branch **main** → folder **/ (root)** → **Save**
3. Wait ~2 minutes. Temporary preview URL appears: `https://laura3578.github.io/metonym/`

### Step 4 — Point `metonym.health` at GitHub
At your domain registrar's DNS panel for **metonym.health**, add these records:

| Type | Host / Name | Value |
|------|-------------|-------|
| A | @ (root) | `185.199.108.153` |
| A | @ (root) | `185.199.109.153` |
| A | @ (root) | `185.199.110.153` |
| A | @ (root) | `185.199.111.153` |
| CNAME | www | `laura3578.github.io` |

Back on GitHub → repo Settings → Pages → "Custom domain": enter `metonym.health` → Save.
Wait 5–60 minutes for DNS to propagate, then check **"Enforce HTTPS"**.

### Step 5 — Set up `metonym.app` as a redirect (optional but recommended)

Easiest approach: at your registrar, set **metonym.app** to forward (301 redirect) to **https://metonym.health**. Most registrars offer this as a built-in "Domain Forwarding" feature, no DNS work required.

Alternative: point metonym.app's DNS at GitHub Pages the same way as metonym.health, and add `metonym.app` as an additional custom domain in the repo's Pages settings. This serves the same site at both URLs (slightly worse for SEO than a redirect, but works).

---

## Make the contact form send to you

The form has a Formspree placeholder. To activate (5 minutes):

1. Sign up at **https://formspree.io** with `laura@walshpsychology.com`
2. Click **+ New Form**, name it "Metonym contact"
3. Copy the form ID it gives you (looks like `abc12345`)
4. Open `index.html` in TextEdit or VS Code
5. Find the line:
   ```
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
6. Replace `YOUR_FORM_ID` with your real form ID, save, re-upload to GitHub

Formspree's free tier handles 50 submissions/month. The form also has a backup `mailto:` link to `laura@walshpsychology.com` so visitors can always reach you even if Formspree is unavailable.

---

## To change content later

**Text edits:** open the relevant `.html` file in TextEdit, edit, save, re-upload to GitHub.
**Colors / typography:** open `style.css`. The palette is in CSS variables at the top under `:root { ... }`. Change the hex codes, save, re-upload.
**Add a logo:** drop your logo file in `images/`, then in each HTML file replace the line `<a href="index.html" class="brand">Metonym<span class="mark">.</span></a>` with `<a href="index.html" class="brand"><img src="images/metonym-logo.svg" alt="Metonym" height="32"></a>`.

---

## Verified content sources used in v02

To avoid making anything up, the About page pulls verified facts from:
- **https://walshpsychology.com/about.html** — bio, education, licensure numbers, engineer-father anecdote, voice
- **https://walshpsychology.com/ai.html** — the four high-risk clinical states (Decision-State Transitions, Collapse of Perceived Options, Temporal Narrowing, Calm/Resolved States) now echoed on the Metonym methodology page
- **https://drlauralwalsh.com/s/Dr-Laura-L-Walsh-CV-Rev-02-26.pdf** — linked from About as "Download CV"
- **https://walshpsychology.com/laura_square_headshot.webp** — downloaded as `images/headshot.webp` for local hosting

---

## Open items for v03 (whenever you're ready)

1. **Logo** — currently styled text ("Metonym."). Replace when designed.
2. **Open Graph image** for nice link previews on LinkedIn / Twitter / iMessage — 1200×630 PNG, drop into `images/`, reference in each page's `<head>`.
3. **Formspree wiring** (5-min task above).
4. **Decide on metonym.app strategy** — redirect or duplicate hosting (recommend redirect).
5. **Optional: Patent application number** — currently the site says "US Provisional Application filed May 2026" without the number 64/059,837. Standard practice varies on whether to list the number publicly. Easy add if you decide yes.

---

## Questions or revisions?

Edit the files locally, or ask for specific revisions. Everything is intentionally simple — no build tools, no frameworks. Just HTML and CSS that any future-you (or developer-you-hire) can edit.

# Cloudflare Setup Walkthrough — metonym.health

**Goal:** Put Cloudflare's free edge layer in front of GitHub Pages so metonym.health gets longer cache TTLs, security headers (HSTS, X-Content-Type-Options, etc.), DDoS protection, and a real CDN — without changing where the site is published.

**Time required:** ~20 minutes of clicking, plus DNS propagation wait (often minutes, can be up to 24 hours).
**Cost:** Free.
**What changes for visitors:** Nothing visible. Page loads slightly faster, especially for return visitors and visitors outside North America.

---

## Part 1 — Sign up for Cloudflare (~3 minutes)

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up using your `drlauralwalsh@gmail.com` email (or whichever you prefer).
3. Verify your email.
4. When asked to "Add a website," type `metonym.health` and click Continue.
5. Pick the **Free** plan ($0/month). Click Continue.

## Part 2 — Let Cloudflare import your existing DNS (~2 minutes)

Cloudflare will scan your current Porkbun DNS records and display them. You'll see records like:

- `A     @         185.199.108.153` (and three more — GitHub's IPs)
- `CNAME www       Laura3578.github.io`
- maybe a `TXT` record for Google Search Console verification

**Important:** For each record listed, look at the "Proxy status" toggle (the cloud icon).

- **Orange cloud (Proxied)** = Cloudflare's CDN, caching, and security headers apply. **This is what you want for the website records (A and CNAME for the domain).**
- **Grey cloud (DNS only)** = Cloudflare just forwards DNS, no CDN. Use this for email-related records (MX, SPF/DKIM TXT records).

Make sure the GitHub Pages records (the four `A` records and the `www` CNAME) are **orange cloud (Proxied)**.

Make sure any **MX records** (for your Porkbun email forwarding to `laura@metonym.health`) and any **TXT records for SPF/DKIM/DMARC** stay **grey cloud (DNS only)**. Cloudflare's proxy doesn't handle email, so email records must pass through unchanged.

Click Continue.

## Part 3 — Change nameservers at Porkbun (~5 minutes)

Cloudflare will show you **two nameservers**, something like:

- `lola.ns.cloudflare.com`
- `walt.ns.cloudflare.com`

(Yours will be different — those are example names. Copy yours exactly.)

Now, in a new tab:

1. Log into Porkbun: https://porkbun.com/account/login
2. Click on the **metonym.health** domain.
3. Find the **Authoritative Nameservers** section (also called "Nameservers" or "Change Nameservers").
4. **Delete** the existing Porkbun nameservers (they'll be `curitiba.ns.porkbun.com` or similar).
5. **Paste in** the two Cloudflare nameservers you copied. Use only those two; don't keep the old ones.
6. Save.

Go back to Cloudflare and click **Done, check nameservers**.

## Part 4 — Wait for activation (5 minutes to 24 hours)

Cloudflare will email you when activation is complete. You can also check by reloading the Cloudflare dashboard — when it says "Active" next to metonym.health, you're done with the wait. In most cases this takes 5–30 minutes, occasionally up to a few hours.

**During the wait:** The site still works normally. Nothing breaks.

## Part 5 — Configure SSL/TLS (~2 minutes)

Once the site is Active in Cloudflare:

1. In the Cloudflare dashboard, click **metonym.health**.
2. Left sidebar → **SSL/TLS** → **Overview**.
3. Select **Full (strict)**.

   - **Why "Full (strict)" and not "Flexible":** Flexible breaks GitHub Pages with infinite redirects because GitHub force-redirects to HTTPS. Always use Full or Full (strict) with GitHub Pages.
   - **Why "strict" not just "Full":** GitHub Pages provides a valid Let's Encrypt cert for your custom domain, so Cloudflare can verify it. "Full (strict)" gives you the strongest end-to-end protection.

4. Left sidebar → **SSL/TLS** → **Edge Certificates**. Confirm these are ON:
   - **Always Use HTTPS:** ON
   - **HTTP Strict Transport Security (HSTS):** Enable, then set:
     - Max Age: 6 months (180 days) for now — you can move to 12 months once you're confident nothing is breaking
     - Include subdomains: leave OFF for now (turn on later if you don't plan to host non-HTTPS subdomains)
     - Preload: OFF for now
   - **Minimum TLS Version:** TLS 1.2
   - **Opportunistic Encryption:** ON
   - **TLS 1.3:** ON
   - **Automatic HTTPS Rewrites:** ON

## Part 6 — Configure caching (~2 minutes)

This is what fixes the "10-minute cache TTL" Perplexity flagged.

1. Left sidebar → **Caching** → **Configuration**.
2. **Caching Level:** Standard
3. **Browser Cache TTL:** Respect Existing Headers (leave default) — GitHub Pages still sends its 10-minute TTL, but Cloudflare will cache at the edge for longer.
4. Left sidebar → **Caching** → **Cache Rules** → **Create rule**.
5. Create a rule:
   - **Rule name:** Long cache for static assets
   - **When incoming requests match:** URI Path → ends with → `.css` (then click "Add and" and repeat for `.js`, `.svg`, `.webp`, `.png`, `.woff2`)
   - **Then take action:** Eligible for cache: Yes; Edge TTL: 1 month
6. Save.

## Part 7 — Add security headers (~5 minutes)

This is the bit GitHub Pages cannot do natively. Cloudflare adds them at the edge.

1. Left sidebar → **Rules** → **Transform Rules** → **Modify Response Header**.
2. Click **Create rule**.
3. **Rule name:** Security headers
4. **When incoming requests match:** Hostname → equals → `metonym.health`
5. **Then modify response header:** Click **+ Add** and add each of these:

| Action | Header name | Value |
|---|---|---|
| Set | `X-Content-Type-Options` | `nosniff` |
| Set | `X-Frame-Options` | `SAMEORIGIN` |
| Set | `Referrer-Policy` | `strict-origin-when-cross-origin` |
| Set | `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |

6. Click Deploy.

## Part 8 — Verify everything works

1. Wait 5 minutes for changes to propagate.
2. Visit https://metonym.health/ in an Incognito/Private window.
3. Open browser dev tools → Network tab → refresh → click on the document request → look at "Response Headers."
4. You should see:
   - `cf-cache-status: HIT` (or DYNAMIC on first hit, HIT on subsequent)
   - `strict-transport-security: max-age=15552000` (180 days)
   - `x-content-type-options: nosniff`
   - `x-frame-options: SAMEORIGIN`
   - `referrer-policy: strict-origin-when-cross-origin`
   - `permissions-policy: ...`

If you don't want to mess with dev tools, paste `https://metonym.health/` into https://securityheaders.com — it'll give you a grade. You're aiming for A or A+.

## Part 9 — Verify GA4 and GTM still fire

After all the proxying, double-check:

1. Open https://metonym.health/ in a regular window.
2. Open https://analytics.google.com → Realtime → confirm you appear within 30 seconds.
3. Open https://tagmanager.google.com → your container → Preview → enter `https://metonym.health/` → confirm GTM fires.

If either is silent, the Cloudflare "Bot Fight Mode" is the most common culprit — turn it off under **Security → Bots**.

---

## Things to NOT do

- **Don't enable "Auto Minify"** under Speed → Optimization. It can break inline JSON-LD schema and CSS in subtle ways. You already have clean, hand-tuned code.
- **Don't enable Rocket Loader.** It defers and rewrites scripts in ways that occasionally break GTM and GA4.
- **Don't enable "Email Obfuscation."** It rewrites `mailto:` links and can break your contact links.
- **Don't enable HSTS preload yet.** Once you preload, you cannot easily switch HSTS off if you ever need to. Wait 6 months and confirm everything is stable first.

## After it's live — bonus checks

- Test page load speed at https://pagespeed.web.dev/ → enter `https://metonym.health/`. You should see a higher score than before.
- Test security headers at https://securityheaders.com → aim for A+.
- Test SSL/TLS at https://www.ssllabs.com/ssltest/ → aim for A+.

---

**If anything goes wrong** — at any step, you can reset by changing the Porkbun nameservers back to Porkbun's defaults. Cloudflare is non-destructive; it doesn't delete your DNS records.

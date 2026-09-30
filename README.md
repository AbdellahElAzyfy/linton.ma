# linton.ma

Hub site for the LINTON group. It presents the group and links out to the three specialised sites:
[linton-id.com](https://linton-id.com), [linton-cloud.com](https://linton-cloud.com) and
[linton-media.com](https://linton-media.com). Brand rules are in [linton-brand-brief.md](linton-brand-brief.md).

It's a static Next.js 16 site. There is no CMS or database: all copy lives in `dictionaries/fr.json`
and `dictionaries/en.json`, and French is the default locale.

## Run

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /fr or /en
npm run build
npm run sweep      # Playwright screenshots of every page/locale/theme/viewport (needs dev server)
```

## Where things live

| What | Where |
| --- | --- |
| All text (FR/EN) | `dictionaries/*.json` |
| Sister-site domains, suffixes, accents | `lib/lines.js` |
| Site URL, canonical/hreflang helper | `lib/site.js` |
| Pages | `app/[lang]/` (home, `about`, `contact`, `legal`) |
| Locale redirect | `proxy.js` (Next 16's replacement for `middleware.js`) |
| Brand tokens, buttons, eyebrows | `app/globals.css` (shared with linton-id.com) |
| Page section styles | `app/[lang]/Home.module.css` |
| Contact form → email | `components/contact/`, `app/api/contact/route.js`, `lib/notify.js` |

## Contact form

Enquiries are sent by email through SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` in `.env`, see
`.env.example`). Without credentials, they are only written to the server log. Nothing is stored, so
if SMTP is configured and sending fails, the visitor sees an error instead of a false success.

## Deploy

`docker compose -f docker-compose.prod.yml --env-file .env up -d --build`. This runs the app behind
Caddy, which handles HTTPS for linton.ma and www.linton.ma.

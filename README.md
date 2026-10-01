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
npm start           # serves the build through app.js, like cPanel does
npm run pack:cpanel # build + dist/linton-ma-cpanel.zip for cPanel
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

Enquiries are sent by email over SMTP. `SMTP_HOST`, `SMTP_USER` and `SMTP_PASSWORD` are all required
(`SMTP_PORT` defaults to 465); see `.env.example`. Without them, enquiries are only written to the
server log. Nothing is stored, so if SMTP is configured and sending fails, the visitor sees an error
instead of a false success.

## Deploy

Production runs on cPanel (Setup Node.js App / Passenger) through `app.js`. `npm run pack:cpanel`
builds the site and writes `dist/linton-ma-cpanel.zip`; the full procedure is in
[DEPLOY.md](DEPLOY.md). The Docker/Caddy files are an alternative for a plain VPS.

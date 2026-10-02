# linton.ma

Hub site for the LINTON group. It presents the group and links out to the three specialised sites:
[linton-id.com](https://linton-id.com), [linton-cloud.com](https://linton-cloud.com) and
[linton-media.com](https://linton-media.com). Brand rules are in [linton-brand-brief.md](linton-brand-brief.md).

Next.js 16 + [Payload 3](https://payloadcms.com) on MongoDB. All content is edited in the admin at
`/admin`, in French (default) and English; the admin has its own **Documentation** page for
editors.

## Run

`.env` needs `DATABASE_URI` and `PAYLOAD_SECRET` (see `.env.example`).

```bash
npm install
npm run dev        # http://localhost:3000 → /fr or /en; admin at /admin
npm run seed       # one-time: import the original content into an empty database
npm run build
npm start           # serves the build through app.cjs, like cPanel does
npm run pack:cpanel # build + dist/linton-ma-cpanel.zip for cPanel
npm run sweep      # Playwright screenshots of every page/locale/theme/viewport (needs dev server)
npm run generate:importmap  # after adding/renaming a custom admin component
```

## Where things live

| What | Where |
| --- | --- |
| Payload config | `payload.config.ts` |
| Pages (block builder) | `collections/Pages.ts`, blocks in `collections/blocks/` |
| Navigation, business lines, site settings | `globals/` |
| Contact messages, uploads, admin users | `collections/Submissions.ts`, `Media.ts`, `Users.ts` |
| Block → component mapping | `lib/blocks.jsx` (components in `components/home/`, `components/blocks/`) |
| Reading content on the site | `lib/content.js` |
| Refreshing cached pages after an admin save | `lib/revalidate.ts` |
| Every page of the site | `app/(frontend)/[lang]/[[...slug]]/page.js` |
| Admin and REST API (Payload) | `app/(payload)/` |
| Admin documentation | `components/admin/DocumentationBody.tsx` |
| Interface labels (aria, theme, 404) | `dictionaries/*.json` |
| Original content, for `npm run seed` | `scripts/seed/*.json`, `scripts/seed.ts` |
| Sister-site domains, suffixes, accents | `lib/lines.js` |
| Site URL, canonical/hreflang helper | `lib/site.js` |
| Locale redirect | `proxy.js` (Next 16's replacement for `middleware.js`) |
| Brand tokens, buttons, eyebrows | `app/globals.css` (shared with linton-id.com) |
| Section styles | `app/(frontend)/[lang]/Home.module.css` |

## Content and caching

Pages are prerendered at build time from the database and served from cache. Saving anything in the
admin refreshes the cached pages (`revalidatePath` in the Payload hooks), and every page is re-checked
at most every 10 minutes as a safety net. Pages published after a deploy render on their first visit.

## Contact form

Each message is saved in the admin (**Messages**) and e-mailed over SMTP. `SMTP_HOST`, `SMTP_USER`
and `SMTP_PASSWORD` are all required for e-mail (`SMTP_PORT` defaults to 465). The visitor only sees
an error if the message could be neither saved nor sent.

## Deploy

Production runs on cPanel (Setup Node.js App / Passenger) through `app.cjs`. `npm run pack:cpanel`
builds the site and writes `dist/linton-ma-cpanel.zip`; the full procedure is in
[DEPLOY.md](DEPLOY.md). The Docker/Caddy files are an alternative for a plain VPS.

# Deploying linton.ma on cPanel

cPanel runs Node apps through **Setup Node.js App** (Phusion Passenger). Passenger loads
[app.cjs](app.cjs), which serves the prebuilt site and the Payload admin at `/admin`. The server never
builds: build here, upload the result.

Content (pages, menus, texts) lives in MongoDB on the VPS and is edited in the admin; it never needs
a redeploy. Redeploy only when the code changes.

## 0. Before the first deploy

- **The database is reachable from cPanel.** The VPS firewall must let the cPanel server's IP connect
  to MongoDB (port 27017). Test from cPanel's Terminal, if it has one:
  `curl -v telnet://VPS_IP:27017` should say "Connected".
- **Content exists in the database.** It was imported once with `npm run seed` (safe to re-run: it
  never overwrites existing content).

## 1. Build the package (on your machine)

`.env` must contain `DATABASE_URI` and `PAYLOAD_SECRET` (see `.env.example`): the build reads the
pages from the database to prerender them.

```bash
npm run pack:cpanel
```

This runs `next build` and writes **`dist/linton-ma-cpanel.zip`**. It contains only
`app.cjs`, `package.json`, `package-lock.json`, `next.config.mjs`, `public/` and `.next/`.

- No `node_modules`: the Node.js Selector creates its own and breaks if the folder already exists.
- No `public/media`: images uploaded in the admin live only on the server, and a deploy must not
  overwrite them.

## 2. Upload

1. **File Manager** → your home directory (`/home/USER`, *not* inside `public_html`) → create a
   folder `linton.ma`.
2. Upload `linton-ma-cpanel.zip` into it and **Extract**. Then delete the zip.
3. Turn on **Settings → Show Hidden Files (dotfiles)** and check that `linton.ma/` contains:
   `.next/`, `public/`, `app.cjs`, `next.config.mjs`, `package.json`, `package-lock.json`, and **no**
   `node_modules`.

## 3. Create the app

**Software → Setup Node.js App → Create Application**

| Field | Value |
| --- | --- |
| Node.js version | **22** (20.9 or newer is required by Next 16; 22 is preferred) |
| Application mode | Production |
| Application root | `linton.ma` |
| Application URL | `linton.ma` |
| Application startup file | `app.cjs` |

Then **Create**.

**Environment variables** (same screen):

| Name | Value |
| --- | --- |
| `DATABASE_URI` | same as in your local `.env` |
| `PAYLOAD_SECRET` | same as in your local `.env` |
| `SMTP_HOST` | your mail server, usually `mail.linton.ma` |
| `SMTP_USER` | the mailbox that sends and receives enquiries |
| `SMTP_PASSWORD` | its password |
| `SMTP_PORT` | `465` (default) or `587` |

Without the three SMTP variables, contact messages are still saved in the admin (Messages) but
nobody gets an e-mail.

Save, click **Run NPM Install** (installs the runtime dependencies: a few minutes, and about 720 MB
of disk), then **Restart**.

## 4. Check it

- `https://linton.ma` redirects to `/fr`; `/en` works; switch language and theme.
- `https://linton.ma/admin` asks to **create the first admin user**: do it right away (until then,
  anyone could). Then read **Documentation** in the admin's menu.
- In the admin, change a text (e.g. Site settings → Footer), save, and reload the site: it shows
  within seconds.
- Send a test message on `/fr/contact`: it appears in Messages, and in the mailbox.
- `https://linton.ma/sitemap.xml` and `/robots.txt` load.
- In **Domains**, enable **Force HTTPS Redirect**. If `www.linton.ma` should work too, add it as a
  second Application URL or redirect it to the bare domain.
- Make sure the domain's document root (`public_html`) has no `index.html`: Apache would serve it
  instead of the app.

## Updating the site (code changes only)

1. `npm run pack:cpanel`, upload the new zip.
2. In `linton.ma/`, **delete the old `.next` folder**, then extract the zip over the rest (stale
   chunks from an older build must not linger). **Never delete `public/media`**: it holds the
   images uploaded in the admin.
3. Only if `package.json` changed: **Run NPM Install**.
4. **Restart** the app.

## If it doesn't start

- Open the app's log from the Setup Node.js App screen (or `stderr.log` in the app root). `app.cjs`
  prints the actual reason and exits, rather than hanging.
- *"Could not find a production build in the '.next' directory"* → `.next` is missing (hidden
  folder skipped during upload/extract).
- *"Cannot find module 'next'"* → **Run NPM Install** wasn't done, or a `node_modules` folder that
  was uploaded is in the way: delete it and run it again.
- *"Failed to load external module mongoose-…"* (or sharp-, pino-) → `.next/external-modules.json`
  is missing: the zip wasn't made with `npm run pack:cpanel`. `app.cjs` uses that file to recreate
  the links under `.next/node_modules` that Next's build needs.
- *"Server selection timed out"* / admin errors while the pages still load → the server can't reach
  MongoDB: check `DATABASE_URI` and the VPS firewall. Already-built pages keep being served from
  cache meanwhile; the admin, the contact form's saving and new pages need the database.
- Node older than 20.9 selected → pick 20 or 22.
- 503 right after a restart can just be the app still starting; give it a minute.

## Notes

- Passenger picks the port itself (`app.cjs` calls `listen()` and Passenger ignores the port), so
  no port configuration is needed anywhere.
- Uploaded images go to `public/media` in the app folder. To keep them outside it, set `MEDIA_DIR`
  to an absolute path (e.g. `/home/USER/linton-media`) and move the existing files there.
- To run the same file locally after a build: `npm run build && npm start`.
- `Dockerfile` / `docker-compose.prod.yml` / `Caddyfile` are an alternative VPS deployment and are
  not used on cPanel.

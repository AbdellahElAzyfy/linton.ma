# Deploying linton.ma on cPanel

cPanel runs Node apps through **Setup Node.js App** (Phusion Passenger). Passenger loads
[app.js](app.js), which serves the prebuilt site. The server never builds: build here, upload the
result.

## 1. Build the package (on your machine)

```bash
npm run pack:cpanel
```

This runs `next build` and writes **`dist/linton-ma-cpanel.zip`**. It contains only
`app.js`, `package.json`, `package-lock.json`, `next.config.mjs`, `public/` and `.next/`. There is
no `node_modules` in it on purpose: the Node.js Selector creates its own and breaks if the folder
already exists.

## 2. Upload

1. **File Manager** → your home directory (`/home/USER`, *not* inside `public_html`) → create a
   folder `linton.ma`.
2. Upload `linton-ma-cpanel.zip` into it and **Extract**. Then delete the zip.
3. Turn on **Settings → Show Hidden Files (dotfiles)** and check that `linton.ma/` contains:
   `.next/`, `public/`, `app.js`, `next.config.mjs`, `package.json`, `package-lock.json`, and **no**
   `node_modules`.

## 3. Create the app

**Software → Setup Node.js App → Create Application**

| Field | Value |
| --- | --- |
| Node.js version | **22** (20.9 or newer is required by Next 16; 22 is preferred) |
| Application mode | Production |
| Application root | `linton.ma` |
| Application URL | `linton.ma` |
| Application startup file | `app.js` |

Then **Create**.

**Environment variables** (same screen, for the contact form; without all three, enquiries are
only written to the log and nothing is emailed):

| Name | Value |
| --- | --- |
| `SMTP_HOST` | your mail server, usually `mail.linton.ma` |
| `SMTP_USER` | the mailbox that sends and receives enquiries |
| `SMTP_PASSWORD` | its password |
| `SMTP_PORT` | `465` (default) or `587` |

Save, click **Run NPM Install** (installs the runtime dependencies; takes a few minutes), then
**Restart**.

## 4. Check it

- `https://linton.ma` redirects to `/fr`; `/en` works; switch language and theme.
- Send a test message on `/fr/contact` and check the mailbox.
- `https://linton.ma/sitemap.xml` and `/robots.txt` load.
- In **Domains**, enable **Force HTTPS Redirect**. If `www.linton.ma` should work too, add it as a
  second Application URL or redirect it to the bare domain.
- Make sure the domain's document root (`public_html`) has no `index.html`: Apache would serve it
  instead of the app.

## Updating the site

1. `npm run pack:cpanel`, upload the new zip.
2. In `linton.ma/`, **delete the old `.next` folder**, then extract the zip over the rest (stale
   chunks from an older build must not linger).
3. Only if `package.json` changed: **Run NPM Install**.
4. **Restart** the app.

## If it doesn't start

- Open the app's log from the Setup Node.js App screen (or `stderr.log` in the app root). `app.js`
  prints the actual reason and exits, rather than hanging.
- *"Could not find a production build in the '.next' directory"* → `.next` is missing (hidden
  folder skipped during upload/extract).
- *"Cannot find module 'next'"* → **Run NPM Install** wasn't done, or a `node_modules` folder that
  was uploaded is in the way: delete it and run it again.
- Node older than 20.9 selected → pick 20 or 22.
- 503 right after a restart can just be the app still starting; give it a minute.

## Notes

- Passenger picks the port itself (`app.js` calls `listen()` and Passenger ignores the port), so
  no port configuration is needed anywhere.
- To run the same file locally after a build: `npm run build && npm start`.
- `Dockerfile` / `docker-compose.prod.yml` / `Caddyfile` are an alternative VPS deployment and are
  not used on cPanel.

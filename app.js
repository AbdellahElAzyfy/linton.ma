// cPanel / Phusion Passenger entry point.
// cPanel → Setup Node.js App → "Application startup file": app.js
//
// Passenger doesn't run `npm start` or `next start`: it loads this file and
// waits for it to call listen() on an http.Server, then swaps that server onto
// its own Unix socket ("reverse port binding"). So the port passed to
// listen() has no effect under Passenger, and it must not be a fixed one like
// 3000, which some hosts report as a 503. Port 0 (any free port) is used
// unless PORT is set, which is only for running this file by hand:
//   PORT=3000 node app.js
//
// Sources: phusionpassenger.com/library/indepth/nodejs/reverse_port_binding.html
//          docs.cpanel.net/knowledge-base/web-services/how-to-install-a-node.js-application/
//
// Plain CommonJS on purpose (no "type": "module" in package.json): Passenger
// loads the startup file with require(), and this file isn't compiled by Next.

// Passenger doesn't reliably set NODE_ENV, and this file only ever serves the
// prebuilt site (`next build` output in ./.next), so production is forced.
process.env.NODE_ENV = "production";

const { createServer } = require("http");
const next = require("next");

const port = Number(process.env.PORT) || 0;

const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

// Passenger's log view shows a bare stack trace otherwise; also make sure a
// crash exits, so Passenger restarts the app instead of routing to a zombie.
process.on("unhandledRejection", (err) => {
  console.error("[app.js] unhandledRejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("[app.js] uncaughtException:", err);
  process.exit(1);
});

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      handle(req, res).catch((err) => {
        console.error("[app.js] request failed:", req.method, req.url, err);
        if (!res.headersSent) res.statusCode = 500;
        res.end("Internal Server Error");
      });
    });

    server.listen(port, () => {
      const address = server.address();
      console.log(`> Ready (production) on ${typeof address === "string" ? address : `port ${address.port}`}`);
    });
  })
  .catch((err) => {
    // Without a listen() call Passenger would just wait out its startup
    // timeout with no explanation — fail fast with the real reason instead.
    console.error("[app.js] Next.js failed to start (is ./.next present and up to date?):", err);
    process.exit(1);
  });

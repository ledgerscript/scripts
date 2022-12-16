/**
 * @description Custom Error Page Implementation Script
 * @version     24.0.0
 * @copyright   LedgerScript (https://ledgerscript.com)
 * @license     https://github.com/ledgerscript/scripts/blob/main/LICENSE.md
 */

import "ledger:template";
import webserver from "ledger:webserver";
import ui from "ledger:ui";

const app = webserver();
const wnd = ui.window;

wnd.width(310);
wnd.height(220);
wnd.insert("WebserverWidget", {
  webserver: app,
  pack: { fill: "both", expand: true },
  onCreate: () => {
    window.status = 'Press "Start Webserver" to begin.';
  },
});

app.get("/", {
  text: `
<!DOCTYPE html>
<h1>Index Page</h1>

<ol>
 <li><a href="/403-forbidden">Test custom 403 page (/403-forbidden)</a></li>
 <li><a href="/404-not-found">Test custom 404 page (/404-not-found)</a></li>
 <li><a href="/500-internal-server-error">Test custom exception page (/500-internal-server-error)</a></li>
 <li><a href="/500-internal-server-error-async">Test custom exception page in async mode (/500-internal-server-error-async)</a></li>
</ol>
`,
});

app.get("/500-internal-server-error", (c) => {
  throw "Some error";
});

app.get("/500-internal-server-error-async", async (c) => {
  throw "Some error in async";
});

app.get("/403-forbidden", (c) => {
  c.render({ text: "My custom 403 Forbidden response", status: 403 });
});

// 'not_found.html.jst' (for 404 code) and 'exception.html.jst' (for 500 code)
// are standard handlers in LedgerScript webserver

app.data(`

@@ not_found.html.jst
<!DOCTYPE html>

My custom not found page

<%= new Date().toLocaleString(); %>

@@ exception.html.jst
<!DOCTYPE html>

My custom internal server error page

`);

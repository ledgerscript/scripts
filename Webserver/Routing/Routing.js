/**
 * @description Web Server Routing Demonstration
 * @version     24.0.0
 * @copyright   LedgerScript (https://ledgerscript.com)
 * @license     https://github.com/ledgerscript/scripts/blob/main/LICENSE.md
 */

// Import necessary modules
import "ledger:template";
import webserver from "ledger:webserver";
import ui from "ledger:ui";

// Initialize webserver and UI window
const app = webserver();
const wnd = ui.window;

// Set window dimensions
wnd.width(310);
wnd.height(220);

// Insert 'WebserverWidget' into the UI window
// On creation, set the window status to guide user
wnd.insert("WebserverWidget", {
  webserver: app,
  pack: { fill: "both", expand: true },
  onCreate: () => {
    window.status = 'Press "Start Webserver" to begin.';
  },
});

// Define HTTP GET routes

// This route returns a plain text "Hello World!"
app.get("/text/hello-world", {
  text: "Hello World! (in plain text)",
  format: "txt",
});

// This route returns an HTML-formatted "Hello World!"
app.get("/html/hello-world", {
  text: "Hello World! (in HTML)",
  format: "html",
});

// This route returns a string of octets in plain text format
app.get("/text/octets", { data: "Octets \x01\x02\x03", format: "txt" });

// This route returns a sample list of users in CSV format
app.get("/csv/sample-users", {
  data: `Username; Identifier
booker20;1001
johnson22;1002
jenkins10;1003
smith12;1003
`,
  format: "csv",
});

// This route returns a templated string with a parameter
app.get("/templated/hello-world", {
  inline: "Hello World! Param is <%= param1 %>!",
  param1: "abc",
});

// This route returns a templated string where a parameter
// is added during the request handling
app.get(
  "/templated/hello-world-2",
  { inline: "Hello World! Param is <%= param1 %>!" },
  (c) => {
    c.stash("param1", "foo");
  }
);

// This route returns a templated string with a dynamic parameter derived
// from the request path
app.get("/templated/:name", { inline: "Hello World! Param is <%= name %>!" });

// This route returns a delayed response using async and delay function
app.get("/async/delay", async (c) => {
  await delay(250);
  c.render({ text: "Hello World! Rendered after 250ms using delay()" });
});

// This route returns a delayed response using setTimeout function
app.get("/async/setTimeout", (c) => {
  setTimeout(() => {
    c.render({ text: "Rendered after 250ms using setTimeout()" });
  }, 250);
});

// This route uses the 'html.jst' data section to render the '/' path
app.get("/");

// This route uses the 'templated.html.jst' data section
// to render the '/templated' path
app.get("/templated");

// This route uses the 'templated.html.jst' data section
// to render the '/templated-alias' path
app.get("/templated-alias", "templated");

// This route adds a parameter to the stash before using
// the 'templated.html.jst' data section
// to render the '/templated-alias-with-param' path
app.get(
  "/templated-alias-with-param",
  (c) => {
    c.stash("param1", "bar");
  },
  "templated"
);

// Neither is this route featured in data section nor does it have request
// handling implemented
app.get("/action-is-not-defined");

// Define application data sections

// 'app.data' method is used to store and serve various types of data
// The .html.jst suffix in the data identifiers indicates two things:
//   1. 'html' specifies the Content-Type of the response
//   2. 'jst' indicates that the output is generated dynamically
//      using a template renderer
// If there was only '.html', the content would be served as static HTML
app.data(`

@@ .html.jst
<!DOCTYPE html>
<h1>Index Page</h1>

<h2>Static Files</h2>
<ol>
 <li><a href="/static-html.html">Static HTML Page (/static-html.html)</a></li>
 <li><a href="/static-image.png">Static Image File (/static-image.png)</a></li>
 <li><a href="/static-json.json">Static JSON File (/static-json.json)</a></li>
</ol>

<h2>Text and CSV Files</h2>
<ol>
 <li><a href="/text/hello-world">Plain Text Data: Hello World (/text/hello-world)</a></li>
 <li><a href="/text/octets">Octets Data (10 bytes) (/text/octets)</a></li>
 <li><a href="/csv/sample-users">Sample User Data (CSV Format) (/csv/sample-users)</a></li>
</ol>

<h2>HTML Files</h2>
<ol>
 <li><a href="/html/hello-world">HTML Data: Hello World (/html/hello-world)</a></li>
</ol>

<h2>HTML Templating</h2>
<ol>
 <li><a href="/templated/hello-world">HTML Template: Hello World (with parameters) (/templated/hello-world)</a></li>
 <li><a href="/templated/hello-world-2">HTML Template: Hello World 2 (with parameters) (/templated/hello-world-2)</a></li>
 <li><a href="/templated/SomeName">HTML Template: SomeName (with parameters) (/templated/SomeName)</a></li>
 <li><a href="/templated">Dynamically Generated HTML Template (/templated)</a></li>
 <li><a href="/templated-alias">Dynamically Generated HTML Template (Alias) (/templated-alias)</a></li>
 <li><a href="/templated-alias-with-param">Dynamically Generated HTML Template (Alias with Parameters) (/templated-alias-with-param)</a></li>
</ol>

<h2>Asynchronous HTML</h2>
<ol>
 <li><a href="/async/delay">HTML Page with Delay (/async/delay)</a></li>
 <li><a href="/async/setTimeout">HTML Page with Delay (setTimeout) (/async/setTimeout)</a></li>
</ol>

<h2>Exception</h2>
<ol>
 <li><a href="/action-is-not-defined">Route without action and nothing to render (/action-is-not-defined)</a></li>
</ol>

@@ templated.html.jst
<!DOCTYPE html>
<p>HTML page dynamically generated through template.</p>
% for (let i = 0; i < 5; i++) {
    Step: <%= i %><br>
% }
% if (typeof param1 == 'string') {
    Param is <%= param1 %>
% }

@@ static-html.html
<!DOCTYPE html>
Static HTML page accessed through /static-html.html

@@ static-json.json
{
    "glossary": {
        "title": "example glossary",
    "GlossDiv": {
            "title": "S",
      "GlossList": {
                "GlossEntry": {
                    "ID": "SGML",
          "SortAs": "SGML",
          "GlossTerm": "Standard Generalized Markup Language",
          "Acronym": "SGML",
          "Abbrev": "ISO 8879:1986",
          "GlossDef": {
                        "para": "A meta-markup language, used to create markup languages such as DocBook.",
            "GlossSeeAlso": ["GML", "XML"]
                    },
          "GlossSee": "markup"
                }
            }
        }
    }
}

@@ static-image.png (base64)
iVBORw0KGgoAAAANSUhEUgAAAAQAAAAEAQMAAACTPww9AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9
kT1Iw0AcxV9bpVIqDnZQcchQnSwUFemoVShChVArtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB
8APE1cVJ0UVK/F9SaBHjwXE/3t173L0D/M0qU82eOKBqlpFJJYVcflUIviKIYYSQQFxipj4niml4
jq97+Ph6F+NZ3uf+HP1KwWSATyCeZbphEW8Qz2xaOud94ggrSwrxOfGEQRckfuS67PIb55LDfp4Z
MbKZeeIIsVDqYrmLWdlQiaeJo4qqUb4/57LCeYuzWq2z9j35C8MFbWWZ6zRHkcIiliBCgIw6KqjC
QoxWjRQTGdpPevhHHL9ILplcFTByLKAGFZLjB/+D392axalJNymcBHpfbPtjDAjuAq2GbX8f23br
BAg8A1dax19rAolP0hsdLXoEDGwDF9cdTd4DLneAoSddMiRHCtD0F4vA+xl9Ux4YvAVCa25v7X2c
PgBZ6ip9AxwcAuMlyl73eHdfd2//nmn39wPeZHLSu4HIlAAAAANQTFRFANIuyKKXiAAAAAlwSFlz
AAAuIwAALiMBeKU/dgAAAAd0SU1FB+cHGQo6HGSbQn8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3
aXRoIEdJTVBXgQ4XAAAACklEQVQIHWOAAgAACAABjDe3LwAAAABJRU5ErkJggg==
`);

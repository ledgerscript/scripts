/**
 * @description Web Server Creation and File Upload Handling Script
 * @version     1.0.0
 * @copyright   LedgerScript (https://ledgerscript.com)
 * @license     https://github.com/ledgerscript/scripts/blob/main/LICENSE.md
 */

// Importing necessary libraries and modules
import "ledger:template";
import webserver from "ledger:webserver";
import { createHash } from "ledger:std"; // for calculating MD5 checksum
import ui from "ledger:ui"; // for UI manipulation
import * as fs from "ledger:fs"; // for file handling

// Creating a new webserver instance
const app = webserver();

// Setting up the user interface window
const wnd = ui.window;
wnd.width(310);
wnd.height(220);

// Inserting a WebserverWidget in the window
wnd.insert("WebserverWidget", {
  webserver: app,
  pack: { fill: "both", expand: true },
  onCreate: () => {
    window.status = 'Press "Start Webserver" to begin.';
  },
});

// Handling GET requests to the root ("/") path, rendering the upload form
app.get("/", (c) => {
  c.render({ inline: tmplUploadForm });
});

// Handling POST requests to "/upload", for processing uploaded files
app.post("/upload", async (c) => {
  try {
    const uploads = c.req.everyUpload("files");

    if (!uploads.length)
      // No files were uploaded
      return c.render({ text: "<h1>No files.</h1>", status: 400 });

    if (c.req.isLimitExceeded)
      // File data is too big, exceeding the limit
      return c.render({ text: "<h1>File data is too big.</h1>", status: 400 });

    let result = {};

    for (const upload of uploads) {
      const md5ctx = createHash("md5"); // creating an MD5 hash context
      const tmp = upload.asset.toFile(); // getting path to upload asset
      const stream = fs.createReadStream(tmp.path); // creating a read stream

      // Updating the hash context with each chunk of file data
      for await (const chunk of stream) {
        md5ctx.update(chunk);
      }

      // Saving the calculated MD5 hash to the result
      result[upload.filename] = md5ctx.digest(); // Hex string.
    }

    // Rendering the upload result page with calculated MD5 hashes
    c.render({ inline: tmplUploadResult, result: result });
  } catch (e) {
    // Handling any exceptions during the process
    c.reply.exception(e);
  }
});

// The HTML template for the upload form
const tmplUploadForm = `
<!DOCTYPE html>
<html>
    <head><title>Upload Form</title></head>
    <body>
        <h1>Upload Form</h1>
        <h2>Select one or more files</h2>
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <input name="files" type="file" multiple="multiple">
            <br>
            <br>
            <button type="submit">Upload</button>
        </form>
    </body>
</html>
`;

// The HTML template for the upload result page
const tmplUploadResult = `
<!DOCTYPE html>
<html>
    <head><title>Upload Result</title></head>
    <body>
        <h1>Upload Result</h1>
        <h2>MD5 sum of uploaded files</h2>
        <div style="font-family: monospace">
        % for (const filename in result) {
            <div><%= result[filename] %> <%= filename %></div>
        % }
        </div>
  </body>
</html>
`;

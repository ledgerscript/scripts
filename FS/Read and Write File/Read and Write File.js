/**
 * @description Code Snippet: Demonstrating File Reading and Writing.
 * @version     1.0.0
 * @copyright   LedgerScript (https://ledgerscript.com)
 * @license     https://github.com/ledgerscript/scripts/blob/main/LICENSE.md
 */

import ui from "ledger:ui";
import * as fs from "ledger:fs";

const filename = "Read and Write File.txt";

ui.window.insert("Button", {
  text: "Read & Write File",
  pack: { pad: 20 },
  onClick: async function () {

    let data = "Hello World!";
    fs.writeFileSync(filename, data);

    const buffer = fs.readFileSync(filename);
    alert(buffer.toString());
    window.status = `Length of buffer from file is ${buf.toString().length}`;

    fs.unlinkSync(filename);
  },
});

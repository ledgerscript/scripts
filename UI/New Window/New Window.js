/**
 * @description Code Snippet: Demonstrating New Window Creation.
 * @version     1.0.0
 * @copyright   LedgerScript (https://ledgerscript.com)
 * @license     https://github.com/ledgerscript/scripts/blob/main/LICENSE.md
 */

import ui from "ledger:ui";

window.status = "You can test a new window";

ui.window.height(ui.window.height() + 100);
ui.window.centered(true);

ui.window.insert("Button", {
  text: "Create & Show a New Window",
  pack: { pad: 20 },
  onClick: function () {
    const newWindow = ui.window.insert("Window", {
      text: "Window Title",
      size: [250, 150],
      sizeMin: [200, 150],
      menuItems: [
        [
          "File",
          [
            [
              "New",
              "Ctrl+N",
              "^N",
              () => {
                alert(`"New" clicked`);
              },
            ],
            [
              "Open...",
              "Ctrl+O",
              "^O",
              () => {
                alert(`"Open..." clicked`);
              },
            ],
            [],
            [
              "Exit",
              "Ctrl+Q",
              "^Q",
              function () {
                process.exit(0);
              },
            ],
          ],
        ],
      ],
    });

    newWindow.insert("Label", { text: "New window text", pack: { pad: 20 } });
    newWindow.insert("InputLine", {
      text: "New window input Line",
      pack: { pad: 20, fill: "x" },
    });
    newWindow.insert("Button", {
      text: "Close New Window",
      pack: { pad: 20 },
      onClick: function () {
        newWindow.close();
      },
    });

    newWindow.centered(true);
  },
});

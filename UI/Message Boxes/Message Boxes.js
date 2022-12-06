/**
 * @description Code Snippet: Showcasing Message Box Creation.
 * @version     1.0.0
 * @copyright   LedgerScript (https://ledgerscript.com)
 * @license     https://github.com/ledgerscript/scripts/blob/main/LICENSE.md
 */

import ui from "ledger:ui";

const buttons = {
  "ui.mb.OK": ui.mb.OK,
  "ui.mb.CANCEL": ui.mb.CANCEL,
  "ui.mb.ABORT": ui.mb.ABORT,
};

const icons = {
  "ui.mb.WARNING": ui.mb.WARNING,
  "ui.mb.ERROR": ui.mb.ERROR,
  "ui.mb.INFORMATION": ui.mb.INFORMATION,
  "ui.mb.QUESTION": ui.mb.QUESTION,
};

ui.window.height(500);
ui.window.centered(true);

ui.window.insert("Button", {
  text: "alert(...)",
  pack: { side: "top", expand: true, pad: 15 },
  onClick: function () {
    alert("Ordinary JavaScript alert()");
    window.status = "User closed the alert.";
  },
});

ui.window.insert("Button", {
  text: "confirm(...)",
  pack: { side: "top", expand: true, pad: 15 },
  onClick: function () {
    if (confirm("Ordinary JavaScript confirm()")) {
      window.status = "User made the confirmation.";
    } else {
      window.status = "User didn't make the confirmation.";
    }
  },
});

ui.window.insert("Button", {
  text: "prompt(...)",
  pack: { side: "top", expand: true, pad: 15 },
  onClick: function () {
    const person = prompt("Please enter your name:", "Harry Potter");
    let text;
    if (person == null || person == "") {
      text = "User cancelled the prompt.";
    } else {
      text = "User entered text in the prompt: " + person;
    }
    window.status = text;
  },
});

const widget = ui.window.insert("Widget", {
  pack: { side: "top", fill: "x", expand: false, pad: 15 },
  backColor: 0xf7fbc4,
});

const checkBoxGroup = widget.insert("CheckBoxGroup", {
  text: "Buttons",
  pack: { pad: 20, fill: "both", expand: true, side: "left" },
});

const radioGroup = widget.insert("RadioGroup", {
  text: "Icon",
  pack: { pad: 20, fill: "both", expand: true, side: "left" },
});

for (const btn in buttons) {
  checkBoxGroup.insert("CheckBox", {
    text: btn,
    data: buttons[btn],
    checked: btn == "ui.mb.OK",
    pack: { side: "top", padx: 20, pady: 35, fill: "x" },
    backColor: 0xf7fbc4,
    hiliteBackColor: 0xff9421,
  });
}

for (const ico in icons) {
  radioGroup.insert("Radio", {
    text: ico,
    data: icons[ico],
    checked: ico == "ui.mb.WARNING",
    pack: { side: "top", padx: 20, pady: 25, fill: "x" },
    backColor: 0xf7fbc4,
    hiliteBackColor: 0xff9421,
  });
}

ui.window.insert("Button", {
  text: "ui.message(...)",
  pack: { side: "top", expand: false, pad: 15 },
  onClick: function () {
    let flags = 0;
    checkBoxGroup.each((component) => {
      if (component.checked()) flags |= component.data();
    });
    radioGroup.each((component) => {
      if (component.checked()) flags |= component.data();
    });

    const ret = ui.message("Message Box Text", flags);

    switch (ret) {
      case ui.mb.CANCEL:
        window.status = "User pressed the Cancel button.";
        break;
      case ui.mb.OK:
        window.status = "User pressed the OK button.";
        break;
      case ui.mb.ABORT:
        window.status = "User pressed the Abort button.";
        break;
      default:
        window.status = "User pressed unknown button: " + ret;
    }
  },
});

ui.window.insert("Widget", { pack: {} });

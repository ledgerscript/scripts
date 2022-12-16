/**
 * @description Purchase Order-Invoice Converter: Bidirectional Conversion Tool
 * @version     24.0.0
 * @copyright   LedgerScript (https://ledgerscript.com)
 * @license     https://github.com/ledgerscript/scripts/blob/main/LICENSE.md
 */

import QBD from "ledger:qbd";
import ui from "ledger:ui";

ui.window.height(400);
ui.window.width(590);
ui.window.sizeMin(590, 400);
ui.window.centered(true);

const qbd = new QBD();

ui.window.insert("Widget", { height: 10, pack: { fill: "x" } });

ui.window.insert("Label", {
  text:
    "This script is designed to seamlessly convert Purchase Orders into " +
    "Invoices and facilitate reverse conversions as well." +
    "\r\n\r\n\r\n" +
    "Select Conversion Direction:",
  wordWrap: true,
  autoHeight: true,
  pack: { padx: 20, side: "top", fill: "both", expand: false },
});

ui.window.insert("ComboBox", {
  text: "",
  pack: { padx: 20, side: "top", fill: "both", expand: false },
  style: ui.cs.DROPDOWN,
  readOnly: true,
  autoWidth: true,
  items: ["Purchase Order to Invoice", "Invoice to Purchase Order"],
  onChange: (self) => {
    if (self.text() == "Purchase Order to Invoice") {
      frames.frameSizes(["100%", "*"]);
      frames.visible(true);
      frames.frame(0).data()();
    } else if (self.text() == "Invoice to Purchase Order") {
      frames.frameSizes(["*", "100%"]);
      frames.visible(true);
      frames.frame(1).data()();
    }
  },
});

ui.window.insert("Widget", { height: 20, pack: { fill: "x" } });

const group = ui.window.insert("RadioGroup", {
  pack: { fill: "both", expand: true, side: "top" },
  text: "Convert",
});

const frames = group.insert("FrameSet", {
  pack: { fill: "both", expand: true, side: "top", padx: 5, pady: 50 },
  sliderWidth: 0,
  separatorWidth: 0,
  flexible: false,
  visible: false,
  frameSizes: ["50%", "50%"],
  onSize: (self) => self.frameSizes(self.frameSizes()),
});

Object.defineProperty(String.prototype, "capitalized", {
  enumerable: false,
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
});

function addToFrames(frameId, transactionName, listName, oppTransactionName) {
  let transactionLabel,
    transactionComboBox,
    listLabel,
    listComboBox,
    convertButton,
    transactionPulled,
    listPulled,
    resultLabel;

  function setEnabled(enabled = true) {
    transactionLabel.enabled(enabled);
    transactionComboBox.enabled(enabled);
    listLabel.enabled(enabled);
    listComboBox.enabled(enabled);
    if (
      enabled &&
      transactionComboBox.text().length &&
      listComboBox.text().length
    ) {
      convertButton.enabled(true);
    } else {
      convertButton.enabled(false);
    }
  }

  function parseIdFromText(text) {
    if (!text) return null;
    const id = text.match(/(\S+)$/)?.[0];
    if (!id) throw `Invalid ${transactionName} ID`;
    return id;
  }

  async function transactionOpen() {
    const id = parseIdFromText(transactionComboBox.text());
    if (!id) {
      alert(`Please select ${transactionName} from the list`);
      return;
    }
    if (transactionName == "Purchase Order") {
      await qbd.TxnDisplay.update({
        TxnDisplayModType: "PurchaseOrder",
        TxnID: id,
      });
    } else {
      await qbd.TxnDisplay.update({ TxnDisplayModType: "Invoice", TxnID: id });
    }
  }

  async function transactionReload(force = false) {
    if (!force && transactionComboBox.items().length) return;
    try {
      window.status = [`Getting ${transactionName}s...`];
      setEnabled(false);

      let items = [];
      if (transactionName == "Purchase Order") {
        const cursor = qbd.PurchaseOrder.find().projection(
          "VendorRef",
          "RefNumber",
          "TotalAmount",
          "TxnID"
        );
        for await (const purchaseOrder of cursor) {
          items.push(
            `${purchaseOrder.VendorRef.FullName} / Ref ${
              purchaseOrder.RefNumber
            } / Amount ${purchaseOrder.TotalAmount.toAmountString()} / ID ${
              purchaseOrder.TxnID
            }`
          );
          window.status = [`Found ${items.length} ${transactionName}s...`];
          await delay(1);
        }
      } else {
        const cursor = qbd.Invoice.find().projection(
          "CustomerRef",
          "RefNumber",
          "Subtotal",
          "TxnID"
        );
        for await (const invoice of cursor) {
          items.push(
            `${invoice.CustomerRef.FullName} / Ref ${
              invoice.RefNumber
            } / Amount ${invoice.Subtotal.toAmountString()} / ID ${
              invoice.TxnID
            }`
          );
          window.status = [`Found ${items.length} ${transactionName}s...`];
          await delay(1);
        }
      }

      transactionComboBox.items(items);
      window.status = `Done. ${items.length} ${transactionName} found.`;
    } finally {
      setEnabled(true);
    }
  }

  async function listOpen() {
    const id = parseIdFromText(listComboBox.text());
    if (!id) {
      alert(`Please select ${listName} from the list`);
      return;
    }
    if (listName == "Customer") {
      await qbd.ListDisplay.update({
        ListDisplayModType: "Customer",
        ListID: id,
      });
    } else {
      await qbd.ListDisplay.update({
        ListDisplayModType: "Vendor",
        ListID: id,
      });
    }
  }

  async function listReload(force = false) {
    if (!force && listComboBox.items().length) return;
    try {
      window.status = [`Getting ${listName}s...`];
      setEnabled(false);

      let items = [];
      if (listName == "Customer") {
        const cursor = qbd.Customer.find().projection("FullName", "ListID");
        for await (const customer of cursor) {
          items.push(`${customer.FullName} / ID ${customer.ListID}`);
          window.status = [`Found ${items.length} customers...`];
          await delay(1);
        }
      } else {
        const cursor = qbd.Vendor.find().projection("Name", "ListID");
        for await (const vendor of cursor) {
          items.push(`${vendor.Name} / ID ${vendor.ListID}`);
          window.status = [`Found ${items.length} ${listName}...`];
          await delay(1);
        }
      }

      listComboBox.items(items);
      window.status = `Done. ${items.length} ${listName}s found.`;
    } finally {
      setEnabled(true);
    }
  }

  frames.insertToFrame(frameId, "Widget", { height: 10, pack: { fill: "x" } });

  const defText1 =
    `Select ${transactionName} | ` +
    `L<Reload|Reload List> | L<Open|Open in QuickBooks>`;
  transactionLabel = frames.insertToFrame(frameId, "Label", {
    text: ui.M(defText1),
    pack: { fill: "x", padx: 20, pady: 0 },
    onEnable: (self) => self.text(ui.M(defText1)),
    onDisable: (self) => self.text(ui.M(`Select ${transactionName}`)),
    onLink: (self, linkHandler, link) => {
      if (link.includes("Reload")) {
        transactionReload(true);
      } else {
        transactionOpen();
      }
    },
  });

  transactionComboBox = frames.insertToFrame(frameId, "ComboBox", {
    items: [],
    pack: { fill: "x", padx: 20 },
    style: ui.cs.DROPDOWN,
    readOnly: true,
    autoWidth: true,
    text: "",
    onChange: async (self) => {
      transactionPulled = null;
      resultLabel.visible(false);
      const id = parseIdFromText(self.text());
      if (!id) return;
      try {
        setEnabled(false);
        window.status = [`Loading ${transactionName.toLowerCase()}...`];
        if (transactionName == "Purchase Order") {
          transactionPulled = await qbd.PurchaseOrder.find({
            TxnID: [id],
            IncludeLineItems: true,
          }).one();
        } else {
          transactionPulled = await qbd.Invoice.find({
            TxnID: [id],
            IncludeLineItems: true,
          }).one();
        }
        window.status = `${transactionName.capitalized()} has been loaded.`;
      } finally {
        setEnabled(true);
      }
    },
  });

  frames.insertToFrame(frameId, "Widget", { height: 10, pack: { fill: "x" } });

  const defText2 =
    `Select ${listName} | ` +
    `L<Reload|Reload List> | L<Open|Open in QuickBooks>`;
  listLabel = frames.insertToFrame(frameId, "Label", {
    text: ui.M(defText2),
    pack: { fill: "x", padx: 20 },
    onEnable: (self) => self.text(ui.M(defText2)),
    onDisable: (self) => self.text(ui.M(`Select ${listName}`)),
    onLink: async (widget, linkHandler, link) => {
      if (link.includes("Reload")) {
        listReload(true);
      } else {
        listOpen();
      }
    },
  });

  listComboBox = frames.insertToFrame(frameId, "ComboBox", {
    items: [],
    pack: { fill: "x", padx: 20 },
    style: ui.cs.DROPDOWN,
    readOnly: true,
    autoWidth: true,
    text: "",
    onChange: async (self) => {
      listPulled = null;
      resultLabel.visible(false);
      const id = parseIdFromText(self.text());
      if (!id) return;
      try {
        setEnabled(false);
        window.status = [`Loading ${listName.toLowerCase()}...`];
        if (listName == "Vendor") {
          listPulled = await qbd.Vendor.find({ ListID: [id] }).one();
        } else {
          listPulled = await qbd.Customer.find({ ListID: [id] }).one();
        }
        window.status = `${listName.capitalized()} has been loaded.`;
      } finally {
        setEnabled(true);
      }
    },
  });

  convertButton = frames.insertToFrame(frameId, "Button", {
    pack: { padx: 20, pady: 40 },
    width: 170,
    enabled: false,
    backColor: 0x7ff4a9,
    text: `Convert to ${oppTransactionName}`,
    onClick: async () => {
      if (!listPulled || !transactionPulled) throw "Not all inputs are filled";
      try {
        if (oppTransactionName == "Invoice") {
          const obj = new qbd.Invoice({
            CustomerRef: { ListID: listPulled.ListID },
            InvoiceLineRet: JSON.parse(
              JSON.stringify(transactionPulled.PurchaseOrderLineRet)
            ),
            InvoiceLineGroupRet: JSON.parse(
              JSON.stringify(transactionPulled.PurchaseOrderLineGroupRet)
            ),
          });

          setEnabled(false);
          window.status = ["Adding invoice..."];
          await obj.save();
          resultLabel.text(
            ui.M(`Invoice L<in:${obj.TxnID}|${obj.RefNumber}> has been added.`)
          );
          resultLabel.visible(true);
          window.status = "Invoice has been added.";
        } else {
          let hash = {
            VendorRef: { ListID: listPulled.ListID },
            PurchaseOrderLineRet: JSON.parse(
              JSON.stringify(transactionPulled.InvoiceLineRet)
            ),
            PurchaseOrderLineGroupRet: JSON.parse(
              JSON.stringify(transactionPulled.InvoiceLineGroupRet)
            ),
          };

          hash.PurchaseOrderLineRet?.forEach((element) => {
            element.CustomerRef = transactionPulled.CustomerRef;
          });

          const obj = new qbd.PurchaseOrder(hash);

          setEnabled(false);
          window.status = ["Adding purchase order..."];
          await obj.save();
          resultLabel.text(
            ui.M(`PO L<po:${obj.TxnID}|${obj.RefNumber}> has been added.`)
          );
          resultLabel.visible(true);
          window.status = "Purchase order has been added.";
        }
      } finally {
        setEnabled(true);
      }
    },
  });

  resultLabel = frames.insertToFrame(frameId, "Label", {
    pack: { padx: 20, fill: "both", expand: true },
    visible: false,
    autoHeight: true,
    wordWrap: true,
    font: { style: ui.fs.BOLD },
    onLink: async (widget, linkHandler, link) => {
      if (link.startsWith("in:")) {
        await qbd.TxnDisplay.update({
          TxnDisplayModType: "Invoice",
          TxnID: link.substring(3),
        });
      } else {
        await qbd.TxnDisplay.update({
          TxnDisplayModType: "PurchaseOrder",
          TxnID: link.substring(3),
        });
      }
    },
  });

  frames.frame(frameId).data(() => {
    transactionReload();
    listReload();
  });
}

addToFrames(0, "Purchase Order", "Customer", "Invoice");
addToFrames(1, "Invoice", "Vendor", "Purchase Order");

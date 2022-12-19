# Welcome to LedgerScript samples

<a href="https://ledgerscript.com/">
    <img style="vertical-align: top;" src="https://ledgerscript.com/assets/img/logo/md.png?raw=true" alt="LedgerScript Logo" height="50px">
</a>

## The Repository

This repository contains samples of scripts for LedgerScript, an application and
developer tool that allows JavaScript to work with QuickBooks® Desktop. The code
available here is meant to show what LedgerScript and QuickBooks can do.

![Build succeeded](https://img.shields.io/badge/Build-succeeded-brightgreen.svg)
![Test passing](https://img.shields.io/badge/Tests-passing-brightgreen.svg)

## LedgerScript

<p align="center">
  <img alt="LedgerScript" src="./editor.png?raw=true">
</p>

## Getting Started

To enable JavaScript in QuickBooks for Windows:

1. Download the LedgerScript software, a JavaScript runtime for QuickBooks on
   Windows. Both [free trial and full license](https://ledgerscript.com/register)
   options are available.

   | Parameter        | Minimum requirement          |
   |------------------|------------------------------|
   | Operating System | Windows 11, Windows 10, Windows 8.1, Windows 8, Windows 7, Windows Server 2012 or higher |
   | QuickBooks       | QuickBooks® 2010 or higher   |
   | Processor        | 1Ghz or faster processor     |
   | Memory (RAM)     | 1 GB or more of RAM          |
   | Display          | 800x600 pixels               |
   | Internet         | Internet connection and registration are necessary for required software activation and validation of subscriptions |
   | Prerequisites    | LedgerScript software must be installed on a computer with QuickBooks |

2. Start free trial or purchase a license and evaluate JavaScript with your
QuickBooks® Desktop, Premier, Enterprise (including Pro and Accountant
versions).

You can find more information about our JavaScript support at
<https://ledgerscript.com/contact>. If you're interested in learning more about
a script, you can open it in the LedgerScript application by navigating to
"Script" and selecting "Edit". This provides you with a straightforward
JavaScript editor. To execute the scripts, simply press "Run" in the editor.

## Samples

The sample scripts in the repository are arranged according to the various
releases of LedgerScript application. Each branch in the repository corresponds
to a specific release. Choose the appropriate branch that matches your go-live
version.

Please remember, this repository exclusively contains samples. Therefore,
there's no need to clone this repository.

| Folder       | Description                                                                     |
|--------------|---------------------------------------------------------------------------------|
| [QBD](QBD)   | Contains samples on establishing communication with QuickBooks Desktop.         |
| [UI](UI)     | Contains samples on how to create interactive dialogs and forms. |
| [Webserver](Webserver) | Contains samples on how to run a webserver capable of communicating with QuickBooks Desktop using JSON. |
| [FS](FS)     | Contains samples on how to read and write files.                                |

## Code

There are a few examples of how you can communicate with QuickBooks Desktop
in LedgerScript.

#### Retrieve all customers

```js
import QBD from "ledger:qbd";
const qbd = new QBD();

async function showCustomers() {
  const cursor = qbd.Customer.find();

  for await (const customer of cursor) {
    console.log(customer.FullName + "\n" + customer.ListID);
    console.log(JSON.stringify(customer));
  }
}
```

#### Count all customers

```js

async function countCustomers() {
  const count = await qbd.Customer.count();
  console.log(`Found ${count} customers`);
}
```

#### Add new invoice

```js
async function addNewInvoice() {
  const invoice = new qbd.Invoice({
    CustomerRef: { ListID: "800000B8-1197707458" },
    InvoiceLineRet: [
        {
          ItemRef: {
            FullName: "Concrete Slab",
            ListID: "320000-1071525597"
          },
          Rate: 167.5,
          Quantity: 5,
        }
      ],
    });

  await invoice.save(); // Saved `invoice` obtains all values QBD returned.

  console.log(`Invoice has been added TxnID is ${invoice.TxnID}:\n`
              `Its JSON is ${JSON.stringify(invoice)}`);
}

```

You'll notice that all the complex operations, including managing sessions,
handling XML tags, preparing data types, as well as managing results and errors,
are conveniently handled behind the scenes.

#### You also have the option to launch a webserver

```js
import QBD from "ledger:qbd";
import webserver from 'ledger:webserver';

const app = webserver();
app.listen('http://127.0.0.1:5000');

app.get('/customers/recent', async(ctx) => {

  const array = await qbd.Customer.find({ FromModifiedDate: '2010-01-01',
                                          ToModifiedDate:   '2010-12-31' })
                                  .all();
  ctx.render({ json: array });

});

app.get('/', { inline: `
  <h1>Welcome to the panel</h1>
  <a href="/customers/recent">View QuickBooks Desktop customers in JSON</a>
`});
```

## Disclaimer

Some of our script samples may modify data within your QuickBooks company file,
including creating, deleting, or updating information. Understand the impact of
each sample script before executing it. We recommend running samples using a
non-production or 'sample' company file to avoid unintended changes to your live
data. Sample `.qbw` files can be found within the QuickBooks Desktop application.

## Contribute

All the sample scripts we've shared are open for you to suggest fixes and
enhancements. However, at this time, we are not accepting new scripts from the
community. But don't let that stop you! You can create your own repository and
share your work that way.

## Questions and comments

We highly value your thoughts on the LedgerScript samples. Should you have any
questions or suggestions, feel free to reach out to us at
<https://ledgerscript.com/contact>.

## Trademarks

All product names, logos, and brands are property of their respective owners.
All company, product and service names used in this repository are for
identification purposes only. Use of these names, logos, and brands does not
imply endorsement.

Intuit®, the Intuit® logo, QB®, and QuickBooks® are registered trademarks and/or
registered service marks of Intuit Inc., or its subsidiaries, in the U.S. and/or
other countries.

All other trademarks cited herein are the property of their respective owners.
Subject to change without notice.

## License

Copyright (c) 2023 Online Technologies. All rights reserved.

See [LICENSE](LICENSE.md) for license rights and limitations.

Please note: LedgerScript application and developer tool are separate and not
part of this repository. Usage of LedgerScript tools is restricted to authorized
licensees of our [product](https://ledgerscript.com).

// Payment reconciliation.
//
// Reads payments.jsonl and works out how much money we actually collected.
// Run:  node reconcile.js


//handled error 
//skip events without txn_id
// used a map keyed by txn_id and compares timestmaps so only latest attempt for each transaction is retained 
const fs = require("fs");

function parseAmount(amount) {
  if (typeof amount === "number") {
    return amount;
  }
  if (typeof amount === "string") {
    return parseFloat(amount.replace(/,/g, "").trim());
  }
  return Number(amount);
}


let total = 0;
let count = 0;

const lines = fs.readFileSync("payments.jsonl", "utf8").split("\n").filter((l) => l.length > 0);


const latestTransactions = new Map();

for (const line of lines) {
  let event

  try {
    event = JSON.parse(line);
  } catch {
    continue;
  }

  if (!event || !event.txn_id) {
    continue;
  }

  const existing = latestTransactions.get(event.txn_id);

  if (!existing || new Date(event.ts) > new Date(existing.ts)) {
    latestTransactions.set(event.txn_id, event)
  }

}


//aggregate last attempts 
for (const event of latestTransactions.values()) {
  if (event.status === "success") {
    total += parseAmount(event.amount);
    count += 1;
  }

}

const expected = parseInt(fs.readFileSync("expected.txt", "utf8").trim(), 10);

if (count !== expected) {
  console.log(`Check failed: counted ${count} successful payments, expected ${expected}.`);
  console.log("Something in the data isn't being handled the way the README describes.");
} else {
  console.log(`Check passed: ${count} successful payments.`);
  console.log(`Your code: KOYA-${Math.round(total)}`);
}

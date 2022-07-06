import accounts from "../accounts.json";
import mergeAccounts from "./accounts-merger";

// Pretty print the JSON
const jsonString = JSON.stringify(mergeAccounts(accounts), null, 2);

// Log to console
console.log(jsonString);
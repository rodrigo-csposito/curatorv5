const { sendLogsToDatabases } = require("./helpers/handle-process");

async function main(actionAssistant, payload, results) {
  console.log("INSIDE INSERT");
  return sendLogsToDatabases(actionAssistant, payload, results);
}

module.exports = {
  main,
};

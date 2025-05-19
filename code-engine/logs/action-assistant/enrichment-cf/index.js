const { handleActions } = require("./helpers/handleActions.js");
const { contextVariablesTable } = require("./helpers/handleContext.js");
const { queryNlu } = require("./helpers/nlu.js");

async function main(log, results) {
  console.log("INSIDE ENRICH");

  results.contextTable = contextVariablesTable(log);
  results.actionTable = handleActions(log);

  const nluResponse = await queryNlu(results.logsTable);
  results.logsTable.sentiment = nluResponse;

  return {
    results,
  };
}

module.exports = {
  main,
};

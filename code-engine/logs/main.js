require("dotenv").config({ path: "./.env" });

async function main(params) {
  const actionAssistant = params.payload.environment ? true : false;
  if (actionAssistant) {
    var createTables = require("./action-assistant/create-tables-cf/index");
    var processLogs = require("./action-assistant/process-logs-cf/index");
    var processConversations = require("./action-assistant/process-conversations-cf/index");
    var enrich = require("./action-assistant/enrichment-cf/index");
    var insert = require("./action-assistant/insert-logs-cf/index");
  } else {
    var createTables = require("./dialog-assistant/create-tables-cf/index");
    var processLogs = require("./dialog-assistant/process-logs-cf/index");
    var processConversations = require("./dialog-assistant/process-conversations-cf/index");
    var enrich = require("./dialog-assistant/enrichment-cf/index");
    var insert = require("./dialog-assistant/insert-logs-cf/index");
  }

  await createTables.main(params.payload);
  const processLogsResult = processLogs.main(params.payload);
  const processConversationsResult = await processConversations.main(
    actionAssistant,
    params.payload,
    processLogsResult
  );
  const enrichResult = await enrich.main(
    params.payload,
    processConversationsResult
  );
  await insert.main(actionAssistant, params.payload, enrichResult);

  return {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: enrichResult,
  };
}

/* Comment following lines when uploading to CE */
// const testInput = require("./actionLogExample.json");
// main(testInput);
// const testInput2 = require("./dialogLogExample.json");
// main(testInput2);

module.exports.main = main;

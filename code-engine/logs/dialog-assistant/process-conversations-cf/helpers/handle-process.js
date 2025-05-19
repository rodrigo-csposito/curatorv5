const { connect, endConnection } = require("../database/db2");
const { handleLogs } = require("./process-helpers");

async function processConversations(actionAssistant, payload, results) {
  const conn = await connect(process.env.DB2_CONN_STR);
  const conversationsAndPath = await handleLogs(
    conn,
    actionAssistant
      ? payload.assistant_id.replace(/-/g, "")
      : payload.skill_id.replace(/-/g, ""),
    payload,
    results
  );
  endConnection(conn);
  return conversationsAndPath;
}

module.exports = {
  processConversations,
};

module.exports = {
  processConversations,
};

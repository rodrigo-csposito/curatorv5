const {
  checkIfNew,
  getSettings,
  groupLogsByConversation,
  getMostRecentPathObj,
} = require("../database/db2");
const {
  handleConversations,
  adjustTimestamp,
} = require("./handleConversations");
const { handlePath } = require("./handlePath");

async function handleLogs(conn, schema, log, results) {
  const settings = await getSettings(conn, schema);

  const promiseResults = await Promise.all([
    checkIfNew(
      conn,
      schema,
      `conversationid = '${log.response.context.global.session_id}'`
    ),
    checkIfNew(conn, schema, `iduser = '${log.response?.user_id}'`),
    getMostRecentPathObj(conn, schema),
  ]);

  const existantConversationData = promiseResults[0];
  const existantUserData = promiseResults[1];
  const conversationLogs = await groupLogsByConversation(
    conn,
    schema,
    log.response.context.global.session_id,
    promiseResults[2]?.[0]?.["1"]
      ? adjustTimestamp(promiseResults[2]?.[0]?.["1"])
      : null
  );
  // console.log(
  //   existantConversationData[0]
  //     ? "Found existing conversation records:"
  //     : "No conversation records with this id:",
  //   existantConversationData[0]
  // );
  // console.log(
  //   existantUserData[0]
  //     ? "Found existing user records:"
  //     : "No user records with this id:",
  //   existantUserData[0]
  // );
  // console.log(
  //   conversationLogs[0]
  //     ? "Found existing conversation-logs records:"
  //     : "No conversation-logs records with this id:",
  //   conversationLogs
  // );

  const transferNodes = settings
    .map((settingsRow) => settingsRow.TRANSFERNODES)
    .filter((node) => node);
  const feedbackVar = settings
    .map((settingsRow) => settingsRow.FEEDBACKVAR)
    .filter((node) => node);
  const finalNodes = settings
    .map((settingsRow) => settingsRow.FINALNODES)
    .filter((node) => node);
  const relevantTopics = settings
    .map((settingsRow) => settingsRow.RELEVANTTOPICS)
    .filter((node) => node);

  return {
    conversationTable: handleConversations(
      log,
      existantConversationData[0],
      existantUserData[0],
      {
        transferNodes: transferNodes ?? [],
        feedbackVar: feedbackVar ?? [],
        finalNodes: finalNodes ?? [],
        relevantTopics: relevantTopics ?? [],
      }
    ),
    pathTable: handlePath(results.logsTable, conversationLogs),
  };
}

module.exports = {
  handleLogs,
};

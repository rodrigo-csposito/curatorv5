const {
  insertOnWorkspaceTable,
  connect,
  endConnection,
  checkIfRegisteredOnWorkspaceTable,
} = require("./database/db2");
const { activateExperiment } = require("./helpers/experiment");
const { createTables } = require("./helpers/handle-process");
const { getAssistantCreds } = require("./helpers/workspaceSetup");

async function main(payload) {
  const conn = await connect(process.env.DB2_CONN_STR);
  await createTables(conn, payload.assistant_id.replace(/-/g, ""));

  const registered = await checkIfRegisteredOnWorkspaceTable(
    conn,
    payload.assistant_id
  );

  console.log(
    registered ? "Assistant already registered!" : "Need to register assistant!"
  );

  if (!registered) {
    const creds = await getAssistantCreds(payload.assistant_id);
    await insertOnWorkspaceTable(conn, creds);
    activateExperiment(
      creds.rightInstance.credentials[0].credentials.apikey,
      creds.rightInstance.credentials[0].credentials.url,
      creds.skill.skill_id,
      payload.assistant_id.replace(/-/g, ""),
      creds.skill.assistant_id
    );
  }

  endConnection(conn);
}

module.exports = {
  main,
};

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
  await createTables(conn, payload.skill_id.replace(/-/g, ""));

  const registered = await checkIfRegisteredOnWorkspaceTable(
    conn,
    payload.skill_id
  );

  console.log(
    registered ? "Assistant already registered!" : "Need to register assistant!"
  );

  if (!registered) {
    const creds = await getAssistantCreds(payload.skill_id);
    await insertOnWorkspaceTable(conn, creds);
    activateExperiment(
      creds.rightInstance.credentials[0].credentials.apikey,
      creds.rightInstance.credentials[0].credentials.url,
      creds.skill.workspace_id,
      payload.skill_id.replace(/-/g, "")
    );
  }

  endConnection(conn);
}

module.exports = {
  main,
};

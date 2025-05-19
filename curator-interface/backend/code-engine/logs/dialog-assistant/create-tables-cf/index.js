const {
  insertOnWorkspaceTable,
  connect,
  endConnection,
  checkIfRegisteredOnWorkspaceTable,
} = require("./database/db2");
const { activateExperiment } = require("./helpers/experiment");
const { createTables } = require("./helpers/handle-process");
const { getAssistantCreds } = require("./helpers/workspaceSetup");

async function main(payload, tmpRegistering) {
  const conn = await connect(process.env.DB2_CONN_STR);
  await createTables(conn, payload.skill_id.replace(/-/g, ""));

  const registered = await checkIfRegisteredOnWorkspaceTable(
    conn,
    payload.skill_id
  );

  if (!registered && !tmpRegistering.includes(payload.skill_id)) {
    console.log("Need to register assistant!");
    tmpRegistering.push(payload.skill_id);
    const creds = await getAssistantCreds(payload.skill_id);
    await insertOnWorkspaceTable(conn, creds);
    activateExperiment(
      creds.rightInstance.credentials[0].credentials.apikey,
      creds.rightInstance.credentials[0].credentials.url,
      creds.skill.workspace_id,
      payload.skill_id.replace(/-/g, ""),
      tmpRegistering,
      payload.skill_id
    );
  } else {
    console.log(
      tmpRegistering.includes(payload.skill_id)
        ? "Assistant in registration process!"
        : "Assistant already registered!"
    );
  }

  endConnection(conn);
}

module.exports = {
  main,
};

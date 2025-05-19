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
  await createTables(conn, payload.assistant_id.replace(/-/g, ""));

  const registered = await checkIfRegisteredOnWorkspaceTable(
    conn,
    payload.assistant_id
  );

  if (!registered && !tmpRegistering.includes(payload.assistant_id)) {
    console.log("Need to register assistant!");
    tmpRegistering.push(payload.assistant_id);
    const creds = await getAssistantCreds(payload.assistant_id);
    await insertOnWorkspaceTable(conn, creds);
    activateExperiment(
      creds.rightInstance.credentials[0].credentials.apikey,
      creds.rightInstance.credentials[0].credentials.url,
      creds.skill.skill_id,
      payload.assistant_id.replace(/-/g, ""),
      creds.skill.assistant_id,
      tmpRegistering,
      payload.assistant_id
    );
  } else {
    console.log(
      tmpRegistering.includes(payload.assistant_id)
        ? "Assistant in registration process!"
        : "Assistant already registered!"
    );
  }

  endConnection(conn);
}

module.exports = {
  main,
};

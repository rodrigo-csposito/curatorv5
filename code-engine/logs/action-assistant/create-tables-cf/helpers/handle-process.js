require("dotenv").config({ path: "../../../.env" });

const {
  connect,
  createLogsTable,
  deleteIfOlderThan,
  createConversationsTable,
  createContextVariablesTable,
  createConversationPathTable,
  endConnection,
  createActionsTable,
  createSettingsTable,
  createWorkspaceTable,
} = require("../database/db2");

function createTables(conn, schema) {
  console.log("Using following id as schema:", schema);

  return new Promise(async (resolve, reject) => {
    try {
      let deadlineDate;
      await Promise.all([
        createLogsTable(conn, schema),
        createConversationsTable(conn, schema),
        createContextVariablesTable(conn, schema),
        createConversationPathTable(conn, schema),
        createActionsTable(conn, schema),
        createSettingsTable(conn, schema),
        createWorkspaceTable(conn),
      ]);
      if (process.env.DEADLINE) {
        deadlineDate = generateDate(process.env.DEADLINE);
        await deleteIfOlderThan(conn, schema, deadlineDate);
      }
      resolve({ result: "success" });
    } catch (error) {
      reject(error);
    }
  });
}

function generateDate(deadline) {
  var d = new Date();
  d.setDate(d.getDate() - deadline);
  const formatedDate = d.toISOString().toString().split("T")[0];
  return formatedDate;
}

module.exports = {
  createTables,
};

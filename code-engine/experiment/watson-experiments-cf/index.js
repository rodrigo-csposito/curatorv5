const { runExperiment } = require("./helpers/experiment");
const {
  createTables,
  insertOnDb2,
  returnSqlStrings,
} = require("./helpers/db2");
const { connect, endConnection } = require("./common/database/db2");

function main(params) {
  const { apiKey, url, workspaceId, schema, assistantId } = params;

  return new Promise(async (resolve, reject) => {
    try {
      const conn = await connect(process.env.DB2_CONN_STR);
      await createTables(conn, schema);
      const experimentResults = await runExperiment(
        apiKey,
        url,
        workspaceId,
        assistantId
      );
      await insertOnDb2(conn, schema, returnSqlStrings(experimentResults));
      endConnection(conn);
      resolve(experimentResults);
    } catch (error) {
      console.log(error);
      resolve(error);
    }
  });
}

module.exports = {
  main,
};

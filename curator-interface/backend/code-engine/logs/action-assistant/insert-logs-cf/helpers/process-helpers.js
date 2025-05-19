const {
  connect,
  insert,
  insertOnConversations,
  insertOnPath,
  endConnection,
} = require("../database/db2");
const { uploadItem } = require("../database/cos");

async function insertOnDb2(schema, results) {
  try {
    delete results.logsTable.temp;
    results.logsTable.score = 0;

    const logSql = agregateSql(results.logsTable);
    const conversationSql = agregateSql(results.conversationTable);
    const contextSql = agregateSql(results.contextTable);
    const pathSql = agregateSql(results.pathTable);
    const actionSql = agregateSql(results.actionTable);

    const conn = await connect(process.env.DB2_CONN_STR);
    await Promise.allSettled([
      insert(conn, schema, "LOGS", logSql),
      insertOnConversations(conn, schema, conversationSql),
      insertOnPath(conn, schema, pathSql),
      insert(conn, schema, "CONTEXTVARIABLES", contextSql),
      insert(conn, schema, "ACTIONS", actionSql),
    ]);
    endConnection(conn);
  } catch (error) {
    console.log(error);
  }
}

function agregateSql(objects) {
  if (Array.isArray(objects)) {
    let sqlStrings = [];
    for (let object of objects) {
      sqlStrings.push(createSqlString(object));
    }
    return sqlStrings;
  } else {
    return createSqlString(objects);
  }
}

function createSqlString(params) {
  let values = [];
  Object.entries(params).map(([key, value]) => {
    if (key.includes("Time"))
      values.push(
        `(TIMESTAMP(CAST('${value.date}' AS VARCHAR(10)),'${value.time}'))`
      );
    else values.push(typeof value === "number" ? value : `'${value}'`);
  });
  return `(${values.join(",")})`;
}

async function insertOnCos(result) {
  try {
    var today = new Date();
    const itemName = `result-${result.results.logsTable.logID}-${String(
      today.getDate()
    ).padStart(2, "0")}/${today.getMonth() + 1}/${today.getFullYear()}.json`;

    await uploadItem(
      {
        apiKeyId: process.env.COS_APIKEY,
        bucketName: process.env.COS_BUCKET,
        endpoint: process.env.COS_ENDPOINT,
        serviceInstanceId: process.env.COS_SERVICE_INSTANCE,
      },
      itemName,
      JSON.stringify(result, null, 2)
    );
    return true;
  } catch (error) {
    return error;
  }
}

module.exports = {
  insertOnCos,
  insertOnDb2,
};

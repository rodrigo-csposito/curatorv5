process.env.DB2CODEPAGE = process.env.DB2CODEPAGE || 1208;
var ibmdb = require("ibm_db");

function connect(connStr) {
  return new Promise((resolve, reject) => {
    ibmdb.open(connStr, function (err, conn) {
      if (err) reject(err);
      resolve(conn);
    });
  });
}

function endConnection(conn) {
  conn.close(function () {
    console.log("Db2 connection closed.");
  });
}

function insert(conn, schema, table, sqlString) {
  if (sqlString?.length > 0) {
    var sql = `INSERT INTO "${schema}".${table} VALUES ${sqlString};`;

    conn.query(sql, function (err) {
      if (err) console.log(`ERROR INSERTING ON ${table} TABLE:`, err);
      else {
        console.log(`INSERTED SUCCESSFULLY ON ${table} TABLE!`);
      }
    });
  }
}

async function insertOnPath(conn, schema, sqlString) {
  var sql = `
      MERGE
        INTO "${schema}".CONVERSATIONPATH
        USING(
        VALUES ${sqlString}) AS SOURCE(CONVERSATIONID,ORIGINNODE,DESTINENODE,STARTTIME)
        ON "${schema}".CONVERSATIONPATH.CONVERSATIONID = SOURCE.CONVERSATIONID AND "${schema}".CONVERSATIONPATH.STARTTIME = SOURCE.STARTTIME
      WHEN NOT MATCHED THEN
        INSERT
        VALUES (SOURCE.CONVERSATIONID,SOURCE.ORIGINNODE,SOURCE.DESTINENODE,SOURCE.STARTTIME);`;

  await conn.query(sql, function (err) {
    if (err) console.log(`ERROR INSERTING ON PATH TABLE:`, err);
    else console.log(`INSERTED SUCCESSFULLY ON PATH TABLE!`);
  });
}

async function insertOnConversations(conn, schema, sqlString) {
  var sql = `MERGE
      INTO "${schema}".CONVERSATIONS
      USING(
      VALUES${sqlString}) AS SOURCE(IDUSER,CONVERSATIONID,CHANNEL,STARTTIME,TIMEINTERVAL,FEEDBACK,TRANSFERED,RELEVANCE,NEWUSER)
      ON "${schema}".CONVERSATIONS.CONVERSATIONID= SOURCE.CONVERSATIONID
      WHEN MATCHED THEN
      UPDATE SET 
      TIMEINTERVAL = SOURCE.TIMEINTERVAL,
      FEEDBACK = SOURCE.FEEDBACK,
      TRANSFERED = SOURCE.TRANSFERED,
      RELEVANCE = SOURCE.RELEVANCE
      WHEN NOT MATCHED THEN
      INSERT
      VALUES (SOURCE.IDUSER,SOURCE.CONVERSATIONID,SOURCE.CHANNEL,SOURCE.STARTTIME,SOURCE.TIMEINTERVAL,SOURCE.FEEDBACK,SOURCE.TRANSFERED,SOURCE.RELEVANCE,SOURCE.NEWUSER);`;

  await conn.query(sql, function (err) {
    if (err) console.log(`ERROR INSERTING ON CONVERSATION TABLE:`, err);
    else console.log(`INSERTED SUCCESSFULLY ON CONVERSATION TABLE!`);
  });
}

module.exports = {
  connect,
  insert,
  insertOnPath,
  insertOnConversations,
  endConnection,
};

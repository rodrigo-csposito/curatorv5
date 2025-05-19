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
    console.log("Connection closed.");
  });
}

function checkIfNew(conn, schema, sqlString) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM "${schema}".CONVERSATIONS WHERE ${sqlString};`;

    try {
      conn.query(sql, (err, data) => {
        if (err) throw err;
        return resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getSettings(conn, schema) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM "${schema}".SETTINGS;`;

    try {
      conn.query(sql, (err, data) => {
        if (err) throw err;
        return resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getMostRecentPathObj(conn, schema) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT max(starttime) FROM "${schema}".CONVERSATIONPATH;`;

    try {
      conn.query(sql, (err, data) => {
        if (err) throw err;
        return resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function groupLogsByConversation(conn, schema, id, date) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM "${schema}".LOGS WHERE CONVERSATIONID = '${id}' ${
      date
        ? `AND CLIENTTIMESTAMP > (TIMESTAMP(CAST('${date.date}' AS VARCHAR(10)),'${date.time}'))`
        : ""
    } ORDER BY CLIENTTIMESTAMP ASC;`;

    try {
      conn.query(sql, (err, data) => {
        if (err) throw err;
        return resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  connect,
  checkIfNew,
  getMostRecentPathObj,
  endConnection,
  getSettings,
  groupLogsByConversation,
};

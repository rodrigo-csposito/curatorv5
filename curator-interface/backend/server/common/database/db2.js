process.env.DB2CODEPAGE = process.env.DB2CODEPAGE || 1208;
var ibmdb = require("ibm_db");

function connect(connStr) {
  return new Promise((resolve, reject) => {
    ibmdb.open(connStr.replace(/\"/g, ""), function (err, conn) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(conn);
    });
  });
}

function endConnection(conn) {
  return new Promise((resolve, reject) => {
    try {
      conn.close(function () {
        resolve("Db2 connection closed.");
      });
    } catch (error) {
      reject(error);
    }
  });
}

function updateLogs(conn, schema, newValue, clause) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `update "${schema}".LOGS set ${newValue} where ${clause}`;
      conn.querySync(sql);
      resolve("Updated rows");
    } catch (error) {
      reject(error);
    }
  });
}

function update(conn, table, newValue, clause) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `update CURATOR.${table} set ${newValue} where ${clause}`;
      conn.querySync(sql);
      resolve("Updated rows");
    } catch (error) {
      reject(error);
    }
  });
}

function selectLogs(conn, schema, clause) {
  console.log(clause);

  return new Promise(async (resolve, reject) => {
    var sql = `SELECT * FROM "${schema}".LOGS WHERE ${clause};`;
    try {
      const rows = conn.querySync(sql);
      resolve(Array.from(rows));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function select(conn, table, clause) {
  return new Promise(async (resolve, reject) => {
    var sql = `SELECT * FROM CURATOR.${table} WHERE ${clause};`;
    try {
      const rows = conn.querySync(sql);
      resolve(Array.from(rows));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function insert(conn, table, values) {
  return new Promise(async (resolve, reject) => {
    var sql = `INSERT INTO CURATOR.${table} VALUES (${values});`;
    try {
      const rows = conn.querySync(sql);
      resolve(Array.from(rows));
    } catch (error) {
      reject(error);
    }
  });
}

async function insert2(conn, table, columns, values) {
  return new Promise((resolve, reject) => {
    // Verifique se columns é um array
    if (!Array.isArray(columns)) {
      return reject(new TypeError("`columns` deve ser um array."));
    }

    // Query SQL
    const sql = `INSERT INTO CURATOR.${table} (${columns.join(
      ", "
    )}) VALUES (${values.map(() => "?").join(", ")});`;

    try {
      const stmt = conn.prepareSync(sql);
      stmt.executeSync(values); // Executa usando valores parametrizados
      resolve();
    } catch (error) {
      reject(error); // Captura e rejeita erros
    }
  });
}

function refreshTables(conn, schema) {
  return new Promise((resolve, reject) => {
    try {
      conn.query(
        `
      DELETE FROM "${schema}".OVERVIEW;
      DELETE FROM "${schema}".CLASSDISTRIBUTION;
      DELETE FROM "${schema}".PRECISIONATK;
      DELETE FROM "${schema}".CLASSACCURACY;
      DELETE FROM "${schema}".PAIRWISECLASSERRORS;
      DELETE FROM "${schema}".ACCURACYVSCOVERAGE;
      `,
        (newErr) => {
          if (newErr && (newErr?.sqlcode != 513 || newErr?.sqlcode != -204)) {
            console.log("ERRO 154", newErr);
          }
          resolve("Tables refreshed! Starting from 0.");
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

async function updateCognosURL(conn, SKILL_NAME, COGNOSURL) {
  var sql = `UPDATE CURATOR.WORKSPACES 
             SET COGNOSURL = '${COGNOSURL}'
             WHERE SKILL_NAME = '${SKILL_NAME}';`;

  conn.query(sql, function (err) {
    if (err) console.log(`ERROR UPDATING COGNOSURL:`, err);
    else {
      console.log(`COGNOSURL UPDATED SUCCESSFULLY!`);
    }
  });
}

module.exports = {
  connect,
  endConnection,
  updateLogs,
  update,
  selectLogs,
  select,
  insert,
  refreshTables,
  insert2,
  updateCognosURL,
};

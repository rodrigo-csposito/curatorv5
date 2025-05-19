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

function createLogsTable(conn, schema) {
  return new Promise((resolve, reject) => {
    var sql = `CREATE TABLE IF NOT EXISTS "${schema}".LOGS (idUser VARCHAR(1000)NOT NULL, conversationID VARCHAR(1000) NOT NULL,logID VARCHAR(1000) NOT NULL, clientMessage CLOB(2147483647),clientTimeStamp timestamp,assistantMessage CLOB(2147483647),assistantTimeStamp timestamp,nodeTitle VARCHAR(1000), sentiment FLOAT(10),firstIntent VARCHAR(1000),firstIntentConfidence FLOAT(10),intents VARCHAR(10000),intentsConfidence VARCHAR(10000),entities VARCHAR(1000),error VARCHAR(10000),score INTEGER default null,PRIMARY KEY(logID));`;
    try {
      conn.query(sql, (err) => {
        if (err) {
          if (err.sqlcode === 4136 || err.sqlcode === -601) {
            return resolve("Table already existent!");
          }
          throw err;
        }
        return resolve("Table created!");
      });
    } catch (error) {
      reject(error);
    }
  });
}

function createConversationsTable(conn, schema) {
  return new Promise((resolve, reject) => {
    var sql = `CREATE TABLE IF NOT EXISTS "${schema}".CONVERSATIONS (iduser VARCHAR(1000) NOT NULL,conversationID VARCHAR(1000) NOT NULL,channel VARCHAR(1000),starttime timestamp,timeInterval INTEGER NOT NULL, feedback SMALLINT, transfered BOOLEAN, relevance BOOLEAN,newuser BOOLEAN NOT NULL,PRIMARY KEY(conversationID));`;
    try {
      conn.query(sql, (err) => {
        if (err) {
          if (err.sqlcode === 4136 || err.sqlcode === -601) {
            return resolve("Table already existent!");
          }
          throw err;
        }
        return resolve("Table created!");
      });
    } catch (error) {
      reject(error);
    }
  });
}

function createContextVariablesTable(conn, schema) {
  return new Promise((resolve, reject) => {
    var sql = `CREATE TABLE IF NOT EXISTS "${schema}".CONTEXTVARIABLES (conversationID VARCHAR(1000) NOT NULL,envVariableName VARCHAR(1000) NOT NULL,envVariableValue VARCHAR(1000),envVariableType VARCHAR(1000));`;
    try {
      conn.query(sql, (err) => {
        if (err) {
          if (err.sqlcode === 4136 || err.sqlcode === -601) {
            return resolve("Table already existent!");
          }
          throw err;
        }
        return resolve("Table created!");
      });
    } catch (error) {
      reject(error);
    }
  });
}

function createConversationPathTable(conn, schema) {
  return new Promise((resolve, reject) => {
    var sql = `CREATE TABLE IF NOT EXISTS "${schema}".CONVERSATIONPATH (conversationID VARCHAR(1000) NOT NULL, originNode VARCHAR(1000), destineNode VARCHAR(1000), STARTTIME timestamp);`;
    try {
      conn.query(sql, (err) => {
        if (err) {
          if (err.sqlcode === 4136 || err.sqlcode === -601) {
            return resolve("Table already existent!");
          }
          throw err;
        }
        return resolve("Table created!");
      });
    } catch (error) {
      reject(error);
    }
  });
}

function createActionsTable(conn, schema) {
  return new Promise((resolve, reject) => {
    var sql = `CREATE TABLE IF NOT EXISTS "${schema}".ACTIONS (conversationID VARCHAR(1000) NOT NULL,actionName VARCHAR(1000) NOT NULL,actionType VARCHAR(1000),actionReason VARCHAR(1000),actionStartTime timestamp, actionEvent VARCHAR(1000));`;
    try {
      conn.query(sql, (err) => {
        if (err) {
          if (err.sqlcode === 4136 || err.sqlcode === -601) {
            return resolve("Table already existent!");
          }
          throw err;
        }
        return resolve("Table created!");
      });
    } catch (error) {
      reject(error);
    }
  });
}

function createSettingsTable(conn, schema) {
  return new Promise((resolve, reject) => {
    var sql = `CREATE TABLE IF NOT EXISTS "${schema}".SETTINGS (transferNodes VARCHAR(1000),feedBackVar VARCHAR(1000),finalNodes VARCHAR(1000),relevantTopics VARCHAR(1000));`;
    try {
      conn.query(sql, (err) => {
        if (err) {
          if (err.sqlcode === 4136 || err.sqlcode === -601) {
            return resolve("Table already existent!");
          }
          throw err;
        }
        return resolve("Table created!");
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function createWorkspaceTable(conn) {
  var sql = `create table curator.workspaces (
    workspace_id varchar(500) not null primary key,
    skill_name varchar(500) not null,
    assistant_guid varchar(500) not null,
    assistant_id varchar(500),
    environment_id varchar(500),
    account_id varchar(500) not null,
    ASSISTANTAPIKEY varchar(500) not null,
    ASSISTANTURL varchar(500) not null,
    COGNOSURL VARCHAR(500)  

    );`;

  try {
    conn.query(sql, (err) => {
      if (err) {
        if (err.sqlcode === 4136 || err.sqlcode === -601) {
          console.log("Table already existent!");
        } else {
          throw err;
        }
      } else console.log("Tables created!");
    });
  } catch (error) {
    return error;
  }
}

async function insertOnWorkspaceTable(conn, values) {
  var sql = `INSERT INTO CURATOR.WORKSPACES (
    workspace_id, 
    skill_name, 
    assistant_guid, 
    assistant_id, 
    environment_id, 
    account_id, 
    ASSISTANTAPIKEY, 
    ASSISTANTURL,
    COGNOSURL
  ) VALUES (
    '${values.skill.skill_id}',
    '${values.skill.name}',
    '${values.rightInstance.guid}',
    '${values.skill.assistant_id}',
    '${values.skill.environment_id}',
    '${values.rightInstance.account}',
    '${values.rightInstance.credentials[0].credentials.apikey}',
    '${values.rightInstance.credentials[0].credentials.url}',
    '${values.cognosUrl || null}' -- Adicionado o novo campo
  );`;

  conn.query(sql, function (err) {
    if (err) console.log(`ERROR INSERTING ON WORKSPACE TABLE:`, err);
    else {
      console.log(`INSERTED SUCCESSFULLY ON WORKSPACE TABLE!`);
    }
  });
}

async function updateCognosURL(conn, workspaceId, cognosURL) {
  var sql = `UPDATE CURATOR.WORKSPACES 
             SET COGNOSURL = '${cognosURL}'
             WHERE workspace_id = '${workspaceId}';`;

  conn.query(sql, function (err) {
    if (err) console.log(`ERROR UPDATING COGNOSURL:`, err);
    else {
      console.log(`COGNOSURL UPDATED SUCCESSFULLY!`);
    }
  });
}

async function checkIfRegisteredOnWorkspaceTable(conn, searchId) {
  return new Promise((resolve, reject) => {
    var sql = `select ENVIRONMENT_ID from CURATOR.WORKSPACES WHERE ENVIRONMENT_ID = '${searchId}';`;
    try {
      conn.query(sql, function (err, data) {
        if (err) throw err;
        else {
          if (data?.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function deleteIfOlderThan(conn, schema, date) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE from "${schema}".LOGS WHERE CLIENTTIMESTAMP < '${date}';`;
    conn.query(sql, (err) => {
      if (err) {
        console.log(err);
      }
      resolve("Older lines deleted!");
    });
  });
}

module.exports = {
  connect,
  createLogsTable,
  createConversationsTable,
  createContextVariablesTable,
  createConversationPathTable,
  createActionsTable,
  deleteIfOlderThan,
  createSettingsTable,
  createWorkspaceTable,
  insertOnWorkspaceTable,
  checkIfRegisteredOnWorkspaceTable,
  endConnection,
  updateCognosURL,
};

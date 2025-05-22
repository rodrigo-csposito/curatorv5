require("dotenv").config({ path: "../../.env" });
const {
  selectLogs,
  select,
  updateLogs,
  connect,
  endConnection,
  refreshTables,
  insert,
  insert2,
} = require("../common/database/db2");
const axios = require("axios");

function getConversations({ schema, lastDate, date, intent }) {
  console.log(intent);
  console.log(date);
  console.log(lastDate);

  return new Promise(async (resolve, reject) => {
    try {
      const conn = await connect(process.env.DB2_CONN_STR);
      const rows = await selectLogs(
        conn,
        schema,
        date
          ? `SCORE = 0 ${
              intent ? `and FIRSTINTENT like '%${intent}%'` : ""
            } and CLIENTTIMESTAMP between '${date} 00:00:00.00' and '${date} 23:59:59.99' ORDER BY CLIENTTIMESTAMP DESC FETCH FIRST 100 ROWS ONLY`
          : lastDate
          ? `SCORE = 0 ${
              intent ? `and FIRSTINTENT like '%${intent}%'` : ""
            } and CLIENTTIMESTAMP < '${lastDate}' ORDER BY CLIENTTIMESTAMP DESC FETCH FIRST 100 ROWS ONLY`
          : `SCORE = 0 ${
              intent ? `and FIRSTINTENT like '%${intent}%'` : ""
            } ORDER BY CLIENTTIMESTAMP DESC FETCH FIRST 100 ROWS ONLY`
      );

      if (rows.legnth === 0) {
        resolve(null);
      } else {
        const intents = arrangeConversations(rows);
        endConnection(conn);
        resolve({
          intents: intents,
        });
      }
    } catch (err) {
      console.log(err);
      resolve(null);
    }
  });
}
function arrangeConversations(rows) {
  let arrangedConversations = {};
  for (let row of rows) {
    if (arrangedConversations[row.FIRSTINTENT])
      arrangedConversations[row.FIRSTINTENT].push(row);
    else arrangedConversations[row.FIRSTINTENT] = [row];
  }
  return arrangedConversations;
}
async function updateConversation(conversations, schema) {
  return new Promise(async (resolve, reject) => {
    try {
      const conn = await connect(process.env.DB2_CONN_STR);
      for (let conversation of Object.keys(conversations)) {
        for (let log of conversations[conversation]) {
          if (log.SCORE !== null)
            await updateLogs(
              conn,
              schema,
              `score = ${log.SCORE}`,
              `logId = '${log.LOGID}'`
            );
        }
      }

      endConnection(conn);
      resolve("Conversation updated");
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
const saveAssistant = async (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(400).send({ error: "Name and link are required." });
  }

  try {
    console.log("Connecting to DB2...");
    const conn = await connect(process.env.DB2_CONN_STR);
    console.log("Connected to DB2");

    // Apenas as colunas name e link
    const columns = ["name", "link"];
    const values = [name, link];
    console.log("Inserting values:", values);

    await insert2(conn, "ASSISTANTS", columns, values);
    console.log("Values inserted successfully");

    await endConnection(conn);
    console.log("Connection closed");

    res.status(201).send({ message: "Assistant saved successfully." });
  } catch (error) {
    console.error("Error saving assistant:", error);
    res.status(500).send({ error: "Failed to save assistant." });
  }
};

const getAssistants = async (req, res) => {
  try {
    console.log("Connecting to DB2...");
    const conn = await connect(process.env.DB2_CONN_STR);
    console.log("Connected to DB2");

    const assistants = await select(conn, "ASSISTANTS", "1=1");
    console.log("Assistants fetched successfully");

    await endConnection(conn);
    console.log("Connection closed");

    res.status(200).send(assistants);
  } catch (error) {
    console.error("Error fetching assistants:", error);
    res.status(500).send({ error: "Failed to fetch assistants." });
  }
};

const getAssistantWithWorkspace = async (req, res) => {
  try {
    console.log("Connecting to DB2...");
    const conn = await connect(process.env.DB2_CONN_STR);
    console.log("Connected to DB2");

    // Query para unir WORKSPACES e ASSISTANTS
    const query = `
      SELECT
          w.skill_name,
          COALESCE(a.link, '') AS cognos_link -- retorna link ou vazio se não existir
      FROM
          CURATOR.WORKSPACES w
      LEFT JOIN
          CURATOR.ASSISTANTS a
      ON
          w.skill_name = a.name
    `;

    console.log("Executing query:", query);

    // Executar a query
    const result = await selectLogs(conn, query);
    console.log("Query result:", result);

    await endConnection(conn);
    console.log("Connection closed");

    if (result.length === 0) {
      return res.status(404).send({ error: "No matching data found." });
    }

    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching assistant with workspace:", error);
    res.status(500).send({ error: "Failed to fetch data." });
  }
};

module.exports = {
  getConversations,
  updateConversation,
  arrangeConversations,
  saveAssistant,
  getAssistants,
  getAssistantWithWorkspace,
};

require("dotenv").config();
const ibmdb = require("ibm_db");

const connStr = process.env.DB2_CONN_STR;

async function resetAssistantsTable() {
  try {
    const conn = await ibmdb.open(connStr);

    console.log("🔄 Apagando tabela CURATOR.assistants (se existir)...");
    try {
      await conn.query("DROP TABLE CURATOR.assistants");
      console.log("✅ Tabela CURATOR.assistants foi dropada.");
    } catch (dropErr) {
      if (dropErr.message.includes("SQL0204N")) {
        console.log("ℹ️ Tabela CURATOR.assistants não existia.");
      } else {
        throw dropErr;
      }
    }

    console.log("📦 Criando CURATOR.assistants com colunas esperadas pelo backend...");
    await conn.query(`
      CREATE TABLE CURATOR.assistants (
        name VARCHAR(255),
        link VARCHAR(1024)
      )
    `);

    console.log("✅ Tabela CURATOR.assistants criada com sucesso.");
    conn.close();
  } catch (err) {
    console.error("❌ Erro ao resetar tabela CURATOR.assistants:", err.message || err);
  }
}

resetAssistantsTable();

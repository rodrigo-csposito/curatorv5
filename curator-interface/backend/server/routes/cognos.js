// import dependencies and initialize the express router
const express = require("express");
const router = express.Router();
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
  updateCognosURL,
} = require("../common/database/db2");

const {
  cognosSession,
  initializeDashboardController,
  initializeExperimentsController,
} = require("../useCases/cognos");

// define routes
router.post("/createSession", cognosSession);
router.post("/initializeDashboard", initializeDashboardController);
router.post("/initializeExperiments", initializeExperimentsController);

router.post("/ensureCognosColumn", async (req, res) => {
  const conn = await connect(process.env.DB2_CONN_STR);

  const sql = `
    ALTER TABLE CURATOR.WORKSPACES 
    ADD COLUMN COGNOSURL VARCHAR(500);
  `;

  try {
    // Tenta adicionar a coluna
    await conn.query(sql);
    res
      .status(200)
      .json({ success: true, message: "COGNOSURL column ensured." });
  } catch (error) {
    // Ignora erros de coluna já existente
    if (error.sqlcode === -601 || error.message.includes("already exists")) {
      res
        .status(200)
        .json({ success: true, message: "Column already exists." });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  } finally {
    endConnection(conn);
  }
});

router.post("/update-cognos-url", async (req, res) => {
  const { SKILL_NAME, COGNOSURL } = req.body;

  console.log("Recebido:", { SKILL_NAME, COGNOSURL });

  if (!SKILL_NAME || !COGNOSURL) {
    console.error("Parâmetros ausentes");
    return res
      .status(400)
      .json({ success: false, message: "Missing parameters." });
  }

  const conn = await connect(process.env.DB2_CONN_STR);

  try {
    console.log("Atualizando URL no banco...");
    await updateCognosURL(conn, SKILL_NAME, COGNOSURL);
    console.log("Atualização concluída!");
    res
      .status(200)
      .json({ success: true, message: "COGNOSURL updated successfully." });
  } catch (err) {
    console.error("Erro ao atualizar:", err.message);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    endConnection(conn);
  }
});

module.exports = router;

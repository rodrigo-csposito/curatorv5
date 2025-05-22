// import dependencies and initialize the express router
const express = require("express");
const router = express.Router();
const { saveAssistant } = require("../helpers/db2");
const { getAssistants } = require("../helpers/db2");
const { getAssistantWithWorkspace } = require("../helpers/db2");

const { getLogs, updateScore } = require("../useCases/db2");

// define routes
router.post("/getLogs", getLogs);
router.post("/updateScore", updateScore);
router.post("/saveAssistant", saveAssistant);
router.get("/getAssistants", getAssistants);
router.get("/ibmid/curator/workspaces", async (req, res) => {
  try {
    const conn = await connect(process.env.DB2_CONN_STR);
    const assistants = await select(conn, "CURATOR.assistants", "1=1");
    await endConnection(conn);

    const formatted = assistants.map((a) => ({
      skill_id: a.SKILL_ID,
      skill_name: a.SKILL_NAME,
      link: a.COGNOSURL,
    }));

    res.status(200).send(formatted);
  } catch (err) {
    console.error("Erro ao buscar workspaces:", err);
    res.status(500).send({ error: "Erro ao buscar workspaces" });
  }
});




module.exports = router;

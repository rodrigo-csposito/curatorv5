// import dependencies and initialize the express router
const express = require("express");
const router = express.Router();
const { saveAssistant } = require("../helpers/db2");
const { getAssistants } = require("../helpers/db2");
// const { getAssistantWithWorkspace } = require("../helpers/db2");

const { getLogs, updateScore } = require("../useCases/db2");

// define routes
router.post("/getLogs", getLogs);
router.post("/updateScore", updateScore);
router.post("/saveAssistant", saveAssistant);
router.get("/getAssistants", getAssistants);
// router.get("/ibmid/curator/assistant-workspace", getAssistantWithWorkspace);

module.exports = router;

// import dependencies and initialize the express router
const express = require("express");
const router = express.Router();
require("dotenv").config({ path: "../../.env" });

const log = require("../../code-engine/logs/main");
const experiment = require("../../code-engine/experiment/main");
const { connect } = require("../common/database/db2");

router.post("/log", async (req, res) => {
  const conn = await connect(process.env.DB2_CONN_STR);
  res.send(await log.main({ ...req.body, conn: conn }));
});
router.post("/experiment", async (req, res) => {
  const conn = await connect(process.env.DB2_CONN_STR);
  res.send(await experiment.main({ ...req.body, conn: conn }));
});

module.exports = router;

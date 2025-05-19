// import dependencies and initialize the express router
const express = require("express");
const axios = require("axios");
const router = express.Router();
const experiment = require("../../code-engine/experiment/main");

// define routes
router.post("/", async (req, res) => {
  try {
    const experimentResponse = await experiment.main(req.body);
    // const experimentResponse = await axios.post(
    //   process.env.EXPERIMENT_FUNCTION_URL,
    //   req.body
    // );
    res.send(experimentResponse);
  } catch (err) {
    console.log("Error activating experiment function:", err);
    res.send(null);
  }
});

module.exports = router;

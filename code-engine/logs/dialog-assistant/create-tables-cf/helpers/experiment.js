require("dotenv").config({ path: "../../../.env" });
const axios = require("axios");

async function activateExperiment(apiKey, url, workspaceId, schema) {
  try {
    await axios.post(process.env.EXPERIMENT_FUNCTION_URL, {
      apiKey: apiKey,
      url: url,
      workspaceId: workspaceId,
      schema: schema,
    });
  } catch (err) {
    console.log("Error activating experiment function:", err);
  }
}

module.exports = { activateExperiment };

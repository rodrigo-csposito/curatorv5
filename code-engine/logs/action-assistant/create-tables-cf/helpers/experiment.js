require("dotenv").config({ path: "../../../.env" });
const axios = require("axios");

async function activateExperiment(
  apiKey,
  url,
  workspaceId,
  schema,
  assistantId
) {
  try {
    await axios.post(process.env.EXPERIMENT_FUNCTION_URL, {
      apiKey: apiKey,
      url: url,
      workspaceId: workspaceId,
      schema: schema,
      assistantId: assistantId,
    });
  } catch (err) {
    console.log("Error activating experiment function:", err);
  }
}

module.exports = { activateExperiment };

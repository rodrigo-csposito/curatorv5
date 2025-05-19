require("dotenv").config({ path: "../../../../../.env" });
const axios = require("axios");
const experiment = require("../../../../experiment/main");

async function activateExperiment(
  apiKey,
  url,
  workspaceId,
  schema,
  tmpRegistering,
  id
) {
  try {
    experiment
      .main({
        apiKey: apiKey,
        url: url,
        workspaceId: workspaceId,
        schema: schema,
      })
      .then(() => {
        tmpRegistering = tmpRegistering.filter((ids) => ids != id);
      });
    // await axios.post(process.env.EXPERIMENT_FUNCTION_URL, {
    //   apiKey: apiKey,
    //   url: url,
    //   workspaceId: workspaceId,
    //   schema: schema,
    // });
  } catch (err) {
    console.log("Error activating experiment function.", err);
  }
}

module.exports = { activateExperiment };

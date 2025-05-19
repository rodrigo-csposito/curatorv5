require("dotenv").config({ path: "../../../../../.env" });
const experiment = require("../../../../experiment/main");

async function activateExperiment(
  apiKey,
  url,
  workspaceId,
  schema,
  assistantId,
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
        assistantId: assistantId,
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

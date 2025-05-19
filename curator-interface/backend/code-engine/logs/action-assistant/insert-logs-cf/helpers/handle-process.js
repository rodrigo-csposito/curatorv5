const { insertOnCos, insertOnDb2 } = require("./process-helpers");

async function sendLogsToDatabases(actionAssistant, payload, results) {
  try {
    await Promise.allSettled([
      insertOnCos(results),
      insertOnDb2(
        actionAssistant
          ? payload.assistant_id.replace(/-/g, "")
          : payload.skill_id.replace(/-/g, ""),
        results.results
      ),
    ]).then(() => ({
      result: `DONE ! ! !`,
    }));
  } catch (error) {
    return {
      result: error,
    };
  }
}

module.exports = {
  sendLogsToDatabases,
};

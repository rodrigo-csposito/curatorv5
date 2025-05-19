const { handleLog } = require("./process-helpers");

function processLogs(payload) {
  const logsTable = handleLog(payload);
  return { logsTable };
}

module.exports = {
  processLogs,
};

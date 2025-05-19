const { processLogs } = require("./helpers/handle-process");

function main(payload) {
  console.log("INSIDE PROCESS LOGS");
  const results = processLogs(payload);
  return results;
}

module.exports = {
  main,
};

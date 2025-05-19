const { processLogs } = require("./helpers/handle-process");

function main(payload) {
  const results = processLogs(payload);
  return results;
}

module.exports = {
  main,
};

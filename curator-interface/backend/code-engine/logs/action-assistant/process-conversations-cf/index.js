const { processConversations } = require("./helpers/handle-process");
async function main(actionAssistant, payload, results) {
  console.log("INSIDE PROCESS CONVERSATIONS");
  const conversationsAndPath = await processConversations(
    actionAssistant,
    payload,
    results
  );

  return { ...results, ...conversationsAndPath };
}

module.exports = {
  main,
};

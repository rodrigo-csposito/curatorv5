const { getConversations, updateConversation } = require("../helpers/db2");

async function getLogs(req, res) {
  const { connStr, schema, lastDate, date, intent } = req.body;

  console.log(schema);

  const result = await getConversations({
    schema: schema,
    lastDate: lastDate,
    date: date,
    intent: intent,
  });

  result
    ? res.send({
        intents: result.intents,
      })
    : res.send(null);
}

async function updateScore(req, res) {
  const { conversation, schema } = req.body;

  console.log(schema);

  await updateConversation(conversation, schema);
  res.send({ result: "Conversation Updated" });
}

module.exports = {
  getLogs,
  updateScore,
};

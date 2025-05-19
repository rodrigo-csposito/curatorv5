const fs = require("fs");
const path = require("path");
const { getIntentsAndExamples } = require("./assistant");

const { createFolds } = require("./k-folds");

async function generateTrainingData(client, id, skillJSON) {
  let intents = await getIntentsAndExamples(client, id, [], null);

  if (skillJSON) {
    // Renaming intents with their respective action name for greater clarity.
    // Not mandatory, but helps a ton
    intents.forEach((intentObj) => {
      const foundAction = skillJSON.workspace.actions.find(
        (action) =>
          action.condition?.intent === intentObj.intent ||
          action.condition?.intent?.and?.[0].intent === intentObj.intent ||
          action.condition?.intent?.and?.[1].intent === intentObj.intent
      );
      if (foundAction) {
        intentObj.intent = foundAction.title
          .match(/[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff ]/g)
          .join("")
          .replace(/ /g, "_");
      }
    });
  }

  intents = intents.reduce(
    (examples, intent) => [
      ...examples,
      ...intent.examples.map((e) => ({
        input: { text: e.text },
        class: intent.intent,
      })),
    ],
    []
  );

  // Partitioning data into folds
  const folds = await createFolds(intents, 3);
  return folds;
}

module.exports = { generateTrainingData };

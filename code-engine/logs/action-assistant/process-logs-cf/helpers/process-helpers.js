function handleLog(log) {
  const intents = findIntents(log);
  const confidence = intentsConfidence(log);
  const actionVisited = findActionsVisited(log);

  return {
    idUser: log.response?.user_id ?? "",
    conversationID: log.response.context.global.session_id,
    logID: log.log_id,
    clientMessage: log.request.input?.text
      ? log.request.input.text.replace("'", "")
      : "",
    temp: log.request_timestamp,
    clientTimestamp: adjustTimestamp(log.request_timestamp),
    assistantMessage: findText(log),
    assistantTimestamp: adjustTimestamp(log.response_timestamp),
    action:
      actionVisited.length > 0
        ? actionVisited[0]
          ? actionVisited[0]
          : ""
        : "",
    sentiment: 0,
    firstIntent: intents.length > 0 ? intents[0] : "",
    firstIntentConfidence:
      confidence.length > 0 ? parseFloat(confidence[0]) : 0,
    intents: intents.join(","),
    intentsConfidence: confidence.join(","),
    entities: findEntities(log),
    error: "",
    score: "NULL",
  };
}

function adjustTimestamp(timestamp) {
  const Timestamp = timestamp.split("T");

  const date = Timestamp[0].split("-").reverse().join(".");
  const time = Timestamp[1].split(".")[[0]];

  return { date: date, time: time };
}

function findText(log) {
  return log.response.output.generic
    .filter((genericOutputObj) => {
      return genericOutputObj.response_type === "text";
    })
    .map((genericOutputObj) => {
      return genericOutputObj.text.replace(/'/g, "");
    })
    .join(", ");
}

function findActionsVisited(log) {
  if (!log.response.output.debug?.nodes_visited) {
    var allActions = log.response.output.debug?.turn_events?.map((action) => {
      return action.source.action_title;
    });
  } else {
    var allActions = log.response.output.debug?.nodes_visited?.map((node) => {
      return node.title ?? node.dialog_node;
    });
  }
  const filteredDuplicates = [...new Set(allActions)];
  return filteredDuplicates;
}

function findIntents(log) {
  return log.response.output.intents?.map((intent) => {
    return intent.intent;
  });
}

function intentsConfidence(log) {
  return log.response.output.intents?.map((intent) => {
    return intent.confidence;
  });
}

function findEntities(log) {
  return log.response.output.entities
    ?.map((entity) => {
      return entity.entity;
    })
    .join(" , ");
}

module.exports = {
  handleLog,
};

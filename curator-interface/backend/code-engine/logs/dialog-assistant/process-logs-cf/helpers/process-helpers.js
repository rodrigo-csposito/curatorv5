function handleLog(log) {
  const intents = findIntents(log);
  const confidence = intentsConfidence(log);
  const nodeTitle = findNodesVisited(log)[0];
  return {
    idUser: log.response?.user_id ? log.response?.user_id : "",
    conversationID: log.response.context.global.session_id,
    logID: log.log_id,
    clientMessage:
      log.request.input && log.request.input.text
        ? log.request.input.text.replace(/'/g, "")
        : "",
    temp: log.request_timestamp,
    clientTimestamp: adjustTimestamp(log.request_timestamp),
    assistantMessage: findText(log),
    assistantTimestamp: adjustTimestamp(log.response_timestamp),
    nodeTitle: nodeTitle,
    sentiment: 0,
    firstIntent: intents[0] ? intents[0] : "",
    firstIntentConfidence: confidence[0] ? parseFloat(confidence[0]) : 0,
    intents: intents.join(","),
    intentsConfidence: confidence.join(","),
    entities: findEntities(log),
    error: "",
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

function findNodesVisited(log) {
  let nodesVisited = [];
  if (!log.response.output.debug?.nodes_visited) {
    nodesVisited.push("assistant Suggestion");
  } else {
    for (let nodeDetail of log.response.output.debug?.nodes_visited) {
      if (nodeDetail.title) {
        nodesVisited.push(nodeDetail.title);
      } else {
        nodesVisited.push(nodeDetail.dialog_node);
      }
    }
  }
  return nodesVisited;
}

function findIntents(log) {
  let intents = [];
  for (let intent of log.response.output.intents) {
    intents.push(intent.intent);
  }
  return intents;
}

function intentsConfidence(log) {
  let confidence = [];
  for (let intent of log.response.output.intents) {
    confidence.push(intent.confidence);
  }
  return confidence;
}

function findEntities(log) {
  let entities = [];
  for (let entity of log.response.output.entities) {
    entities.push(entity.entity);
  }
  return entities.join(",");
}

module.exports = {
  handleLog,
};

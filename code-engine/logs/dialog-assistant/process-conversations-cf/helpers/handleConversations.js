const fs = require("fs");

function handleConversations(
  log,
  existantConversationData,
  existantUserData,
  settings
) {
  let startTime =
    !existantConversationData?.STARTTIME ||
    new Date(existantConversationData?.STARTTIME) >
      new Date(log.request_timestamp)
      ? log.request_timestamp
      : existantConversationData?.STARTTIME;
  let finisTime =
    !existantConversationData?.STARTTIME ||
    new Date(existantConversationData?.STARTTIME) <
      new Date(log.request_timestamp)
      ? log.request_timestamp
      : existantConversationData?.STARTTIME;
  const interval = findInterval(startTime, finisTime);

  return {
    idUser: existantConversationData?.IDUSER ?? log.response?.user_id ?? "",
    conversationID:
      existantConversationData?.CONVERSATIONID ??
      log.response.context.global.session_id,
    channel:
      existantConversationData?.CHANNEL ??
      log.request.context.integrations.channel.name,
    startTime: adjustTimestamp(startTime),
    interval: interval,
    feedback:
      existantConversationData?.FEEDBACK &&
      existantConversationData?.FEEDBACK != 0
        ? existantConversationData?.FEEDBACK
        : findFeedBack(log, settings.feedbackVar),
    transfered:
      existantConversationData?.TRANSFERED ??
      checkIfTransfered(log, settings.transferNodes)
        ? 1
        : 0,
    relevance:
      existantConversationData?.RELEVANCE ??
      checkRelevance(log, settings.relevantTopics)
        ? 1
        : 0,
    newUser: existantUserData ? 0 : 1,
  };
}

function adjustTimestamp(timestamp) {
  const Timestamp = timestamp.split(/[T ]/g);

  const date = Timestamp[0].split("-").reverse().join(".");
  const time = Timestamp[1].split(".")[[0]];

  return { date: date, time: time };
}

function findInterval(start, finish) {
  let interval = Math.abs(new Date(finish) - new Date(start));
  let resultingDate = new Date(interval);

  let seconds = resultingDate / 1000;
  return Math.abs(seconds);
}

function findFeedBack(log, feedbackVar) {
  const feedbackTurnEvent =
    log.response.context.skills?.["main skill"]?.user_defined;

  var possibleValues = Object.entries(feedbackTurnEvent).find(([key, value]) =>
    feedbackVar.some((search) => search == key)
  );

  return possibleValues?.[1] ?? 0;
}

function checkIfTransfered(log, transferNodes) {
  const nodes = findeNodesVisited(log);

  for (let node of nodes) {
    var found = Object.entries(node).find(([key, value]) => {
      return transferNodes.some((search) => search == value);
    });
    if (found) break;
  }
  return found ? true : false;
}

function checkRelevance(log, relevantTopics) {
  const nodes = findeNodesVisited(log);
  return nodes.some((node) => {
    return relevantTopics.some((topic) => topic === node.title || node.id);
  });
}

function findeNodesVisited(log) {
  const allActions = log.response.output.debug?.nodes_visited?.map((node) => ({
    title: node?.title,
    id: node?.dialog_node,
  }));
  const filteredDuplicates = [...new Set(allActions)];
  return filteredDuplicates.filter((action) => action);
}

module.exports = {
  handleConversations,
  adjustTimestamp,
};

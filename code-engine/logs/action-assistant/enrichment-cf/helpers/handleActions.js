const fs = require("fs");

function handleActions(log) {
  const actionsVisited = findActionsVisited(log);

  const actionObjects = actionsVisited
    .map((action) => ({
      conversationID: log.response.context.global.session_id,
      action: action.source.action_title,
      type: action.source.type,
      reason: action.reason ? action.reason : "Null",
      actionStartTime: action.action_start_time
        ? adjustTimestamp(action.action_start_time)
        : "",
      event: action.event,
    }))
    .filter((value, index, self) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        self.findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    });

  return actionObjects;
}

function findActionsVisited(log) {
  return log.response.output.debug?.turn_events
    ?.map((action) => {
      return action;
    })
    .filter((action) => action);
}

function adjustTimestamp(timestamp) {
  const Timestamp = timestamp.split("T");

  const date = Timestamp[0].split("-").reverse().join(".");
  const time = Timestamp[1].split(".")[[0]];

  return { date: date, time: time };
}

module.exports = {
  handleActions,
};

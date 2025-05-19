const fs = require("fs");
const { compareAsc } = require("date-fns");

function handlePath(logsTableObj, conversationLogs) {
  conversationLogs.push(logsTableObj);
  const sortedLogs = conversationLogs.sort(sortFunction);

  const pathObjs = sortedLogs.map((log, index) => {
    return {
      conversationID: log.CONVERSATIONID ?? log.conversationID,
      originNode: log.NODETITLE ?? log.action,
      destineNode:
        sortedLogs?.[index + 1]?.NODETITLE ??
        sortedLogs?.[index + 1]?.action ??
        "END",
      logTime: log.CLIENTTIMESTAMP
        ? adjustTimestamp(log.CLIENTTIMESTAMP)
        : adjustTimestamp(log.temp),
    };
  });

  return pathObjs;
}

function sortFunction(a, b) {
  let aTimeStamp;
  let bTimeStamp;

  if (a.temp) {
    aTimeStamp = a.temp.replace(/T/g, " ").replace(/(?<=\.)\d+Z/g, "0");
  } else {
    aTimeStamp = a.CLIENTTIMESTAMP;
  }

  if (b.temp) {
    bTimeStamp = b.temp.replace(/T/g, " ").replace(/(?<=\.)\d+Z/g, "0");
  } else {
    bTimeStamp = b.CLIENTTIMESTAMP;
  }

  const order = [aTimeStamp, bTimeStamp].sort(compareAsc);
  if (order.indexOf(aTimeStamp) < order.indexOf(bTimeStamp)) return -1;
  else return 1;
}

function adjustTimestamp(timestamp) {
  const Timestamp = timestamp.split(/[T ]/g);

  const date = Timestamp[0].split("-").reverse().join(".");
  const time = Timestamp[1].split(".")[[0]];

  return { date: date, time: time };
}

module.exports = {
  handlePath,
};

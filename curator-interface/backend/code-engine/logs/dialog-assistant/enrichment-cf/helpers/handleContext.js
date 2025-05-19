function contextVariablesTable(log) {
  const skillVariables = {
    conversationID: log.response.context.global.session_id,
    variables: log.response.context.skills?.["main skill"]?.user_defined,
  };
  if (skillVariables.variables)
    return Object.entries(skillVariables.variables).map(([key, value]) => ({
      conversationID: log.response.context.global.session_id,
      envVariableName: key,
      envVariableValue: JSON.stringify(value).replace(/'|"/g, ""),
      envVariableType: typeof value,
    }));
  else return [];
}

module.exports = {
  contextVariablesTable,
};

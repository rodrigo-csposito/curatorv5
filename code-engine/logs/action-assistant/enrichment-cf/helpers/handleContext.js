function contextVariablesTable(log) {
  const skillVariables = {
    conversationID: log.response.context.global.session_id,
    variables: log.response.context?.skills["actions skill"]?.skill_variables,
  };

  return Object.entries(skillVariables.variables).map(([key, value]) => ({
    conversationID: log.response.context.global.session_id,
    envVariableName: key,
    envVariableValue: JSON.stringify(value).replace(/'|"/g, ""),
    envVariableType: typeof value,
  }));
}

module.exports = {
  contextVariablesTable,
};

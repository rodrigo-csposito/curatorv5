const {
  getCognosSession,
  initializeDashboard,
  initializeExperiments,
} = require("../helpers/cognos");

async function cognosSession(req, res) {
  res.send(await getCognosSession());
}

function initializeDashboardController(req, res) {
  const { schema, language } = req.body;
  console.log(schema);
  res.send(initializeDashboard(schema, language));
}

function initializeExperimentsController(req, res) {
  const { schema, language } = req.body;
  console.log(schema);
  res.send(initializeExperiments(schema, language));
}

module.exports = {
  cognosSession,
  initializeDashboardController,
  initializeExperimentsController,
};

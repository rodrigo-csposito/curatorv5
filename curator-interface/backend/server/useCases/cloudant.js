const {
  insertOnCloudant,
  getFromCloudant,
  deleteFromCloudant,
  getAllFromCloudant,
} = require("../helpers/cloudant");

async function insertOnCloudantController(req, res) {
  const { public, docId, document } = req.body;

  res.send(await insertOnCloudant(docId, document, public));
}

async function getFromCloudantController(req, res) {
  const { public, docId } = req.body;

  res.send(await getFromCloudant(docId, public));
}

async function deleteFromCloudantController(req, res) {
  const { document, public } = req.body;

  console.log(document);

  res.send(await deleteFromCloudant(document, public));
}

async function getAllFromCloudantController(req, res) {
  res.send(await getAllFromCloudant());
}

module.exports = {
  insertOnCloudantController,
  getFromCloudantController,
  deleteFromCloudantController,
  getAllFromCloudantController,
};

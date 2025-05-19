require("dotenv").config({ path: "../../.env" });
const {
  createCloudantClient,
  createDbAndDoc,
  getDoc,
  getAllDocs,
  deleteDoc,
} = require("../common/database/cloudant");

async function insertOnCloudant(docId, document, public) {
  try {
    const client = createCloudantClient(
      process.env.CLOUDANT_API_KEY,
      process.env.CLOUDANT_URL
    );
    return await createDbAndDoc(client, docId, document, public);
  } catch (err) {
    console.log(err);
    return { Error: "Unnable to connect with suplied credentials" };
  }
}

async function getFromCloudant(docId, public) {
  try {
    const client = createCloudantClient(
      process.env.CLOUDANT_API_KEY,
      process.env.CLOUDANT_URL
    );
    return await getDoc(client, docId, public);
  } catch (err) {
    console.log(err);
    return { Error: "Unnable to connect with suplied credentials" };
  }
}

async function deleteFromCloudant(document, public) {
  try {
    const client = createCloudantClient(
      process.env.CLOUDANT_API_KEY,
      process.env.CLOUDANT_URL
    );
    return await deleteDoc(client, document, public);
  } catch (err) {
    console.log(err);
  }
}

async function getAllFromCloudant() {
  try {
    const client = createCloudantClient(
      process.env.CLOUDANT_API_KEY,
      process.env.CLOUDANT_URL
    );
    return await getAllDocs(client);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  insertOnCloudant,
  getFromCloudant,
  deleteFromCloudant,
  getAllFromCloudant,
};

require("dotenv").config({ path: "../../.env" });

const watsonExperiments = require("./watson-experiments-cf/index");

async function main(params) {
  return await watsonExperiments.main(params);
}

module.exports.main = main;

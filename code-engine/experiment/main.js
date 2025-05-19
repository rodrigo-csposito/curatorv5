require("dotenv").config({ path: "./.env" });

const watsonExperiments = require("./watson-experiments-cf/index");

async function main(params) {
  return {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: { message: "Hello, Code Engine!" },
  };
}

module.exports.main = main;

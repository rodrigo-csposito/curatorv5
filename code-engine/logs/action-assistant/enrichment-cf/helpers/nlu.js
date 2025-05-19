require("dotenv").config({ path: "../../../.env" });

const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

async function queryNlu(logObj) {
  try {
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: process.env.NLU_VERSION,
      authenticator: new IamAuthenticator({
        apikey: process.env.NLU_APIKEY,
      }),
      serviceUrl: process.env.NLU_URL,
    });

    if (logObj.clientMessage) {
      const analyzeParams = {
        text: logObj.clientMessage,
        language: process.env.NLU_LANGUAGE,
        features: {
          sentiment: {
            document: true,
          },
        },
      };

      const nluResponse = await naturalLanguageUnderstanding.analyze(
        analyzeParams
      );

      return nluResponse.result.sentiment.document.score;
    } else return 0;
  } catch (err) {
    console.log("NLU ERROR:", err);
    return 0;
  }
}

module.exports = {
  queryNlu,
};

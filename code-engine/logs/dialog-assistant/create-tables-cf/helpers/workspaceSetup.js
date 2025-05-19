const fs = require("fs");
require("dotenv").config({ path: "../../../.env" });

const ResourceControllerV2 = require("@ibm-cloud/platform-services/resource-controller/v2");
const AssistantV1 = require("ibm-watson/assistant/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const resourceControllerService = ResourceControllerV2.newInstance({
  authenticator: new IamAuthenticator({
    apikey: process.env.IAM_APIKEY,
  }),
});

async function listResources() {
  const allResults = [];
  try {
    const pager = new ResourceControllerV2.ResourceInstancesPager(
      resourceControllerService,
      {
        resourceId: process.env.WATSON_ASSISTANT_RESOURCE_ID,
      }
    );
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      allResults.push(...nextPage);
    }
    return allResults;
  } catch (err) {
    return err;
  }
}

async function getResourceKeys(instanceGuid) {
  const allResults = [];
  try {
    const pager = new ResourceControllerV2.ResourceKeysForInstancePager(
      resourceControllerService,
      {
        id: instanceGuid,
      }
    );
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      allResults.push(...nextPage);
    }
    return allResults;
  } catch (err) {
    console.warn(err);
  }
}

async function listAssistantsV1(assistant) {
  const fullResponse = [];
  return await getNextPage(null, fullResponse);

  async function getNextPage(cursor, fullResponse) {
    const params = {
      cursor,
      pageLimit: 3,
    };
    const res = await assistant.listWorkspaces(params);

    try {
      fullResponse = fullResponse.concat(res.result.workspaces);
      if (res.result.pagination.next_cursor) {
        return await getNextPage(
          res.result.pagination.next_cursor,
          fullResponse
        );
      } else {
        return fullResponse;
      }
    } catch (err) {
      return err;
    }
  }
}

async function getSkill(assistant, workspaceId) {
  const res = await assistant.exportWorkspaceAsync({
    workspaceId: workspaceId,
  });

  if (res.result?.status === "Processing") {
    await sleep(1000);
    return await getSkill(assistant, workspaceId);
  } else {
    return res.result;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAssistantCreds(searchedId) {
  const instances = await listResources();

  const instancesAndCreds = [];
  for (let assistantInstance of instances.filter(
    (instance) =>
      instance.resource_plan_id != process.env.WATSON_ASSISTANT_LITE_PLAN_ID
  )) {
    const credentials = await getResourceKeys(assistantInstance.guid);
    instancesAndCreds.push({
      name: assistantInstance.name,
      guid: assistantInstance.guid,
      credentials: credentials,
      account: assistantInstance.account_id,
    });
  }

  let rightInstance;
  for (let instance of instancesAndCreds) {
    var assistant = new AssistantV1({
      version: "2021-06-14",
      authenticator: new IamAuthenticator({
        apikey: instance.credentials[0].credentials.apikey,
      }),
      serviceUrl: instance.credentials[0].credentials.url,
    });
    const assistants = await listAssistantsV1(assistant);
    var found = assistants.find(
      (assistant) => assistant.workspace_id === searchedId
    );
    if (found) {
      rightInstance = instance;
      break;
    }
  }
  const skill = await getSkill(assistant, found.workspace_id);

  return {
    rightInstance,
    skill,
  };
}

module.exports = { getAssistantCreds };

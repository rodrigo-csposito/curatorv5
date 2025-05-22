import api from "../services/api";

import axios from "axios";

axios.defaults.withCredentials = true; // ✅ garante envio dos cookies

export async function getAvailableWorkspaces() {
  try {
    const res = await api.get("/db2/getAssistants");
    console.log("🚨 Dados crus recebidos do backend:", res.data);

    const mapped = res.data.map((a) => ({
      skill_id: a.SKILL_ID || a.skill_id || "",
      skill_name: a.SKILL_NAME || a.name || a.NAME || "",
      link: a.COGNOSURL || a.LINK || a.link || ""
    }));

    console.log("🔍 Dados mapeados:", mapped);
    return mapped;
  } catch (err) {
    console.error("❌ Erro ao buscar workspaces:", err);
    return [];
  }
}


export async function listAccounts() {
  const res = await api.get("/ibmid/accounts");
  return res.data.resources;
}

export async function queryAllResources(account) {
  try {
    const res = await api.post("/ibmid/curator/resources", {
      account: account,
    });
    console.log("resources", res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getAllKeys(resourceData, setLoading) {
  try {
    const res = await api.post("/ibmid/curator/manage", {
      resources: resourceData,
      metadata: {
        actions: resourceData.actions,
        workspaceId: resourceData.workspace_id,
        assistantId: resourceData.assistant_id,
        environmentId: resourceData.environment_id,
        skill_name: resourceData.skill_name,
        accountId: resourceData.accountId,
        assistantGuid: resourceData.assistant,
        periodicity: resourceData.periodicity,
      },
    });
  } catch (err) {
    alert("Dados inválidos");
  }
}

export async function getAssistants(resourceID) {
  try {
    const res = await api.post("/ibmid/curator/assistants", {
      resource_id: resourceID,
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getAssistantDetails(workspaceId, resourceId) {
  const res = await api.post("/ibmid/curator/workspace", {
    workspaceId: workspaceId,
    resource_id: resourceId,
  });

  return res.data;
}

export async function getCOSBuckets(region, id) {
  console.log(region);
  try {
    const res = await api.post("/ibmid/curator/buckets", {
      region: region,
      id: id,
    });
    console.log(res.data);
    return res.data.Buckets;
  } catch (err) {
    console.log(err);
    return [];
  }
}

import api from "../services/api";

export async function getLogs({ schema, lastDate, date, intent }) {
  const response = await api.post("/db2/getLogs", {
    schema: schema,
    lastDate: lastDate,
    date: date,
    intent: intent,
  });

  if (response.data.intents && Object.keys(response.data.intents).length > 0) {
    return response.data.intents;
  } else {
    return null;
  }
}

export async function sendScore(logs, schema) {
  await api.post("/db2/updateScore", {
    conversation: logs,
    schema: schema,
  });

  let updateRender = [];
  Object.entries(logs).map(([key, value]) => {
    updateRender.push([key, value.filter((obj) => obj.SCORE === null)]);
  });
  updateRender = updateRender.filter(([key, value]) => value.length !== 0);

  return Object.fromEntries(updateRender);
}

export async function addAssistant(name, link) {
  try {
    const response = await api.post("/db2/saveAssistant", { name, link });

    if (response.status === 201) {
      console.log(response.data.message);
      return response.data.message;
    } else {
      throw new Error(response.data.error || "Failed to save assistant.");
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function getAssistants(name, link) {
  try {
    const response = await api.get("/db2/getAssistants");

    // Verifica se a resposta contém dados
    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      // Retorna os name e link dos assistants
      return response.data.map((assistant) => ({
        name: assistant.NAME,
        link: assistant.LINK,
      }));
    } else {
      return []; // Retorna um array vazio caso não haja assistants
    }
  } catch (error) {
    console.error("Error fetching assistants:", error);
    throw error; // Lança o erro para ser tratado externamente
  }
}

export async function findAssistantWithWorkspace(name) {
  try {
    const response = await api.post("/ibmid/curator/assistant-workspace", {
      name,
    });
    return response.data; // Dados relacionados
  } catch (error) {
    console.error("Erro ao buscar dados do workspace:", error);
    return null;
  }
}

export async function updateCognosUrl(workspaceId, cognosURL) {
  try {
    const response = await api.post("/cognos/update-cognos-url", {
      SKILL_NAME: workspaceId,
      COGNOSURL: cognosURL,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar CognosURL:", error);
    throw error;
  }
}

export async function ensureCognosColumn() {
  try {
    const response = await api.post("/cognos/ensureCognosColumn");
    if (response.status === 200) {
      console.log("COGNOSURL column ensured.");
      return true;
    } else {
      throw new Error(response.data.error || "Failed to ensure column.");
    }
  } catch (error) {
    console.error("Error ensuring COGNOSURL column:", error.message);
    throw error;
  }
}

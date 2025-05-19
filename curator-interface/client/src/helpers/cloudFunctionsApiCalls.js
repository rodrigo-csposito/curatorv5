import api from "../services/api";

export async function runExperiment(params) {
  await api.post("/experiment", params);
}

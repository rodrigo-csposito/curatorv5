import api from "../services/api";

export async function getCognosSession(username, password) {
  return await api.post("/cognos/createSession", {
    username: username,
    password: password,
  });
}

// export async function initializeSources(schema, language) {
//   const response = await api.post("/cognos/initializeDashboard", {
//     schema,
//     language: language,
//   });

//   delete response.data._id;
//   delete response.data._rev;

//   return response.data;
// }

// export async function initializeExperiments(schema, language) {
//   const response = await api.post("/cognos/initializeExperiments", {
//     schema,
//     language: language,
//   });

//   delete response.data._id;
//   delete response.data._rev;

//   return response.data;
// }

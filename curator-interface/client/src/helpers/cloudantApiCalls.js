// import api from "../services/api";

// export async function sendToCloudant(dashboardName, cognosDashboard, publicDb) {
//   const response = await api.post("/cloudant/insertDashboard", {
//     docId: dashboardName,
//     document: cognosDashboard,
//     public: publicDb,
//   });
//   if (response.data.Error) {
//     return null;
//   } else {
//     return response.data;
//   }
// }

// export async function getFromCloudant(ID, publicDb) {
//   const response = await api.post("/cloudant/getDashboard", {
//     docId: ID,
//     public: publicDb,
//   });

//   if (response.data.Error) {
//     return null;
//   } else {
//     return response.data;
//   }
// }

// export async function deleteDashboard(dashboard) {
//   const response = await api.post("/cloudant/deleteDashboard", {
//     document: dashboard,
//     public: true,
//   });
//   return response.data;
// }

// export async function getPublicDashbords() {
//   const response = await api.get("/cloudant/publicDashboards");
//   console.log(response.data.rows);
//   return response.data.rows;
// }

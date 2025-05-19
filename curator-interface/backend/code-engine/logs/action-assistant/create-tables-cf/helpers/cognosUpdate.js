// const express = require("express");
// const router = express.Router();
// const {
//   connect,
//   updateCognosURL,
//   endConnection,
// } = require("./../database/db2");

// router.post("/update-cognos-url", async (req, res) => {
//   const { workspace_id, cognos_url } = req.body;

//   if (!workspace_id || !cognos_url) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Missing parameters." });
//   }

//   const conn = await connect(process.env.DB2_CONN_STR);

//   try {
//     await updateCognosURL(conn, workspace_id, cognos_url);
//     res
//       .status(200)
//       .json({ success: true, message: "COGNOSURL updated successfully." });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   } finally {
//     endConnection(conn);
//   }
// });

// module.exports = router;

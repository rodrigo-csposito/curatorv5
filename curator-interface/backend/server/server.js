require("dotenv").config();

// import dependencies and initialize express
const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
const server = http.createServer(app);

const { default: IBMidService } = require("./ibmid-login/lib/index");
const ibmidLogin = new IBMidService();

// enable parsing of http request body
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../build")));

// routes and api calls
app.use("/ibmid", ibmidLogin.expressAdapter);

const codeEngineFunctionRoutes = require("./routes/codeEngineFunction");
app.use("/codeEngineFunction", codeEngineFunctionRoutes);

const db2Routes = require("./routes/db2");
app.use("/db2", db2Routes);

const cognosRoutes = require("./routes/cognos");
app.use("/cognos", cognosRoutes);

const cloudantRoutes = require("./routes/cloudant");
app.use("/cloudant", cloudantRoutes);

const experimentRoutes = require("./routes/experiment");
app.use("/experiment", experimentRoutes);

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));


app.use(express.static(path.join(__dirname, "../../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});



// start node server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App UI available http://localhost:${port}`);
});

module.exports = app;

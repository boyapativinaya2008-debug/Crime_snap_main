const express = require("express");
const cors = require("cors");

const app = express();

/* MIDDLEWARE */

app.use(cors());
app.use(express.json());

/* TEST ROUTE */

app.get("/", (req, res) => {
  res.send("Backend API Running");
});

/* ROUTES */

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/admin", require("./routes/admin.route"));
app.use("/api/complaints", require("./routes/complaint.route"));
app.use("/api/officers", require("./routes/officers.route"));
app.use("/api/locations", require("./routes/adminLocation"));
module.exports = app;
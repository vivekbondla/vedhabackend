const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const vendorRoutes = require("./routes/vendorRoutes");
const clientRoutes = require("./routes/clientRoutes");
const siteRoutes = require("./routes/siteRoutes");
const auditorRoutes = require("./routes/auditorRoutes");
const scheduleAuditRoutes = require("./routes/scheduleAuditRoutes");

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/vendors",vendorRoutes);
app.use("/api/clients",clientRoutes);
app.use("/api/sites",siteRoutes);
app.use("/api/auditors",auditorRoutes);
app.use("/api/audits",scheduleAuditRoutes);
// Connect MongoDB
mongoose
  .connect(
    "mongodb+srv://vedahrsoftware:vedahr@firstcluster.amsjdlc.mongodb.net/vedahr"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

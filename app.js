const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const vendorRoutes = require("./routes/vendorRoutes");
const clientRoutes = require("./routes/clientRoutes");
const siteRoutes = require("./routes/siteRoutes");
const auditorRoutes = require("./routes/auditorRoutes");
const scheduleAuditRoutes = require("./routes/scheduleAuditRoutes");
const userRoutes = require("./routes/userRoutes");
const checklistUploadRoutes = require("./routes/checklistUploadRoutes");
const auditReportRoutes = require("./routes/auditReportRoutes");
const app = express();

//Configure CORS explicitly
app.use(cors({
  origin: "https://vedahr.netlify.app", // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // If you are sending cookies or auth headers
}));
app.use(express.json());
dotenv.config();
app.use("/uploads", express.static("uploads")); 

app.use("/api/users", userRoutes);
app.use("/api/vendors",vendorRoutes);
app.use("/api/clients",clientRoutes);
app.use("/api/sites",siteRoutes);
app.use("/api/auditors",auditorRoutes);
app.use("/api/audits",scheduleAuditRoutes);
app.use("/api/upload",checklistUploadRoutes);
app.use("/api/report",auditReportRoutes)
// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

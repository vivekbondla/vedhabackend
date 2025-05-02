const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const vendorRoutes = require("./routes/vendorRoutes")

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/vendors",vendorRoutes)
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

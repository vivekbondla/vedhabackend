const Auditor = require("../models/AuditorModel");
const getAllAuditors =async (req, res)=>{
    
    try {
      const auditors = await Auditor.find();
      res.status(200).json(auditors);
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ message: "Server error" });
    }

}

exports.getAllAuditors = getAllAuditors;
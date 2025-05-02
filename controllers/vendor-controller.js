const express = require("express");
const Vendor = require("../models/Vendor");

const getAllVendors =async (req, res)=>{
    
      try {
        const vendors = await Vendor.find();
        res.status(200).json(vendors);
      } catch (error) {
        console.log("error:", error);
        res.status(500).json({ message: "Server error" });
      }

}

exports.getAllVendors = getAllVendors;
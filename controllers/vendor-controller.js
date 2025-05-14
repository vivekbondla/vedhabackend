const express = require("express");
const Vendor = require("../models/VendorModel");

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createVendor = async (req, res) => {
  const {
    vendorsName,
    vendorCode,
    contactPerson,
    vendorPhone,
    natureOfWork,
    vendorEmail,
    vendorCity,
    vendorStateLoc,
    vendorAddress,
  } = req.body;

  try {
    const newVendor = new Vendor({
      vendorsName,
      vendorCode,
      contactPerson,
      vendorPhone,
      natureOfWork,
      vendorEmail,
      vendorCity,
      vendorStateLoc,
      vendorAddress,
    })
    const savedVendor = await newVendor.save();
    res.status(201).json(savedVendor)
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ message: "Server error while creating vendor" });
  }
};

exports.getAllVendors = getAllVendors;
exports.createVendor = createVendor;

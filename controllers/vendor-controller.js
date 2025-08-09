const express = require("express");
const Vendor = require("../models/VendorModel");
const User = require("../models/UserModel");

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
    });
    const savedVendor = await newVendor.save();
    const user = await User.create({
      // From request body
      email: req.body.vendorEmail, // or another field
      password: req.body.password, // Will be hashed
      userName: req.body.vendorsName,
      role: "vendor",
      refId: savedVendor._id,
      refModel: "Vendor",
    });
    // res.status(201).json(savedVendor)
    res
      .status(201)
      .json({ message: "Vendor and user created", savedVendor, user });
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ message: "Server error while creating vendor" });
  }
};

const updateVendor = async (req, res) => {
  const vendorId = req.params.id;
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
    const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, {
      vendorsName,
      vendorCode,
      contactPerson,
      vendorPhone,
      natureOfWork,
      vendorEmail,
      vendorCity,
      vendorStateLoc,
      vendorAddress,
    });

    await User.findOneAndUpdate(
      { refId: vendorId, role: "vendor" },
      {
        email: vendorEmail,
        userName: vendorsName,
      }
    );

    res
      .status(200)
      .json({ message: "Vendor updated successfully", updatedVendor });
  } catch (error) {
    console.error("Error updating Auditor:", error);
    res.status(500).json({ message: "Server error while updating auditor" });
  }
};

const deleteVendor = async (req, res) => {
  const vendorId = req.params.id;

  try {
    await Vendor.findByIdAndDelete(vendorId);

    await User.findOneAndDelete({ refId: vendorId, role: "vendor" });

    res.status(200).json({ message: "Vendor and user deleted successfully" });
  } catch (error) {
    console.error("Error deleting Vendor:", error);
    res.status(500).json({ message: "Server error while deleting Vendor" });
  }
};

exports.getAllVendors = getAllVendors;
exports.createVendor = createVendor;
exports.updateVendor = updateVendor;
exports.deleteVendor = deleteVendor;

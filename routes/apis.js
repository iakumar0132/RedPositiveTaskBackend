const express = require("express");
const router = express.Router();
const Data = require("../models/Data"); // Import your data model

// GET all data
router.get("/data", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single data by ID
router.get("/data/:id", async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new data
router.post("/data", async (req, res) => {
  console.log(req.body, "ERROR");
  const newData = new Data({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    hobbies: req.body.hobbies,
  });

  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update data
router.put("/data/:id", async (req, res) => {
  try {
    const updatedData = await Data.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedData) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json(updatedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE data
router.delete("/data/:id", async (req, res) => {
  try {
    const deletedData = await Data.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

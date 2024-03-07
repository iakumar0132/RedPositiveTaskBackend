// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Data = require("./models/Data");
const nodemailer = require("nodemailer");

const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//GET
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET all data
app.get("/data", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single data by ID
app.get("/data/:id", async (req, res) => {
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
app.post("/data", async (req, res) => {
  console.log(req.body);
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
app.put("/data/:id", async (req, res) => {
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
app.delete("/data/:id", async (req, res) => {
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

// send email API S from CRUDS operation
app.post("/data", async (req, res) => {
  console.log(req.body);

  // Create a transporter using SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "iakumar0132@gmail.com",
      pass: "12345678",
    },
  });

  // Email message body
  let messageBody = `
    <h1>New Data Received</h1>
    <p>Name: ${req.body.name}</p>
    <p>Phone Number: ${req.body.phoneNumber}</p>
    <p>Email: ${req.body.email}</p>
    <p>Hobbies: ${req.body.hobbies.join(", ")}</p>`;

  // Email options
  let mailOptions = {
    from: "iakumar0132@gmail.com",
    to: "info@redpositive.in",
    subject: "New Data Received",
    html: messageBody,
  };

  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);

    // Save data to MongoDB
    const newData = new Data({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      hobbies: req.body.hobbies,
    });

    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    console.error("Error sending email:", err);
    res
      .status(500)
      .json({ message: "Error sending email", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

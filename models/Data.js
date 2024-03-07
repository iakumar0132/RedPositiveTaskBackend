const mongoose = require("mongoose");

// Define the schema
const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hobbies: String, // Assuming hobbies is an array of strings
});

// Create the model
const Data = mongoose.model("Data", dataSchema);

module.exports = Data;

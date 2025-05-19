const mongoose = require('mongoose');

// Define the schema for the Faculty data
const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  }
});

// Create the Faculty model from the schema
const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;

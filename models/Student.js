const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  department: String,
  year: Number,
  section: String,
  subject: String,
  marks: Number
});

module.exports = mongoose.model("Student", studentSchema);

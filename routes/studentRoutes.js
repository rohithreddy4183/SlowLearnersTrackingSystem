const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Fetch all students
router.get("/fetch-students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

// Filter students
router.post("/filter-students", async (req, res) => {
  try {
    const { department, year, section, subject, criteria } = req.body;
    let filter = {};

    if (department) filter.department = department;
    if (year) filter.year = Number(year);
    if (section) filter.section = section;
    if (criteria) filter.marks = { $lt: Number(criteria) };

    const students = await Student.find(filter);
    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: "Error filtering students" });
  }
});

module.exports = router;

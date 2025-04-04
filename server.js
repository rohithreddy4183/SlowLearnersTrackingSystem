import express from "express";
import multer from "multer";
import XLSX from "xlsx";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/slow-learners";
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // Change this in production!

// 🔹 Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 🔹 Define Student Schema & Model
const studentSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  name: String,
  department: String,
  year: String,
  section: String,
  subject: String,
  marks: Number,
  cgpa: Number,
  status: String,
});

const Student = mongoose.model("Student", studentSchema);

// 🔹 Define User Schema & Model (with password hashing)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// 🔹 Multer Configuration for File Upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📥 **File Upload Route**
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "⚠ No file uploaded." });
    }

    console.log("📥 File Received:", req.file.originalname);

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (jsonData.length === 0) {
      return res.status(400).json({ success: false, message: "⚠ Uploaded file is empty." });
    }

    const students = jsonData.map(student => ({
      regNo: student["Reg No"],
      name: student["Name"],
      department: student["Department"],
      year: student["Year"],
      section: student["Section"],
      subject: student["Subject"],
      marks: student["Marks"],
      cgpa: student["CGPA"],
      status: student["Marks"] < 21 ? "Slow Learner" : "Normal",
    }));

    let insertedCount = 0;
    for (const student of students) {
      await Student.findOneAndUpdate({ regNo: student.regNo }, student, { upsert: true, new: true });
      insertedCount++;

      // Auto-create user accounts for students with hashed passwords
      const existingUser = await User.findOne({ username: student.regNo });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(student.regNo, 10);
        await new User({ username: student.regNo, password: hashedPassword }).save();
      }
    }

    res.status(200).json({ success: true, message: "✅ Data uploaded successfully", count: insertedCount });

  } catch (error) {
    console.error("❌ Error processing file:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// 📌 **Fetch all students or filter by department (case-insensitive)**
app.get("/fetch-students", async (req, res) => {
  try {
    const { department } = req.query;
    let query = department ? { department: new RegExp(`^${department}$`, "i") } : {};

    console.log("🔍 Fetching students with query:", query);
    const students = await Student.find(query);

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: "No students found for this department." });
    }

    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// 📌 **Filter students dynamically based on optional parameters**
app.post("/filter-students", async (req, res) => {
  try {
    const { department, year, section, subject, criteria } = req.body;
    let query = {};

    if (department) query.department = new RegExp(`^${department}$`, "i");
    if (year) query.year = year;
    if (section) query.section = section;
    if (subject) query.subject = subject;
    if (criteria) query.marks = { $lt: parseInt(criteria) };

    console.log("🔍 Query being executed:", JSON.stringify(query));

    const students = await Student.find(query);
    
    if (students.length === 0) {
      console.log("❌ No students found with this query.");
      return res.status(404).json({ success: false, message: "No students found." });
    }

    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error("❌ Error filtering students:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});



// 📌 **User Login Route (JWT Authentication)**
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("❌ Error in login:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// 📌 **Delete Student Route**
app.delete("/delete-student/:regNo", async (req, res) => {
  try {
    const { regNo } = req.params;

    const student = await Student.findOneAndDelete({ regNo });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    await User.findOneAndDelete({ username: regNo }); // Also delete associated user
    res.status(200).json({ success: true, message: "Student deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting student:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// 🌐 **Root Route (Health Check)**
app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

// 🚀 **Start the Server**
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
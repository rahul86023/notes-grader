const multer = require("multer"); // For handling file uploads (PDF submissions)
const Submission = require("../../models/submission");
const Assignment = require("../../models/assignment");
const Class = require("../../models/class");
const User = require("../../models/user");

// Middleware for file uploads (PDF submissions)
const upload = multer({ dest: "uploads/" });

// API to list all classes with enrollment option (Student)
const allClassesList = async (req, res) => {
  try {
    // Check if the user's role is "student"
    if (req.user.role === "student") {
      // Find all classes and populate teacher information
      const classes = await Class.find({}).populate("teacher", "name");
      console.log(classes, "classes is here");
      res.json(classes);
    } else {
      res.status(403).json({
        error:
          "Permission denied. Only students can access the list of all classes.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// API to request enrollment in a class (Student)
const requestClassEnrollment = async (req, res) => {
  try {
    const { classId } = req.params;
    const studentId = req.user._id;

    // Check if the class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check if the student is already enrolled or has a pending request
    const student = await User.findById(studentId);
    if (
      student.enrolledClasses.includes(classId) ||
      student.enrollmentRequests.includes(classId)
    ) {
      return res.status(400).json({
        error: "Student is already enrolled or has a pending request",
      });
    }

    // Add the class to the student's enrollment requests
    student.enrollmentRequests.push(classId);
    await student.save();

    res.json({ message: "Enrollment request sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// API to submit an assignment (Student)
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user._id;
    const file = req.file;

    // Check if the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Check if the assignment deadline has passed
    if (assignment.deadline < new Date()) {
      return res.status(400).json({ error: "Assignment deadline has passed" });
    }

    // Save the submission
    const submission = new Submission({
      assignment: assignmentId,
      student: studentId,
      file: file.path, // Store the file path
    });
    await submission.save();

    res.json({ message: "Assignment submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  allClassesList,
  requestClassEnrollment,
  submitAssignment,
};

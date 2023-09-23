const Assignment = require("../../models/assignment");
const Class = require("../../models/class");
const User = require("../../models/user");

// API to retrieve the teacher's dashboard
const dashboard = async (req, res) => {
  try {
    // Check if the user's role is "teacher"
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        error:
          "Permission denied. Only teachers can access the teacher dashboard.",
      });
    }

    const teacherId = req.user._id;
    console.log(req.user, "user is here");

    // Find classes taught by the teacher and populate assignments and students
    const classes = await Class.find({ teacher: teacherId })
      .populate("assignments")
      .populate("students", "name");

    // Find enrollment requests for the teacher's classes
    const enrollmentRequests = await Class.find({
      teacher: teacherId,
      enrollmentRequests: { $exists: true, $not: { $size: 0 } },
    }).populate("enrollmentRequests", "name");

    const teacherDashboard = {
      classes,
      enrollmentRequests,
    };

    res.json(teacherDashboard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// API to create a new class (Teacher)
const createClass = async (req, res) => {
  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        error: "Permission denied. Only teachers can create classes.",
      });
    }

    const teacherId = req.user._id;
    const { subject } = req.body;

    // Create a new class
    const newClass = new Class({
      subject,
      teacher: teacherId,
    });
    await newClass.save();

    res.status(200).json({ message: "Class created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// API to assign assignments to classes (Teacher)
const assignAssignment = async (req, res) => {
  try {
    const { classId } = req.params;
    const { title, description, deadline } = req.body;

    // Check if the class exists and is taught by the teacher
    const teacherId = req.user._id;
    const existingClass = await Class.findOne({
      _id: classId,
      teacher: teacherId,
    });
    if (!existingClass) {
      return res
        .status(404)
        .json({ error: "Class not found or not taught by the teacher" });
    }

    // Create a new assignment
    const newAssignment = new Assignment({
      title,
      description,
      deadline,
      class: classId,
    });
    await newAssignment.save();

    res.json({ message: "Assignment assigned to the class successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// API to view assignments and submissions for a specific class (Teacher)
const viewAssignments = async (req, res) => {
  try {
    const { classId } = req.params;

    // Check if the class exists and is taught by the teacher
    const teacherId = req.user._id;
    const existingClass = await Class.findOne({
      _id: classId,
      teacher: teacherId,
    });
    if (!existingClass) {
      return res
        .status(404)
        .json({ error: "Class not found or not taught by the teacher" });
    }

    // Find assignments and submissions for the class
    const assignments = await Assignment.find({ class: classId });
    const submissions = await Submission.find({
      assignment: { $in: assignments.map((a) => a._id) },
    })
      .populate("student", "name")
      .populate("assignment", "title");

    const classDetails = {
      class: existingClass,
      assignments,
      submissions,
    };

    res.json(classDetails);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// API to grade a student's submission (Teacher)
const assignGrades = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade } = req.body;

    // Check if the submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    // Update the grade for the submission
    submission.grade = grade;
    await submission.save();

    res.json({ message: "Grade assigned successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// API to view enrollment requests from students for teacher's classes
const enrollmentRequests = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Find classes taught by the teacher with enrollment requests
    const classesWithRequests = await Class.find({
      teacher: teacherId,
      enrollmentRequests: { $exists: true, $not: { $size: 0 } },
    }).populate("enrollmentRequests", "name");

    res.json(classesWithRequests);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// API to approve or reject student enrollment requests for teacher's classes
const approveOrRejectEnrollment = async (req, res) => {
  try {
    const { studentId, classId } = req.params;
    const { approve } = req.body;

    // Check if the class exists and is taught by the teacher
    const teacherId = req.user._id;
    const existingClass = await Class.findOne({
      _id: classId,
      teacher: teacherId,
    });
    if (!existingClass) {
      return res
        .status(404)
        .json({ error: "Class not found or not taught by the teacher" });
    }

    // Check if the student is in the enrollment requests list
    if (!existingClass.enrollmentRequests.includes(studentId)) {
      return res
        .status(400)
        .json({ error: "Student not in enrollment requests" });
    }

    // Approve or reject the enrollment request
    if (approve) {
      // Add the student to the class's students list
      existingClass.students.push(studentId);
      // Remove the student from the enrollment requests list
      existingClass.enrollmentRequests.pull(studentId);
    } else {
      // Reject the enrollment request
      existingClass.enrollmentRequests.pull(studentId);
    }

    await existingClass.save();

    res.json({ message: "Enrollment request processed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  dashboard,
  createClass,
  assignAssignment,
  viewAssignments,
  assignGrades,
  enrollmentRequests,
  approveOrRejectEnrollment,
};

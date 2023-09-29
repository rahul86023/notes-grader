const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }], // Add this line
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  enrollmentRequestsFromStudents: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ],
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;

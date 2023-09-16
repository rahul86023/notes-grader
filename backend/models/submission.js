const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment", // Reference to the assignment (Assignment model)
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the student (User model)
    required: true,
  },
  uploadedFile: {
    type: String, // You can store the file path or use a file storage service.
    required: true,
  },
  grade: {
    type: Number, // Optionally, you can include a field for grading.
  },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;

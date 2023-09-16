const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the teacher (User model)
    required: true,
  },
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const { getProfile, updateProfile } = require("../api/v0/profile");
const {
  dashboard,
  createClass,
  assignAssignment,
  viewAssignments,
  assignGrades,
  enrollmentRequests,
  approveOrRejectEnrollment,
} = require("../api/v0/teacher");
const {
  allClassesList,
  requestClassEnrollment,
  submitAssignment,
} = require("../api/v0/student");
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile
);
router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  updateProfile
);
//student-specific routes
router.get(
  "/student/allClassesList",
  passport.authenticate("jwt", { session: false }),
  allClassesList
);
router.post(
  "/student/requestClassEnrollment",
  passport.authenticate("jwt", { session: false }),
  requestClassEnrollment
);
router.post(
  "/student/submitAssignment",
  passport.authenticate("jwt", { session: false }),
  submitAssignment
);
//teacher-specific routes
router.get(
  "/teacher/dashboard",
  passport.authenticate("jwt", { session: false }),
  dashboard
);
router.post(
  "/teacher/create-class",
  passport.authenticate("jwt", { session: false }),
  createClass
);
router.post(
  "/teacher/assign-assignments/:classId",
  passport.authenticate("jwt", { session: false }),
  assignAssignment
);
router.get(
  "/teacher/view-assignments-and-submissions/:classId",
  passport.authenticate("jwt", { session: false }),
  viewAssignments
);
router.put(
  "/teacher/grade-submission/:submissionId",
  passport.authenticate("jwt", { session: false }),
  assignGrades
);
router.get(
  "/teacher/enrollment-requests",
  passport.authenticate("jwt", { session: false }),
  enrollmentRequests
);
router.put(
  "/teacher/approve-enrollment/:studentId/:classId",
  passport.authenticate("jwt", { session: false }),
  approveOrRejectEnrollment
);
module.exports = router;

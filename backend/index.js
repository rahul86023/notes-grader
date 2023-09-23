const express = require("express");
const app = express();

const createHttpError = require("http-errors");

const cors = require("cors");

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const passport = require("./utils/passport-jwt-strategy"); // Updated import

dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToDatabase();

// 404 Handler
// app.use((req, res, next) => {
//   next(createHttpError.NotFound());
// });
app.use(express.json());
//routes
app.use("/api/v0", require("./routes/auth"));
app.use("/api/v0", require("./routes/protectedRoutes"));
// Passport Middleware
app.use(passport.initialize());

app.listen(4000, () => {
  console.log("Server is started and running on port 4000");
});

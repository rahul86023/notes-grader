// passport.js

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

// User model import
const User = require("../models/user");

// JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "my_secret",
};

// JWT strategy for handling authentication
const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // Find the user by the provided user ID
    const user = await User.findById(payload.sub);

    if (user) {
      // If the user exists, set the user in the request object
      done(null, user);
    } else {
      // If the user does not exist, handle unauthorized access
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
});

// Passport middleware setup
passport.use(jwtStrategy);

module.exports = passport;

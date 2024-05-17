// external imports
const express = require("express");
const { body } = require("express-validator");
// controllers
const authController = require("../controllers/auth");
// models
const User = require("../models/user");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists.");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long."),
    body("name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Name field cannot be empty."),
  ],
  authController.signup
);
// POST /login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email format.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("Email not found.");
          }
        });
      }),
  ],
  authController.login
);

module.exports = router;

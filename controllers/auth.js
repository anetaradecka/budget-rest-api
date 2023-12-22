const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  // collectiong errors from the server-side validation done through the middleware in routes
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");

    error.statusCode = 422;
    // This will keep the original error and pass it through the middleware in app and show the errors array

    error.data = errors.array();

    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "User successfully created", userId: result._id });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      // We can add some user data to the token
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "somesupersecretkey",
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({
          token: token,
          userId: loadedUser._id.toString(),
          name: loadedUser.name,
        });
    })
    // At this point the error means that there is some issue with the data base
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

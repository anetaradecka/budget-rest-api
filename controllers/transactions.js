const { validationResult } = require("express-validator");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const { ObjectId } = require("mongodb");
const user = require("../models/user");

exports.getTransactions = (req, res, next) => {
  const id = new ObjectId(req.userId);

  User.findOne(id)
    .then((user) => {
      if (!user) {
        // handle error
      }
      return user.transactions;
    })
    .then((result) => {
      res.status(200).json({
        message: "Transactions fetched successfully.",
        transactions: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postNewTransaction = (req, res, next) => {
  // collectiong errors from the server-side validation done through the middleware in routes
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed! Entered data is incorrect.",
      errors: errors.array(),
    });
  }

  let creator;

  // transaction creation based on a model, userId is available from the decodedToken
  const transaction = new Transaction({
    category: req.body.submitData.category,
    type: req.body.submitData.type,
    value: req.body.submitData.value,
    description: req.body.submitData.description,
    date: req.body.submitData.date,
    creator: req.userId,
  });

  // Create post in db
  transaction
    .save()
    .then((result) => {
      console.log(result);
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.transactions.push(transaction);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Transaction created successfully!",
        transaction: transaction,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteTransaction = (req, res, next) => {
  const transactionId = new ObjectId(req.params.transactionId);
  const userId = new ObjectId(req.userId);

  User.findById(userId)
    .then((user) => {
      if (!userId) {
        const error = new Error("User with this id hasn't been found");
        error.statusCode = 404;
        throw error;
      }
      return user.deleteTransaction(transactionId);
    })
    .then((result) => {
      res.status(200).json({ message: "Transaction deleted." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

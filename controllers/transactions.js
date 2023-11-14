const { validationResult } = require("express-validator");
const Transaction = require("../models/transaction");

exports.getTransactions = (req, res, next) => {
  Transaction.find()
    .then((transactions) => {
      res.status(200).json({
        message: "Transactions fetched successfully.",
        transactions: transactions,
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
  // transaction creation based on a model
  const transaction = new Transaction({
    category: req.body.category,
    value: req.body.value,
    description: req.body.description,
    date: req.body.date,
  });

  // Create post in db
  transaction
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Transaction created successfully!",
        transaction: result,
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
  const transactionId = req.params.transactionId;
  Transaction.findById(transactionId)
    .then((transaction) => {
      // check if the transaction even exists in db
      if (!transaction) {
        const error = new Error("Transaction hasn't been found");
        error.statusCode = 404;
        throw error;
      }
      return Transaction.findByIdAndRemove(transactionId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Transaction deleted." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const express = require("express");
const { body } = require("express-validator");

const transactionsController = require("../controllers/transactions");

const router = express.Router();

// GET /transactions
router.get("/", transactionsController.getTransactions);
//-------------------------------------------------------------------
// POST /transactions/add-transaction
router.post(
  "/add-transaction",
  [body("description").trim()],
  transactionsController.postNewTransaction
);
// DELETE /:transationId
router.delete("/:transactionId", transactionsController.deleteTransaction);

module.exports = router;

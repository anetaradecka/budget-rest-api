const express = require("express");
const { body } = require("express-validator");

const transactionsController = require("../controllers/transactions");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /transactions
router.get("/", isAuth, transactionsController.getTransactions);
//-------------------------------------------------------------------
// POST /transactions/add-transaction
router.post(
  "/add-transaction",
  isAuth,
  [body("description").trim()],
  transactionsController.postNewTransaction
);
// DELETE /:transationId
router.delete(
  "/:transactionId",
  isAuth,
  transactionsController.deleteTransaction
);

module.exports = router;

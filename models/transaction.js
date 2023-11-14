const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);

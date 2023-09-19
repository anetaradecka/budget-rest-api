const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    //   type: {
    //     type: String, ==> expense/income
    //     required: true,
    //   },
    category: {
      type: String,
      required: true,
    },
    //   subcategory: {
    //     type: String,
    //     required: true
    //   },
    value: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      // get: (date) => date.toLocaleDateString("pl-PL"),
    },
    comment: {
      type: String,
      required: false,
    },
    // creator: {
    //   type: Object,
    //   required: String,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);

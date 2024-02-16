const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  transactions: Array,

  // The following is used when we need to connect with another collection
  // transactions: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Transaction",
  //   },
  // ],
});

userSchema.methods.deleteTransaction = function (transactionId) {
  const updatedTransactions = this.transactions.filter((item) => {
    return item._id.toString() !== transactionId.toString();
  });
  this.transactions = updatedTransactions;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

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

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
var StatisticSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
  },
  rest: {
    type: Number,
  },
});
var StatistictModel = mongoose.model("Statistic", StatisticSchema);
module.exports = StatistictModel;

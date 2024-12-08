// for admin
const mongoose = require("mongoose");

const discountPromotionSchema = new mongoose.Schema({
  discountPercentage: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: function () {
      return !this.applyToAll;
    },
  },
  applyToAll: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("DiscountPromotion", discountPromotionSchema);

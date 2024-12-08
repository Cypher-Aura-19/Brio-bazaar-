const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true, // Set to true if WhatsApp number is mandatory
  },
  password: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false, // Not approved by default
  },
});

// Hash password before saving the seller document

// Compare passwords
sellerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;

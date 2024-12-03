const express = require('express');
const bcrypt = require('bcryptjs');
const Seller = require('./Seller');
const User = require('../users/user.model'); // Assuming there's a User model for role validation
const router = express.Router();


// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  const userId = req.userId; // Assume userId is set in req by authentication middleware
  const user = await User.findById(userId);

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  
  next(); // Proceed if the user is an admin
};

// Seller registration route
router.post('/register', async (req, res) => {
  const { storeName, email, phone, password } = req.body;

  // Validation
  if (!storeName || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if the storeName or email already exists
  const existingSeller = await Seller.findOne({
    $or: [{ storeName }, { email }]
  });

  if (existingSeller) {
    return res.status(400).json({ error: "Store Name or Email already exists" });
  }

  try {
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new seller with isApproved set to false by default
    const newSeller = new Seller({
      storeName,
      email,
      phone,
      password: hashedPassword,
      isApproved: false, // Explicitly showing the default value (optional)
    });

    // Save the seller to the database
    await newSeller.save();

    // Return a success response
    res.status(201).json({ 
      message: "Seller registered successfully. Waiting for admin approval.",
      sellerId: newSeller._id, // Optionally return the seller ID
    });
  } catch (error) {
    console.error("Error registering seller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch all sellers
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await Seller.find(); // Get all sellers from the database
    res.status(200).json(sellers); // Return the sellers as a JSON response
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Route for admin to approve or disapprove seller
router.put('/approve-seller/:sellerId', async (req, res) => {
  const { sellerId } = req.params;
  const { status } = req.body; // Get status from the request body

  try {
    // Find the seller by ID
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Update the isApproved status based on the passed status
    if (status === 'approved') {
      seller.isApproved = true; // Set to true for approval
    } else if (status === 'pending') {
      seller.isApproved = false; // Set to false for pending
    } else {
      return res.status(400).json({ error: "Invalid status" });
    }

    await seller.save(); // Save the updated seller

    // Return a success response
    res.status(200).json({ 
      message: `Seller ${status} successfully.`, 
      sellerId: seller._id 
    });
  } catch (error) {
    console.error("Error updating seller status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.delete('/delete-seller/:sellerId', async (req, res) => {
  const { sellerId } = req.params;

  try {
    // Find and delete the seller by ID
    const seller = await Seller.findByIdAndDelete(sellerId);

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Return a success response
    res.status(200).json({ 
      message: "Seller deleted successfully.", 
      sellerId: seller._id 
    });
  } catch (error) {
    console.error("Error deleting seller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;

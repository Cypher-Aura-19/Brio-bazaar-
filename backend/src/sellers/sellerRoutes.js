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

// router.get('/seller-stats/:sellerId', async (req, res) => {
//   try {
//     const sellerId = req.params.sellerId;

//     // Get all products of the seller
//     const products = await Product.find({ author: sellerId });
    
//     // Get total revenue (sum of all orders' products)
//     const orders = await Order.aggregate([
//       { $unwind: '$products' },
//       { $match: { 'products.productId': { $in: products.map(p => p._id.toString()) } } },
//       { $group: { _id: { $month: '$createdAt' }, totalAmount: { $sum: '$amount' } } },
//       { $sort: { _id: 1 } } // Sort by month
//     ]);
    
//     // Prepare data for monthly earnings
//     const monthlyEarnings = new Array(12).fill(0); // Initialize an array with 12 zeros (one for each month)
//     orders.forEach(order => {
//       monthlyEarnings[order._id - 1] = order.totalAmount; // Store total earnings per month (index starts from 0)
//     });

//     const totalEarnings = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
//     const totalOrders = orders.length;
//     const totalProducts = products.length;
    
//     res.json({
//       totalEarnings,
//       totalOrders,
//       totalProducts,
//       monthlyEarnings,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch seller stats' });
//   }
// });


router.get("/stats/:sellerId", async (req, res) => {
  const { sellerId } = req.params;

  try {
    // Fetch the seller's total earnings (sum of all orders for the seller)
    const orders = await Order.aggregate([
      { $match: { sellerId: sellerId } }, // Match orders by seller ID
      { $group: { _id: null, totalEarnings: { $sum: "$totalPrice" } } } // Sum the totalPrice field
    ]);

    // Fetch the seller's total number of orders
    const totalOrders = await Order.countDocuments({ sellerId: sellerId });

    // Fetch the seller's total number of products
    const totalProducts = await Product.countDocuments({ sellerId: sellerId });

    // If no orders are found, set totalEarnings to 0
    const totalEarnings = orders.length > 0 ? orders[0].totalEarnings : 0;

    // Return the stats in the response
    return res.status(200).json({
      totalEarnings: totalEarnings,
      totalOrders: totalOrders,
      totalProducts: totalProducts,
    });
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    return res.status(500).json({ message: "Server error, could not fetch stats." });
  }
});



router.post('/register', async (req, res) => {
  const { storeName, email, phone, whatsapp, password } = req.body;

  // Validation
  if (!storeName || !email || !phone || !whatsapp || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if the storeName or email already exists
  const existingSeller = await Seller.findOne({
    $or: [{ storeName }, { email }],
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
      whatsapp, // Include the WhatsApp field
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

router.post('/logout', (req, res) => {
  res.clearCookie('token'); 
  res.status(200).send({ message: 'Logged out successfully' });
});

module.exports = router;

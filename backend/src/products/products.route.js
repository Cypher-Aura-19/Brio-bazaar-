// for admin to approve products
const express = require("express");
const Products = require("./products.model");
const cloudinaryUpload = require("../utils/uploadImage");
const Reviews = require("../reviews/reviews.model");
const User = require("../users/user.model");
const Seller = require("../sellers/Seller");
const router = express.Router();
const jwt = require("jsonwebtoken");



// Post a product (Create product)
// Post a product (Create product)
router.post('/create-product', async (req, res) => {
  try {
      const {
          name,
          category,
          description,
          price,
          oldPrice,
          image,
          color,
          rating,
          author,
          approved,
          stockLevel,
      } = req.body;

      // Validate required fields
      if (!name || !category || !description || !price || !author || !stockLevel) {
          return res.status(400).json({ message: 'Required fields are missing.' });
      }

      // Create and save the new product
      const newProduct = new Products({
          name,
          category,
          description,
          price,
          oldPrice,
          image,
          color,
          rating,
          author,
          approved,
          stockLevel,
      });

      const savedProduct = await newProduct.save();

      res.status(201).json({
          message: 'Product created successfully',
          product: savedProduct,
      });
  } catch (error) {
      console.error('Error creating product:', error.message);
      res.status(500).json({
          // message: 'Failed to create product',
          error: error.message,
      });
  }
});



// Get all products (public route)
router.get("/", async (req, res) => {
  try {
    const { category, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (color && color !== "all") {
      filter.color = color;
    }

    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    const products = await Products.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "storeName") // Adjusted to use seller's storeName
      .sort({ createdAt: -1 });

    res.status(200).send({ products, totalPages, totalProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ message: "Failed to fetch products" });
  }
});

// Get single product (public route)
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Products.findById(productId).populate("author", "storeName email");
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const reviews = await Reviews.find({ productId }).populate("userId", "username email");

    res.status(200).send({ product, reviews });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send({ message: "Failed to fetch product" });
  }
});

router.put("/update-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { stockLevel } = req.body;

    // Validate stockLevel
    if (stockLevel !== undefined && stockLevel < 0) {
      return res.status(400).json({ message: "Stock level must be non-negative." });
    }

    // Fetch the product
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is the seller or an admin
    const user = await User.findById(req.userId); // Assumes `req.userId` contains the authenticated user ID
    const isSeller = product.author.toString() === req.userId;
    const isAdmin = user && user.role === "admin";

    if (!isSeller && !isAdmin) {
      return res.status(403).json({ message: "Permission denied." });
    }

    // Update the product
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});


router.patch("/update-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;  // Get all fields from request body

    // Validate stockLevel if it's part of the request
    if (updates.stockLevel !== undefined && updates.stockLevel < 0) {
      return res.status(400).json({ message: "Stock level must be non-negative." });
    }

    // Fetch the product
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product with the provided fields
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      updates,  // Use all fields provided in the request body
      { new: true }  // Return the updated product
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});



// Delete a product and related comments
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Find and delete the product
    const deletedProduct = await Products.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Delete associated reviews
    await Reviews.deleteMany({ productId });

    res.status(200).send({
      message: "Product and associated reviews deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ message: "Failed to delete product" });
  }
});

// Approve a product (admin only)
router.patch("/:id/approve", async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the user is an admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can approve products" });
    }

    // Find the product and update approval status
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    product.approved = true;
    await product.save();

    res.status(200).send({
      message: "Product approved successfully",
      product,
    });
  } catch (error) {
    console.error("Error approving product:", error);
    res.status(500).send({ message: "Failed to approve product" });
  }
});

// Get related products
router.get("/related/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "Product ID is required" });
    }

    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Create a regex pattern for partial matching of the product name
    const titleRegex = new RegExp(
      product.name
        .split(" ")
        .filter((word) => word.length > 1)
        .join("|"),
      "i"
    );

    const relatedProducts = await Products.find({
      _id: { $ne: id },
      $or: [
        { name: { $regex: titleRegex } },
        { category: product.category },
      ],
    });

    res.status(200).send(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).send({ message: "Failed to fetch related products" });
  }
});

module.exports = router;

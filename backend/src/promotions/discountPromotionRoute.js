//for admin
const express = require("express");
const router = express.Router();
const DiscountPromotion = require("./discountPromotionModel");
const Product = require("../products/products.model");
const User = require("../users/user.model");

// Create a new discount promotion
router.post("/", async (req, res) => {
  try {
    const { userId, discountPercentage, startDate, endDate, productId, applyToAll } = req.body;

    // Validate user is an admin
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can create promotions" });
    }

    // If applyToAll is false, validate product existence
    if (!applyToAll) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
    }

    // Create the promotion
    const promotion = new DiscountPromotion({
      userId,
      discountPercentage,
      startDate,
      endDate,
      productId: applyToAll ? undefined : productId,
      applyToAll,
    });

    // Save the promotion
    await promotion.save();

    // Apply discount to products
    if (applyToAll) {
      // Apply the discount to all products
      const products = await Product.find();
      const updatedProducts = await Promise.all(
        products.map(async (product) => {
          // Store the original price before the discount is applied
          if (!product.oldPrice) {
            product.oldPrice = product.price;
          }

          // Apply the discount
          product.price = product.price - (product.price * discountPercentage) / 100;

          // Save the updated product with the old price stored
          await product.save();
          return product;
        })
      );
      console.log("Discount applied to all products:", updatedProducts);
    } else {
      // Apply discount to a single product
      const product = await Product.findById(productId);
      if (!product.oldPrice) {
        // Store the original price if not already done
        product.oldPrice = product.price;
      }

      // Apply the discount
      product.price = product.price - (product.price * discountPercentage) / 100;
      await product.save();
      console.log(`Discount applied to product ${productId}`);
    }

    res.status(201).json({ message: "Promotion created and discount applied", promotion });
  } catch (error) {
    console.error("Error applying discount:", error);
    res.status(500).json({ error: error.message });
  }
});


// Get all promotions
router.get("/details", async (req, res) => {
  try {
    const promotions = await DiscountPromotion.find()
      .populate("productId", "name category price")
      .populate("userId", "username email role");
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single promotion by ID
router.get("/:id", async (req, res) => {
  try {
    const promotion = await DiscountPromotion.findById(req.params.id)
      .populate("productId", "name category price")
      .populate("userId", "username email role");

    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    res.status(200).json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a promotion
router.put("/:id", async (req, res) => {
  try {
    const { discountPercentage, startDate, endDate } = req.body;

    const promotion = await DiscountPromotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    // Store the old discount percentage
    const oldDiscountPercentage = promotion.discountPercentage;

    // Update the promotion details
    promotion.discountPercentage = discountPercentage || promotion.discountPercentage;
    promotion.startDate = startDate || promotion.startDate;
    promotion.endDate = endDate || promotion.endDate;

    await promotion.save();

    // Apply the updated discount to products
    if (promotion.applyToAll) {
      // Update all product prices: reverse old discount and apply new one
      const products = await Product.find();
      const updatedProducts = await Promise.all(
        products.map(async (product) => {
          // If old price exists, reverse old discount
          if (product.oldPrice) {
            const originalPrice = product.oldPrice; // Restore the old price before discount
            product.price = originalPrice;
          } else {
            const originalPrice = product.price / (1 - oldDiscountPercentage / 100); // Reverse the previous discount if no oldPrice
            product.price = originalPrice;
          }

          // Apply the new discount to the product
          const discountedPrice = product.price - (product.price * promotion.discountPercentage) / 100;
          product.price = discountedPrice;

          // Save the updated price
          await product.save();
          return product;
        })
      );
      console.log("Updated discount applied to all products:", updatedProducts);
    } else {
      // Update price for a single product
      const product = await Product.findById(promotion.productId);
      if (product) {
        // If old price exists, reverse old discount
        if (product.oldPrice) {
          const originalPrice = product.oldPrice; // Restore the old price before discount
          product.price = originalPrice;
        } else {
          const originalPrice = product.price / (1 - oldDiscountPercentage / 100); // Reverse the previous discount if no oldPrice
          product.price = originalPrice;
        }

        // Apply the new discount to the product
        const discountedPrice = product.price - (product.price * promotion.discountPercentage) / 100;
        product.price = discountedPrice;

        // Save the updated product price
        await product.save();
        console.log(`Updated discount applied to product ${promotion.productId}`);
      }
    }

    res.status(200).json({ message: "Promotion updated and discount reapplied", promotion });
  } catch (error) {
    console.error("Error updating promotion:", error);
    res.status(500).json({ error: error.message });
  }
});


// Delete a promotion
router.delete("/:id", async (req, res) => {
  try {
    // Find the promotion by ID
    const promotion = await DiscountPromotion.findById(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    // Use deleteOne or delete() instead of remove
    await promotion.deleteOne();  // or you can also use `promotion.delete()`
    
    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

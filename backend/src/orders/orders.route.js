const express = require("express");
const Order = require("./orders.model");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  // Extract product IDs
  const productIds = products.map((product) => product._id);

  try {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    // Log productIds
    console.log("Product IDs:", productIds);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        product_ids: JSON.stringify(productIds), // Store productIds in metadata
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.post("/confirm-payment", async (req, res) => {
  const { session_id } = req.body; // Get session_id from the request body

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

    const paymentIntentId = session.payment_intent.id;

    let order = await Order.findOne({ orderId: paymentIntentId });

    if (!order) {
      const lineItems = session.line_items.data.map((item) => ({
        productId: item.price.product,
        quantity: item.quantity,
      }));

      // Retrieve productIds from session metadata
      const productIds = session.metadata.product_ids ? JSON.parse(session.metadata.product_ids) : [];

      console.log("Product IDs after session:", productIds);

      const amount = session.amount_total / 100;

      order = new Order({
        orderId: paymentIntentId,
        products: lineItems,
        amount: amount,
        email: session.customer_details.email,
        productIds: session.metadata.product_ids ? JSON.parse(session.metadata.product_ids) : [], // Use productIds from session metadata
        status: session.payment_intent.status === "succeeded" ? "pending" : "failed",
      });
    } else {
      order.status = session.payment_intent.status === "succeeded" ? "pending" : "failed";
    }

    // Save the order to MongoDB
    await order.save();

    res.json({ order });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
});






router.get("/:email", async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ message: "Email parameter is required" });
  }
 

  try {
    const orders = await Order.find({ email: email }).sort({ createdAt: -1 });
    if (orders.length === 0 || !orders) {
      return res
        .status(404)
        .json({ order: 0, message: "No orders found for this email" });
    }
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/order/:id", async (req, res) => {
  // console.log(req.params.id);
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// get all orders 
router.get('/', async (req, res) => {

  try {
    const orders = await Order.find().sort({createdAt: -1});
    if (orders.length === 0) {
      console.log('No orders found');
      return res.status(200).json({ message: "No orders found", orders: [] });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// update order status
router.patch('/update-order-status/:id', async (req, res) => {
  try {
      const { id } = req.params;
      // console.log(id);
      const { status } = req.body;

      // console.log(status)

      if (!status) {
          return res.status(400).json({ message: "Order status is required" });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
          id,
          { status, updatedAt: Date.now() },
          { new: true, runValidators: true }
      );

      if (!updatedOrder) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({
          message: "Order status updated successfully",
          order: updatedOrder
      });
  } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Server error" });
  }
});

// delete order
router.delete('/delete-order/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully",
      order: deletedOrder
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

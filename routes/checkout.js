import express from "express";
import mongoose from "mongoose"; 
import Order from "../models/order.js";
import Stripe from "stripe";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

router.post("/create-checkout-session", authenticateToken, async (req, res) => {
  try {
    let order = await Order.findOne({
      userId: req.myUser.userId,
      status: "pending",
      items: { $exists: true, $ne: [] }
    }).populate("items.menuItem");

    if (!order || order.items.length === 0) {
      return res.status(400).json({ error: "Please add items to your order before proceeding to payment" });
    }

    const lineItems = order.items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.menuItem.name },
        unit_amount: Math.round(item.menuItem.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.SERVER_URL}/api/checkout-success?userId=${req.myUser.userId}`,
      cancel_url: `${process.env.SERVER_URL}/checkout-cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/checkout-success", async (req, res) => {
  const { userId } = req.query;


  if (!userId) {
    console.warn("⚠️ No userId provided in checkout-success.");
    return res.redirect("/?paymentSuccess=true");
  }

  try {
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    const pendingOrders = await Order.find({ userId: objectIdUserId, status: "pending" });
    const deleteResult = await Order.deleteMany({ userId: objectIdUserId, status: "pending" });

    if (req.session) {
      req.session.cart = null;
    } else {
      console.warn("No session detected. Unable to clear session cart.");
    }

    res.redirect("/?paymentSuccess=true");

  } catch (error) {
    console.error("Error clearing persistent order:", error);
    res.redirect("/?paymentFailed=true");
  }
});


export default router;
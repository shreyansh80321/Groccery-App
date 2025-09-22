import { CartItem } from "../models/cartModel.js";
import createError from "http-errors";

export const getCart = async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.user._id }).populate({
      path: "product",
      model: "Product",
    });
    const formatted = items.map((ci) => ({
      _id: ci._id.toString(),
      product: ci.product,
      quantity: ci.quantity,
    }));
    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, itemId, quantity } = req.body;
    const pid = productId || itemId;
    if (!pid || typeof quantity !== "number") {
      throw createError(400, "Product identifier and quantity are required");
    }
    let cartItem = await CartItem.findOne({ user: req.user._id, product: pid });
    if (cartItem) {
      cartItem.quantity = Math.max(1, cartItem.quantity + quantity);
      if (cartItem.quantity < 1) {
        await cartItem.deleteOne();
        return res.status(200).json({
          message: "Item Removed",
          _id: cartItem._id.toString(),
        });
      }
      await cartItem.save();
      await cartItem.populate("product");
      return res.status(200).json({
        _id: cartItem._id.toString(),
        product: cartItem.product,
        quantity: cartItem.quantity,
      });
    }
    cartItem = await CartItem.create({
      user: req.user._id,
      product: pid,
      quantity,
    });
    await cartItem.populate("product");
    res.status(201).json({
      _id: cartItem._id.toString(),
      product: cartItem.product,
      quantity: cartItem.quantity,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!cartItem) {
      throw createError(404, "Cart item not found");
    }
    if (quantity < 1) {
      await cartItem.deleteOne();
      return res.json({
        message: "Item removed",
        _id: cartItem._id.toString(),
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    await cartItem.populate("product");
    res.json({
      _id: cartItem._id.toString(),
      product: cartItem.product,
      quantity: cartItem.quantity,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.id;

    console.log("🛒 Delete request - user:", userId, "itemId:", itemId);

    const cartItem = await CartItem.findOne({ _id: itemId, user: userId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.deleteOne();

    res.json({ message: "Item removed", _id: itemId });
  } catch (error) {
    console.error("❌ Delete cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const clearCart = async (req, res, next) => {
  try {
    await CartItem.deleteMany({ user: req.user._id });
    res.json({ message: "Cart Cleared" });
  } catch (err) {
    next(err);
  }
};

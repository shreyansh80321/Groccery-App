import { Product } from "../models/productModel.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const filename = req.file?.filename ?? null;
    const imageUrl = filename ? `/uploads/${filename}` : null;
    const { name, description, category, oldPrice, price } = req.body;
    const product = await Product.create({
      name,
      description,
      category,
      oldPrice: Number(oldPrice),
      price: Number(price),
      imageUrl,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json({ message: "Product Removed" });
  } catch (err) {
    next(err);
  }
};

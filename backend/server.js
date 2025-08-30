import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import itemrouter from "./routes/productRoute.js";
import authMiddleware from "./middleware/auth.js";
import cartRouter from "./routes/cartRoute.js";
import orderrouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Allowed origins from .env (comma-separated)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/cart", authMiddleware, cartRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/items", itemrouter);
app.use("/api/orders", orderrouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

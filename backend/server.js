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

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://groccery-app-frontend.onrender.com",
        "https://groccery-app-admin.onrender.com",
        "http://localhost:5173",
        "http://localhost:5174",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by cors"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/user", userRouter);
app.use("/api/cart", authMiddleware, cartRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/items", itemrouter);
app.use("/api/orders", orderrouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Debug endpoint: echoes Authorization header
app.get("/api/debug/auth", (req, res) => {
  console.log(
    "Debug /api/debug/auth - Authorization header:",
    req.headers.authorization
  );
  res.json({ authorization: req.headers.authorization || null });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

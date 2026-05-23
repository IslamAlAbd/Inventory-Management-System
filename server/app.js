import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from './src/config/db.js'
import productRouter from './src/routes/productRoutes.js';
import movementRouter from "./src/routes/movementRoutes.js";


dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/products", productRouter);
app.use("/api/movements", movementRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
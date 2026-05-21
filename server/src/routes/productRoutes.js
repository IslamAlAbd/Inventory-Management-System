import express from "express";
import {
  createProducts,
  deleteProducts,
  getAllProducts,
  getProductsById,
  updateProducts,
} from "../controller/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductsById);
router.post("/", createProducts);
router.put("/:id", updateProducts);
router.delete("/:id", deleteProducts);

export default router;
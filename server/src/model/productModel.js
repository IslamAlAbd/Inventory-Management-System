import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    min_quantity: { type: Number, required: true },
  },
  { timestamps: true },
);

const ProductModel = model("Product", productSchema);
export default ProductModel;

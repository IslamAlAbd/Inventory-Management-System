import { Schema, model } from 'mongoose'

const movementSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type:     { type: String, enum: ['IN', 'OUT'], required: true },
  quantity: { type: Number, required: true },
  note:     { type: String, default: '' },
}, { timestamps: true })

const MovementsModel = model("Movements", movementSchema);
export default MovementsModel;

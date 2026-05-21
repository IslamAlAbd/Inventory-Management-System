import MovementsModel from "../model/movementModel.js";
import ProductModel from "../model/productModel.js";

class MovementsService {
  async getAllMovements() {
    try {
      const movements = await MovementsModel.find();
      return { success: true, data: movements };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getMovementsById(id) {
    try {
      const movement = await MovementsModel.findById(id);
      if (!movement) return { success: false, error: "Movement Not Found" };
      return { success: true, data: movement };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async addMovement(movementData) {
    try {
      if (
        !movementData.product_id ||
        !movementData.type ||
        !movementData.quantity
      ) {
        return { success: false, error: "all fields are required" };
      }
      const product = await ProductModel.findById(movementData.product_id);
      if (!product) return { success: false, error: "Product Not Found" };

      if (
        movementData.type === "OUT" &&
        product.quantity < movementData.quantity
      ) {
        return {
          success: false,
          error: `Not enough stock. Available: ${product.quantity}, Requested: ${movementData.quantity}`,
        };
      }
      if (movementData.type === "OUT") {
        product.quantity -= movementData.quantity;
      } else if (movementData.type === "IN") {
        product.quantity += movementData.quantity;
      }
      let warning = null;
      if (product.quantity < product.min_quantity) {
        warning = `Low stock warning! Current: ${product.quantity}, Minimum: ${product.min_quantity}`;
      }
      await product.save();
      const newMov = await MovementsModel.create(movementData);
      return { success: true, data: newMov, warning };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateMovement(id, movementData) {
    try {
      const movement = await MovementsModel.findById(id);
      if (!movement) return { success: false, error: "Movement Not Found" };
      const updateMov = await MovementsModel.findByIdAndUpdate(
        id,
        movementData,
        { returnDocument: 'after' },
      );
      return { success: true, data: updateMov };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteMovement(id) {
    try {
      const movExists = await MovementsModel.findById(id);
      if (!movExists) return { success: false, error: "Movement not found" };

      const product = await ProductModel.findById(movExists.product_id);
      if (!product) return { success: false, error: "Product not found" };

      // reverse the quantity
      if (movExists.type === "OUT") {
        product.quantity += movExists.quantity; // give it back
      } else if (movExists.type === "IN") {
        product.quantity -= movExists.quantity; // take it back
      }

      await product.save();
      await MovementsModel.findByIdAndDelete(id);
      return {
        success: true,
        data: { message: "Movement deleted successfully" },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default MovementsService;

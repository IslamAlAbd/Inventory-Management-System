import ProductModel from "../model/productModel.js";

class productService {
  async getAllProduct() {
    try {
      const products = await ProductModel.find();
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) return { success: false, error: "Product Not Found" };
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async addProduct(productData) {
    try {
      if (
        !productData.name ||
        !productData.price ||
        !productData.quantity ||
        !productData.min_quantity
      ) {
        return { success: false, error: "all fields are required" };
      }

      const existingProduct = await ProductModel.findOne({
        name: productData.name,
      });
      if (existingProduct)
        return { success: false, error: "Product already exists" };
      

      const newProduct = await ProductModel.create(productData);
      return { success: true, data: newProduct };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateProduct(id, productData) {
    try {
      const updateProduct = await ProductModel.findByIdAndUpdate(
        id,
        productData,
        { returnDocument: 'after' },
      );
      if (!updateProduct) return { success: false, error: "Product not found" }
      return { success: true, data: updateProduct };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteProduct(id) {
    try {
      const productExists = await ProductModel.findById(id);
      if (!productExists) {
        return { success: false, error: "product not found" };
      }

      await ProductModel.findByIdAndDelete(id);
      return {
        success: true,
        data: { message: "product deleted successfully" },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default productService;

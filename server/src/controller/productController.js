import productService from "../service/productService.js";

const prodService = new productService();

export const getAllProducts = async (req, res) => {
  const result = await prodService.getAllProduct();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
};

export const getProductsById = async (req, res) => {
  const { id } = req.params;
  const result = await prodService.getProductById(id);

  if (result.success) {
    res.status(200).json(result.data);
  } else if (result.error === "Product not found") {
    res.status(404).json({ error: result.error });
  } else {
    res.status(500).json({ error: result.error });
  }
};

export const createProducts = async (req, res) => {
  const result = await prodService.addProduct(req.body);

  if (result.success) {
    res.status(201).json({ data: result.data });
  } else if (result.error === "all fields are required") {
    res.status(400).json({ error: result.error });
  } else if (result.error === "Product already exists") {
    res.status(404).json({ error: result.error });
  } else {
    res.status(500).json({ error: result.error });
  }
};

export const updateProducts = async (req, res) => {
  const { id } = req.params;
  const result = await prodService.updateProduct(id, req.body);

  if (result.success) {
    res.status(200).json(result.data);
  } else if (result.error === "Product not found") {
    res.status(404).json({ error: result.error });
  } else {
    res.status(500).json({ error: result.error });
  }
};

export const deleteProducts = async (req, res) => {
  const { id } = req.params;
  const result = await prodService.deleteProduct(id);

  if (result.success) {
    res.status(200).json(result.data);
  } else if (result.error == "Product not found") {
    res.status(404).json({ error: result.error });
  } else {
    res.status(500).json({ error: result.error });
  }
};

import MovementsService from "../service/movementService.js";

const movService = new MovementsService();

export const getAllMovements = async (req, res) => {
  const result = await movService.getAllMovements();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
};

export const getMovById = async (req, res) => {
  const { id } = req.params;
  const result = await movService.getMovementsById(id);

  if (result.success) {
    res.status(200).json(result.data);
  } else if (result.error === "Movement not found") {
    res.status(404).json({ error: result.error });
  } else {
    res.status(500).json({ error: result.error });
  }
};

export const createMov = async (req, res) => {
  const result = await movService.addMovement(req.body);

  if (result.success) {
    res.status(201).json({ data: result.data, warning: result.warning });
  } else if (result.error === "all fields are required") {
    res.status(400).json({ error: result.error });
  } else if (result.error === "Product Not Found") {
    res.status(404).json({ error: result.error });
  } else {
    res.status(500).json({ error: result.error });
  }
};

export const updateMovement = async (req, res) => {
  const { id } = req.params;
  const result = await movService.updateMovement(id, req.body);

  if (result.success) {
    res.status(200).json(result.data);
  } else if (result.error === "Movement not found") {
    res.status(404).json({ error: result.error });
  } else {
    res.status(500).json({ error: result.error });
  }
};

export const deleteMov = async (req, res) => {
  const { id } = req.params;
  const result = await movService.deleteMovement(id);

  if (result.success) {
    res.status(200).json(result.data);
  } else if (
    result.error === "Movement not found" ||
    result.error == "Product not found"
  ) {
    res.status(404).json({ error: result.error });
  } else {
    res.status(500).json({ error: result.error });
  }
};

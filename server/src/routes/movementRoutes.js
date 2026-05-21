import express from "express";
import {
  createMov,
  deleteMov,
  getAllMovements,
  getMovById,
  updateMovement,
} from "../controller/movementController.js";

const router = express.Router();

router.get("/", getAllMovements);
router.get("/:id", getMovById);
router.post("/", createMov);
router.put("/:id", updateMovement);
router.delete("/:id", deleteMov);

export default router;
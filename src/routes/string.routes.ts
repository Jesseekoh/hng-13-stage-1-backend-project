import { Router } from "express";
import {
  analyzeStringController,
  getFilteredStringsController,
  getStringController,
  deleteStringController,
  filterByNaturalLanguage,
} from "../controllers/string.controller";

const router = Router();

router.post("/", analyzeStringController);
router.get("/filter-by-natural-language", filterByNaturalLanguage);
router.get("/:value", getStringController);
router.get("/", getFilteredStringsController);
router.delete("/:value", deleteStringController);

// router.post("/strings", analyzeStringController);
// app.get("/strings", getFilteredStringsController);
// app.get("/strings/:value", getStringController);
// app.delete("/strings/:value", deleteStringController);

export default router;

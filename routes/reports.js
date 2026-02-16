import express from "express";
import {
  createReport,
  getReports,
  updateReport,
  getReportsByAuthority,
  updateReportRating
} from "../controllers/reportController.js";

const router = express.Router();

// User submits report
router.post("/", createReport);

// Get all reports
router.get("/", getReports);

// Authority updates report
router.put("/:id", updateReport);

// Update user rating
router.put("/:id/rating", updateReportRating);

// Get reports assigned to specific authority
router.get("/authority/:email", getReportsByAuthority);

export default router;
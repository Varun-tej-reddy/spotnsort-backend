import Report from "../models/report.js";
import User from "../models/user.js";

// ================================
// Create new report (User Side)
// ================================
export const createReport = async (req, res) => {
  try {
    const {
      userEmail,
      name,
      phone,
      problem,
      subtype,
      priority,
      description,
      area,
      lat,
      lng,
      photo,
    } = req.body;

    if (
      !userEmail ||
      !problem ||
      !subtype ||
      !priority ||
      !description ||
      !area ||
      lat == null ||
      lng == null ||
      !photo
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReport = new Report({
      userEmail,
      name,
      phone,
      problem,
      subtype,
      priority,
      description,
      area,
      lat,
      lng,
      photo,
      status: "Pending",
      createdAt: new Date(),
    });

    await newReport.save();
    res.status(201).json({
      message: "Report submitted successfully",
      report: newReport,
    });
  } catch (err) {
    console.error("Report submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// Get all reports (Admin / Display)
// ================================
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error("Fetch reports error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// Authority updates report
// (Adds authority info automatically)
// ================================
export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      authorityEmail,
      comment,
      scheduledAt,
      estimatedDays,
      resolvedPic,
      status,
    } = req.body;

    // Fetch authority details from database
    let authorityInfo = {};
    if (authorityEmail) {
      const authUser = await User.findOne({ email: authorityEmail });
      if (authUser && authUser.role === "authority") {
        authorityInfo = {
          _id: authUser._id,
          name: authUser.name || "",
          role: authUser.role || "authority",
          phone: authUser.phone || "",
          idCard: authUser.idCard || "", // optional
          email: authUser.email,
        };
      }
    }

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      {
        comment,
        scheduledAt,
        estimatedDays,
        resolvedPic,
        status,
        updatedAt: new Date(),
        authorityInfo, // store all authority details here
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Report updated successfully", report: updatedReport });
  } catch (err) {
    console.error("Error updating report:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// Get reports by authority (Dashboard)
// ================================
export const getReportsByAuthority = async (req, res) => {
  try {
    const { email } = req.params;
    const reports = await Report.find({
      "authorityInfo.email": email,
    }).sort({ updatedAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error("Error fetching authority reports:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// Update report rating (User Side)
// ================================
export const updateReportRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (rating === undefined || rating < 0) {
      return res.status(400).json({ message: "Invalid rating" });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { userRating: rating },
      { new: true }
    );

    res.status(200).json({ message: "Rating updated", report });
  } catch (err) {
    console.error("Error updating rating:", err);
    res.status(500).json({ message: "Error updating rating" });
  }
};

import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  name: String,
  phone: String,
  problem: String,
  subtype: String,
  priority: String,
  description: String,
  area: Object,
  lat: Number,
  lng: Number,
  photo: String,

  status: { type: String, default: "Pending" },

  comment: String,
  scheduledAt: String,
  estimatedDays: Number,
  resolvedPic: String,

  authorityInfo: {
    _id: String,
    name: String,
    role: String,
    phone: String,
    idCard: String,
    email: String,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userRating: { type: Number, default: 0 },
});

export default mongoose.model("Report", reportSchema);

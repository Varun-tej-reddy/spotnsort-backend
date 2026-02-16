import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },          // fullName from frontend
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "authority"], default: "user" },

  location: { type: String },                      // new
  idNumber: { type: String },                      // authority only
  idCard: { type: String },                        // store file name or base64
  authorityRole: { type: String },                 // authority only

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
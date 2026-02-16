import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "authority"], default: "user" },
  phone: String,
  idCard: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
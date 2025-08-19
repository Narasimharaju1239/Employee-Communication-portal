import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Employee", "Admin", "SuperAdmin", "NewUser", "employee", "admin", "superadmin", "newuser"], required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  resetPasswordOtp: { type: String },
  resetPasswordOtpExpires: { type: Date },
  imageUrl: { type: String },
  status: { type: String, enum: ["pending", "active"], default: "pending" }
});

export default mongoose.model("User", userSchema);

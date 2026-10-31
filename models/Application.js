import mongoose from "mongoose";
import { CLASSES, STATUSES, GENDERS } from "@/lib/constants";
const schema = new mongoose.Schema({
  applicationNo: { type: String, required: true, unique: true },
  studentName: { type: String, required: true, trim: true },
  dob: { type: String, required: true },
  gender: { type: String, enum: GENDERS, required: true },
  classApplied: { type: String, enum: CLASSES, required: true, index: true },
  parentName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, index: true },
  email: { type: String, required: true, lowercase: true },
  address: { type: String, required: true },
  previousSchool: { type: String, default: "" },
  message: { type: String, default: "" },
  status: { type: String, enum: STATUSES, default: "pending", index: true },
}, { timestamps: true });
schema.index({ createdAt: -1 });
export default mongoose.models.Application || mongoose.model("Application", schema);

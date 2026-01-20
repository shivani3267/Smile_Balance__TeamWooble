import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },

  // SMILE FEATURE
  totalSmileCount: { type: Number, default: 0 },
  todaySmileCount: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastSmileDate: { type: String, default: null },

  // ✅ NEW: Store last smile time (for 6-hour timer)
  lastSmileTime: { type: Date, default: null },

  // Store image hashes to prevent duplicate uploads
  smileHashes: [{ type: String }],

  // Activity log
  activity: [
    {
      action: { type: String },
      time: { type: Date },
      creditsEarned: { type: Number },
    },
  ],
});

// ✅ Hash password before saving (Mongoose v8 safe)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);

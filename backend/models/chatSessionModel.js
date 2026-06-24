import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "bot"], required: true },
    text: { type: String, required: true },
    time: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  messages: { type: [messageSchema], default: [] },

  // (auto delete after 6 hours)
  createdAt: { type: Date, default: Date.now, expires: 21600 },
});

export default mongoose.model("ChatSession", chatSessionSchema);

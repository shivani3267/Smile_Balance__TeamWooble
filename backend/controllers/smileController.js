import crypto from "crypto";
import User from "../models/userModel.js";

// ✅ Reward Logic
const getReward = (totalSmileCount) => {
  if (totalSmileCount <= 2) return Math.floor(Math.random() * 41) + 80; // 80–120
  if (totalSmileCount <= 5) return Math.floor(Math.random() * 31) + 30; // 30–60
  return Math.floor(Math.random() * 20) + 1; // 1–20
};

// ✅ ADD SMILE (upload + hash + update stats)
export const addSmile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No image provided for verification." });
    }

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const imageHash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");

    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date().toISOString().split("T")[0];

    // ✅ Prevent duplicate image
    if (user.smileHashes.includes(imageHash)) {
      return res
        .status(400)
        .json({ message: "This smile has already been verified!" });
    }

    // ✅ Reset today count if new day
    if (user.lastSmileDate !== today) {
      user.todaySmileCount = 0;
    }

    // ✅ Daily limit 2/day
    if (user.todaySmileCount >= 2) {
      return res.status(400).json({ message: "Daily limit reached." });
    }

    user.totalSmileCount += 1;
    user.todaySmileCount += 1;

    // ✅ Streak logic
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    if (user.lastSmileDate === yesterday) user.streak += 1;
    else if (user.lastSmileDate !== today) user.streak = 1;

    user.lastSmileDate = today;

    // ✅ Store hash
    user.smileHashes.push(imageHash);

    // ✅ Reward
    const reward = getReward(user.totalSmileCount);
    user.balance += reward;

    // ✅ Activity
    user.activity.push({
      action: "smile",
      time: new Date(),
      creditsEarned: reward,
    });

    await user.save();

    return res.status(200).json({
      message: `Smile verified and ₹${reward} added!`,
      totalSmileCount: user.totalSmileCount,
      todaySmileCount: user.todaySmileCount,
      streak: user.streak,
      balance: user.balance,
      reward,
      activity: user.activity.slice(-6).reverse(),
    });
  } catch (err) {
    console.error("AddSmile Error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// ✅ GET STATS (Dashboard)
export const getStats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id || req.user._id;

    const user = await User.findById(userId).select(
      "fullName email balance streak totalSmileCount todaySmileCount activity"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      message: "Stats fetched",
      user,
    });
  } catch (err) {
    console.error("GetStats Error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

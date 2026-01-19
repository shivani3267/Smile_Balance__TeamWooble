import User from "../models/userModel.js";

export const addSmile = async (req, res) => {
  try {
    const user = req.user; // full user from protect middleware

    const today = new Date().toISOString().split("T")[0];

    // 👉 Reset today's count if date is changed
    if (user.lastSmileDate !== today) {
      user.todaySmileCount = 0;
    }

    // 👉 Check daily limit (2 per day)
    if (user.todaySmileCount >= 2) {
      return res.status(400).json({
        message: "Daily limit reached. You can smile again tomorrow!",
      });
    }

    // 👉 Increase counters
    user.totalSmileCount += 1;
    user.todaySmileCount += 1;
    user.lastSmileDate = today;

    // 👉 Streak logic
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    if (user.lastSmileDate === today) {
      if (user._previousLastDate === yesterday) {
        user.streak += 1; 
      } else if (user.streak === 0) {
        user.streak = 1; 
      }
    }

    // 👉 Update activity log
    if (!user.activity) user.activity = [];
    user.activity.push({
      type: "smile",
      time: new Date(),
      creditsEarned: 10,
    });

    // 👉 Increase wallet (if you have credits)
    if (user.credits !== undefined) {
      user.credits += 10;
    }

    await user.save();

    return res.json({
      message: "Smile added successfully",
      totalSmileCount: user.totalSmileCount,
      todaySmileCount: user.todaySmileCount,
      streak: user.streak,
      credits: user.credits,
      activity: user.activity.slice(-6).reverse(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

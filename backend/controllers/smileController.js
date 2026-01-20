
export const addSmile = async (req, res) => {
  try {
    console.log("===== AddSmile Called =====");
    console.log("req.user:", req.user);

    if (!req.file) {
      return res.status(400).json({ message: "No image provided for verification." });
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

    // ✅ Duplicate check
    if (user.smileHashes.includes(imageHash)) {
      return res.status(400).json({ message: "This smile has already been verified!" });
    }

    // ✅ Reset daily count if new day
    if (user.lastSmileDate !== today) user.todaySmileCount = 0;

    // ✅ Daily limit
    if (user.todaySmileCount >= 2) {
      return res.status(400).json({ message: "Daily limit reached." });
    }

    // ✅ Update counts
    user.totalSmileCount += 1;
    user.todaySmileCount += 1;

    // ✅ Streak logic
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (user.lastSmileDate === yesterday) user.streak += 1;
    else if (user.lastSmileDate !== today) user.streak = 1;

    user.lastSmileDate = today;

    // ✅ Save hash + balance
    user.smileHashes.push(imageHash);
    user.balance += 10;

    // ✅ Activity log (use action not type)
    user.activity.push({
      action: "smile",
      time: new Date(),
      creditsEarned: 10,
    });

    await user.save();

    return res.json({
      message: "Smile verified and ₹10 added!",
      totalSmileCount: user.totalSmileCount,
      todaySmileCount: user.todaySmileCount,
      streak: user.streak,
      balance: user.balance,
      activity: user.activity.slice(-6).reverse(),
    });
  } catch (err) {
    console.error("AddSmile Error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

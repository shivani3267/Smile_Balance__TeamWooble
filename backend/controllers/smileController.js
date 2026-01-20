
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

    //Duplicate check
    if (user.smileHashes.includes(imageHash)) {
      return res.status(400).json({ message: "This smile has already been verified!" });
    }

    
    if (user.lastSmileDate !== today) user.todaySmileCount = 0;

    
    if (user.todaySmileCount >= 2) {
      return res.status(400).json({ message: "Daily limit reached." });
    }


    user.totalSmileCount += 1;
    user.todaySmileCount += 1;

  
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (user.lastSmileDate === yesterday) user.streak += 1;
    else if (user.lastSmileDate !== today) user.streak = 1;

    user.lastSmileDate = today;

  
    user.smileHashes.push(imageHash);
    user.balance += 10;


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

export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select(
      "fullName email totalSmileCount todaySmileCount streak balance activity"
    );

    return res.status(200).json({
      message: "Stats fetched",
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

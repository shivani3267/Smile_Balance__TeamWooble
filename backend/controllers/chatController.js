import ChatSession from "../models/chatSessionModel.js";

// ✅ simple smart bot reply generator
const getBotReply = (text) => {
  const msg = text.toLowerCase();

  if (msg.includes("exam") || msg.includes("test")) {
    return "Exams can feel really heavy 😞. Want to tell me what went wrong today?";
  }

  if (msg.includes("family") || msg.includes("parents")) {
    return "Family pressure can be hard. Do you want to share what happened at home?";
  }

  if (msg.includes("friend") || msg.includes("relationship")) {
    return "Relationships can be stressful sometimes. What happened exactly?";
  }

  if (msg.includes("angry") || msg.includes("anger")) {
    return "It’s okay to feel angry. What made you feel this way?";
  }

  if (msg.includes("sad") || msg.includes("cry")) {
    return "I’m here for you 🤍. Do you want to talk about what’s making you feel sad?";
  }

  return "I understand. Tell me more about what happened 🌸";
};

// ✅ create/get current chat session
export const getChatSession = async (req, res) => {
  try {
    const userId = req.user._id;

    let session = await ChatSession.findOne({ userId });

    if (!session) {
      session = await ChatSession.create({
        userId,
        messages: [
          {
            role: "bot",
            text: "Hey, I noticed you might be feeling low 😟. Want to talk about it?",
          },
        ],
      });
    }

    return res.status(200).json({
      message: "Chat session fetched",
      session,
    });
  } catch (err) {
    return res.status(500).json({ message: "Chat error", error: err.message });
  }
};

// ✅ send message
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    let session = await ChatSession.findOne({ userId });

    if (!session) {
      session = await ChatSession.create({ userId, messages: [] });
    }

    // save user message
    session.messages.push({ role: "user", text });

    // bot reply
    const reply = getBotReply(text);

    // save bot reply
    session.messages.push({ role: "bot", text: reply });

    await session.save();

    return res.status(200).json({
      message: "Message stored",
      reply,
      session,
    });
  } catch (err) {
    return res.status(500).json({ message: "Chat error", error: err.message });
  }
};

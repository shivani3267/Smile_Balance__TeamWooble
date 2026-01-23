import ChatSession from "../models/chatSessionModel.js";

//  simple smart bot reply generator
const getBotReply = (text) => {
  const msg = text.toLowerCase();

  // exams / studies
  if (msg.includes("exam") || msg.includes("test") || msg.includes("result") || msg.includes("marks")) {
    return "Exams can feel really heavy 😞. Want to tell me what went wrong today?";
  }

  if (msg.includes("study") || msg.includes("college") || msg.includes("assignment") || msg.includes("project")) {
    return "Studies can be stressful sometimes 📚. What part is troubling you the most?";
  }

  // family
  if (msg.includes("family") || msg.includes("parents") || msg.includes("mother") || msg.includes("father")) {
    return "Family pressure can be hard 🤍. Do you want to share what happened at home?";
  }

  // friends / relationship
  if (msg.includes("friend") || msg.includes("friends")) {
    return "Friendship problems hurt 😔. Did something happen between you both?";
  }

  if (msg.includes("relationship") || msg.includes("breakup") || msg.includes("boyfriend") || msg.includes("girlfriend")) {
    return "Relationships can be emotionally draining 💔. Want to talk about what happened?";
  }

  // emotions
  if (msg.includes("angry") || msg.includes("anger") || msg.includes("frustrated") || msg.includes("irritated")) {
    return "It’s okay to feel angry 😤. What exactly triggered it today?";
  }

  if (msg.includes("sad") || msg.includes("cry") || msg.includes("crying") || msg.includes("hurt")) {
    return "I’m here for you 🤍. Do you want to talk about what’s making you feel sad?";
  }

  if (msg.includes("anxiety") || msg.includes("panic") || msg.includes("scared") || msg.includes("worried")) {
    return "That sounds really overwhelming 😟. Are you feeling anxious right now?";
  }

  if (msg.includes("stress") || msg.includes("stressed") || msg.includes("pressure")) {
    return "Stress can feel too much sometimes 😞. What’s the biggest thing on your mind right now?";
  }

  if (msg.includes("lonely") || msg.includes("alone") || msg.includes("no one")) {
    return "Feeling lonely is really painful 😔. I’m here with you. Want to share what’s been happening?";
  }

  if (msg.includes("tired") || msg.includes("exhausted") || msg.includes("burnout")) {
    return "You sound really tired 😞. Have you been overthinking or working too much lately?";
  }

  // confidence / motivation
  if (msg.includes("confidence") || msg.includes("insecure") || msg.includes("self doubt")) {
    return "Self-doubt is very common 😔. Want to tell me what made you feel this way?";
  }

  if (msg.includes("motivation") || msg.includes("demotivated") || msg.includes("lazy")) {
    return "Motivation goes up and down 🌧️. Want to tell me what’s stopping you right now?";
  }

  if (msg.includes("failure") || msg.includes("failed") || msg.includes("loser")) {
    return "You’re not a failure 🤍. One bad phase doesn’t define you. What happened exactly?";
  }

  // job / future
  if (msg.includes("job") || msg.includes("career") || msg.includes("placement") || msg.includes("interview")) {
    return "Career pressure is real 😟. Do you want to share what you’re worried about?";
  }

  if (msg.includes("future") || msg.includes("life") || msg.includes("direction")) {
    return "It’s okay to feel confused about the future 🌸. What’s the main fear you have right now?";
  }

  // health / sleep
  if (msg.includes("sleep") || msg.includes("insomnia") || msg.includes("night")) {
    return "Sleep issues can make everything feel worse 😞. Are you having trouble falling asleep or waking up often?";
  }

  if (msg.includes("headache") || msg.includes("pain") || msg.includes("sick")) {
    return "That sounds uncomfortable 😔. Is it physical pain or more like mental stress showing in your body?";
  }

  // money
  if (msg.includes("money") || msg.includes("financial") || msg.includes("bills") || msg.includes("loan")) {
    return "Money stress can be exhausting 😟. Want to talk about what’s worrying you financially?";
  }

  // if they say "help"
  if (msg.includes("help") || msg.includes("support") || msg.includes("talk")) {
    return "I’m here for you 🤍. Tell me what’s bothering you, slowly.";
  }

  // fallback
  return "I understand 🌸. Tell me more about what happened.";
};


// create/get current chat session
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

// send message
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

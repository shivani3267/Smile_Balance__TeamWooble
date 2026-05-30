import ChatSession from "../models/chatSessionModel.js";
import { GoogleGenAI } from "@google/genai";

//  simple smart bot reply generator

const getBotReply = async (history) => {
  try {
    const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API});
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,

      config: {
        systemInstruction: `
          You are a supportive and calm friend.
          Help the user feel relaxed and heard.
          If the user seems deeply depressed or unsafe,
          suggest talking to a trusted person or helpline.
          Otherwise listen to him and motivate him/her with positive words.
          Your name is Zia. You are very positive .
        `,
      },
    });

    return response.text;
  } catch (err) {
    console.log(err);
    return "I'm here for you. Want to talk more?";
  }
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

    // CREATE HISTORY HERE
    const history = session.messages.map((msg) => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    // bot reply
    const reply = await getBotReply(history);

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

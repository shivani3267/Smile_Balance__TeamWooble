import nodemailer from "nodemailer";

const sendMail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SmileBalance" <${process.env.MY_EMAIL}>`,
      to: email,
      subject,
      text: message,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

export default sendMail;
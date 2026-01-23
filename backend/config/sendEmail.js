import nodemailer from "nodemailer";

const sendMail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: email,
      subject,
      text: message,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

export default sendEmail;

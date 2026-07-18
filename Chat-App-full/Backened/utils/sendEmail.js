import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       // hjha63521@gmail.com
        pass: process.env.EMAIL_PASS,   // 16-digit App Password
      },
    });

    await transporter.sendMail({
      from: `"GoChat" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.log("❌ Email error:", err.message);
  }
};

export default sendEmail;
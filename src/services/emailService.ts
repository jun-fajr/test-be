import nodemailer from "nodemailer";

export const sendWelcomeEmail = async (recipientEmail: string) => {
  const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const emailOptions = {
    from: process.env.EMAIL_USER, 
    to: recipientEmail,
    subject: "Welcome to Our Service!",
    text: "Hi Salam kenal.",
  };

  try {
    await emailTransporter.sendMail(emailOptions);
    console.log(`Email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

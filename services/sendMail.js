const nodemailer = require("nodemailer");

// Load environment variables
const { GMAIL_USER, GMAIL_PASSWORD } = require("../config/env");

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use SSL (secure)
  secure: true, // true for port 465, false for 587
  auth: {
    user: GMAIL_USER, // Your Gmail address
    pass: GMAIL_PASSWORD, // Use an App Password if 2FA is enabled
  },
});

// Function to send email
const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Supriyo Maity" <${GMAIL_USER}>`, // Sender address
      to, // Recipient email
      subject, // Email subject
      text, // Plain text version
      html, // HTML version
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendMail;

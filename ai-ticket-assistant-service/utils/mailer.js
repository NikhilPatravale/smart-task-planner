import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: 'noreaply@ticket-tracker',
      to,
      subject,
      text,
    });
    console.log('📤 Message sent. MessageId: ', info.messageId)
    return info;
  } catch (err) {
    console.error("❌ Error during sending mail", err.message);
  }
};
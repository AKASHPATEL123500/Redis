import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

export const nodemailerService = {
  async sendMail({ to, subject, html }: SendMailParams): Promise<void> {
    const mailOptions = {
      from: `ARG COMMUNITY <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer Success] Mail dispatched. ID: ${info.messageId}`);
  },
};

// import nodemailer from "nodemailer";

// const sendMail = async ({ to, subject, html, text }) => {
//     const transpoter = await nodemailer.createTransporter(
//         service : "gamil",
//         auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS
//     }
//     )

//     const mailOption = {
//         from: `ARG COMINUITY <${process.env.MIAL_USER}>`,
//         to,
//         subject,
//         html,
//         text
//     }

//     const info = await transpoter.sendMail(mailOption)
//     console.log("This is info of mail: ", info);
//     console.log("Mail send successfully: ", info.messageId);
// }
//   export default sendMail

// import nodemailer from "nodemailer";
// import "dotenv/config";

// // 1. Transporter ko ek hi baar initialize karo (Reused for all mails)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS, // App Password use karna production me
//   },
// });

// interface MailOption {
//   to: string;
//   subject: string;
//   html: string;
//   text?: string;
// }

// export async function sendMail({
//   to,
//   subject,
//   html,
//   text,
// }: MailOption): Promise<void> {
//   const mailOption = {
//     from: `ARG COMMUNITY <${process.env.MAIL_USER}>`,
//     to,
//     subject,
//     html,
//     text,
//   };
//   const info = await transporter.sendMail(mailOption);
//   console.log(`[Email Success] MessageId: ${info.messageId}`);
// }

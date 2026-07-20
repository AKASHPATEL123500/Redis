import { Job } from "bullmq";
import { getWelcomeTemplate } from "../template/sendMailTemplate.ts";
import { nodemailerService } from "../services/nodemailer.services.ts";

export async function sendMail(job: Job): Promise<void> {
  const { name, email } = job.data;
  console.log(`[WelcomeHandler] Compiling template for user: ${email}`);
  const htmlTemplate = getWelcomeTemplate(name);

  await nodemailerService.sendMail({
    to: email,
    subject: "Welcome to the Community! 🎉",
    html: htmlTemplate,
  });
  console.log(`[WelcomeHandler] Mail send successfully  for user: ${email}`);
}

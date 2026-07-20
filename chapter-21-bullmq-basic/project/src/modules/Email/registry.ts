import { JOB_NAMES } from "./constants/jobsName.ts";
import { newsletterHandler } from "./handlers/newalater.handler.ts";
import { otpHandler } from "./handlers/otp.handler.ts";
import { sendMail } from "./handlers/wellcome.handler.ts";

export const emailRegistry = {
  [JOB_NAMES.SEND_WELCOME_EMAIL]: sendMail,
  [JOB_NAMES.SEND_OTP_EMAIL]: otpHandler,
  [JOB_NAMES.SEND_NEWSLETTER]: newsletterHandler,
};

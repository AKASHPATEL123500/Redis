export const JOB_NAMES = {
  SEND_WELCOME_EMAIL: "SEND_WELCOME_EMAIL",
  SEND_OTP_EMAIL: "SEND_OTP_EMAIL",
  SEND_NEWSLETTER: "SEND_NEWSLETTER",
} as const;

// TypeScript magic: Taaki string safety mile
export type JobNameType = (typeof JOB_NAMES)[keyof typeof JOB_NAMES];

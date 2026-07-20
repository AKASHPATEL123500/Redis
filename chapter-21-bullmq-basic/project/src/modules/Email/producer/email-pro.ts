import { JOB_NAMES } from "../constants/jobsName.ts";
import { emailQueue } from "../queue/emailQueue.ts";

interface WellcomeEmailPayload {
  name: string;
  username: string;
  email: string;
}

const emailProducer = {
  async sendWellcomeEmail(payload: WellcomeEmailPayload): Promise<void> {
    try {
      console.log(
        "[ Producer ] Job recive successfully from the controller...",
      );
      await emailQueue.add(JOB_NAMES.SEND_WELCOME_EMAIL, payload, {
        jobId: `welcome-${payload.email}-${Date.now()}`,
      });
      console.log("[JOB] Job Added Successfully");
    } catch (error) {
      console.error("[Queue Error] Failed to add welcome email job:", error);
      throw error;
    }
  },
};

export default emailProducer;

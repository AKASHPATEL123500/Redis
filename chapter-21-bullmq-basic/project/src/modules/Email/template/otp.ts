export const getOtpHTML = (otp: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h3>Your Verification Code</h3>
      <p style="font-size: 24px; font-weight: bold; color: #4F46E5; letter-spacing: 2px;">${otp}</p>
      <p>This OTP is valid for 5 minutes only. Do not share it with anyone.</p>
    </div>
  `;

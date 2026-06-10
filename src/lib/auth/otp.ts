/**
 * OTP Service Utility
 * Supports Mock, Twilio, and Firebase (Verification Only)
 */

export class OTPService {
  /**
   * Sends an OTP to the given phone number
   */
  static async sendOTP(phoneNumber: string): Promise<{ success: boolean; message?: string }> {
    console.log(`[OTP] Sending OTP to ${phoneNumber}`);

    // If Mocking (Development)
    if (process.env.NODE_ENV === "development" || !process.env.TWILIO_ACCOUNT_SID) {
      console.log(`[OTP] MOCK OTP: 123456 sent to ${phoneNumber}`);
      return { success: true, message: "Mock OTP sent" };
    }

    // Twilio Implementation
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID) {
      const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      try {
        await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verifications
          .create({ to: phoneNumber, channel: "sms" });
        return { success: true };
      } catch (error: any) {
        console.error("[OTP] Twilio Send Error:", error);
        return { success: false, message: error.message };
      }
    }

    return { success: false, message: "No OTP provider configured" };
  }

  /**
   * Verifies the OTP for the given phone number
   */
  static async verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {
    console.log(`[OTP] Verifying OTP ${otp} for ${phoneNumber}`);

    // Mock Implementation
    if (process.env.NODE_ENV === "development" || !process.env.TWILIO_ACCOUNT_SID) {
      return otp === "123456";
    }

    // Twilio Implementation
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID) {
      const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      try {
        const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verificationChecks
          .create({ to: phoneNumber, code: otp });
        return verificationCheck.status === "approved";
      } catch (error) {
        console.error("[OTP] Twilio Verify Error:", error);
        return false;
      }
    }

    return false;
  }
}

import nodemailer from 'nodemailer';

// Create reusable transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Sends an OTP email to the user
 */
export async function sendOTPEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your AI Study - Email Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0;">AI Study Companion</h1>
                </div>
                <div style="background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333; margin-top: 0;">Verify Your Email</h2>
                    <p style="color: #666; font-size: 16px;">Thank you for signing up! Please use the following verification code to complete your registration:</p>
                    
                    <div style="background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; margin: 25px 0; text-align: center;">
                        <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        AI Study Companion - Your Personal AI-Powered Learning Assistant
                    </p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
}

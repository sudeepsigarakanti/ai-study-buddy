import crypto from 'crypto';

/**
 * Generates a random 6-digit OTP
 */
export function generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
}

/**
 * Hashes an OTP for secure storage
 */
export function hashOTP(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

/**
 * Verifies an OTP against its hash
 */
export function verifyOTP(otp: string, hash: string): boolean {
    return hashOTP(otp) === hash;
}

/**
 * Generates OTP expiry time (10 minutes from now)
 */
export function getOTPExpiry(): Date {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}

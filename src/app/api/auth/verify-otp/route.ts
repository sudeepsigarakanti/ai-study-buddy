import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import { verifyOTP } from '../../../../lib/otp';

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { message: 'Please provide email and OTP' },
                { status: 400 }
            );
        }

        await dbConnect();

        const UserModel = User();
        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { message: 'User already verified' },
                { status: 400 }
            );
        }

        if (!user.otp || !user.otpExpiry) {
            return NextResponse.json(
                { message: 'No OTP found. Please request a new one.' },
                { status: 400 }
            );
        }

        // Check if OTP is expired
        if (new Date() > user.otpExpiry) {
            return NextResponse.json(
                { message: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (!verifyOTP(otp, user.otp)) {
            return NextResponse.json(
                { message: 'Invalid OTP' },
                { status: 400 }
            );
        }

        // Mark user as verified and clear OTP
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return NextResponse.json(
            { message: 'Email verified successfully! You can now login.' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('OTP Verification Error:', error);
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}

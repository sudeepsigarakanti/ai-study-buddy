import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';
import { generateOTP, hashOTP, getOTPExpiry } from '../../../../lib/otp';
import { sendOTPEmail } from '../../../../lib/email';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        await dbConnect();

        const UserModel = User();
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists with this email' },
                { status: 400 }
            );
        }

        // Generate OTP
        const otp = generateOTP();
        const otpHash = hashOTP(otp);
        const otpExpiry = getOTPExpiry();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create unverified user with OTP
        await UserModel.create({
            email,
            password: hashedPassword,
            otp: otpHash,
            otpExpiry,
            isVerified: false,
        });

        // Send OTP email
        await sendOTPEmail(email, otp);

        return NextResponse.json(
            { message: 'OTP sent to your email. Please verify to complete signup.' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Signup Error:', error);
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}

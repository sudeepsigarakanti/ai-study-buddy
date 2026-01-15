import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_me';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Please provide all fields' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 400 }
            );
        }

        // Generate Token
        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        const serialized = serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 1, // 1 day
            path: '/',
        });

        return NextResponse.json(
            { message: 'Logged in successfully', user: { id: user._id, username: user.username, email: user.email } },
            {
                status: 200,
                headers: { 'Set-Cookie': serialized },
            }
        );
    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: 'Please provide all fields' },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return NextResponse.json(
            { message: 'User created successfully', user: { id: user._id, username: user.username, email: user.email } },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Signup Error:', error);
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}

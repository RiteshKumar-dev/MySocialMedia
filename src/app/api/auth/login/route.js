import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../mongodb/dbConfig';
import { User } from '../../../../../mongodb/Models/user.model';

export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 404 });
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 400 });
    }

    const token = user.generateAccessToken();
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          lastActiveAt: user.lastActiveAt,
        },
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

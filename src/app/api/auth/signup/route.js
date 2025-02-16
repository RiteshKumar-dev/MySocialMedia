import connectToDatabase from '../../../../../mongodb/dbConfig';
import { User } from '../../../../../mongodb/Models/user.model';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    if (typeof User.prototype.generateOTP !== 'function') {
      return NextResponse.json({ error: 'OTP generation method is missing' }, { status: 500 });
    }
    const user = new User({ email, password });
    const otp = await user.generateOTP();
    return NextResponse.json(
      {
        message: 'Signup successful, OTP sent',
        user: { email, otp },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

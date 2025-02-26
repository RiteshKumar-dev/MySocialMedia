import connectToDatabase from '../../../../../mongodb/dbConfig';
import { User } from '../../../../../mongodb/Models/user.model';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (typeof user.generateOTP !== 'function') {
      return NextResponse.json({ error: 'OTP generation method is missing' }, { status: 500 });
    }

    const otp = await user.generateOTP();

    return NextResponse.json({ message: 'OTP sent successfully', otp }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

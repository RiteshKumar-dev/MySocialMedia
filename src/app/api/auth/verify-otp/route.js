import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { User } from '../../../../../mongodb/Models/user.model';
import connectToDatabase from '../../../../../mongodb/dbConfig';

export async function POST(req) {
  await connectToDatabase();

  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+verifyCode +verifyCodeExpiry');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (hashedOtp !== user.verifyCode || user.verifyCodeExpiry < Date.now()) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // ✅ Mark user as verified
    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: 'OTP verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

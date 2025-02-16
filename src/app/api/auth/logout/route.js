import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../mongodb/dbConfig';
import { authMiddleware } from '../../../../../middleware/authMiddleware';

export async function POST(req) {
  try {
    await connectToDatabase();

    const authResponse = await authMiddleware(req);
    if (!authResponse) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

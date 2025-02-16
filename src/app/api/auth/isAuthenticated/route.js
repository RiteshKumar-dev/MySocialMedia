import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookiesList = await cookies();
    const token = cookiesList.get('token')?.value;
    return NextResponse.json({ success: !!token }, { status: 200 });
  } catch (error) {
    console.error('Error in isAuthenticated API:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

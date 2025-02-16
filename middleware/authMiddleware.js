import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function authMiddleware(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    return email;
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
  }
}

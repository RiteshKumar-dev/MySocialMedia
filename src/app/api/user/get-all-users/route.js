import { NextResponse } from 'next/server';
import { authMiddleware } from '../../../../../middleware/authMiddleware';
import { User } from '../../../../../mongodb/Models/user.model';
import connectToDatabase from '../../../../../mongodb/dbConfig';

export async function GET(req) {
  try {
    await connectToDatabase();

    const authResponse = await authMiddleware(req);
    if (!authResponse) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const users = await User.find().select('-password');
    return NextResponse.json(
      {
        success: true,
        message: 'Users data fetched successfully',
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

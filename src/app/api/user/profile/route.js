import { NextResponse } from 'next/server';
import { authMiddleware } from '../../../../../middleware/authMiddleware';
import { User } from '../../../../../mongodb/Models/user.model';
import connectToDatabase from '../../../../../mongodb/dbConfig';

export async function GET(req) {
  await connectToDatabase();

  const authResponse = await authMiddleware(req);

  if (!authResponse) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: authResponse }).select('-password'); // Exclude password

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User data fetched successfully',
        user: {
          user,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

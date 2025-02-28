import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../mongodb/dbConfig';
import { authMiddleware } from '../../../../../middleware/authMiddleware';
import { User } from '../../../../../mongodb/Models/user.model';

export async function DELETE(req) {
  try {
    await connectToDatabase();

    // Authenticate user
    const authResponse = await authMiddleware(req);
    if (!authResponse) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const email = authResponse; // Get user email from authentication

    // Find and delete user
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Create response with cookie removal
    const response = NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });

    // Remove authentication token
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

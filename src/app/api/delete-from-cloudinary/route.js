import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';
import { authMiddleware } from '../../../../middleware/authMiddleware';

export async function POST(req) {
  try {
    const authResponse = await authMiddleware(req);
    if (!authResponse) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json({ success: false, message: 'Public ID is required' }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video',
    });

    if (result.result !== 'ok') {
      return NextResponse.json({ success: false, message: 'File deletion failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'File deleted successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ success: false, message: 'File delete failed: ' + error.message }, { status: 500 });
  }
}

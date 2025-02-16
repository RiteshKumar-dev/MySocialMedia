import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';
import { authMiddleware } from '../../../../middleware/authMiddleware';

// Utility function to upload file to Cloudinary
const uploadFileToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
    stream.end(buffer);
  });
};

export async function POST(req) {
  try {
    const authResponse = await authMiddleware(req);
    if (!authResponse) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('avatar');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadFileToCloudinary(buffer, 'mySocialMedia');

    return NextResponse.json({ url: result.secure_url, public_id: result.public_id }, { status: 200 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'File upload failed: ' + error.message }, { status: 500 });
  }
}

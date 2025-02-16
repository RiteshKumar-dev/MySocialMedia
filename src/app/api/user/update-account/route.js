import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { authMiddleware } from '../../../../../middleware/authMiddleware';
import { User } from '../../../../../mongodb/Models/user.model';
import connectToDatabase from '../../../../../mongodb/dbConfig';

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

export async function PUT(req) {
  await connectToDatabase();
  try {
    const authResponse = await authMiddleware(req);
    if (!authResponse) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const email = formData.get('email');
    const firstname = formData.get('firstname');
    const lastname = formData.get('lastname');
    const bio = formData.get('bio');
    const profession = formData.get('profession');
    const avatarfile = formData.get('avatar');
    const bgavatarfile = formData.get('bgImage');
    console.log('bg', bgavatarfile);

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    if (!firstname && !lastname && !bio && !profession && !avatarfile && !bgavatarfile) {
      return NextResponse.json({ success: false, message: 'At least one field is required for update' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid email' }, { status: 404 });
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (bio) user.bio = bio;
    if (profession) user.profession = profession;

    if (avatarfile) {
      const bytes = await avatarfile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadFileToCloudinary(buffer, 'mySocialMedia');
      user.avatar = uploadResult.secure_url;
    }

    if (bgavatarfile) {
      const bytes = await bgavatarfile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadFileToCloudinary(buffer, 'mySocialMedia');
      user.bgImage = uploadResult.secure_url;
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: 'User updated successfully',
        updatedUser: { user },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update Account Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';
import { authMiddleware } from '../../../../middleware/authMiddleware';
import { Article } from '../../../../mongodb/Models/article.model';
import { Post } from '../../../../mongodb/Models/post.model';

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
    const text = formData.get('text');
    const file = formData.get('image');
    const userId = formData.get('userId');
    const isArticle = formData.get('isArticle') === 'true'; // Ensure it's treated as a boolean

    if (!text && !file) {
      return NextResponse.json({ error: 'Post content or image is required!' }, { status: 400 });
    }

    let imageUrl = '';
    let imagePublicId = '';
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await uploadFileToCloudinary(buffer, 'mySocialMedia');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }
    const newEntry = await Post.create({
      user: userId,
      text,
      imageUrl,
      imagePublicId,
      isArticle: isArticle,
      likes: [],
      comments: [],
    });

    // // Create either a Post or an Article based on `isArticle`
    // const newEntry = isArticle
    //   ? await Article.create({
    //       user: userId,
    //       text,
    //       imageUrl,
    //       imagePublicId,
    //       isArticle: true, // Mark as an article
    //       likes: [],
    //       comments: [],
    //     })
    // : await Post.create({
    //     user: userId,
    //     text,
    //     imageUrl,
    //     imagePublicId,
    //     isArticle: false,
    //     likes: [],
    //     comments: [],
    //   });

    return NextResponse.json(
      {
        message: isArticle ? 'Article created successfully!' : 'Post created successfully!',
        data: newEntry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post/article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

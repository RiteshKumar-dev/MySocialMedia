import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../mongodb/dbConfig';
import { Post } from '../../../../../mongodb/Models/post.model';

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await Post.getAllPosts();
    return NextResponse.json(posts, { status: 200 });
  } catch (err) {
    console.error('Error fetching posts:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

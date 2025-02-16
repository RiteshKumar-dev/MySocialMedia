import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../mongodb/dbConfig';
import { Post } from '../../../../../../mongodb/Models/post.model';

export async function POST(req, { params }) {
  try {
    await connectToDatabase();
    const { post_id } = await params;
    const { userId } = await req.json();
    const response = await Post.toggleLike(post_id, userId);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { post_id } = await params;
    const response = await Post.getTotalLikes(post_id);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

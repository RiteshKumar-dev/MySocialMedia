import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../mongodb/dbConfig';
import { Post } from '../../../../../../mongodb/Models/post.model';
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { post_id } = await params;

    const response = await Post.deletePost(post_id);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { Post } from '../../../../../../mongodb/Models/post.model';
import connectToDatabase from '../../../../../../mongodb/dbConfig';

export async function POST(req, { params }) {
  try {
    await connectToDatabase();
    const { post_id } = await params;
    const body = await req.json();
    const response = await Post.addComment(post_id, body);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { post_id } = await params;
    const response = await Post.getAllComments(post_id);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { post_id } = await params;
    const body = await req.json();
    const { commentId } = body;
    console.log(commentId);
    const response = await Post.deleteComment(post_id, commentId);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../mongodb/dbConfig';
import { Article } from '../../../../../mongodb/Models/article.model';

export async function GET() {
  try {
    await connectToDatabase();
    const articles = await Article.getAllPosts();
    return NextResponse.json(articles, { status: 200 });
  } catch (err) {
    console.error('Error fetching articles:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

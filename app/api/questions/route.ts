import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Question } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const questions = await Question.find({}).sort({ question_number: 1 });
    
    // Remove correct answers from response for security
    const questionsForStudent = questions.map(q => ({
      question_number: q.question_number,
      question_text: q.question_text,
      options: q.options,
      marks: q.marks,
      section: q.section
    }));
    
    return NextResponse.json({
      success: true,
      questions: questionsForStudent
    });
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

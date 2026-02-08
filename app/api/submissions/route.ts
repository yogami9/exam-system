import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Submission, Student, Question } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    const {
      student_name,
      admission_number,
      start_time,
      end_time,
      time_taken,
      answers,
      violations,
      banned_during_exam,
      violation_summary
    } = data;

    // Create or update student record
    await Student.findOneAndUpdate(
      { admission_number },
      { 
        admission_number,
        full_name: student_name,
        registered_at: new Date()
      },
      { upsert: true }
    );

    // Create submission
    const submission = await Submission.create({
      student_name,
      admission_number,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      time_taken,
      answers,
      violations,
      banned_during_exam,
      violation_summary,
      submitted_at: new Date()
    });

    // Auto-grade MCQs if not banned
    if (!banned_during_exam) {
      const questions = await Question.find({});
      let score = 0;

      questions.forEach((question) => {
        const studentAnswer = answers[`q${question.question_number}`];
        if (studentAnswer !== undefined && studentAnswer === question.correct_answer) {
          score += question.marks;
        }
      });

      // Calculate grade
      const percentage = (score / 100) * 100;
      let grade = 'F';
      if (percentage >= 70) grade = 'A';
      else if (percentage >= 60) grade = 'B';
      else if (percentage >= 50) grade = 'C';
      else if (percentage >= 40) grade = 'D';

      // Update submission with auto-graded score
      submission.marked_score = score;
      submission.grade = grade;
      submission.marked_by = 'Auto-graded';
      submission.marked_date = new Date();
      await submission.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Exam submitted successfully',
      submission_id: submission._id
    });
  } catch (error: any) {
    console.error('Error submitting exam:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit exam' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const admission_number = searchParams.get('admission_number');
    
    if (admission_number) {
      // Get student's submissions
      const submissions = await Submission.find({ 
        admission_number 
      }).sort({ submitted_at: -1 });
      
      return NextResponse.json({
        success: true,
        submissions
      });
    } else {
      // Get all submissions (admin view)
      const submissions = await Submission.find({}).sort({ submitted_at: -1 });
      
      return NextResponse.json({
        success: true,
        submissions
      });
    }
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

import mongoose, { Schema, Model } from 'mongoose';

// Question Interface and Model
export interface IQuestion {
  question_number: number;
  question_text: string;
  options: string[];
  correct_answer: number;
  marks: number;
  section: string;
}

const QuestionSchema = new Schema<IQuestion>({
  question_number: { type: Number, required: true, unique: true },
  question_text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct_answer: { type: Number, required: true },
  marks: { type: Number, required: true, default: 1 },
  section: { type: String, required: true }
});

// Submission Interface and Model
export interface IViolation {
  timestamp: Date;
  violation: string;
}

export interface ISubmission {
  student_name: string;
  admission_number: string;
  start_time: Date;
  end_time: Date;
  time_taken: string;
  answers: { [key: string]: number };
  violations: IViolation[];
  banned_during_exam: boolean;
  violation_summary: {
    tab_switches: number;
    copy_attempts: number;
    paste_attempts: number;
    total_violations: number;
  };
  marked_score?: number;
  grade?: string;
  marked_by?: string;
  marked_date?: Date;
  submitted_at: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
  student_name: { type: String, required: true },
  admission_number: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  time_taken: { type: String, required: true },
  answers: { type: Map, of: Number, required: true },
  violations: [{
    timestamp: { type: Date, required: true },
    violation: { type: String, required: true }
  }],
  banned_during_exam: { type: Boolean, default: false },
  violation_summary: {
    tab_switches: { type: Number, default: 0 },
    copy_attempts: { type: Number, default: 0 },
    paste_attempts: { type: Number, default: 0 },
    total_violations: { type: Number, default: 0 }
  },
  marked_score: { type: Number },
  grade: { type: String },
  marked_by: { type: String },
  marked_date: { type: Date },
  submitted_at: { type: Date, default: Date.now }
});

// Student Interface and Model
export interface IStudent {
  admission_number: string;
  full_name: string;
  registered_at: Date;
}

const StudentSchema = new Schema<IStudent>({
  admission_number: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  registered_at: { type: Date, default: Date.now }
});

// Admin Interface and Model
export interface IAdmin {
  username: string;
  password: string;
  role: string;
  created_at: Date;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'admin' },
  created_at: { type: Date, default: Date.now }
});

// Export Models
export const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
export const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
export const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
export const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

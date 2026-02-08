'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const examCompleted = sessionStorage.getItem('examCompleted');
    const admissionNumber = sessionStorage.getItem('admissionNumber');

    if (!examCompleted || !admissionNumber) {
      router.push('/');
      return;
    }

    fetchResult(admissionNumber);
  }, [router]);

  const fetchResult = async (admissionNumber: string) => {
    try {
      const response = await axios.get(`/api/submissions?admission_number=${admissionNumber}`);
      if (response.data.success && response.data.submissions.length > 0) {
        // Get the latest submission
        const latest = response.data.submissions[0];
        setResult(latest);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-success';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-warning';
      case 'D': return 'bg-orange-500';
      default: return 'bg-danger';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading results...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-xl text-gray-700">No results found. Please contact your instructor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          {result.banned_during_exam ? (
            <FaTimesCircle className="text-danger text-6xl mx-auto mb-4" />
          ) : (
            <FaCheckCircle className="text-success text-6xl mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Submitted Successfully!</h1>
          <p className="text-gray-600">Thank you for completing the exam.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Student Information</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {result.student_name}</p>
            <p><strong>Admission Number:</strong> {result.admission_number}</p>
            <p><strong>Exam Date:</strong> {new Date(result.submitted_at).toLocaleDateString()}</p>
            <p><strong>Time Taken:</strong> {result.time_taken}</p>
            {result.banned_during_exam && (
              <p className="text-danger font-bold">
                ⚠️ Status: Exam terminated due to violations
              </p>
            )}
          </div>
        </div>

        {result.marked_score !== undefined && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Results</h2>
            <div className="text-6xl font-bold text-primary mb-4">
              {result.marked_score}/100
            </div>
            <div className={`inline-block ${getGradeColor(result.grade)} text-white text-3xl font-bold px-8 py-3 rounded-full`}>
              Grade: {result.grade}
            </div>
            <p className={`mt-4 ${result.violation_summary.total_violations > 0 ? 'text-danger' : 'text-success'}`}>
              <strong>Violations:</strong> {result.violation_summary.total_violations}
            </p>
          </div>
        )}

        {result.marked_score === undefined && !result.banned_during_exam && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-800">
              <strong>Note:</strong> Your exam is being reviewed by the instructor. Results will be available soon.
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => {
              sessionStorage.clear();
              router.push('/');
            }}
            className="btn-primary"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaClock, FaExclamationTriangle } from 'react-icons/fa';

const MAX_VIOLATIONS = 2;
const EXAM_DURATION = 2 * 60 * 60; // 2 hours in seconds

interface Question {
  question_number: number;
  question_text: string;
  options: string[];
  marks: number;
  section: string;
}

interface Violation {
  timestamp: Date;
  violation: string;
}

export default function ExamPage() {
  const router = useRouter();
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isBanned, setIsBanned] = useState(false);
  const [startTime] = useState(new Date());
  const [warningMessage, setWarningMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const violationCounts = useRef({
    tabSwitches: 0,
    copyAttempts: 0,
    pasteAttempts: 0
  });

  // Check if student is logged in
  useEffect(() => {
    const info = sessionStorage.getItem('studentInfo');
    if (!info) {
      router.push('/');
      return;
    }
    setStudentInfo(JSON.parse(info));
  }, [router]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/questions');
        if (response.data.success) {
          setQuestions(response.data.questions);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Failed to load exam questions. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    if (studentInfo) {
      fetchQuestions();
    }
  }, [studentInfo]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Security monitoring
  useEffect(() => {
    if (!studentInfo || isBanned) return;

    // Tab/Window visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('Tab switched or window minimized');
        violationCounts.current.tabSwitches++;
        showWarning('⚠️ WARNING: Tab switching detected!');
      }
    };

    // Window blur (lost focus)
    const handleBlur = () => {
      logViolation('Window lost focus');
      showWarning('⚠️ WARNING: Stay on this page!');
    };

    // Prevent context menu (right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logViolation('Right-click attempted');
      showWarning('⚠️ Right-clicking is disabled!');
    };

    // Prevent copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      violationCounts.current.copyAttempts++;
      logViolation('Copy attempt detected');
      showWarning('⚠️ Copying is not allowed!');
    };

    // Prevent paste
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      violationCounts.current.pasteAttempts++;
      logViolation('Paste attempt detected');
      showWarning('⚠️ Pasting is not allowed!');
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && ['c', 'v', 'x', 'a', 'p'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        logViolation(`Keyboard shortcut: ${e.key}`);
        showWarning('⚠️ Shortcuts disabled!');
      }
    };

    // Prevent page unload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave?';
      logViolation('Attempted to leave exam page');
      return e.returnValue;
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Request fullscreen
    requestFullscreen();

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [studentInfo, isBanned]);

  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {
        showWarning('⚠️ Please enable fullscreen mode for exam security');
      });
    }
  };

  const logViolation = (violation: string) => {
    const newViolation = {
      timestamp: new Date(),
      violation
    };
    
    setViolations((prev) => {
      const updated = [...prev, newViolation];
      
      // Check if should ban
      if (updated.length >= MAX_VIOLATIONS && !isBanned) {
        banStudent();
      }
      
      return updated;
    });
  };

  const showWarning = (message: string) => {
    setWarningMessage(message);
    setTimeout(() => setWarningMessage(''), 5000);
  };

  const banStudent = () => {
    setIsBanned(true);
    handleSubmitExam(true);
  };

  const handleAnswerChange = (questionNumber: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [`q${questionNumber}`]: optionIndex
    }));
  };

  const handleAutoSubmit = () => {
    alert('TIME IS UP! Your exam will be submitted automatically.');
    handleSubmitExam(false);
  };

  const handleSubmitExam = async (banned: boolean = false) => {
    if (!studentInfo) return;

    const endTime = new Date();
    const timeTakenMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);

    const submissionData = {
      student_name: studentInfo.fullName,
      admission_number: studentInfo.admissionNumber,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      time_taken: `${timeTakenMinutes} minutes`,
      answers,
      violations,
      banned_during_exam: banned,
      violation_summary: {
        tab_switches: violationCounts.current.tabSwitches,
        copy_attempts: violationCounts.current.copyAttempts,
        paste_attempts: violationCounts.current.pasteAttempts,
        total_violations: violations.length
      }
    };

    try {
      await axios.post('/api/submissions', submissionData);
      
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }

      // Redirect to results or thank you page
      sessionStorage.removeItem('studentInfo');
      sessionStorage.setItem('examCompleted', 'true');
      sessionStorage.setItem('admissionNumber', studentInfo.admissionNumber);
      router.push('/results');
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam. Please contact the administrator.');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading exam...</div>
      </div>
    );
  }

  if (isBanned) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-12 max-w-2xl text-center">
          <h1 className="text-6xl text-danger mb-6">🚫 EXAM TERMINATED</h1>
          <p className="text-2xl font-bold mb-4">You have been banned from continuing this exam.</p>
          <p className="text-lg mb-2">Reason: Exceeded maximum allowed violations ({MAX_VIOLATIONS})</p>
          <p className="text-lg mb-2">Total violations: {violations.length}</p>
          <p className="text-danger mt-6">
            Your partial submission has been recorded and will be reviewed by the instructor.
          </p>
          <p className="text-gray-500 mt-4 text-sm">
            Contact your instructor for further information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen no-select no-context-menu">
      {/* Timer */}
      <div className="fixed top-4 right-4 bg-danger text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
        <FaClock />
        <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
      </div>

      {/* Warning Banner */}
      {warningMessage && (
        <div className="fixed top-20 left-0 right-0 bg-danger text-white py-4 px-6 text-center font-bold z-50 animate-pulse">
          {warningMessage} ({violations.length}/{MAX_VIOLATIONS})
        </div>
      )}

      {/* Activity Log */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-2 px-4 text-sm text-center">
        <span className={violations.length >= MAX_VIOLATIONS - 1 ? 'text-danger' : ''}>
          Violations: {violations.length}/{MAX_VIOLATIONS} | Tab switches: {violationCounts.current.tabSwitches} |{' '}
          {MAX_VIOLATIONS - violations.length > 0
            ? `${MAX_VIOLATIONS - violations.length} warning(s) remaining before BAN`
            : 'BANNED'}
        </span>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="exam-container">
          {/* Header */}
          <div className="exam-header">
            <h1 className="text-3xl font-bold mb-2">BIPS TECHNICAL COLLEGE</h1>
            <p className="text-lg">CNA Comprehensive Knowledge Assessment Test</p>
            <p className="text-sm mt-2">Student: {studentInfo?.fullName} | Admission: {studentInfo?.admissionNumber}</p>
          </div>

          {/* Questions */}
          <div className="p-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="font-bold text-blue-800">Answer ALL 100 multiple choice questions</p>
            </div>

            {questions.map((question) => (
              <div key={question.question_number} className="question-card">
                <div className="font-bold text-lg mb-4">
                  {question.question_number}. {question.question_text}
                  <span className="text-sm text-gray-500 ml-2">({question.marks} mark)</span>
                </div>
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <label key={index} className="option-label">
                      <input
                        type="radio"
                        name={`q${question.question_number}`}
                        value={index}
                        checked={answers[`q${question.question_number}`] === index}
                        onChange={() => handleAnswerChange(question.question_number, index)}
                        className="mr-3 w-4 h-4 text-primary"
                        required
                      />
                      <span>{String.fromCharCode(65 + index)}) {option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="bg-yellow-50 border border-yellow-400 p-4 rounded mb-6">
                <FaExclamationTriangle className="inline mr-2 text-yellow-600" />
                <span className="text-yellow-800">
                  Make sure you have answered all questions before submitting.
                </span>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
                    handleSubmitExam(false);
                  }
                }}
                className="btn-primary text-xl px-12"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

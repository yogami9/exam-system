'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserShield, FaClipboardList, FaExclamationTriangle } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: '',
    agreeTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      alert('You must agree to the exam security terms');
      return;
    }

    // Store student info in sessionStorage
    sessionStorage.setItem('studentInfo', JSON.stringify({
      fullName: formData.fullName,
      admissionNumber: formData.admissionNumber
    }));

    // Navigate to exam page
    router.push('/exam');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="exam-container max-w-2xl w-full">
        {/* Header */}
        <div className="exam-header">
          <h1 className="text-3xl font-bold mb-2">BIPS TECHNICAL COLLEGE</h1>
          <p className="text-lg">AUXILIARY NURSE DEPARTMENT</p>
          <p className="text-sm mt-2">CNA Comprehensive Knowledge Assessment Test</p>
        </div>

        {/* Exam Info */}
        <div className="bg-gray-700 text-white p-4 flex flex-wrap justify-around gap-4">
          <div className="flex items-center gap-2">
            <FaClipboardList />
            <span>100 MCQs</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⏱️ Duration: 2 Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📝 Total Marks: 100</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-8">
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-6">
            <h4 className="text-yellow-800 font-bold text-lg mb-3 flex items-center gap-2">
              <FaExclamationTriangle />
              ⚠️ CRITICAL EXAM SECURITY INSTRUCTIONS
            </h4>
            <ul className="text-yellow-800 space-y-2 list-disc list-inside">
              <li>This exam is monitored for academic integrity</li>
              <li className="font-bold">Do NOT switch tabs, minimize browser, or leave fullscreen mode</li>
              <li className="font-bold">Do NOT copy, paste, or right-click</li>
              <li className="text-red-600 font-bold">
                After 5 violations, you will be PERMANENTLY BANNED from continuing the exam
              </li>
              <li>All suspicious activities will be logged and reported</li>
              <li>You must complete the exam in one sitting</li>
              <li>Answer ALL 100 multiple choice questions</li>
            </ul>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Admission Number *
              </label>
              <input
                type="text"
                required
                value={formData.admissionNumber}
                onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                placeholder="Enter your admission number"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-1 w-5 h-5 text-primary"
              />
              <label htmlFor="agreeTerms" className="text-gray-700">
                I understand and agree to the exam security terms, including the 2-violation ban policy
              </label>
            </div>

            <button type="submit" className="btn-primary w-full text-lg">
              Start Exam
            </button>
          </form>

          {/* Admin Access */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 mx-auto"
            >
              <FaUserShield />
              Admin Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

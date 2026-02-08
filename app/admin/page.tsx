'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaClipboardList, FaChartBar, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsLoggedIn(true);
      fetchSubmissions();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/auth/login', loginData);
      
      if (response.data.success) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        setIsLoggedIn(true);
        fetchSubmissions();
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    setIsLoggedIn(false);
    router.push('/');
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/submissions');
      if (response.data.success) {
        setSubmissions(response.data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
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

  const calculateStats = () => {
    const total = submissions.length;
    const completed = submissions.filter(s => !s.banned_during_exam).length;
    const banned = submissions.filter(s => s.banned_during_exam).length;
    const graded = submissions.filter(s => s.marked_score !== undefined).length;
    
    const averageScore = submissions
      .filter(s => s.marked_score !== undefined)
      .reduce((sum, s) => sum + s.marked_score, 0) / graded || 0;

    return { total, completed, banned, graded, averageScore: averageScore.toFixed(2) };
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🔐 Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Username</label>
              <input
                type="text"
                required
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full text-gray-600 hover:text-primary transition-colors"
            >
              Back to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">🔐 Admin Dashboard</h1>
                <p className="text-gray-300">Exam Management & Results</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-danger hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-700">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex-1 py-4 px-6 text-white font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'submissions' ? 'bg-gray-800' : 'hover:bg-gray-600'
              }`}
            >
              <FaClipboardList />
              Submissions
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-4 px-6 text-white font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'results' ? 'bg-gray-800' : 'hover:bg-gray-600'
              }`}
            >
              <FaChartBar />
              Results & Stats
            </button>
            <button
              onClick={() => setActiveTab('violations')}
              className={`flex-1 py-4 px-6 text-white font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'violations' ? 'bg-gray-800' : 'hover:bg-gray-600'
              }`}
            >
              <FaExclamationTriangle />
              Violations
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : (
              <>
                {/* Submissions Tab */}
                {activeTab === 'submissions' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Student Submissions</h2>
                    {submissions.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No submissions yet</p>
                    ) : (
                      <div className="space-y-4">
                        {submissions.map((sub, idx) => (
                          <div key={idx} className="bg-gray-50 p-6 rounded-lg border-l-4 border-primary">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-bold">
                                  {sub.student_name} ({sub.admission_number})
                                  {sub.banned_during_exam && (
                                    <span className="ml-2 bg-danger text-white text-xs px-2 py-1 rounded">BANNED</span>
                                  )}
                                </h3>
                              </div>
                              {sub.marked_score !== undefined && (
                                <div className={`${getGradeColor(sub.grade)} text-white px-4 py-2 rounded-full font-bold`}>
                                  {sub.marked_score}/100 - Grade {sub.grade}
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-white p-3 rounded">
                                <p className="text-sm text-gray-600">Submitted</p>
                                <p className="font-semibold">{new Date(sub.submitted_at).toLocaleString()}</p>
                              </div>
                              <div className="bg-white p-3 rounded">
                                <p className="text-sm text-gray-600">Time Taken</p>
                                <p className="font-semibold">{sub.time_taken}</p>
                              </div>
                              <div className="bg-white p-3 rounded">
                                <p className="text-sm text-gray-600">Violations</p>
                                <p className="font-semibold text-danger">{sub.violation_summary.total_violations}</p>
                              </div>
                              <div className="bg-white p-3 rounded">
                                <p className="text-sm text-gray-600">Status</p>
                                <p className="font-semibold">
                                  {sub.marked_score !== undefined ? '✅ Graded' : '⏳ Pending'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Results & Statistics</h2>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                        <p className="text-sm text-gray-600">Total Submissions</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-red-600">{stats.banned}</p>
                        <p className="text-sm text-gray-600">Banned</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-purple-600">{stats.graded}</p>
                        <p className="text-sm text-gray-600">Graded</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-yellow-600">{stats.averageScore}</p>
                        <p className="text-sm text-gray-600">Average Score</p>
                      </div>
                    </div>

                    {/* Results Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-800 text-white">
                            <th className="p-3 text-left">Student</th>
                            <th className="p-3 text-left">Admission No.</th>
                            <th className="p-3 text-center">Score</th>
                            <th className="p-3 text-center">Grade</th>
                            <th className="p-3 text-center">Violations</th>
                            <th className="p-3 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submissions
                            .filter(s => s.marked_score !== undefined)
                            .map((sub, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="p-3">{sub.student_name}</td>
                                <td className="p-3">{sub.admission_number}</td>
                                <td className="p-3 text-center font-bold">{sub.marked_score}/100</td>
                                <td className="p-3 text-center">
                                  <span className={`${getGradeColor(sub.grade)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                                    {sub.grade}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className="bg-danger text-white px-2 py-1 rounded text-sm">
                                    {sub.violation_summary.total_violations}
                                  </span>
                                </td>
                                <td className="p-3">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Violations Tab */}
                {activeTab === 'violations' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Security Violations Report</h2>
                    {submissions.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No submissions yet</p>
                    ) : (
                      <div className="space-y-4">
                        {submissions.map((sub, idx) => (
                          <div key={idx} className="bg-gray-50 p-6 rounded-lg border-l-4 border-danger">
                            <h3 className="text-lg font-bold mb-4">
                              {sub.student_name} ({sub.admission_number})
                              {sub.banned_during_exam && (
                                <span className="ml-2 bg-danger text-white text-xs px-2 py-1 rounded">BANNED</span>
                              )}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="bg-white p-3 rounded">
                                <p className="text-sm text-gray-600">Total Violations</p>
                                <p className="text-2xl font-bold text-danger">{sub.violation_summary.total_violations}</p>
                              </div>
                              <div className="bg-white p-3 rounded">
                                <p className="text-sm text-gray-600">Tab Switches</p>
                                <p className="text-2xl font-bold">{sub.violation_summary.tab_switches}</p>
                              </div>
                              <div className="bg-white p-3 rounded">
                                <p className="text-sm text-gray-600">Copy Attempts</p>
                                <p className="text-2xl font-bold">{sub.violation_summary.copy_attempts}</p>
                              </div>
                              <div className="bg-white p-3 rounded">
                                <p className="text-sm text-gray-600">Paste Attempts</p>
                                <p className="text-2xl font-bold">{sub.violation_summary.paste_attempts}</p>
                              </div>
                            </div>
                            {sub.violations.length > 0 && (
                              <details className="mt-4">
                                <summary className="cursor-pointer font-semibold text-gray-700 hover:text-primary">
                                  View Detailed Violation Log ({sub.violations.length} events)
                                </summary>
                                <div className="mt-3 bg-white p-4 rounded max-h-60 overflow-y-auto">
                                  {sub.violations.map((v: any, vIdx: number) => (
                                    <p key={vIdx} className="text-sm mb-2">
                                      <strong className="text-danger">{new Date(v.timestamp).toLocaleTimeString()}:</strong>{' '}
                                      {v.violation}
                                    </p>
                                  ))}
                                </div>
                              </details>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

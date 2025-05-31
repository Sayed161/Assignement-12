import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProviders'; // Assuming you have an auth context
import axios from 'axios';

const DashBoardWorker = () => {
  // States for dashboard statistics
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [pendingSubmissionsList, setPendingSubmissionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('approved'); // 'approved' or 'pending'

  const { Quser } = useContext(AuthContext);
    const email = Quser?.email; // Get authenticated user from your auth context

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!Quser?.email) return;

        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/submissions?worker_email=${Quser.email}`
        );

  

        const data = response.data.data;
        console.log("data.",data);
        // Calculate dashboard statistics
        const total = data.length;
        const pending = data.filter(sub => sub.status === 'pending').length;
        const earnings = data
          .filter(sub => sub.status === 'approved')
          .reduce((sum, sub) => sum + sub.payable_amount, 0);

        // Filter submissions
        const approved = data.filter(sub => sub.submissionData.status === 'approved');
        const pendingList = data.filter(sub => sub.submissionData.status === 'pending');

        setTotalSubmissions(total);
        setPendingSubmissions(pending);
        setTotalEarnings(earnings);
        setApprovedSubmissions(approved);
        setPendingSubmissionsList(pendingList);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [Quser?.email]); // Re-fetch when user email changes

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Worker Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Submissions</h3>
          <p className="text-2xl font-bold">{totalSubmissions}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Pending Submissions</h3>
          <p className="text-2xl font-bold">{pendingSubmissions}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Earnings</h3>
          <p className="text-2xl font-bold">${totalEarnings.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Submission Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('approved')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'approved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Approved Submissions ({approvedSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Pending Submissions ({pendingSubmissionsList.length})
          </button>
        </nav>
      </div>
      
      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTab === 'approved' ? (
                approvedSubmissions.length > 0 ? (
                  approvedSubmissions.map((submission) => (
                    <tr key={submission.submissionData._id || submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.submissionData.task_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${submission.submissionData.payable_amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.submissionData.Buyer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {submission.submissionData.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.submissionData.current_date || submission.submissionData.current_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No approved submissions found
                    </td>
                  </tr>
                )
              ) : pendingSubmissionsList.length > 0 ? (
                pendingSubmissionsList.map((submission) => (
                  <tr key={submission._id || submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.submissionData.task_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${submission.submissionData.payable_amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.submissionData.Buyer_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {submission.submissionData.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(submission.submissionData.current_date || submission.submissionData.current_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No pending submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashBoardWorker;
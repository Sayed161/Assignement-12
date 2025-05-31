import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LuCheck, LuX, LuEye, LuLoader } from "react-icons/lu";
import Swal from "sweetalert2";
import { AuthContext } from "../Providers/AuthProviders";

const DashBoardBuyer = () => {
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { Quser } = useContext(AuthContext);

  // Fetch pending submissions
  const {
    data: submissions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pending", Quser?.email],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:5000/submissions?Buyer_email=${Quser.email}&status=pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Fetched submissions:", response.data.result); // <-- Add this
      return response.data.result;
    },
    enabled: !!Quser?.email, // Only run query if email exists
  });

  // Approve submission mutation
  const approveSubmission = useMutation({
    mutationFn: async (submissionId) => {
      await axios.patch(
        `http://localhost:5000/submissions/${submissionId}`,
        {status:'approve'},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingSubmissions"]);
      showSuccessAlert("Approved!", "Submission has been approved");
    },
    onError: (error) => {
      showErrorAlert(
        "Error",
        error.response?.data?.message || "Approval failed"
      );
    },
  });

  // Reject submission mutation
  const rejectSubmission = useMutation({
    mutationFn: async (submissionId) => {
      await axios.patch(
        `http://localhost:5000/submissions/${submissionId}`,
        {status:'reject'},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingSubmissions"]);
      showSuccessAlert("Rejected!", "Submission has been rejected");
    },
    onError: (error) => {
      showErrorAlert(
        "Error",
        error.response?.data?.message || "Rejection failed"
      );
    },
  });

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      background: "#1a1a2e",
      color: "#fff",
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "error",
      background: "#1a1a2e",
      color: "#fff",
    });
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleApprove = (submissionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00E1F9",
      cancelButtonColor: "#6A1B70",
      confirmButtonText: "Yes, approve it!",
      background: "#1a1a2e",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        approveSubmission.mutate(submissionId);
      }
    });
  };

  const handleReject = (submissionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00E1F9",
      cancelButtonColor: "#6A1B70",
      confirmButtonText: "Yes, reject it!",
      background: "#1a1a2e",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        rejectSubmission.mutate(submissionId);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <LuLoader className="animate-spin text-4xl text-[#00E1F9]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <div className="text-red-500 text-center">
          <p>Error loading submissions</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]">
        Submissions to Review
      </h1>

      {submissions?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl">No submissions to review</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            {/* Table Headers */}
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Worker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/10">
            {Array.isArray(submissions) && submissions.map(submission => (
                <tr key={submission._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full border-2 border-[#00E1F9]"
                          src={
                            submission.worker?.photoURL ||
                            "https://via.placeholder.com/40"
                          }
                          alt={submission.worker?.displayName}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">
                          {submission.worker?.displayName || "Unknown Worker"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {submission.worker?.email ||
                            submission.submissionData?.worker_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {submission.task?.task_title ||
                        submission.submissionData?.task_title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#00E1F9]">
                      $
                      {submission.task?.payable_amount ||
                        submission.submissionData?.payable_amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <button
                      onClick={() => handleViewSubmission(submission)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#6A1B70] hover:bg-[#6A1B70]/80"
                    >
                      <LuEye className="mr-1" /> View
                    </button>
                    <button
                      onClick={() => handleApprove(submission._id)}
                      disabled={approveSubmission.isLoading}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      {approveSubmission.isLoading ? (
                        <LuLoader className="animate-spin mr-1" />
                      ) : (
                        <LuCheck className="mr-1" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(submission._id)}
                      disabled={rejectSubmission.isLoading}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      {rejectSubmission.isLoading ? (
                        <LuLoader className="animate-spin mr-1" />
                      ) : (
                        <LuX className="mr-1" />
                      )}
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submission Detail Modal */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 rounded-lg max-w-2xl w-full border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">
                {selectedSubmission.task?.task_title ||
                  selectedSubmission.submissionData?.task_title}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Worker</h3>
                <p className="text-white">
                  {selectedSubmission.worker?.displayName || "Unknown Worker"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Amount</h3>
                <p className="text-[#00E1F9]">
                  $
                  {selectedSubmission.task?.payable_amount ||
                    selectedSubmission.submissionData?.payable_amount}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">
                  Submitted On
                </h3>
                <p className="text-white">
                  {new Date(
                    selectedSubmission.current_date ||
                      selectedSubmission.submittedAt
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Status</h3>
                <p className="text-white capitalize">
                  {selectedSubmission.submissionData?.status || "pending"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Submission Details
              </h3>
              <p className="text-white">
                {selectedSubmission.submissionData?.submission_info ||
                  "No details provided"}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Proof</h3>
              {selectedSubmission.proof_url ||
              selectedSubmission.submissionData?.proof_url ? (
                <img
                  src={
                    selectedSubmission.proof_url ||
                    selectedSubmission.submissionData?.proof_url
                  }
                  alt="Submission proof"
                  className="max-w-full h-auto rounded-lg border border-white/10"
                />
              ) : (
                <p className="text-gray-400">No proof submitted</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  handleReject(selectedSubmission._id);
                  setIsModalOpen(false);
                }}
                disabled={rejectSubmission.isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center disabled:opacity-50"
              >
                {rejectSubmission.isLoading ? (
                  <LuLoader className="animate-spin mr-2" />
                ) : (
                  <LuX className="mr-2" />
                )}
                Reject
              </button>
              <button
                onClick={() => {
                  handleApprove(selectedSubmission._id);
                  setIsModalOpen(false);
                }}
                disabled={approveSubmission.isLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center disabled:opacity-50"
              >
                {approveSubmission.isLoading ? (
                  <LuLoader className="animate-spin mr-2" />
                ) : (
                  <LuCheck className="mr-2" />
                )}
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoardBuyer;

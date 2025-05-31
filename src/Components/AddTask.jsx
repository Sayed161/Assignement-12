import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProviders";

const AddTask = () => {
  const navigate = useNavigate();
  const { Quser } = useContext(AuthContext);

  const [taskData, setTaskData] = useState({
    task_title: "",
    task_detail: "",
    required_workers: 1,
    payable_amount: 0,
    completion_date: "",
    submission_info: "",
    task_image_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [balanceError, setBalanceError] = useState("");

  // Calculate total cost whenever workers or amount changes
  useEffect(() => {
    const cost = taskData.payable_amount * taskData.required_workers;
    setTotalCost(cost);

    if (cost > userBalance) {
      setBalanceError(
        `Insufficient balance. You need $${(cost - userBalance).toFixed(
          2
        )} more.`
      );
    } else {
      setBalanceError("");
    }
  }, [taskData.payable_amount, taskData.required_workers, userBalance]);

  // Fetch user balance
  useEffect(() => {
    if (Quser?.email) {
      axios
        .get(`http://localhost:5000/users?email=${Quser.email}`)
        .then((res) => {
          const balance = res.data?.balance || 0;
          setUserBalance(balance);
        })
        .catch((err) => {
          console.error("Error fetching balance:", err);
          Swal.fire("Error", "Failed to load your balance", "error");
        });
    }
  }, [Quser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]:
        name === "required_workers" || name === "payable_amount"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!Quser) throw new Error("User not authenticated");
      if (totalCost > userBalance) throw new Error("Insufficient balance");
      if (
        !taskData.task_title ||
        !taskData.task_detail ||
        !taskData.completion_date
      ) {
        throw new Error("Please fill in all required fields");
      }
      if (new Date(taskData.completion_date) < new Date()) {
        throw new Error("Completion date must be in the future");
      }

      // Prepare task data
      const fullTaskData = {
        ...taskData,
        total_cost: totalCost,
        created_by: {
          uid: Quser.uid,
          displayName: Quser.displayName || "Anonymous",
          email: Quser.email,
          photoURL: Quser.photoURL || "",
        },
        created_at: new Date().toISOString(),
        status: "active",
      };

      // Create task and deduct balance
      const response = await axios.post("http://localhost:5000/tasks", {
        task: fullTaskData,
        userId: Quser.uid,
        amount: totalCost,
      });
      await axios.patch(`http://localhost:5000/users?email=${Quser.email}`, {
        balance: userBalance - totalCost,
      });
      Swal.fire({
        title: "Success!",
        text: `Task created successfully! $${totalCost.toFixed(
          2
        )} deducted from your balance.`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/mytasks");
      });
    } catch (error) {
      console.error("Error creating task:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to create task",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!Quser) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Please login to create tasks</p>
          <button
            onClick={() => navigate("/signin")}
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">Create New Task</h1>
          <p className="text-lg">
            Fill out the form below to create a new task for workers to
            complete.
          </p>
        </div>

        <div className="card bg-base-100 w-full shadow-2xl">
          <div className="card-body">
            {/* Balance Information */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Your Current Balance:</span>
                <span className="font-bold text-lg">
                  ${userBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total Task Cost:</span>
                <span
                  className={`font-bold text-lg ${
                    totalCost > userBalance ? "text-red-600" : "text-green-600"
                  }`}
                >
                  ${totalCost.toFixed(2)}
                </span>
              </div>
              {balanceError && (
                <div className="mt-2 text-red-600 text-sm">{balanceError}</div>
              )}
              {totalCost > 0 && totalCost <= userBalance && (
                <div className="mt-2 text-sm text-gray-600">
                  Your new balance after creation: $
                  {(userBalance - totalCost).toFixed(2)}
                </div>
              )}
            </div>

            <form className="form-control" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                {/* Task Title */}
                <div>
                  <label className="label">
                    <span className="label-text">Task Title*</span>
                  </label>
                  <input
                    type="text"
                    name="task_title"
                    className="input input-bordered w-full"
                    placeholder="e.g. Watch my YouTube video and comment"
                    value={taskData.task_title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Task Details */}
                <div>
                  <label className="label">
                    <span className="label-text">Task Details*</span>
                  </label>
                  <textarea
                    name="task_detail"
                    className="textarea textarea-bordered w-full"
                    placeholder="Detailed description of what workers need to do..."
                    rows="4"
                    value={taskData.task_detail}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Workers and Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Required Workers*</span>
                    </label>
                    <input
                      type="number"
                      name="required_workers"
                      className="input input-bordered w-full"
                      placeholder="e.g. 100"
                      min="1"
                      value={taskData.required_workers}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">
                        Payment Amount (per worker)*
                      </span>
                    </label>
                    <div className="join w-full">
                      <span className="join-item btn btn-disabled px-4">$</span>
                      <input
                        type="number"
                        name="payable_amount"
                        className="input input-bordered join-item w-full"
                        placeholder="e.g. 10"
                        min="0"
                        step="0.01"
                        value={taskData.payable_amount}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Deadline and Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Completion Deadline*</span>
                    </label>
                    <input
                      type="date"
                      name="completion_date"
                      className="input input-bordered w-full"
                      min={new Date().toISOString().split("T")[0]}
                      value={taskData.completion_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">
                        Task Image URL (optional)
                      </span>
                    </label>
                    <input
                      type="url"
                      name="task_image_url"
                      className="input input-bordered w-full"
                      placeholder="https://example.com/image.jpg"
                      value={taskData.task_image_url}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Submission Requirements */}
                <div>
                  <label className="label">
                    <span className="label-text">Submission Requirements*</span>
                  </label>
                  <input
                    type="text"
                    name="submission_info"
                    className="input input-bordered w-full"
                    placeholder="e.g. Screenshot of comment, video URL, etc."
                    value={taskData.submission_info}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary mt-6 w-full"
                  disabled={
                    isSubmitting || totalCost > userBalance || totalCost <= 0
                  }
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Creating Task...
                    </>
                  ) : (
                    `Create Task (Cost: $${totalCost.toFixed(2)})`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;

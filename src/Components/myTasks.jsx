import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LuSearch, LuFilter, LuArrowUpDown, LuTrash2, LuEye, LuClipboardList, LuPlus } from 'react-icons/lu';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../Providers/AuthProviders';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  
  const { Quser } = useContext(AuthContext);
  const email = Quser?.email; // Safely access email

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!email) return; // Don't fetch if no email
        
        const response = await axios.get(`http://localhost:5000/tasks?email=${email}`);
        setTasks(response.data);
        console.log("data",response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load tasks',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
      }
    };

    fetchTasks();
  }, [email]); // Add email to dependency array

  // Handle task deletion
  const handleDelete = async (taskId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/tasks/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
        Swal.fire(
          'Deleted!',
          'Your task has been deleted.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error!',
          'Failed to delete task.',
          'error'
        );
      }
    }
  };

  // Filter and sort tasks
const filteredTasks = tasks.filter(task => {
  const title = task?.task_title || "";
  const detail = task?.task_detail || "";

  const matchesSearch =
    title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    filterStatus === 'all' ||
    (filterStatus === 'active' && new Date(task.completion_date) > new Date()) ||
    (filterStatus === 'completed' && new Date(task.completion_date) <= new Date());

  return matchesSearch && matchesStatus;
});

 const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Request sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate remaining time
  const getRemainingTime = (completionDate) => {
    const now = new Date();
    const end = new Date(completionDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <LuClipboardList className="mr-2" /> My Tasks
            </h1>
            <p className="text-gray-600">Manage all the tasks you've created</p>
          </div>
          <Link 
            to="/addtask" 
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow hover:shadow-lg transition-all flex items-center"
          >
            <LuPlus className="mr-2" /> Create New Task
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <div className="absolute ml-3">
                <LuFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Tasks</option>
                <option value="active">Active Tasks</option>
                <option value="completed">Completed Tasks</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <div className="absolute ml-3">
                <LuArrowUpDown className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={`${sortConfig.key}-${sortConfig.direction}`}
                onChange={(e) => {
                  const [key, direction] = e.target.value.split('-');
                  setSortConfig({ key, direction });
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="completion_date-asc">Deadline (Soonest)</option>
                <option value="completion_date-desc">Deadline (Latest)</option>
                <option value="payable_amount-desc">Highest Pay</option>
                <option value="payable_amount-asc">Lowest Pay</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">You haven't created any tasks yet or no tasks match your filters</p>
            <Link 
              to="/addtask" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LuPlus className="mr-2" /> Create Your First Task
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700">
              <div className="col-span-5 md:col-span-4">Task Title</div>
              <div className="col-span-3 md:col-span-2 text-center">Workers</div>
              <div className="hidden md:block md:col-span-2 text-center">Reward</div>
              <div className="col-span-4 md:col-span-2 text-center">Deadline</div>
              <div className="col-span-3 md:col-span-2 text-center">Actions</div>
            </div>
            
           {sortedTasks.map((task) => (
  <div
    key={task._id}
    className="grid grid-cols-12 items-center border-t hover:bg-gray-50 transition-colors p-4"
  >
    <div className="col-span-5 md:col-span-4">
      <div className="flex items-center space-x-4">
        <img
          src={task.task.task_image_url}
          alt={task.task.task_title}
          className="w-12 h-12 object-cover rounded"
        />
        <div>
          <p className="font-semibold text-gray-800">{task.task.task_title}</p>
          <p className="text-sm text-gray-500 truncate">{task.task.task_detail}</p>
        </div>
      </div>
    </div>
    <div className="col-span-3 md:col-span-2 text-center">
      {task.task.required_workers}
    </div>
    <div className="hidden md:block md:col-span-2 text-center">
      ${task.task.payable_amount}
    </div>
    <div className="col-span-4 md:col-span-2 text-center">
      <span className="text-sm text-gray-600">{getRemainingTime(task.task.completion_date)}</span><br />
      <span className="text-xs text-gray-400">{formatDate(task.task.completion_date)}</span>
    </div>
    <div className="col-span-3 md:col-span-2 text-center flex justify-center space-x-2">
      <Link
        to={`/task/${task._id}`}
        className="text-blue-600 hover:text-blue-800"
        title="View Task"
      >
        <LuEye />
      </Link>
      <button
        onClick={() => handleDelete(task._id)}
        className="text-red-600 hover:text-red-800"
        title="Delete Task"
      >
        <LuTrash2 />
      </button>
    </div>
  </div>
))}

          </div>
        )}

        {/* Stats Summary */}
        {!loading && tasks.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
              <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm font-medium">Active Tasks</h3>
              <p className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => new Date(t.task.completion_date) > new Date()).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm font-medium">Total Rewards</h3>
              <p className="text-2xl font-bold text-green-600">
                ${tasks.reduce((sum, task) => sum + (task.amount), 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomeLayout from "../Layout/HomeLayout";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../AuthFolder/Login";
import SignUp from "../AuthFolder/SignUp";

import AddTask from "../Components/AddTask";
import MyTasks from "../Components/myTasks";
import DashBoardWorker from "../Components/DashBoardWorker";
import DashBoardBuyer from "../Components/DashBoardBuyer";
import DashboardWorker from "../Components/DashBoardWorker";
import Purchase from "../Components/Purchase";
import PaymentHistory from "../Components/PaymentHistory";
import TaskList from "../Components/TaskList";
import Submission from "../Shared/Submission";
import WithDrawls from "../Shared/WithDrawls";
import TaskDetails from "../Components/TaskDetails";
import DashboardAdmin from "../Admin/DashboardAdmin";

import AdminHome from "../Admin/AdminHome";
import ManageTask from "../Admin/ManageTask";
import UserMangement from "../Admin/UserMangement";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "signIn",
        element: <Login></Login>,
      },
      {
        path: "signup",
        element: <SignUp></SignUp>,
      },
      {
        path: "/",
        element: <AuthLayout />,
      },
      {
        path: "addtask",
        element: <AddTask />,
      },
      {
        path: "mytasks",
        element: <MyTasks />,
      },
      {
        path: "dashboard-buyer",
        element: <DashBoardBuyer />,
      },
      {
        path: "dashboard-worker",
        element: <DashboardWorker />,
      },
      {
        path: "purchase",
        element: <Purchase />,
      },
      {
        path: "payments",
        element: <PaymentHistory />,
      },
      {
        path: "tasklist",
        element: <TaskList />,
      },
      {
        path: "tasklist/:id",
        element: <TaskDetails />,
      },
      {
        path: "submissions",
        element: <Submission />,
      },
      {
        path: "withdrawals",
        element: <WithDrawls />,
      },
    ],
  },
  {
    path: "admin-dashboard",
    element: <DashboardAdmin></DashboardAdmin>,
    children: [ 
      {
        path: "/admin-dashboard",
        element: <AdminHome />,
      },
      {
        path:"/admin-dashboard/tasks",
        element:<ManageTask/>
      },
      {
        path:"/admin-dashboard/users",
        element:<UserMangement />
      }
    ],
  },
  {
    path: "*",
    element: (
      <h1 className="text-5xl text-center font-extrabold">Not Found 404</h1>
    ),
  },
]);

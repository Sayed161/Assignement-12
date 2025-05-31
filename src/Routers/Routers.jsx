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



export const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout/>,
      children:[
        {
          path:"signIn",
          element:<Login></Login>
        },
        {
          path:"signup",
          element:<SignUp></SignUp>
        },
        {
          path:"/",
          element:<AuthLayout/>,
          
        },
        {
          path:"addtask",
          element:<AddTask/>
        },
        {  
          path:"mytasks",
          element:<MyTasks/>
        },
        {
          path:"dashboard-buyer",
          element:<DashBoardBuyer/>
        },
        {
          path:"dashboard-worker",
          element:<DashboardWorker/>
        },
        {
          path:"purchase",
          element:<Purchase/>
        },
        {
          path:"payments",
          element:<PaymentHistory/>
        },
        {
          path:"tasklist",
          element:<TaskList/>
        },
        {
          path:"tasklist/:id",
          element:<TaskDetails/>,
          loader: ({params}) => fetch(`http://localhost:5000/tasks/${params.id}`)
        },
        {
          path:"submissions",
          element:<Submission/>
        },
        {
          path:"withdrawals",
          element:<WithDrawls/>
        }
      ]
    },
    {
          path:"*",
          element: <h1 className="text-5xl text-center font-extrabold">Not Found 404</h1>
      },
  ]);


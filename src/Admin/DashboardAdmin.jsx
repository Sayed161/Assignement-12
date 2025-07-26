import React from 'react'
import AdminHome from './AdminHome'
import { Outlet } from 'react-router-dom'
import SideNav from './SideNav'

const DashboardAdmin = () => {
  return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-300">
      {/* Side Navigation - fixed width and full height */}
      <div className="fixed inset-y-0 left-0 z-10 w-64">
        <SideNav />
      </div>

      <div className="flex-1 ml-64 z-0">
        <Outlet />
      </div>
    </div>
  );
};
  

export default DashboardAdmin

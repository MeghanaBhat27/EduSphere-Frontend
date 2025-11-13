// src/components/InstructorAdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";


export default function InstructorAdminLayout({ role = "instructor" }) {
 
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
     
      <Sidebar role={role} />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
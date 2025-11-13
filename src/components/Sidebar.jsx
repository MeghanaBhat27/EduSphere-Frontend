// src/components/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icon library (already available in Vercel/React projects)

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menus = {
    student: [
      { label: "Overview", to: "#overview" },
      { label: "Browse Courses", to: "#courses" },
      { label: "My Enrollments", to: "#enrollments" },
      { label: "Quizzes", to: "#quizzes" },
      { label: "Progress", to: "#progress" },
    ],
    instructor: [
      { label: "Overview", to: "#overview" },
      { label: "My Courses", to: "#courses" },
      { label: "Uploads", to: "#uploads" },
      { label: "Quizzes", to: "#quizzes" },
    ],
    admin: [
      { label: "Overview", to: "#overview" },
      { label: "Manage Users", to: "#users" },
      { label: "Manage Courses", to: "#courses" },
      { label: "Analytic Overview", to: "#analytics" },
    ],
  };

  const handleClick = (item) => {
    if (item.to.startsWith("#")) {
      const el = document.querySelector(item.to);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(item.to);
    }
    setIsOpen(false); // close menu on click (mobile)
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden flex justify-between items-center p-4 bg-blue-100 border-b">
        <h2 className="text-lg font-bold text-gray-800">Dashboard</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded hover:bg-blue-200">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-blue-100 p-5 border-r transition-transform duration-300 ease-in-out z-50`}
      >
        <nav className="space-y-2 mt-4 md:mt-0">
          {menus[role]?.map((item) => (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className="w-full text-left px-3 py-2 rounded hover:bg-yellow-200 text-gray-800 font-medium"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 border-t pt-4">
          <button
            onClick={() => {
              localStorage.removeItem("edusphere_user");
              navigate("/login");
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
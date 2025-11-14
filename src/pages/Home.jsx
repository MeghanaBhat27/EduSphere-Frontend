import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-screen w-full bg-contain bg-center flex items-center"
      style={{
        backgroundImage: "url('/home-bg2.jpg')", 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/95 via-blue-50/60 to-transparent"></div>

    
      <div className="relative z-10 w-full md:w-1/2 px-8 md:px-16 lg:px-24 text-left">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-700 mb-4 drop-shadow-sm">
          Welcome to <span className="text-blue-800">Edusphere</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-md leading-relaxed">
          "Empowering your learning journey with endless possibilities. Discover, grow, and achieve with every step."
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg shadow-sm transition"
          >
            Already have an account?
          </button>
        </div>
      </div>

      
    </div>
  );

}





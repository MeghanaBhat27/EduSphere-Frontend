import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Registration is disabled in demo mode.\nPlease use demo credentials to login");
    setError(""); 

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);

      
      if (res.data.message && !res.data.error) {
        alert("Registration successful!");
        // Optionally store dummy values for now if backend doesn't return token
        localStorage.setItem("edusphere_user", JSON.stringify({
          username: formData.username,
          role: formData.role,
        }));

        // Redirect based on role
        const userRole = formData.role;
        if (userRole === "student") navigate("/dashboard/student");
        else if (userRole === "instructor") navigate("/dashboard/instructor");
        else if (userRole === "admin") navigate("/dashboard/admin");
        else navigate("/");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[70vh] bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">Register</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-500 hover:text-blue-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
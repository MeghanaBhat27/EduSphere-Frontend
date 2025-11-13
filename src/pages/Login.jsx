import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //const handleLogin = async () => {
    //if (!email || !password) {
      //setError("Please enter both email and password.");
      ////return;
   // }

    //try {
     // const response = await axios.post("http://localhost:5000/api/auth/login", {
        //email: email.trim(),
       // password,
      //});
      const handleLogin = () => {
  if (!email || !password) {
    setError("Please enter both email and password.");
    return;
  }

  // Temporary demo logic
  if (email === "student@example.com" && password === "1234") {
    localStorage.setItem("role", "student");
    localStorage.setItem("username", "Demo Student");
    navigate("/dashboard/student");
  } else if (email === "instructor@example.com" && password === "1234") {
    localStorage.setItem("role", "instructor");
    localStorage.setItem("username", "Demo Instructor");
    navigate("/dashboard/instructor");
  } else if (email === "admin@example.com" && password === "1234") {
    localStorage.setItem("role", "admin");
    localStorage.setItem("username", "Demo Admin");
    navigate("/dashboard/admin");
  } else {
    setError("Invalid demo credentials. Try again!");
  }
};

      //const data = response.data;

      
     // localStorage.setItem("token", data.token);
      //localStorage.setItem("role", data.role);
      //localStorage.setItem("username", data.username);
      //localStorage.setItem("user_id", data.user_id);

      // Redirect by role
      //if (data.role === "student") navigate("/dashboard/student");
      //else if (data.role === "instructor") navigate("/dashboard/instructor");
      //else if (data.role === "admin") navigate("/dashboard/admin");
      //else navigate("/");

   // } catch (err) {
      //console.error("Login error:", err.response?.data || err.message);
      //setError(err.response?.data?.message || "Invalid email or password.");
    //}
  //};

  return (
    <div className="flex flex-col justify-center items-center h-[70vh] bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">
          Login
        </h2>

        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
        />


        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-blue-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
        <p className="text-sm text-gray-500 mb-4">
  Demo Login — Use:
  <br /> student@example.com / 1234
  <br /> instructor@example.com / 1234
  <br /> admin@example.com / 1234
</p>
      </div>
    </div>
  );
}
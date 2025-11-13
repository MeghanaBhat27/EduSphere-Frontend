import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
    <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-yellow-300">Edu</span>Sphere
        </h1>
    <div className="flex space-x-4">
      <a href="/" className="hover:text-yellow-300">Home</a>
      <a href="/login" className="hover:text-yellow-300">Login</a>
      <a href="/register" className="hover:text-yellow-300">Register</a>
    </div>
  </div>
</nav>
  );
}
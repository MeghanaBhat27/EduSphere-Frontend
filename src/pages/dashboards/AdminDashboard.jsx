import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { apiGet, apiPost, apiDelete } from "../../lib/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [stats, setStats] = useState(null);

useEffect(() => {
  apiGet("/admin/analytics")
    .then(setStats)
    .catch(() => setStats(null));
}, []);

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  function fetchUsers() {
    apiGet("/admin/users")
      .then(setUsers)
      .catch(() => setUsers([]));
  }

  function fetchCourses() {
    apiGet("/admin/courses")
      .then(setCourses)
      .catch(() => setCourses([]));
  }

  async function addCourse(e) {
    e.preventDefault();
    if (!newCourse.title || !newCourse.description) return alert("Fill fields");
    try {
      await apiPost("/admin/courses/add", { title: newCourse.title, description: newCourse.description });
      setNewCourse({ title: "", description: "" });
      fetchCourses();
      alert("Course added");
    } catch (err) {
      console.error(err);
      alert("Failed to add course");
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Delete user?")) return;
    try {
      await apiDelete(`/admin/users/${id}`);
      fetchUsers();
      alert("Deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  }

  async function deleteCourse(id) {
    if (!window.confirm("Delete course?")) return;
    try {
      await apiDelete(`/admin/courses/${id}`);
      fetchCourses();
      alert("Deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  }

  return (
    <div className="flex flex-col md:flex-row  min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <section id="overview">
          <h1 className="text-2xl font-bold text-blue-700">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and courses.</p>
        </section>

        <section id="users">
          <h2 className="text-xl font-semibold">Users</h2>
          <div className="bg-white p-4 rounded shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Username</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.user_id}>
                    <td className="p-2 border">{u.user_id}</td>
                    <td className="p-2 border">{u.username || u.name || u.email}</td>
                    <td className="p-2 border">{u.email}</td>
                    <td className="p-2 border capitalize">{u.role}</td>
                    <td className="p-2 border">
                      <button onClick={() => deleteUser(u.user_id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="courses">
          <h2 className="text-xl font-semibold">Courses</h2>
          <form onSubmit={addCourse} className="bg-white p-4 rounded shadow max-w-xl mb-4">
            <input value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} placeholder="Title" className="border p-2 w-full rounded mb-2" />
            <textarea value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} placeholder="Description" className="border p-2 w-full rounded mb-2" />
            <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Add Course</button>
          </form>

          <ul className="space-y-2">
            {courses.map(c => (
              <li key={c.course_id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-gray-600">{c.description}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => deleteCourse(c.course_id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section id="analytics" className="mt-8 border-t pt-6">
  <h2 className="text-xl font-semibold mb-3">Analytics Overview</h2>
  {stats ? (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-yellow-100 p-3 rounded shadow text-center">
        <h3 className="font-semibold">Total Users</h3>
        <p>{stats.totalUsers}</p>
      </div>
      <div className="bg-yellow-100 p-3 rounded shadow text-center">
        <h3 className="font-semibold">Total Courses</h3>
        <p>{stats.totalCourses}</p>
      </div>
      <div className="bg-yellow-100 p-3 rounded shadow text-center">
        <h3 className="font-semibold">Enrollments</h3>
        <p>{stats.totalEnrollments}</p>
      </div>
      <div className="bg-yellow-100 p-3 rounded shadow text-center">
        <h3 className="font-semibold">Average Score</h3>
        <p>{Number(stats.avgScore || 0).toFixed(2)}%</p>
      </div>
    </div>
  ) : (
    <p className="text-gray-600">Loading analytics...</p>
  )}
</section>
      </main>
    </div>
  );
}
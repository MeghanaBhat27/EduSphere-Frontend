// src/pages/dashboards/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { apiGet, apiPost } from "../../lib/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadData() {
      try {
        const allCourses = await apiGet("/courses/list");
        setCourses(allCourses || []);
      } catch {
        setCourses([]);
      }

      if (user_id) {
        try {
          const res = await apiGet(`/enrollments/student/${user_id}`);
          console.log(" Enrollments fetched:", res);
          setEnrolled(res || []);
        } catch (err) {
          console.error(" Failed to fetch enrollments:", err);
          setEnrolled([]);
        }
      }
    }

    loadData();
  }, [user_id]);

 
  useEffect(() => {
    async function fetchProgress() {
      if (!user_id) {
        console.warn(" No user_id found in localStorage");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/progress/${user_id}`,
          {
            headers: { Authorization:` Bearer ${token} `},
          }
        );
        console.log(" Progress data received:", res.data);
        setProgress(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setProgress([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [user_id]);

  //  Enroll function
  async function enroll(course) {
    try {
      if (!user_id) {
        alert("User not found. Please log in again.");
        return;
      }

      const response = await apiPost(
        "/enrollments/enroll",
        { student_id: user_id, course_id: course.course_id },
        { headers: { Authorization: `Bearer ${token} `} }
      );

      console.log(" Enroll success:", response);
      alert("Enrolled successfully!");

      
      const updated = await apiGet(`/enrollments/student/${user_id}`);
      setEnrolled(updated || []);
    } catch (err) {
      console.error(" Enroll failed:", err);
      alert("Enrollment failed. Please try again.");
    }
  }

  async function unenroll(course_id) {
  if (!window.confirm("Are you sure you want to unenroll from this course?")) return;
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  if (!user_id) {
    alert("Please log in again.");
    return;
  }

  try {
 
    await apiPost("/enrollments/unenroll", { student_id: user_id, course_id });

  
    const updatedEnrollments = await apiGet(`/enrollments/student/${user_id}`);
    setEnrolled(updatedEnrollments || []);

    
    const prog = await apiGet(`/progress/${user_id}`).catch(() => []);
    setProgress(prog || []);

    alert("Unenrolled successfully.");
  } catch (err) {
    console.error("Unenroll failed:", err);
    alert(err?.message || "Failed to unenroll. Try again.");
  }
}

  //  Search Filter
  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar role="student" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Student Dashboard
        </h1>

        {/*  Search */}
        <div className="mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full max-w-md p-2 border rounded"
          />
        </div>

        {/*  Available Courses */}
        <section id="courses" className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Available Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <div
                key={c.course_id}
                className="bg-white rounded-xl p-5 shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{c.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{c.description}</p>
                <button
                  onClick={() => enroll(c)}
                  className="bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        </section>

    
        <section id="enrollments" className="mb-8">
          <h2 className="text-lg font-semibold mb-3">My Enrollments</h2>
          {enrolled.length === 0 ? (
            <p className="text-gray-600">No enrollments yet.</p>
          ) : (
            <ul className="space-y-3">
              {enrolled.map((e) => (
                <li
                  key={e.course_id}
                  className="bg-white p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-sm text-gray-600">{e.description}</div>

                    
                    {e.material && (
                      <div className="mt-2">
                        {e.material.includes("youtube.com") ? (
                          <iframe
                            width="360"
                            height="200"
                            src={e.material.replace("watch?v=", "embed/")}
                            title="Course video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg shadow"
                          ></iframe>
                        ) : (
                          <a
                            href={e.material}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View course material
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  
  <button onClick={() => navigate(`/quiz/${e.course_id}`)} className="bg-green-600 text-white px-3 py-1 rounded">Take Quiz</button>
  

                </li>
              ))}
            </ul>
          )}
        </section>

      
        <section id="progress" className="mt-8">
          <h2 className="text-lg font-semibold mb-3">My Progress</h2>
          {progress.length === 0 ? (
            <p className="text-gray-600">No progress yet.</p>
          ) : (
            <table className="min-w-full border border-gray-300 rounded-lg mt-2">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border px-4 py-2 text-left">Course ID</th>
                  <th className="border px-4 py-2 text-center">Score (%)</th>
                </tr>
              </thead>
              <tbody>
                {progress.map((p, i) => (
                  <tr key={`${p.course_id}-${i}`}>
                    <td className="border px-4 py-2 text-left">
                      {p.course_id}
                    </td>
                    <td className="border px-4 py-2 text-center">{p.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
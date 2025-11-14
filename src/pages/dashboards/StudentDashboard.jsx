// src/pages/dashboards/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  // FRONTEND-ONLY DEMO MODE (NO BACKEND)
  useEffect(() => {
    // Available Courses (Static)
    setCourses([
      {
        course_id: 1,
        title: "HTML Fundamentals",
        description: "Learn the basics of HTML and webpage structure.",
      },
      {
        course_id: 2,
        title: "JavaScript Beginner",
        description: "Start writing interactive JavaScript.",
      },
      {
        course_id: 3,
        title: "Python Essentials",
        description: "Introduction to Python programming.",
      },
    ]);

    // Enrolled Courses (Static)
    setEnrolled([
      {
        course_id: 1,
        title: "HTML Fundamentals",
        description: "Learn the basics of HTML and webpage structure.",
        material:" https://www.youtube.com/watch?v=pQN-pnXPaVg",
      },
    ]);

    // Progress (Static)
    setProgress([
      { course_id: 1, score: 85 },
    ]);

    setLoading(false);
  }, []);

  // Disabled enroll / unenroll functions
  function enroll() {
    alert("Enroll feature is disabled in the demo version.");
  }

  function unenroll() {
    alert("Unenroll feature is disabled in the demo version.");
  }

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  if (loading)
    return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Student Dashboard
        </h1>

        {/* Search */}
        <div className="mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full max-w-md p-2 border rounded"
          />
        </div>

        {/* Available Courses */}
        <section id="courses" className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Available Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.course_id}
                className="bg-white rounded-xl p-5 shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {course.description}
                </p>

                <button
                  onClick={() => enroll(course)}
                  className="bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* My Enrollments */}
        <section id="enrollments" className="mb-8">
          <h2 className="text-lg font-semibold mb-3">My Enrollments</h2>

          {enrolled.length === 0 ? (
            <p className="text-gray-600">Not enrolled in any course.</p>
          ) : (
            <ul className="space-y-3">
              {enrolled.map((course) => (
                <li
                  key={course.course_id}
                  className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between"
                >
                  <div>
                    <div className="font-semibold">{course.title}</div>
                    <div className="text-sm text-gray-600">
                      {course.description}
                    </div>

                    {course.material && (
                      <div className="mt-3">
                        <iframe
                          width="360"
                          height="200"
                          src={course.material.replace("watch?v=", "embed/")}
                          className="rounded-lg shadow"
                        ></iframe>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                      onClick={() => alert("Quiz is disabled in demo mode.")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Take Quiz
                    </button>

                    <button
                      onClick={() => unenroll(course.course_id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Unenroll
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Progress */}
        <section id="progress">
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
                  <tr key={i}>
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

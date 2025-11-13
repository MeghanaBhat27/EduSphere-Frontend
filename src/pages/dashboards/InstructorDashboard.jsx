import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { apiGet, apiPost } from "../../lib/api";

const user_id = localStorage.getItem("user_id");
const username = localStorage.getItem("username");
const role = localStorage.getItem("role");
const token = localStorage.getItem("token");

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [questionForm, setQuestionForm] = useState({
    quiz_id: "",
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
  });
  const [material, setMaterial] = useState("");

  useEffect(() => {
    apiGet("/courses/list")
      .then((data) => {
       
        if (user_id ) {
          const mine = data.filter((c) => c.instructor_id == user_id);
          setCourses(mine);
        } else {
          setCourses(data);
        }
      })
      .catch(() => setCourses([]));
  }, []);

  
  useEffect(() => {
    if (!selectedCourse) {
      setQuizzes([]);
      return;
    }
    apiGet(`/quizzes/course/${selectedCourse.course_id}`)
      .then(setQuizzes)
      .catch(() => setQuizzes([]));
  }, [selectedCourse]);

  async function handleAddCourse(e) {
    e.preventDefault();
    if (!title || !description) return alert("Please fill title and description");
    try {
      await apiPost("/courses/add", {
        title,
        description,
        instructor_id: user_id, 
      });
      setTitle("");
      setDescription("");
      const updated = await apiGet("/courses/list");
      const mine = updated.filter((c) => c.instructor_id == user_id);
      setCourses(mine);
      alert("Course added");
    } catch (err) {
      console.error(err);
      alert("Failed to add course");
    }
  }

  async function handleCreateQuiz(e) {
    e.preventDefault();
    if (!selectedCourse) return alert("Select a course first");
    if (!quizTitle) return alert("Enter quiz title");
    try {
      await apiPost("/quizzes/add", { course_id: selectedCourse.course_id, title: quizTitle });
      setQuizTitle("");
      // refresh quizzes
      const list = await apiGet(`/quizzes/course/${selectedCourse.course_id}`);
      setQuizzes(list);
      alert("Quiz created");
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    }
  }

  async function handleAddQuestion(e) {
    e.preventDefault();
    const q = questionForm;
    if (!q.quiz_id || !q.question_text || !q.option_a) return alert("Fill required fields");
    try {
      await apiPost("/quizzes/add-question", q);
      // clear question form
      setQuestionForm({
        quiz_id: "",
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A",
      });
      alert("Question added");
    } catch (err) {
      console.error(err);
      alert("Failed to add question");
    }
  }
  async function handleUploadMaterial() {
  if (!selectedCourse) return alert("Select a course first");
  if (!material.trim()) return alert("Enter notes or video link");
  try {
    await apiPost(`/courses/material/${selectedCourse.course_id}`, { material });
    alert("Material uploaded successfully!");
    setMaterial("");
  } catch (err) {
    console.error(err);
    alert("Failed to upload material");
  }
}

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar role="instructor" />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <section id="overview">
          <h1 className="text-2xl font-bold text-blue-700 mb-2">Instructor Dashboard</h1>
          <p className="text-gray-600">Manage your courses and quizzes here.</p>
        </section>

        <section id="courses" className="space-y-4">
          <h2 className="text-xl font-semibold">My Courses</h2>

          <form onSubmit={handleAddCourse} className="bg-white p-4 rounded shadow space-y-3 max-w-xl">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course title" className="border p-2 w-full rounded" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border p-2 w-full rounded" />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Add Course</button>
            </div>
          </form>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <div key={c.course_id} className="bg-white p-4 rounded shadow-sm">
                <div className="font-semibold text-lg text-blue-800">{c.title}</div>
                <div className="text-sm text-gray-600 mb-3">{c.description}</div>
                <button onClick={() => setSelectedCourse(c)} className="text-sm text-blue-700 hover:underline">
                  Manage quizzes for this course
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="quizzes" className="space-y-4">
          <h2 className="text-xl font-semibold">Quizzes</h2>

          <div className="bg-white p-4 rounded shadow max-w-xl">
            <div className="mb-3">
              <label className="block text-sm font-medium">Selected course</label>
              <div className="mt-1">{selectedCourse ? selectedCourse.title : <span className="text-gray-500">No course selected</span>}</div>
            </div>

            <form onSubmit={handleCreateQuiz} className="flex gap-2">
              <input value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="New quiz title" className="border p-2 rounded flex-1" />
              <button type="submit" className="bg-blue-700 text-white px-3 rounded">Create Quiz</button>
            </form>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Existing quizzes</h3>
            <div className="space-y-3">
              {quizzes.length === 0 ? <div className="text-gray-600">No quizzes</div> : quizzes.map(q => (
                <div key={q.quiz_id} className="bg-white p-3 rounded shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{q.title}</div>
                      <div className="text-sm text-gray-600">Created: {q.created_at?.slice(0,19) ?? "—"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setQuestionForm({...questionForm, quiz_id: q.quiz_id})} className="text-sm bg-green-600 text-white px-3 py-1 rounded">Add Question</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow max-w-2xl">
            <h4 className="font-semibold mb-2">Add Question to Quiz</h4>
            <form onSubmit={handleAddQuestion} className="space-y-2">
              <select value={questionForm.quiz_id} onChange={(e) => setQuestionForm({...questionForm, quiz_id: e.target.value})} className="border p-2 rounded w-full">
                <option value="">Select quiz</option>
                {quizzes.map(q => <option key={q.quiz_id} value={q.quiz_id}>{q.title}</option>)}
              </select>
              <textarea value={questionForm.question_text} onChange={(e) => setQuestionForm({...questionForm, question_text: e.target.value})} placeholder="Question text" className="border p-2 w-full rounded" />
              <div className="grid grid-cols-2 gap-2">
                <input value={questionForm.option_a} onChange={(e) => setQuestionForm({...questionForm, option_a: e.target.value})} placeholder="Option A" className="border p-2 rounded" />
                <input value={questionForm.option_b} onChange={(e) => setQuestionForm({...questionForm, option_b: e.target.value})} placeholder="Option B" className="border p-2 rounded" />
                <input value={questionForm.option_c} onChange={(e) => setQuestionForm({...questionForm, option_c: e.target.value})} placeholder="Option C" className="border p-2 rounded" />
                <input value={questionForm.option_d} onChange={(e) => setQuestionForm({...questionForm, option_d: e.target.value})} placeholder="Option D" className="border p-2 rounded" />
              </div>
              <select value={questionForm.correct_option} onChange={(e) => setQuestionForm({...questionForm, correct_option: e.target.value})} className="border p-2 rounded">
                <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
              </select>
              <div>
                <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Add Question</button>
              </div>
            </form>
          </div>
        </section>
        <section id="materials" className="space-y-4 border-t pt-6">
  <h2 className="text-xl font-semibold">Upload Course Materials</h2>
  <div className="bg-white p-4 rounded shadow max-w-xl">
    <div className="mb-3">
      <label className="block text-sm font-medium">Selected Course</label>
      <div className="mt-1">
        {selectedCourse ? selectedCourse.title : (
          <span className="text-gray-500">No course selected</span>
        )}
      </div>
    </div>
    <input
      value={material}
      onChange={(e) => setMaterial(e.target.value)}
      placeholder="Paste notes or video URL"
      className="border p-2 w-full rounded mb-2"
    />
    <button
      onClick={handleUploadMaterial}
      className="bg-blue-700 text-white px-4 py-2 rounded"
    >
      Upload
    </button>
  </div>
</section>
      </main>
    </div>
  );
}
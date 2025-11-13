// src/pages/QuizPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiGet } from "../lib/api";

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuizAndQuestions() {
      setLoading(true);
      setError(null);
      try {
        const quizzes = await apiGet(`/quizzes/course/${courseId}`);
        if (!quizzes || quizzes.length === 0) {
          if (!cancelled) {
            setQuiz(null);
            setQuestions([]);
            setError("No quiz found for this course.");
          }
          return;
        }

        const qz = quizzes[0];
        if (!cancelled) setQuiz(qz);

        const qs = await apiGet(`/quizzes/${qz.quiz_id}/questions`);
        if (!cancelled) setQuestions(qs || []);
      } catch (err) {
        console.error("Quiz load error:", err);
        if (!cancelled) setError("Failed to load quiz. Try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadQuizAndQuestions();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  function handleSelect(question_id, optKey) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [question_id]: optKey }));
  }

  const handleSubmit = async () => {
    if (questions.length === 0) return;

    let correct = 0;
    questions.forEach((q) => {
      const chosen = answers[q.question_id];
      const correctOpt = q.correct_option?.toLowerCase();
      if (chosen && correctOpt && chosen === correctOpt) correct++;
    });

    const pct = ((correct / questions.length) * 100).toFixed(1);
    setScore(Number(pct));
    setSubmitted(true);

    //  Save progress to backend
    try {
      const student_id = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      if (!student_id) {
        console.warn("No student_id found in localStorage");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/progress/update",
        { student_id, course_id: courseId, score: pct },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(" Progress updated:", response.data);
    } catch (err) {
      console.error(" Failed to update progress:", err);
    }
  };

  if (loading)
    return <div className="p-6 text-center">Loading quiz...</div>;

  if (error)
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Go back
        </button>
      </div>
    );

  if (!quiz)
    return (
      <div className="p-6 text-center">
        <p>No quiz available for this course.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
        >
          Back
        </button>
      </div>
    );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-1">
          {quiz.title}
        </h1>
        <p className="text-sm text-gray-600">
          Course ID: {courseId} • Questions: {questions.length}
        </p>
      </header>

      {questions.length === 0 ? (
        <div className="p-6 text-center text-gray-600">
          No questions found for this quiz.
        </div>
      ) : (
        <>
          {questions.map((q, idx) => {
            const opts = {
              a: q.option_a,
              b: q.option_b,
              c: q.option_c,
              d: q.option_d,
            };

            return (
              <div
                key={q.question_id}
                className="mb-6 bg-white shadow rounded p-4"
              >
                <h2 className="font-semibold mb-3">
                  {idx + 1}. {q.question_text}
                </h2>

                {Object.entries(opts).map(([key, text]) => (
                  <label
                    key={key}
                    className={`block mb-2 p-2 rounded cursor-pointer flex items-center ${
                      submitted &&
                      q.correct_option?.toLowerCase() === key
                        ? "bg-green-50 border border-green-200"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q_${q.question_id}`}
                      value={key}
                      checked={answers[q.question_id] === key}
                      onChange={() => handleSelect(q.question_id, key)}
                      disabled={submitted}
                      className="mr-3"
                    />
                    <span className="flex-1">
                      {text ?? (
                        <span className="text-gray-400">[option missing]</span>
                      )}
                    </span>

                    {submitted && (
                      <>
                        {q.correct_option?.toLowerCase() === key ? (
                          <span className="ml-3 text-green-600 font-semibold">
                            Correct
                          </span>
                        ) : answers[q.question_id] === key ? (
                          <span className="ml-3 text-red-600">
                            Your answer
                          </span>
                        ) : null}
                      </>
                    )}
                  </label>
                ))}
              </div>
            );
          })}

          <div className="flex items-center gap-4">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="bg-blue-700 text-white px-4 py-2 rounded"
              >
                Submit Quiz
              </button>
            ) : (
              <div className="text-lg font-semibold">
                Your score:{" "}
                <span className="text-blue-700">{score}%</span>
              </div>
            )}

            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}
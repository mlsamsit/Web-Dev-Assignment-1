import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const fetchAvailableQuizzes = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes`);
  const data = await response.json();
  const quizzes = data.quizzes;
  return quizzes;
};

function AvailableQuizzes() {
  const [quizzes, setQuizzes] = useState<string[]>([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await fetchAvailableQuizzes();
      setQuizzes(data);
    })();
  }, []);

  const handleDelete = async (title: string) => {
    if (!title) return alert("No quiz provided!");
    const token = localStorage.getItem("token");
    if (!token) return alert("Invalid token!\nPlease SignIn again.");

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizName: title,
        token,
      }),
    });

    const { message } = await response.json();

    if (response.ok) {
      const updatedQuizzes = quizzes.filter((quiz: any) => quiz.title != title);
      setQuizzes(updatedQuizzes);
    }
    alert(message);
  };

  const handleQuizClick = (title: string) => {
    if (deleteMode) {
      const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
      if (confirmDelete) handleDelete(title);
    } else {
      navigate(`/quiz/${title}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-10">Available Quizzes</h1>

        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => (
              <div
                key={index}
                onClick={() => handleQuizClick((quiz as any).title)}
                className={`bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg transition duration-200 cursor-pointer ${
                  deleteMode ? "hover:bg-red-600/30" : "hover:bg-white/20"
                }`}
              >
                <h2 className="text-xl font-semibold">{(quiz as any).title}</h2>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-100 mt-6">No quizzes available.</p>
        )}

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-indigo-100 transition duration-200"
          >
            Back to Home
          </button>

          <button
            onClick={() => navigate("/quiz/new")}
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-indigo-100 transition duration-200"
          >
            Add Your Own Quiz
          </button>

          <button
            onClick={() => setDeleteMode(!deleteMode)}
            className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition duration-200 ${
              deleteMode
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-white text-red-600 hover:bg-red-100"
            }`}
          >
            {deleteMode ? "Cancel Delete" : "Delete Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvailableQuizzes;

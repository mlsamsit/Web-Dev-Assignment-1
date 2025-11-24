import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

type Question = {
  _id: string;
  question: string;
  options: string[];
  answer: number;
};

type QuizData = {
  _id: string;
  quizName: string;
  questions: Question[];
  __v?: number;
};

const fetchQuizData = async (title: string | undefined) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/${title}`);
  const data = await response.json();
  return data;
};

const updateStats = async (title: string, score: number) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('No token found. Please sign in again.');
    return;
  }

  const now = new Date();
  const time = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()} at ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token,
      title,
      score: score.toString(),
      time
    })
  })
  if (response.ok) console.log('stats updated')
}

function QuizPage() {
  const { title } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchQuizData(title);
      setQuizData(data);
    })();
  }, [title]);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (quizData && quizData.questions[currentQuestion].answer - 1 === index) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!quizData) return;
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
      updateStats(quizData.quizName, score + (selectedOption !== null && quizData.questions[currentQuestion].answer - 1 === selectedOption ? 1 : 0));
    }
  };

  if (!quizData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <p className="text-lg">Loading quiz...</p>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-10 flex flex-col items-center">
      {!showResult ? (
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            {quizData.quizName}
          </h2>
          <p className="text-lg font-medium mb-6">{question.question}</p>

          <div className="space-y-4">
            {question.options.map((option, index) => {
              const isCorrect = question.answer - 1 === index;
              const isSelected = selectedOption === index;
              let optionClass = "bg-white/10 hover:bg-white/20";

              if (selectedOption !== null) {
                if (isSelected && isCorrect) optionClass = "bg-green-500";
                else if (isSelected && !isCorrect) optionClass = "bg-red-500";
                else if (isCorrect) optionClass = "bg-green-500/70";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition duration-200 ${optionClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-indigo-100 transition duration-200"
              >
                {currentQuestion === quizData.questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </button>
            </div>
          )}

          <div className="mt-6 text-right text-sm text-gray-200">
            Question {currentQuestion + 1} of {quizData.questions.length}
          </div>
        </div>
      ) : (
        <div className="text-center bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-lg max-w-md">
          <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-6">
            You scored{" "}
            <span className="font-bold text-white">
              {score} / {quizData.questions.length}
            </span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-indigo-100 transition duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/quizzes")}
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-indigo-100 transition duration-200"
            >
              See Available Quizzes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;

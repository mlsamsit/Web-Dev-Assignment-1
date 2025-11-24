import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


type QuestionForm = {
  question: string;
  options: string[];
  answer: number | null;
};

function AddQuizPage() {

  async function submitQuiz(data: any) {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please SignIn to add quizzes.')
      navigate('/')
      return 
    }
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quizName: data.quizName,
            questions: data.questions,
            token
        })
    })
    const result = await response.json()
    alert(result.message)
    console.log(result)
    navigate('/quizzes') 
  }

  const navigate = useNavigate()
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { question: "", options: ["", "", "", ""], answer: null },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleQuestionChange = (value: string) => {
    const updated = [...questions];
    updated[currentQuestionIndex].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[currentQuestionIndex].options[index] = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (value: number) => {
    if (value >= 1 && value <= 4) {
      const updated = [...questions];
      updated[currentQuestionIndex].answer = value;
      setQuestions(updated);
    } else {
      const updated = [...questions];
      updated[currentQuestionIndex].answer = null;
      setQuestions(updated);
    }
  };

  const canGoNext = () => {
    if (!quizName.trim()) return false;
    if (!currentQuestion.question.trim()) return false;

    for (let i = 0; i < currentQuestion.options.length; i++) {
        if (!currentQuestion.options[i].trim()) return false;
    }

    if (currentQuestion.answer === null || currentQuestion.answer < 1 || currentQuestion.answer > 4) return false;

    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    if (currentQuestionIndex === questions.length - 1) {
      setQuestions((prev) => [
        ...prev,
        { question: "", options: ["", "", "", ""], answer: null },
      ]);
    }
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-10 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Create New Quiz
        </h2>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Quiz Name</label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-white bg-transparent outline outline-2 outline-gray-300 focus:outline-indigo-400"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            Question {currentQuestionIndex + 1}
          </label>
          <input
            type="text"
            value={currentQuestion.question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-white bg-transparent outline outline-2 outline-gray-300 focus:outline-indigo-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {currentQuestion.options.map((option, idx) => (
            <div key={idx}>
              <label className="block mb-1 font-semibold">Option {idx + 1}</label>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-white bg-transparent outline outline-2 outline-gray-300 focus:outline-indigo-400"
              />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Correct Option (1-4)</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[1-4]"
            value={currentQuestion.answer ?? ""}
            onChange={(e) => handleAnswerChange(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg text-white bg-transparent outline outline-2 outline-gray-300 focus:outline-indigo-400"
          />
        </div>

        <div className="flex justify-between mt-6 flex-wrap gap-3">
          <button
            onClick={handlePrevious}
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-indigo-100 transition duration-200"
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className={`px-6 py-3 font-semibold rounded-xl shadow-lg transition duration-200 ${
              canGoNext()
                ? "bg-white text-indigo-600 hover:bg-indigo-100"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
            disabled={!canGoNext()}
          >
            Next
          </button>
          <button
            onClick={() => navigate('/quizzes')}
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-indigo-100 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => submitQuiz({quizName, questions})}
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-indigo-100 transition duration-200"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddQuizPage;

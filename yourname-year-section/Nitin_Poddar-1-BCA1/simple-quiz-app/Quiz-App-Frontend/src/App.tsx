import LandingPage from "./components/LandingPage"
import { Route, Routes, BrowserRouter } from "react-router";
import AvailableQuizzes from "./components/Quizzes";
import QuizPage from "./components/QuizPage";
import AddQuizPage from "./components/AddQuizPage";
import StatPage from "./components/StatPage";

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/quizzes" element={<AvailableQuizzes />} />
      <Route path="/quiz/:title" element={<QuizPage />} />
      <Route path="/quiz/new" element={<AddQuizPage />} />
      <Route path="/stats" element={<StatPage />} />
    </Routes>
  </BrowserRouter>)
}

export default App

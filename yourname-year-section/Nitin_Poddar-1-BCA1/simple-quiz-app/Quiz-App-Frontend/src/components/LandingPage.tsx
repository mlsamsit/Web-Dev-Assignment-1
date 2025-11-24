import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const autoLogin = async (token: string) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'token',
      token
    })
  });

  if (response.ok) {
    const { userName } = await response.json();
    return userName;
  }

  return false;
};

function LandingPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    (async () => {
      const name = await autoLogin(token);
      if (!name) return;
      setUserName(name);
    })();
  }, []);

  const handleSignUp = async () => {
    const userName = userRef.current?.value.toLowerCase();
    const password = passRef.current?.value;

    if (!userName || !password) return alert("Please fill all the fields!");

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        userName, password
      })
    });

    const { message } = await response.json();
    alert(message);
  };

  const handleSignIn = async () => {
    const userName = userRef.current?.value.toLowerCase();
    const password = passRef.current?.value;

    if (!userName || !password) return alert('Please fill all the fields!');

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signin`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        type: 'password',
        userName,
        password
      })
    });

    const data = await response.json();
    if (response.ok) {
      if (data.token) localStorage.setItem('token', data.token);
      const name = data.userName;
      setUserName(name);
    }
    alert(data.message)
  };

  const handleLogout = () => {
    setUserName('');
    localStorage.removeItem('token');
  };

  const handleSeeQuizzes = () => {
    if (!userName) return alert('Please Sign In first!');
    navigate("/quizzes");
  };

  const handleSeeStats = () => {
    if (!userName) return alert('Please Sign In first!');
    navigate("/stats");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4">
      <div className="max-w-2xl text-center mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
          Welcome to Quizzy
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-8 text-gray-100">
          Test your knowledge with fun and challenging quizzes anytime, anywhere.
        </p>

        {userName && (
          <div className="flex flex-col items-center justify-center gap-3 mb-6">
            <p className="text-white text-lg font-medium">
              You are signed in as <span className="font-semibold">{userName}</span>
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-indigo-100 transition duration-200"
            >
              Logout
            </button>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleSeeQuizzes}
            className="px-6 sm:px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-indigo-100 transition duration-200 text-sm sm:text-base"
          >
            See Available Quizzes
          </button>

          <button
            onClick={handleSeeStats}
            className="px-6 sm:px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-indigo-100 transition duration-200 text-sm sm:text-base"
          >
            Check Your Stats
          </button>
        </div>
      </div>

      {!userName && (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold mb-6 text-indigo-600">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h1>

          <input
            ref={userRef}
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-2 border-2 border-indigo-600 rounded-lg text-indigo-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            ref={passRef}
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-2 border-2 border-indigo-600 rounded-lg text-indigo-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          {isSignUp ? (
            <button
              onClick={handleSignUp}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
            >
              Sign Up
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
            >
              Sign In
            </button>
          )}

          <p className="mt-4 text-indigo-600 font-medium">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="font-semibold underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="font-semibold underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default LandingPage;

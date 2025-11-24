import { useEffect, useState } from "react";

function StatPage() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return alert('Invalid token!\nPlease SignIn again.');

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stats`, {
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
      });

      const data = await response.json();
      if (response.ok) setStats(data.stats);
      else{
        if (response.status == 404) return
        alert(data.message)
      };
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-10">
          Your Quiz Stats
        </h1>

        {stats && stats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg hover:bg-white/20 transition duration-200"
              >
                <h2 className="text-xl font-semibold mb-2">Quiz: {item.title}</h2>
                <p className="text-lg">Score: {item.score}</p>
                <p className="text-lg">Time: {item.time}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-100 mt-6">No stats available.</p>
        )}
      </div>
    </div>
  );
}

export default StatPage;

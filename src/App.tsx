import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Matching from './pages/Matching';
import Messaging from './pages/Messaging';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        {user && (
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">MentorMatch</h1>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/matching" />} />
          <Route 
            path="/onboarding" 
            element={user && !user.profile_completed ? <Onboarding /> : <Navigate to="/matching" />} 
          />
          <Route 
            path="/matching" 
            element={user && user.profile_completed ? <Matching /> : <Navigate to="/onboarding" />} 
          />
          <Route 
            path="/messages/:matchId" 
            element={user ? <Messaging /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to={user ? "/matching" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchingAPI, type Match } from '../api';

export default function Matching() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState<string | boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getMatches = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await matchingAPI.getMatches(user.id);
        setMatches(response.data.matches);
        setFallback(response.data.fallback);
      } catch (error) {
        console.error('Error getting matches:', error);
        alert('Failed to load matches. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getMatches();
  }, []);

  const handleAccept = async (match: Match) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await matchingAPI.createMatch({
        junior_id: user.id,
        senior_id: match.id,
        match_score: match.match_score,
        match_reasons: match.match_reasons
      });
      navigate(`/messages/${match.id}`);
    } catch (error) {
      console.error('Error accepting match:', error);
      alert('Failed to accept match. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">AI matching in progress...</p>
          <p className="text-white/80 mt-2">Finding the best mentors for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Your Matches</h2>
            {fallback && (
              <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                {fallback === 'low_confidence' ? 'Low Confidence Matches' : 
                 fallback === 'no_matches' ? 'No Matches Available' : 
                 'Admin Review Required'}
              </span>
            )}
          </div>

          {matches.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {fallback === 'no_matches' ? "You're on the waitlist" : "No matches yet"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're still looking for the perfect mentors for you. We'll notify you as soon as we find matches.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {matches.map((match) => (
                <div key={match.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {match.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{match.name}</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {match.match_score}% Match
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {match.industry} • {match.years_experience} years experience • 
                        Available in {match.available_within}h • {match.success_rate}% success rate
                      </p>
                      
                      <p className="text-gray-700 mb-4">{match.bio}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {match.match_reasons.map((reason, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 flex-shrink-0">
                      <button
                        onClick={() => handleAccept(match)}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all"
                      >
                        Accept Match
                      </button>
                      <button
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

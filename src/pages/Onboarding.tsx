import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../api';

export default function Onboarding() {
  const [role, setRole] = useState<'junior' | 'senior'>('junior');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Junior form state
  const [juniorForm, setJuniorForm] = useState({
    industry: '',
    years_experience: 0,
    problem: '',
    preferred_language: 'English',
    timezone: 'UTC-8'
  });

  // Senior form state
  const [seniorForm, setSeniorForm] = useState({
    name: '',
    industry: '',
    expertise: '',
    years_experience: 0,
    bio: '',
    available_within: 24
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (role === 'junior') {
        await profileAPI.updateJuniorProfile(user.id, juniorForm);
      } else {
        await profileAPI.updateSeniorProfile(user.id, {
          ...seniorForm,
          languages: ['English'],
          success_rate: 90
        });
      }

      // Update user profile status
      localStorage.setItem('user', JSON.stringify({
        ...user,
        role,
        profile_completed: true
      }));

      navigate('/matching');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Complete Your Profile
          </h2>

          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole('junior')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                role === 'junior'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              I'm looking for mentorship
            </button>
            <button
              type="button"
              onClick={() => setRole('senior')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                role === 'senior'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              I want to be a mentor
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {role === 'junior' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={juniorForm.industry}
                    onChange={(e) => setJuniorForm({ ...juniorForm, industry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g. Technology, Marketing, Design"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={juniorForm.years_experience}
                    onChange={(e) => setJuniorForm({ ...juniorForm, years_experience: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    max="50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your challenge
                  </label>
                  <textarea
                    value={juniorForm.problem}
                    onChange={(e) => setJuniorForm({ ...juniorForm, problem: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={4}
                    placeholder="What do you need help with? Be specific!"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Language
                    </label>
                    <input
                      type="text"
                      value={juniorForm.preferred_language}
                      onChange={(e) => setJuniorForm({ ...juniorForm, preferred_language: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <input
                      type="text"
                      value={juniorForm.timezone}
                      onChange={(e) => setJuniorForm({ ...juniorForm, timezone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. UTC-8, GMT+1"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={seniorForm.name}
                    onChange={(e) => setSeniorForm({ ...seniorForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={seniorForm.industry}
                    onChange={(e) => setSeniorForm({ ...seniorForm, industry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g. Technology, Marketing, Finance"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Expertise
                  </label>
                  <textarea
                    value={seniorForm.expertise}
                    onChange={(e) => setSeniorForm({ ...seniorForm, expertise: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    placeholder="What can you mentor others on? e.g. AI transition, engineering management, digital marketing"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={seniorForm.years_experience}
                      onChange={(e) => setSeniorForm({ ...seniorForm, years_experience: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                      max="50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available within (hours)
                    </label>
                    <input
                      type="number"
                      value={seniorForm.available_within}
                      onChange={(e) => setSeniorForm({ ...seniorForm, available_within: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="1"
                      max="168"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Bio
                  </label>
                  <textarea
                    value={seniorForm.bio}
                    onChange={(e) => setSeniorForm({ ...seniorForm, bio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    placeholder="Tell mentees a bit about yourself and your background"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

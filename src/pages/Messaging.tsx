import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { messagesAPI, type Message } from '../api';

export default function Messaging() {
  const { matchId } = useParams<{ matchId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing messages
    const loadMessages = async () => {
      if (matchId) {
        try {
          // For demo, start with a welcome message
          setMessages([
            {
              id: '1',
              match_id: matchId,
              sender_id: 'senior-id',
              content: 'Hi there! I saw we matched. How can I help you today?',
              created_at: new Date().toISOString(),
              crisis_alert: false
            }
          ]);
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      }
    };

    loadMessages();
  }, [matchId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !matchId) return;

    setLoading(true);
    try {
      const response = await messagesAPI.sendMessage({
        match_id: matchId,
        content: newMessage.trim()
      });

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');

      // Simulate reply
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          match_id: matchId,
          sender_id: 'senior-id',
          content: "Thanks for your message! I'd be happy to help you with that. Let's schedule a call to discuss more details.",
          created_at: new Date().toISOString(),
          crisis_alert: false
        }]);
      }, 2000);

      // Show alert if crisis detected
      if (response.data.crisis_alert) {
        alert('Crisis content detected! This message has been flagged for review.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                JS
              </div>
              <div>
                <h2 className="text-xl font-semibold">John Smith</h2>
                <p className="text-sm text-white/80">Online • Usually responds in a few hours</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              Matched 85%
            </span>
          </div>

          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => {
                const isMe = message.sender_id !== 'senior-id';
                return (
                  <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[70%] px-4 py-3 rounded-lg shadow-sm ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                      }`}
                    >
                      <p className="mb-1">{message.content}</p>
                      <div className={`text-xs ${isMe ? 'text-white/70' : 'text-gray-500'} flex items-center gap-2`}>
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {message.crisis_alert && (
                          <span className="text-red-300 font-medium">⚠️ Crisis flagged</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message Input */}
          <form onSubmit={handleSend} className="p-6 border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Messages are scanned for crisis content. High-risk messages will be flagged for review.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

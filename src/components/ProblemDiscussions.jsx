import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { MessageSquare, ThumbsUp, Send, User, Sparkles, AlertCircle, Code, Lock } from 'lucide-react';

export function ProblemDiscussions({ problemId }) {
  const { user, authToken, setAuthModalOpen } = useApp();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const API_BASE = 'http://localhost:5000/api';

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/problems/${problemId}/comments`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (e) {
      console.log("Using offline comments fallback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [problemId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    if (!authToken || user.username === 'Guest Explorer') {
      setAuthModalOpen(true);
      return;
    }

    setPosting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE}/problems/${problemId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ content: newCommentContent })
      });
      const data = await res.json();
      setPosting(false);

      if (res.ok && data.comment) {
        setComments(prev => [data.comment, ...prev]);
        setNewCommentContent('');
      } else {
        setErrorMsg(data.error || 'Failed to post comment.');
      }
    } catch (err) {
      setPosting(false);
      // Offline fallback posting
      const fallbackComment = {
        id: Date.now(),
        problemId,
        username: user.username,
        avatar: user.avatar,
        content: newCommentContent,
        upvotes: 0,
        createdAt: new Date().toISOString()
      };
      setComments(prev => [fallbackComment, ...prev]);
      setNewCommentContent('');
    }
  };

  const handleUpvote = async (commentId) => {
    if (!authToken || user.username === 'Guest Explorer') {
      setAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/comments/${commentId}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        setComments(prev => prev.map(c => {
          if (c.id === commentId) {
            return { ...c, upvotes: c.upvotes + 1 };
          }
          return c;
        }));
      }
    } catch (err) {
      console.log("Upvote fallback");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-3">
        <h3 className="font-extrabold text-base text-violet-950 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-violet-600" />
          <span>Community Discussions & Solution Tips ({comments.length})</span>
        </h3>
      </div>

      {/* Post Comment Form */}
      {user.username === 'Guest Explorer' ? (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-violet-950 font-medium">
            <Lock className="w-4 h-4 text-violet-600 shrink-0" />
            <span>Sign in to join the conversation, share your SQL query tips, and help others!</span>
          </div>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white shrink-0 hover:bg-violet-500 transition-colors shadow-md shadow-purple-500/20"
          >
            Sign In / Register
          </button>
        </div>
      ) : (
        <form onSubmit={handlePostComment} className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-lg shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1 space-y-2">
              <textarea
                rows={3}
                placeholder="Share your approach, alternative solution query, or tips for this problem..."
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white border border-purple-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-violet-500 placeholder:text-slate-400 shadow-sm"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">Supports code blocks (`SELECT...`)</span>
                <button
                  type="submit"
                  disabled={posting || !newCommentContent.trim()}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-md shadow-purple-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{posting ? 'Posting...' : 'Post Solution Tip'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Discussions Feed */}
      {loading ? (
        <div className="text-xs font-mono text-slate-500 p-4 text-center animate-pulse">
          Loading community discussions...
        </div>
      ) : comments.length === 0 ? (
        <div className="p-8 rounded-2xl bg-purple-50/40 border border-purple-100 text-center space-y-2">
          <MessageSquare className="w-8 h-8 text-purple-300 mx-auto" />
          <p className="text-xs font-bold text-violet-950">No discussions posted for this problem yet!</p>
          <p className="text-[11px] text-slate-500">Be the first developer to share your SQL solution approach or tip.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-2xl bg-white border border-purple-100 space-y-2.5 shadow-sm">
              
              {/* Comment Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{comment.avatar}</span>
                  <div>
                    <h4 className="text-xs font-bold text-violet-950">{comment.username}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleUpvote(comment.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200 font-mono text-xs transition-colors font-bold"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-violet-600" />
                  <span>{comment.upvotes || 0}</span>
                </button>
              </div>

              {/* Comment Body */}
              <div className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                {comment.content}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

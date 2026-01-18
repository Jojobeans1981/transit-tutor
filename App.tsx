import React, { useState, useEffect, useCallback } from 'react';

// --- 1. TYPES ---
interface SessionReview {
  question: string;
  correctText: string;
  status: 'pending' | 'CORRECT' | 'FAILED';
}

interface LeaderboardEntry {
  pass_number: string;
  readiness_rating: number;
}

interface RadarPing {
  id: number;
  top: string;
  left: string;
}

// SECURE: Environment Variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SESSION_LIMIT = 10;

export default function App() {
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [passNum, setPassNum] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [review, setReview] = useState<SessionReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pings, setPings] = useState<RadarPing[]>([]);
  const [sloganText, setSloganText] = useState("");
  
  // OFFICIAL SLOGAN
  const fullSlogan = "S.O.D.A. — Promotion Through Precision";

  // --- 2. DATA FETCHING ---
  const fetchLeaderboard = useCallback(async () => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/operator_scores?select=pass_number,readiness_rating&order=readiness_rating.desc&limit=5`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) setLeaderboard(data);
    } catch (e) {
      console.error("Leaderboard Error:", e);
    }
  }, []);

  const fetchQuestion = useCallback(async () => {
    if (loading || !SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    setLoading(true);
    setShowExplanation(false);
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/soda-prep`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ history, salt: Math.random() })
      });
      const data = await response.json();
      if (data?.answer) {
        setHistory(prev => [...prev, data.answer.question]);
        setCurrentQuestion(data.answer);
      }
    } catch (e) {
      console.error("SODA Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  }, [history, loading]);

  // --- 3. EFFECTS ---
  useEffect(() => {
    fetchLeaderboard();
    
    let i = 0;
    const sloganInterval = setInterval(() => {
      if (i <= fullSlogan.length) {
        setSloganText(fullSlogan.slice(0, i));
        i++;
      } else {
        clearInterval(sloganInterval);
      }
    }, 40);

    const pingInterval = setInterval(() => {
      setPings((prev) => [
        ...prev.slice(-3),
        { id: Date.now(), top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%` }
      ]);
    }, 3000);

    return () => {
      clearInterval(sloganInterval);
      clearInterval(pingInterval);
    };
  }, [fetchLeaderboard]);

  // --- 4. HANDLERS ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passNum.trim().length >= 2) {
      setIsLoggedIn(true);
      fetchQuestion();
    }
  };

  const handleAnswer = (letter: string) => {
    if (showExplanation || !currentQuestion) return;
    const isCorrect = letter === currentQuestion.correct;
    const newStats = { correct: stats.correct + (isCorrect ? 1 : 0), total: stats.total + 1 };
    
    setReview(prev => [...prev, {
      question: currentQuestion.question,
      correctText: currentQuestion.options[currentQuestion.correct],
      status: isCorrect ? 'CORRECT' : 'FAILED'
    }]);

    setStats(newStats);
    setShowExplanation(true);

    if (newStats.total >= SESSION_LIMIT) {
      const finalScore = Math.round((newStats.correct / SESSION_LIMIT) * 100);
      saveToDatabase(finalScore, newStats.correct);
      setTimeout(() => setIsFinished(true), 1500);
    }
  };

  const saveToDatabase = async (finalScore: number, correctCount: number) => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/operator_scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          pass_number: passNum.toUpperCase(),
          readiness_rating: finalScore,
          correct_answers: correctCount,
          total_questions: SESSION_LIMIT,
          last_active: new Date().toISOString()
        })
      });
    } catch (e) {
      console.error("Database Sync Error:", e);
    }
  };

  // --- 5. UI: ZOOMED BACKGROUND & HUD ---
  const BackgroundBranding = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#01040a]">
      {/* Centered Radar Rings */}
      <div className="absolute top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 w-[250vmax] h-[250vmax] opacity-20">
        {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((scale, i) => (
          <div key={i} className="absolute inset-0 border-[0.5px] border-orange-500/20 rounded-full" style={{ transform: `scale(${scale})` }}></div>
        ))}
      </div>

      <div className="absolute top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 w-[300vmax] h-[300vmax] z-10 opacity-30">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(234,88,12,0.6)_4deg,transparent_60deg)] animate-[spin_15s_linear_infinite]"></div>
      </div>

      {/* LEFT SECTOR: map.jpg (ZOOMED) */}
      <div className="absolute inset-y-0 left-0 w-[60%] opacity-[0.12] flex items-center justify-center -translate-x-20 overflow-hidden">
        <img src="/map.jpg" alt="MAP" className="min-w-full min-h-full object-cover grayscale scale-110 contrast-125 brightness-150" />
      </div>

      {/* RIGHT SECTOR: Logo (ZOOMED) */}
      <div className="absolute inset-y-0 right-0 w-[60%] opacity-[0.18] flex items-center justify-center translate-x-24 overflow-hidden">
        <img src="/We Move New York Final.png" alt="LOGO" className="w-[110%] max-w-none grayscale scale-125 contrast-125 select-none" />
      </div>

      {pings.map(ping => (
        <div key={ping.id} className="absolute w-2 h-2 bg-orange-600 rounded-full z-20" style={{ top: ping.top, left: ping.left, animation: 'sonarPing 5s forwards' }}>
          <style>{`@keyframes sonarPing { 0% { transform: scale(0.5); opacity: 0; } 5% { opacity: 1; } 100% { transform: scale(14); opacity: 0; } }`}</style>
        </div>
      ))}
    </div>
  );

  const Header = () => (
    <div className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-[100] bg-slate-950/90 backdrop-blur-3xl border-b border-white/10 shadow-2xl">
      <div className="flex items-center gap-3">
        <img src="/We Move New York Final.png" alt="WMNY" className="h-10" />
        <div className="h-8 w-[1px] bg-white/20"></div>
        <img src="/image0.png" alt="SODA" className="h-8" />
      </div>
      <div className="text-right">
        <div className="text-[10px] font-black text-white italic uppercase tracking-widest">PROMOTION ASSESSMENT NODE</div>
        <div className="text-[10px] font-black text-orange-500 italic">SECURE CONNECTION ACTIVE</div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
        <BackgroundBranding />
        <Header />
        <div className="w-full max-w-md z-10 pt-24">
          <div className="p-10 rounded-[3rem] bg-black/80 border border-white/10 backdrop-blur-3xl text-center shadow-2xl">
            <h1 className="text-5xl font-black mb-2 italic tracking-tighter">S.O.D.A.</h1>
            <p className="text-[9px] text-orange-500 tracking-[0.2em] font-bold uppercase mb-10 min-h-[20px]">{sloganText}</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white text-center text-xl tracking-[0.3em] uppercase outline-none focus:border-orange-500 transition-all font-mono"
                placeholder="CANDIDATE PASS #"
                value={passNum}
                onChange={(e) => setPassNum(e.target.value)}
              />
              <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-6 rounded-2xl uppercase tracking-[0.4em] text-[10px] shadow-lg shadow-orange-900/40">Initialize Prep</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = Math.round((stats.correct / stats.total) * 100);
    const getLevel = () => {
        if (score >= 90) return { label: 'SUPERIOR - COMMAND READY', color: 'text-green-500' };
        if (score >= 75) return { label: 'COMPETENT - QUALIFIED', color: 'text-blue-400' };
        return { label: 'INCOMPLETE - REVIEW REQUIRED', color: 'text-orange-500' };
    }
    const level = getLevel();

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative text-white">
        <BackgroundBranding />
        <div className="z-10 text-center p-16 rounded-[4rem] bg-black/80 border-2 border-white/10 backdrop-blur-3xl shadow-2xl">
          <h2 className="text-[10rem] font-black leading-none mb-4">{score}%</h2>
          <p className={`${level.color} tracking-[0.5em] uppercase font-black italic mb-2`}>READINESS RATING</p>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-8">{level.label}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-12 py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-orange-600 hover:text-white transition-all shadow-xl">Reset Node</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 relative flex flex-col items-center overflow-hidden">
      <BackgroundBranding />
      <Header />
      <div className="w-full max-w-3xl z-10 mt-28 mb-20">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-mono text-orange-500 uppercase tracking-[0.5em]">Synchronizing Data...</p>
          </div>
        ) : currentQuestion && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
               <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Task {stats.total + 1} / {SESSION_LIMIT}</div>
               <div className="h-[2px] w-32 bg-white/10 relative overflow-hidden rounded-full">
                  <div className="h-full bg-orange-500 transition-all duration-700" style={{ width: `${(stats.total / SESSION_LIMIT) * 100}%` }}></div>
               </div>
            </div>
            <h3 className="text-4xl font-black mb-10 italic leading-tight">{currentQuestion.question}</h3>
            <div className="grid gap-4 mb-10">
              {Object.entries(currentQuestion.options).map(([letter, text]: any) => (
                <button 
                  key={letter} 
                  onClick={() => handleAnswer(letter)} 
                  disabled={showExplanation}
                  className={`p-7 rounded-[2rem] text-left border-2 transition-all flex items-center group ${
                    showExplanation && letter === currentQuestion.correct 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-white/5 bg-white/5 hover:border-orange-500/30'
                  }`}
                >
                   <span className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mr-5 font-black text-orange-500 group-hover:bg-orange-500/10 transition-colors">{letter}</span>
                   <span className="font-bold text-lg">{text}</span>
                </button>
              ))}
            </div>
            {showExplanation && (
              <div className="p-8 rounded-[2.5rem] bg-black/90 border-l-4 border-orange-600 animate-fadeIn backdrop-blur-3xl shadow-2xl">
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-3">Operational Reference</p>
                <p className="text-slate-200 italic leading-relaxed text-lg">{currentQuestion.explanation}</p>
                <button onClick={fetchQuestion} className="mt-8 w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-orange-600 hover:text-white transition-all shadow-xl">Acknowledge & Continue</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from "react";

interface AuthProps {
  onLogin: (
    username: string,
    password: string,
    name: string,
    isSignUp: boolean,
  ) => Promise<string | null>;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await onLogin(username, password, fullName, isSignUp);
      if (result) {
        setError(result);
      }
    } catch (err) {
      setError("Terminal Connection Error: Protocol handshake failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Effect */}
      <div className="radar-container opacity-20 scale-150">
        <div className="radar-beam"></div>
      </div>

      <div className="max-w-lg w-full relative z-10 animate-in fade-in zoom-in duration-1000">
        <div className="bg-[#0A0A0A]/90 backdrop-blur-3xl rounded-[3rem] p-12 md:p-16 shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="relative mb-10 group">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center font-black text-white text-4xl shadow-2xl border-4 border-[#0039A6] p-4 overflow-hidden transition-transform group-hover:scale-105">
                <img
                  src="logo.png"
                  alt="S.O.D.A. Logo"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#FF6319] rounded-2xl flex items-center justify-center font-black text-white text-lg border-4 border-[#0A0A0A] shadow-xl">
                S
              </div>
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">
              S.O.D.A.
            </h1>
            <p className="text-[#FF6319] font-black uppercase tracking-[0.3em] text-[12px] leading-tight">
              Surface Operations Digital Academy
            </p>
            <p className="text-slate-500 mt-2 font-black uppercase tracking-[0.4em] text-[8px]">
              PROMETHEUS ANALYTICS SECURE NODE
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">
                  Official Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Officer Marcus Wright"
                  className="w-full px-8 py-5 bg-black border-2 border-white/10 rounded-2xl focus:border-[#0039A6] outline-none transition-all font-bold text-white placeholder:text-slate-800 text-lg"
                />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">
                Academy Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="dispatcher_unit_42"
                className="w-full px-8 py-5 bg-black border-2 border-white/10 rounded-2xl focus:border-[#0039A6] outline-none transition-all font-bold text-white placeholder:text-slate-800 text-lg"
              />
              {isSignUp && (
                <p className="text-[8px] text-slate-500 mt-3 uppercase font-black tracking-widest italic leading-relaxed px-2">
                  * SECURITY NOTE: Include{" "}
                  <span className="text-[#0039A6] underline">'admin'</span>{" "}
                  in your ID for Command Node level access.
                </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">
                Secure Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-8 py-5 bg-black border-2 border-white/10 rounded-2xl focus:border-[#0039A6] outline-none transition-all font-bold text-white placeholder:text-slate-800 text-lg"
              />
            </div>

            {error && (
              <div className="bg-[#EE352E]/10 border border-[#EE352E]/30 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                <i className="fa-solid fa-triangle-exclamation text-[#EE352E]">
                </i>
                <p className="text-[#EE352E] text-[10px] font-black uppercase tracking-widest">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-6 bg-[#0039A6] hover:bg-[#002a7a] text-white rounded-2xl font-black shadow-[0_15px_30px_rgba(0,57,166,0.3)] transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-4 uppercase tracking-[0.4em] text-sm disabled:opacity-50`}
            >
              {isLoading
                ? (
                  <>
                    <i className="fa-solid fa-sync fa-spin"></i>
                    Verifying Terminal...
                  </>
                )
                : (
                  <>
                    {isSignUp ? "Initialize Enrollment" : "Terminal Unlock"}
                    <i className="fa-solid fa-shield-halved ml-2"></i>
                  </>
                )}
            </button>
          </form>

          <div className="mt-12 text-center border-t border-white/5 pt-8">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-[10px] font-black text-[#FF6319] uppercase tracking-[0.3em] hover:text-white transition-colors"
            >
              {isSignUp
                ? "Existing Personnel? Log In"
                : "New Candidate? Create Credentials"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

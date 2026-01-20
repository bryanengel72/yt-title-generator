import React, { useState } from 'react';

/**
 * DEFENSIVE BRIDGE LOADING
 * We use a try/require block to handle the MindStudio bridge. 
 * This prevents the "Could not resolve './bridge'" compilation error 
 * if the environment is in a state where the module is not yet linked.
 */
let bridge = {
  submit: async () => { },
  useTemplateVariables: () => ({})
};

/* 
// ADAPTATION FOR VITE: require() is not supported in the browser/Vite by default.
// Disabling dynamic require to prevent build errors.
try {
  // Attempt to load the bridge dynamically
  const importedBridge = require('./bridge');
  if (importedBridge) {
    bridge = importedBridge;
  }
} catch (e) {
  // If loading fails, we use the fallback to keep the UI rendering
  console.warn("MindStudio bridge not detected. Using preview mode.");
}
*/
console.warn("MindStudio bridge not detected (Vite Preview). Using preview mode.");

const { submit, useTemplateVariables } = bridge;

// --- HIGH-FIDELITY INLINE ICONS ---
// We use inline SVGs to ensure visuals render even if icon libraries are blocked
const IconYoutube = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" fill="#FF0000" />
    <path d="m9.67 15.02 6.06-3.27-6.06-3.27v6.54z" fill="#fff" />
  </svg>
);

const IconZap = ({ size = 14, className = "text-white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const App = () => {
  const vars = useTemplateVariables() || {};

  const [topic, setTopic] = useState(vars.topic || '');
  const [keyPoints, setKeyPoints] = useState(vars.key_points || '');
  const [targetAudience, setTargetAudience] = useState(vars.target_audience || '');
  const [mainTakeaway, setMainTakeaway] = useState(vars.main_takeaway || '');
  const [descriptionCount, setDescriptionCount] = useState(vars.description_count || '10');
  const [tone, setTone] = useState(vars.tone || 'Viral');
  const [loading, setLoading] = useState(false);

  const tones = [
    { id: 'Viral', icon: '🔥', color: 'bg-orange-600', glow: 'shadow-orange-500/40', desc: 'Curiosity gaps' },
    { id: 'Educational', icon: '💡', color: 'bg-blue-600', glow: 'shadow-blue-500/40', desc: 'Authority & Value' },
    { id: 'Story', icon: '✨', color: 'bg-purple-600', glow: 'shadow-purple-500/40', desc: 'Transformation' },
    { id: 'SEO', icon: '🔍', color: 'bg-emerald-600', glow: 'shadow-emerald-500/40', desc: 'Keyword Focus' },
  ];

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      // Trigger the webhook
      const response = await fetch('https://v1.mindstudio-api.com/developer/v2/apps/run-webhook/main-ff90e155/be73f64d-9f84-48d5-b7c2-e3e45ec96687', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          key_points: keyPoints,
          target_audience: targetAudience,
          main_takeaway: mainTakeaway,
          description_count: descriptionCount,
          tone: tone
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Webhook result:", result);

      // Keep original bridge submit as backup or if needed for other internals, 
      // otherwise this effectively replaces it for the button action.
      // await submit({...});
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-4 sm:p-8 flex items-center justify-center font-sans overflow-x-hidden text-white">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Main UI Card */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[2.5rem] shadow-[0_0_80px_-20px_rgba(239,68,68,0.3)] border border-white/10 bg-[#0f172a]">

        {/* Left Panel: Sidebar */}
        <div className="lg:col-span-4 bg-gradient-to-br from-red-600 via-red-700 to-red-900 p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" /></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                <IconYoutube />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter italic uppercase leading-none">Titler</h1>
                <span className="text-[9px] font-bold tracking-[0.4em] text-red-100 uppercase opacity-70">Expert Cockpit</span>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold leading-tight uppercase tracking-tight border-l-4 border-white pl-4">Rules</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-black/10 rounded-xl border border-white/10 backdrop-blur-md">
                  <IconZap size={14} className="mt-0.5" />
                  <div className="text-[11px] font-medium text-red-50">Under 50 Characters</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-black/10 rounded-xl border border-white/10 backdrop-blur-md">
                  <div className="w-3.5 h-3.5 mt-0.5 bg-white text-red-700 text-[9px] font-black flex items-center justify-center rounded-full">!</div>
                  <div className="text-[11px] font-medium text-red-50 italic">No AI-Speak Patterns</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <div className="p-4 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-xl">
              <div className="text-[10px] font-black text-red-200 uppercase tracking-widest mb-1 italic">Active Strategy</div>
              <p className="text-[12px] font-bold text-white">
                {tones.find(t => t.id === tone)?.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Controls */}
        <div className="lg:col-span-8 p-8 lg:p-12 space-y-8 bg-slate-900/60 backdrop-blur-md">

          {/* Strategy Toggles */}
          <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Profile</label>
              <span className="text-[9px] font-black text-red-500 uppercase">{tone} Mode</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`relative p-4 rounded-2xl text-[11px] font-bold transition-all border flex flex-col items-center gap-2
                    ${tone === t.id
                      ? `bg-white text-slate-900 border-white shadow-2xl scale-105 z-10`
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <span className="uppercase tracking-tight">{t.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-2 bg-[#0f172a] text-[10px] font-black text-red-500 uppercase tracking-widest z-10">1. Core Idea</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="The core video subject..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all min-h-[70px] text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 px-2 bg-[#0f172a] text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">2. Secrets</label>
                <textarea
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="Key hooks..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white text-[11px] placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all min-h-[100px]"
                />
              </div>
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 px-2 bg-[#0f172a] text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">3. The Reveal</label>
                <textarea
                  value={mainTakeaway}
                  onChange={(e) => setMainTakeaway(e.target.value)}
                  placeholder="The 'aha' moment..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white text-[11px] placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all min-h-[100px]"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-2 bg-[#0f172a] text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">4. Target Profile</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Who are we calling out?"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white text-[11px] focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
              <span className="pl-3 text-[10px] font-black text-slate-500 uppercase">Variations</span>
              <div className="flex gap-1">
                {['5', '10', '20'].map(val => (
                  <button
                    key={val}
                    onClick={() => setDescriptionCount(val)}
                    className={`w-9 h-9 rounded-xl text-[10px] font-bold transition-all ${descriptionCount === val
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className={`flex-1 group relative overflow-hidden rounded-2xl py-5 px-4 font-black uppercase tracking-wider text-[10px] sm:text-[11px] transition-all whitespace-nowrap
                ${loading || !topic
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed shadow-none'
                  : 'bg-white text-slate-900 hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/10'}`}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <IconZap size={16} className="text-slate-900" />
                    Transform Content
                  </>
                )}
              </div>
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center gap-2 pt-4 animate-pulse">
              <div className="w-full max-w-[200px] h-1 bg-white/10 rounded-full overflow-hidden relative">
                <div className="h-full bg-red-600 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
              </div>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Calibrating CTR patterns...</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};

export default App;

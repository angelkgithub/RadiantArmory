import { useState, useEffect } from 'react';
import { useGetAllAgentsQuery } from '../services/valorantApi';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What\'s your playstyle?',
    options: ['Aggressive & Bold', 'Passive & Tactical'],
    key: 'aggression',
  },
  {
    id: 2,
    question: 'Team role preference?',
    options: ['Controller/Leader', 'Support/Utility', 'Damage Dealer'],
    key: 'role',
  },
  {
    id: 3,
    question: 'Ability cooldown preference?',
    options: ['Quick Cooldowns (Many uses)', 'Long Cooldowns (Powerful)'],
    key: 'cooldown',
  },
  {
    id: 4,
    question: 'Combat range?',
    options: ['Close Range', 'Medium Range', 'Long Range'],
    key: 'range',
  },
  {
    id: 5,
    question: 'Team coordination?',
    options: ['High (Coordinated plays)', 'Medium', 'Solo Impact'],
    key: 'coordination',
  },
];

const AGENT_SCORES = {
  Jett: {
    aggression: { 'Aggressive & Bold': 3, 'Passive & Tactical': 0 },
    role: { 'Damage Dealer': 3, 'Support/Utility': 0, 'Controller/Leader': 0 },
    cooldown: { 'Quick Cooldowns (Many uses)': 2, 'Long Cooldowns (Powerful)': 1 },
    range: { 'Close Range': 3, 'Medium Range': 1, 'Long Range': 0 },
    coordination: { 'Solo Impact': 3, 'Medium': 1, 'High (Coordinated plays)': 0 },
  },
  Reyna: {
    aggression: { 'Aggressive & Bold': 3, 'Passive & Tactical': 0 },
    role: { 'Damage Dealer': 3, 'Support/Utility': 0, 'Controller/Leader': 0 },
    cooldown: { 'Quick Cooldowns (Many uses)': 1, 'Long Cooldowns (Powerful)': 2 },
    range: { 'Close Range': 1, 'Medium Range': 2, 'Long Range': 2 },
    coordination: { 'Solo Impact': 3, 'Medium': 1, 'High (Coordinated plays)': 0 },
  },
  Phoenix: {
    aggression: { 'Aggressive & Bold': 3, 'Passive & Tactical': 0 },
    role: { 'Damage Dealer': 1, 'Support/Utility': 2, 'Controller/Leader': 1 },
    cooldown: { 'Quick Cooldowns (Many uses)': 2, 'Long Cooldowns (Powerful)': 1 },
    range: { 'Close Range': 2, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'Solo Impact': 1, 'Medium': 3, 'High (Coordinated plays)': 1 },
  },
  Raze: {
    aggression: { 'Aggressive & Bold': 3, 'Passive & Tactical': 0 },
    role: { 'Damage Dealer': 3, 'Support/Utility': 0, 'Controller/Leader': 0 },
    cooldown: { 'Quick Cooldowns (Many uses)': 2, 'Long Cooldowns (Powerful)': 1 },
    range: { 'Close Range': 1, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'Solo Impact': 1, 'Medium': 2, 'High (Coordinated plays)': 2 },
  },
  Omen: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3 },
    role: { 'Damage Dealer': 0, 'Support/Utility': 1, 'Controller/Leader': 3 },
    cooldown: { 'Quick Cooldowns (Many uses)': 1, 'Long Cooldowns (Powerful)': 2 },
    range: { 'Close Range': 0, 'Medium Range': 3, 'Long Range': 2 },
    coordination: { 'Solo Impact': 0, 'Medium': 1, 'High (Coordinated plays)': 3 },
  },
  Sage: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3 },
    role: { 'Damage Dealer': 0, 'Support/Utility': 3, 'Controller/Leader': 1 },
    cooldown: { 'Quick Cooldowns (Many uses)': 1, 'Long Cooldowns (Powerful)': 2 },
    range: { 'Close Range': 0, 'Medium Range': 3, 'Long Range': 1 },
    coordination: { 'Solo Impact': 0, 'Medium': 1, 'High (Coordinated plays)': 3 },
  },
  Sova: {
    aggression: { 'Aggressive & Bold': 1, 'Passive & Tactical': 3 },
    role: { 'Damage Dealer': 1, 'Support/Utility': 3, 'Controller/Leader': 0 },
    cooldown: { 'Quick Cooldowns (Many uses)': 1, 'Long Cooldowns (Powerful)': 2 },
    range: { 'Close Range': 0, 'Medium Range': 1, 'Long Range': 3 },
    coordination: { 'Solo Impact': 0, 'Medium': 2, 'High (Coordinated plays)': 3 },
  },
  Breach: {
    aggression: { 'Aggressive & Bold': 2, 'Passive & Tactical': 1 },
    role: { 'Damage Dealer': 1, 'Support/Utility': 2, 'Controller/Leader': 2 },
    cooldown: { 'Quick Cooldowns (Many uses)': 3, 'Long Cooldowns (Powerful)': 0 },
    range: { 'Close Range': 1, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'Solo Impact': 0, 'Medium': 1, 'High (Coordinated plays)': 3 },
  },
  Cypher: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3 },
    role: { 'Damage Dealer': 0, 'Support/Utility': 2, 'Controller/Leader': 3 },
    cooldown: { 'Quick Cooldowns (Many uses)': 1, 'Long Cooldowns (Powerful)': 2 },
    range: { 'Close Range': 0, 'Medium Range': 2, 'Long Range': 3 },
    coordination: { 'Solo Impact': 1, 'Medium': 2, 'High (Coordinated plays)': 3 },
  },
  Viper: {
    aggression: { 'Aggressive & Bold': 1, 'Passive & Tactical': 3 },
    role: { 'Damage Dealer': 1, 'Support/Utility': 1, 'Controller/Leader': 3 },
    cooldown: { 'Quick Cooldowns (Many uses)': 0, 'Long Cooldowns (Powerful)': 3 },
    range: { 'Close Range': 0, 'Medium Range': 2, 'Long Range': 3 },
    coordination: { 'Solo Impact': 1, 'Medium': 2, 'High (Coordinated plays)': 2 },
  },
  Killjoy: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3 },
    role: { 'Damage Dealer': 1, 'Support/Utility': 2, 'Controller/Leader': 2 },
    cooldown: { 'Quick Cooldowns (Many uses)': 2, 'Long Cooldowns (Powerful)': 1 },
    range: { 'Close Range': 2, 'Medium Range': 2, 'Long Range': 1 },
    coordination: { 'Solo Impact': 2, 'Medium': 2, 'High (Coordinated plays)': 1 },
  },
  Yoru: {
    aggression: { 'Aggressive & Bold': 3, 'Passive & Tactical': 1 },
    role: { 'Damage Dealer': 2, 'Support/Utility': 1, 'Controller/Leader': 0 },
    cooldown: { 'Quick Cooldowns (Many uses)': 1, 'Long Cooldowns (Powerful)': 2 },
    range: { 'Close Range': 3, 'Medium Range': 1, 'Long Range': 0 },
    coordination: { 'Solo Impact': 3, 'Medium': 1, 'High (Coordinated plays)': 0 },
  },
};

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const { data: agents = [], isLoading } = useGetAllAgentsQuery();

  const handleAnswerClick = (optionIndex) => {
    const question = QUIZ_QUESTIONS[currentQuestion];
    const newAnswers = {
      ...answers,
      [question.key]: question.options[optionIndex],
    };
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    let bestAgent = null;
    let bestScore = -1;

    for (const [agentName, scoring] of Object.entries(AGENT_SCORES)) {
      let score = 0;
      for (const [key, answer] of Object.entries(finalAnswers)) {
        if (scoring[key] && scoring[key][answer] !== undefined) {
          score += scoring[key][answer];
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestAgent = agentName;
      }
    }

    const matchedAgent = agents.find(
      (a) => a.displayName === bestAgent
    );
    setResult(matchedAgent || agents[0]);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const bgStyle = {
    backgroundImage: `url('https://res.cloudinary.com/dc3erz7jd/image/upload/v1776507337/1868810-3840x2160-desktop-4k-valorant-wallpaper_plv2fb.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="text-white text-xl">Loading agents...</div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="h-screen px-4 flex items-center justify-center relative overflow-hidden" style={bgStyle}>
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Large ghost agent portrait */}
        {result.fullPortrait && (
          <img
            src={result.fullPortrait}
            alt=""
            className="absolute right-[-10%] top-1/2 -translate-y-1/2 h-[110%] object-contain opacity-[0.12] pointer-events-none select-none"
          />
        )}

        <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
          {/* Agent Portrait + Name */}
          <div className="flex flex-col items-center mb-4 sm:mb-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#ff4654]/20 blur-xl scale-150"></div>
              {result.displayIcon && (
                <img
                  src={result.displayIcon}
                  alt={result.displayName}
                  className="relative w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-[0_0_30px_rgba(255,70,84,0.4)]"
                />
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mt-2 tracking-wider text-center">
              {result.displayName.toUpperCase()}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px w-6 sm:w-8 bg-[#ff4654]"></div>
              <span className="text-[#ff4654] text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
                {result.role.displayName}
              </span>
              <div className="h-px w-6 sm:w-8 bg-[#ff4654]"></div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-2 mb-3 sm:mb-4">
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl py-2.5 px-2 text-center">
              <div className="text-[#ff4654] text-base sm:text-lg font-black">✦</div>
              <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">Playstyle</p>
              <p className="text-white text-[11px] sm:text-xs font-bold">Match</p>
            </div>
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl py-2.5 px-2 text-center">
              <div className="text-[#ff4654] text-base sm:text-lg font-black">⚡</div>
              <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">Synergy</p>
              <p className="text-white text-[11px] sm:text-xs font-bold">High</p>
            </div>
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl py-2.5 px-2 text-center">
              <div className="text-[#ff4654] text-base sm:text-lg font-black">🎯</div>
              <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">Impact</p>
              <p className="text-white text-[11px] sm:text-xs font-bold">Strong</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl px-4 py-3 mb-4 sm:mb-5">
            <p className="text-gray-300 text-[11px] sm:text-xs leading-relaxed text-center line-clamp-2">
              {result.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={restart}
              className="group relative flex-1 py-3 sm:py-3.5 overflow-hidden rounded-xl font-bold text-sm sm:text-base text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff4654] to-[#ff6b6b]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b] to-[#ff4654] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
              <span className="relative flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                RETRY
              </span>
            </button>
            <button
              className="group relative flex-1 py-3 sm:py-3.5 overflow-hidden rounded-xl font-bold text-sm sm:text-base text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 border border-[#ff4654]/40 rounded-xl bg-[#ff4654]/5"></div>
              <div className="absolute inset-0 bg-[#ff4654]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <span className="relative flex items-center justify-center gap-2 text-[#ff4654] group-hover:text-white transition-colors duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                SAVE
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="h-screen px-4 flex items-center justify-center relative overflow-hidden" style={bgStyle}>
      <div className="absolute inset-0 bg-[#111823]/50"></div>
      <div className="w-full max-w-lg mx-auto relative z-10">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 text-center tracking-wider">
          FIND YOUR <span className="text-[#ff4654]">AGENT</span>
        </h1>
        <p className="text-gray-500 text-center mb-4 text-xs sm:text-sm uppercase tracking-widest">
          {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
        </p>

        {/* Progress Bar */}
        <div className="mb-6 h-[3px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ff4654] to-[#ff6b6b] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-[#1a2332] border border-white/5 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/40">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-6 text-center">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className="w-full py-4 sm:py-5 px-6 bg-white/[0.03] border border-white/10 text-gray-300 font-semibold text-base sm:text-lg rounded-xl hover:bg-[#ff4654]/10 hover:border-[#ff4654]/50 hover:text-white transition-all duration-200 text-center"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;

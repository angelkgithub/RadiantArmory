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

const AGENT_MATCHES = {
  'Aggressive & Bold-Damage Dealer-Long Range-Solo Impact': 'Reyna',
  'Aggressive & Bold-Damage Dealer-Close Range-Solo Impact': 'Jett',
  'Aggressive & Bold-Support/Utility-Medium Range-Medium': 'Phoenix',
  'Passive & Tactical-Controller/Leader-Medium Range-High': 'Omen',
  'Passive & Tactical-Support/Utility-Medium Range-High': 'Sage',
  'Aggressive & Bold-Damage Dealer-Medium Range-High': 'Raze',
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
    const key = Object.values(finalAnswers).slice(0, 5).join('-');
    const matchedAgentName = AGENT_MATCHES[key] || 'Jett';
    const matchedAgent = agents.find(
      (a) => a.displayName === matchedAgentName
    );
    setResult(matchedAgent);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
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
      <div className="min-h-screen bg-[#111823] px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-12 text-center">
            YOUR AGENT
          </h1>

          <div className="bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-8 rounded-lg mb-8">
            <div className="text-center mb-8">
              {result.displayIcon && (
                <img
                  src={result.displayIcon}
                  alt={result.displayName}
                  className="w-48 h-48 mx-auto mb-4 object-contain"
                />
              )}
            </div>

            <h2 className="text-4xl font-bold text-[#ff4654] text-center mb-2">
              {result.displayName}
            </h2>
            <p className="text-gray-300 text-center mb-6">{result.role.displayName}</p>

            <div className="bg-black/50 p-6 rounded mb-6">
              <h3 className="text-[#ff4654] font-bold mb-3">WHY IT FITS YOU</h3>
              <ul className="text-gray-300 space-y-2">
                <li>✓ Matches your playstyle and preferences</li>
                <li>✓ Ability synergy with your role</li>
                <li>✓ Impact potential aligned with your goals</li>
              </ul>
            </div>

            <div className="bg-black/50 p-6 rounded mb-6">
              <h3 className="text-[#ff4654] font-bold mb-3">PLAYSTYLE TIPS</h3>
              <p className="text-gray-300 text-sm">{result.description}</p>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={restart}
                className="px-6 py-3 bg-[#ff4654] text-white font-bold hover:bg-[#ba3a46] transition-all duration-300 rounded"
              >
                TRY AGAIN
              </button>
              <button
                className="px-6 py-3 border-2 border-[#ff4654] text-[#ff4654] font-bold hover:bg-[#ff4654]/20 transition-all duration-300 rounded"
              >
                SAVE RESULT
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-[#111823] px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-2 text-center">
          BEST AGENT FOR YOU
        </h1>
        <p className="text-gray-400 text-center mb-12">
          Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
        </p>

        {/* Progress Bar */}
        <div className="mb-10 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ff4654] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className="w-full p-4 bg-black/50 border-2 border-gray-600 text-white font-bold text-lg hover:border-[#ff4654] hover:bg-[#ff4654]/10 transition-all duration-300 rounded"
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

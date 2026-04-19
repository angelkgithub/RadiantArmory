import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import WeaponDetailPage from './pages/WeaponDetailPage';
import QuizPage from './pages/QuizPage';
import LoadoutPage from './pages/LoadoutPage';
import LoadoutBuilder from './pages/LoadoutBuilder';
import StrategyPage from './pages/StrategyPage';
import MapPlannerPage from './pages/MapPlannerPage';
import CollectionPage from './pages/CollectionPage';
import HoverCard from './components/HoverCard';
import Footer from './components/Footer';
import './App.css';
import './styles.css';

function App() {
  const [activeIndex, setActiveIndex] = useState(null);

  const cards = [
    { title: "PHOENIX", description: "DUELIST // UK", color: "red", image: "https://picsum.photos/600/800?random=1" },
    { title: "JETT", description: "DUELIST // KR", color: "blue", image: "https://picsum.photos/600/800?random=2" },
    { title: "CYPHER", description: "SENTINEL // MOR", color: "violet", image: "https://picsum.photos/600/800?random=3" },
    { title: "SAGE", description: "SENTINEL // CN", color: "green", image: "https://picsum.photos/600/800?random=4" },
    { title: "SOVA", description: "INITIATOR // RU", color: "orange", image: "https://picsum.photos/600/800?random=5" },
  ];

  return (
    <Router>
      <div className="main-wrapper">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/loadout" element={<LoadoutBuilder />} />
            <Route path="/strategy" element={<StrategyPage />} />
            <Route path="/planner" element={<MapPlannerPage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/weapon/:weaponId" element={<WeaponDetailPage />} />
            <Route path="/weapons" element={<HomePage />} />
            <Route path="/skins" element={<HomePage />} />
            <Route path="/agents" element={
              <div className="card-container" onMouseLeave={() => setActiveIndex(null)}>
                {cards.map((card, i) => (
                  <HoverCard 
                    key={i} 
                    {...card} 
                    isActive={activeIndex === i}
                    onHover={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            } />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import WeaponDetailPage from './pages/WeaponDetailPage';
import QuizPage from './pages/QuizPage';
import LoadoutPage from './pages/LoadoutPage';
import LoadoutBuilder from './pages/LoadoutBuilder';
import StrategyPage from './pages/StrategyPage';
import MapPlannerPage from './pages/MapPlannerPage';
import CollectionPage from './pages/CollectionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#111823] flex flex-col">
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
            <Route path="/agents" element={<HomePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

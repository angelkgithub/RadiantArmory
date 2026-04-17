import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import WeaponDetailPage from './pages/WeaponDetailPage';
import './App_new.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-valorant flex flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
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

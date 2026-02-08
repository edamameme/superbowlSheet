import { useState, useEffect } from 'react';
import './App.css';
import PredictionForm from './components/PredictionForm';
import AdminView from './components/AdminView';
import Leaderboard from './components/Leaderboard';
import MyPredictions from './components/MyPredictions';

function App() {
  const [view, setView] = useState('home'); // home, form, admin, leaderboard, myPredictions
  const [predictions, setPredictions] = useState([]);
  const [scores, setScores] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [predictionsLocked, setPredictionsLocked] = useState(false);

  // Game settings
  const [teamNames, setTeamNames] = useState({ team1: 'Seattle Seahawks', team2: 'New England Patriots' });
  const [theme, setTheme] = useState('seahawks'); // default, seahawks, patriots
  const [categories, setCategories] = useState([
    { key: 'firstTDTime', label: 'First TD Time', type: 'text', pointValue: 10 },
    { key: 'firstScoreTeam', label: 'First Score Team', type: 'radio', pointValue: 5 },
    { key: 'finalScore', label: 'Final Score', type: 'score', pointValue: 10 },
    { key: 'overtime', label: 'Overtime?', type: 'radio', pointValue: 5 },
    { key: 'totalPoints', label: 'Total Points', type: 'number', pointValue: 10 },
    { key: 'carCommercials', label: 'Car Commercials', type: 'number', pointValue: 10 },
    { key: 'beerBrand', label: 'Beer Brand Most Ads', type: 'radio', pointValue: 5 },
    { key: 'cryptoAd', label: 'Crypto Ad?', type: 'radio', pointValue: 5 },
    { key: 'bestCommercial', label: 'Best Commercial', type: 'text', pointValue: 15 },
    { key: 'weirdestCommercial', label: 'Weirdest Commercial', type: 'text', pointValue: 15 },
    { key: 'openingSong', label: 'Opening Song', type: 'text', pointValue: 10 },
    { key: 'closingSong', label: 'Closing Song', type: 'text', pointValue: 10 },
    { key: 'totalSongs', label: 'Total Songs', type: 'number', pointValue: 10 },
    { key: 'specialGuest', label: 'Special Guest', type: 'text', pointValue: 10 },
    { key: 'costumeChanges', label: 'Costume Changes', type: 'number', pointValue: 10 },
    { key: 'playBiggestHit', label: 'Play Biggest Hit?', type: 'radio', pointValue: 5 }
  ]);

  // Load all data from localStorage on mount
  useEffect(() => {
    const savedPredictions = localStorage.getItem('superBowlPredictions');
    const savedScores = localStorage.getItem('superBowlScores');
    const savedTeamNames = localStorage.getItem('superBowlTeamNames');
    const savedTheme = localStorage.getItem('superBowlTheme');
    const savedCategories = localStorage.getItem('superBowlCategories');
    const savedLocked = localStorage.getItem('superBowlPredictionsLocked');

    if (savedPredictions) setPredictions(JSON.parse(savedPredictions));
    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedTeamNames) setTeamNames(JSON.parse(savedTeamNames));
    if (savedTheme) setTheme(savedTheme);
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedLocked) setPredictionsLocked(JSON.parse(savedLocked));
  }, []);

  // Save predictions to localStorage
  useEffect(() => {
    if (predictions.length > 0) {
      localStorage.setItem('superBowlPredictions', JSON.stringify(predictions));
    }
  }, [predictions]);

  // Save scores to localStorage
  useEffect(() => {
    if (Object.keys(scores).length > 0) {
      localStorage.setItem('superBowlScores', JSON.stringify(scores));
    }
  }, [scores]);

  // Save team names to localStorage
  useEffect(() => {
    localStorage.setItem('superBowlTeamNames', JSON.stringify(teamNames));
  }, [teamNames]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('superBowlTheme', theme);
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Save categories to localStorage
  useEffect(() => {
    localStorage.setItem('superBowlCategories', JSON.stringify(categories));
  }, [categories]);

  // Save predictions locked state to localStorage
  useEffect(() => {
    localStorage.setItem('superBowlPredictionsLocked', JSON.stringify(predictionsLocked));
  }, [predictionsLocked]);

  const addPrediction = (playerName, predictionData) => {
    const newPrediction = {
      id: Date.now(),
      playerName,
      timestamp: new Date().toISOString(),
      ...predictionData
    };

    setPredictions(prev => {
      const filtered = prev.filter(p => p.playerName !== playerName);
      return [...filtered, newPrediction];
    });

    // Initialize score for new player
    setScores(prev => ({
      ...prev,
      [playerName]: prev[playerName] || 0
    }));

    setView('home');
  };

  const updateScore = (playerName, points) => {
    setScores(prev => ({
      ...prev,
      [playerName]: (prev[playerName] || 0) + points
    }));
  };

  const resetAll = () => {
    if (window.confirm('Are you sure you want to reset all predictions and scores?')) {
      setPredictions([]);
      setScores({});
      localStorage.removeItem('superBowlPredictions');
      localStorage.removeItem('superBowlScores');
      setView('home');
    }
  };

  const updateTeamNames = (team1, team2) => {
    setTeamNames({ team1, team2 });
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const updateCategories = (newCategories) => {
    setCategories(newCategories);
  };

  const addCategory = (category) => {
    setCategories(prev => [...prev, category]);
  };

  const removeCategory = (key) => {
    setCategories(prev => prev.filter(cat => cat.key !== key));
  };

  const updateCategoryPoints = (key, pointValue) => {
    setCategories(prev => prev.map(cat =>
      cat.key === key ? { ...cat, pointValue } : cat
    ));
  };

  const updatePrediction = (playerName, predictionData) => {
    setPredictions(prev => prev.map(p =>
      p.playerName === playerName ? { ...p, ...predictionData } : p
    ));
  };

  const viewMyPredictions = (playerName) => {
    setCurrentPlayer(playerName);
    setView('myPredictions');
  };

  const togglePredictionsLock = () => {
    setPredictionsLocked(prev => !prev);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏈 Super Bowl Prediction Party 🏈</h1>
        <nav className="nav-buttons">
          {view !== 'home' && (
            <button onClick={() => setView('home')} className="nav-button">
              Home
            </button>
          )}
          {predictions.length > 0 && (
            <>
              <button onClick={() => setView('myPredictions')} className="nav-button">
                My Predictions
              </button>
              <button onClick={() => setView('admin')} className="nav-button">
                Admin View
              </button>
              <button onClick={() => setView('leaderboard')} className="nav-button">
                Leaderboard
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        {view === 'home' && (
          <div className="home-view">
            <h2>Welcome to the Super Bowl Prediction Party!</h2>
            <p>Enter your predictions and compete with your friends!</p>

            <div className="players-status">
              <h3>Players ({predictions.length}/4)</h3>
              {predictions.length > 0 ? (
                <ul className="players-list">
                  {predictions.map(p => (
                    <li key={p.id}>
                      {p.playerName} ✅
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No predictions yet. Be the first!</p>
              )}
            </div>

            {predictions.length < 4 && (
              <button
                onClick={() => setView('form')}
                className="primary-button"
              >
                Enter Your Predictions
              </button>
            )}

            {predictions.length > 0 && (
              <div className="admin-actions">
                <button onClick={resetAll} className="danger-button">
                  Reset All Data
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'form' && (
          <PredictionForm
            onSubmit={addPrediction}
            existingPlayers={predictions.map(p => p.playerName)}
            onCancel={() => setView('home')}
            teamNames={teamNames}
            categories={categories}
            theme={theme}
            onUpdateTheme={updateTheme}
          />
        )}

        {view === 'myPredictions' && (
          <MyPredictions
            predictions={predictions}
            scores={scores}
            categories={categories}
            onSelectPlayer={setCurrentPlayer}
            currentPlayer={currentPlayer}
            onUpdatePrediction={updatePrediction}
            predictionsLocked={predictionsLocked}
          />
        )}

        {view === 'admin' && (
          <AdminView
            predictions={predictions}
            scores={scores}
            onUpdateScore={updateScore}
            teamNames={teamNames}
            onUpdateTeamNames={updateTeamNames}
            theme={theme}
            onUpdateTheme={updateTheme}
            categories={categories}
            onUpdateCategories={updateCategories}
            onAddCategory={addCategory}
            onRemoveCategory={removeCategory}
            onUpdateCategoryPoints={updateCategoryPoints}
            onUpdatePrediction={updatePrediction}
            predictionsLocked={predictionsLocked}
            onToggleLock={togglePredictionsLock}
          />
        )}

        {view === 'leaderboard' && (
          <Leaderboard
            predictions={predictions}
            scores={scores}
          />
        )}
      </main>
    </div>
  );
}

export default App;

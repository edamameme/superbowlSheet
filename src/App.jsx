import { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import './App.css';
import PredictionForm from './components/PredictionForm';
import AdminView from './components/AdminView';
import Leaderboard from './components/Leaderboard';
import MyPredictions from './components/MyPredictions';
import { subscribeToState, saveState } from './firebase';

const DEFAULT_CATEGORIES = [
  { key: 'firstTDTime', label: 'First TD Time', type: 'text', pointValue: 10 },
  { key: 'firstTDTime', label: 'First TD Time', type: 'text', pointValue: 10 },
  { key: 'firstScoreTeam', label: 'First Score Team', type: 'team', pointValue: 5 },
  { key: 'finalScore', label: 'Final Score', type: 'score', pointValue: 10 },
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
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [predictions, setPredictions] = useState([]);
  const [scores, setScores] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [predictionsLocked, setPredictionsLocked] = useState(false);
  const [teamNames, setTeamNames] = useState({ team1: 'Seattle Seahawks', team2: 'New England Patriots' });
  const [theme, setTheme] = useState('seahawks');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loaded, setLoaded] = useState(false);

  // Track whether updates come from Firestore listener to avoid write loops
  const isRemoteUpdate = useRef(false);
  const lastRemoteData = useRef(null);

  // Sync state to Firestore (debounced to avoid rapid writes)
  const syncTimeout = useRef(null);
  const syncToFirestore = useCallback((state) => {
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(async () => {
      // Merge local predictions with remote to avoid overwrites
      const remotePredictions = lastRemoteData.current?.predictions || [];
      const localPredictions = state.predictions || [];

      // Create a map of all predictions, local ones take priority for same player
      const predictionMap = new Map();
      remotePredictions.forEach(p => predictionMap.set(p.playerName, p));
      localPredictions.forEach(p => predictionMap.set(p.playerName, p));

      const mergedPredictions = Array.from(predictionMap.values());

      // Merge scores similarly
      const mergedScores = {
        ...(lastRemoteData.current?.scores || {}),
        ...(state.scores || {})
      };

      saveState({
        ...state,
        predictions: mergedPredictions,
        scores: mergedScores,
      });
    }, 300);
  }, []);

  // Subscribe to Firestore on mount
  useEffect(() => {
    const unsubscribe = subscribeToState((data) => {
      isRemoteUpdate.current = true;
      lastRemoteData.current = data; // Store remote data for merging
      if (data.predictions) setPredictions(data.predictions);
      if (data.scores) setScores(data.scores);
      if (data.teamNames) setTeamNames(data.teamNames);
      if (data.theme) setTheme(data.theme);
      if (data.categories) setCategories(data.categories);
      if (data.predictionsLocked !== undefined) setPredictionsLocked(data.predictionsLocked);
      setLoaded(true);
      // Reset flag after React processes the state updates
      setTimeout(() => { isRemoteUpdate.current = false; }, 0);
    });

    // If no data exists in Firestore yet, mark as loaded after a timeout
    const fallbackTimer = setTimeout(() => setLoaded(true), 2000);

    return () => {
      unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Sync all state changes to Firestore
  useEffect(() => {
    if (!loaded || isRemoteUpdate.current) return;
    syncToFirestore({
      predictions,
      scores,
      teamNames,
      theme,
      predictionsLocked,
      categories,
    });
  }, [predictions, scores, teamNames, theme, predictionsLocked, categories, loaded, syncToFirestore]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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

    setScores(prev => ({
      ...prev,
      [playerName]: prev[playerName] || 0
    }));

    navigate('/');
  };

  const updateScore = (playerName, points) => {
    setScores(prev => ({
      ...prev,
      [playerName]: (prev[playerName] || 0) + points
    }));
  };

  const resetAll = () => {
    if (window.confirm('Are you sure you want to reset all predictions and scores?')) {
      // Clear local cache of remote data so we don't merge it back in
      lastRemoteData.current = { predictions: [], scores: {} };

      setPredictions([]);
      setScores({});
      navigate('/');
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

  const updateCategoryLabel = (key, newLabel) => {
    setCategories(prev => prev.map(cat =>
      cat.key === key ? { ...cat, label: newLabel } : cat
    ));
  };

  const updateCategoryType = (key, newType) => {
    setCategories(prev => prev.map(cat =>
      cat.key === key ? { ...cat, type: newType } : cat
    ));
  };

  const moveCategory = (key, direction) => {
    setCategories(prev => {
      const index = prev.findIndex(cat => cat.key === key);
      if (index === -1) return prev;

      const newCategories = [...prev];
      if (direction === 'up' && index > 0) {
        [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
      } else if (direction === 'down' && index < newCategories.length - 1) {
        [newCategories[index + 1], newCategories[index]] = [newCategories[index], newCategories[index + 1]];
      }
      return newCategories;
    });
  };

  const updatePrediction = (playerName, predictionData) => {
    setPredictions(prev => prev.map(p =>
      p.playerName === playerName ? { ...p, ...predictionData } : p
    ));
  };

  const viewMyPredictions = (playerName) => {
    setCurrentPlayer(playerName);
    navigate('/my-predictions');
  };

  const togglePredictionsLock = () => {
    setPredictionsLocked(prev => !prev);
  };

  if (!loaded) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>🏈 Super Bowl Prediction Party 🏈</h1>
        </header>
        <main className="app-main">
          <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏈 Super Bowl Prediction Party 🏈</h1>
        <nav className="nav-buttons">
          {location.pathname !== '/' && (
            <button onClick={() => navigate('/')} className="nav-button">
              Home
            </button>
          )}
          {predictions.length > 0 && (
            <>
              <button onClick={() => navigate('/my-predictions')} className="nav-button">
                My Predictions
              </button>
              <button onClick={() => navigate('/admin')} className="nav-button desktop-only">
                Admin View
              </button>
              <button onClick={() => navigate('/leaderboard')} className="nav-button">
                Leaderboard
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={
            <div className="home-view">
              <h2>Welcome to the Super Bowl Prediction Party!</h2>
              <p>Enter your predictions and compete with your friends!</p>

              <div className="players-status">
                <h3>Players ({predictions.length})</h3>
                {predictions.length > 0 ? (
                  <ul className="players-list">
                    {predictions.map(p => (
                      <li key={p.id} className="player-item">
                        <span className="player-name">{p.playerName}</span>
                        <img
                          src={`${import.meta.env.BASE_URL}${p.selectedTeam === 'patriots' ? 'patriots-logo.svg' : 'seahawks-logo.svg'}`}
                          alt={p.selectedTeam === 'patriots' ? 'Patriots' : 'Seahawks'}
                          className="player-team-logo"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No predictions yet. Be the first!</p>
                )}
              </div>

              <button
                onClick={() => navigate('/form')}
                className="primary-button"
              >
                Enter Your Predictions
              </button>
            </div>
          } />

          <Route path="/form" element={
            <PredictionForm
              onSubmit={addPrediction}
              existingPlayers={predictions.map(p => p.playerName)}
              onCancel={() => navigate('/')}
              teamNames={teamNames}
              categories={categories}
              theme={theme}
              onUpdateTheme={updateTheme}
            />
          } />

          <Route path="/my-predictions" element={
            <MyPredictions
              predictions={predictions}
              scores={scores}
              categories={categories}
              onSelectPlayer={setCurrentPlayer}
              currentPlayer={currentPlayer}
              onUpdatePrediction={updatePrediction}
              predictionsLocked={predictionsLocked}
              theme={theme}
              onUpdateTheme={updateTheme}
            />
          } />

          <Route path="/admin" element={
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
              onUpdateCategoryLabel={updateCategoryLabel}
              onUpdateCategoryType={updateCategoryType}
              onMoveCategory={moveCategory}
              onUpdatePrediction={updatePrediction}
              predictionsLocked={predictionsLocked}
              onToggleLock={togglePredictionsLock}
              onResetAll={resetAll}
            />
          } />

          <Route path="/leaderboard" element={
            <Leaderboard
              predictions={predictions}
              scores={scores}
            />
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;

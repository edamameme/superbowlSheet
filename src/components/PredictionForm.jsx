import { useState } from 'react';
import './PredictionForm.css';

const PredictionForm = ({ onSubmit, existingPlayers, onCancel, teamNames, categories, theme, onUpdateTheme }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [predictions, setPredictions] = useState({
    // Game Predictions
    firstTDTime: '',
    firstScoreTeam: '',
    finalScoreTeam1: '',
    finalScoreTeam2: '',
    overtime: '',
    totalPoints: '',

    // Commercial Predictions
    carCommercials: '',
    beerBrand: '',
    cryptoAd: '',
    bestCommercial: '',
    weirdestCommercial: '',

    // Halftime Show
    openingSong: '',
    closingSong: '',
    totalSongs: '',
    specialGuest: '',
    costumeChanges: '',
    playBiggestHit: ''
  });

  const handleChange = (field, value) => {
    setPredictions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }

    if (existingPlayers.includes(playerName.trim())) {
      if (!window.confirm(`\${playerName} already has predictions. Do you want to update them?`)) {
        return;
      }
    }

    // Check if at least some predictions are filled
    const filledPredictions = Object.values(predictions).filter(v => v !== '').length;
    if (filledPredictions < 5) {
      if (!window.confirm('You have very few predictions filled. Continue anyway?')) {
        return;
      }
    }

    onSubmit(playerName.trim(), { ...predictions, selectedTeam: selectedTheme });
  };

  return (
    <div className="prediction-form-container">
      <h2>Enter Your Predictions</h2>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-section player-name-section">
          <label htmlFor="playerName" className="required">Your Name</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="text-input"
            required
          />
        </div>

        {/* Team Picker */}
        <div className="form-section team-picker-section">
          <h3>🏈 Who do you want to win?</h3>
          <div className="team-picker">
            <div
              className={`team-choice ${selectedTheme === 'seahawks' ? 'active' : ''}`}
              onClick={() => { setSelectedTheme('seahawks'); onUpdateTheme('seahawks'); }}
            >
              <div className="team-logo">
                <img src={`${import.meta.env.BASE_URL}seahawks-logo.svg`} alt="Seahawks" className="team-logo-img" />
              </div>
              <span className="team-name-choice">Seattle Seahawks</span>
            </div>
            <div
              className={`team-choice ${selectedTheme === 'patriots' ? 'active' : ''}`}
              onClick={() => { setSelectedTheme('patriots'); onUpdateTheme('patriots'); }}
            >
              <div className="team-logo">
                <img src={`${import.meta.env.BASE_URL}patriots-logo.svg`} alt="Patriots" className="team-logo-img" />
              </div>
              <span className="team-name-choice">New England Patriots</span>
            </div>
          </div>
        </div>

        {/* Game Predictions */}
        <div className="form-section">
          <h3>🏈 Game Predictions</h3>

          <div className="form-group">
            <label htmlFor="firstTDTime">What time will the first TD happen?</label>
            <input
              id="firstTDTime"
              type="text"
              value={predictions.firstTDTime}
              onChange={(e) => handleChange('firstTDTime', e.target.value)}
              placeholder="e.g., 7:32 Q1"
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label>Which team scores first?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="firstScoreTeam"
                  value={teamNames.team1}
                  checked={predictions.firstScoreTeam === teamNames.team1}
                  onChange={(e) => handleChange('firstScoreTeam', e.target.value)}
                />
                {teamNames.team1}
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="firstScoreTeam"
                  value={teamNames.team2}
                  checked={predictions.firstScoreTeam === teamNames.team2}
                  onChange={(e) => handleChange('firstScoreTeam', e.target.value)}
                />
                {teamNames.team2}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Final Score Prediction</label>
            <div className="score-inputs">
              <input
                type="number"
                value={predictions.finalScoreTeam1}
                onChange={(e) => handleChange('finalScoreTeam1', e.target.value)}
                placeholder={teamNames.team1}
                className="number-input"
                min="0"
              />
              <span className="score-separator">-</span>
              <input
                type="number"
                value={predictions.finalScoreTeam2}
                onChange={(e) => handleChange('finalScoreTeam2', e.target.value)}
                placeholder={teamNames.team2}
                className="number-input"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Will the game go to overtime?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="overtime"
                  value="Yes"
                  checked={predictions.overtime === 'Yes'}
                  onChange={(e) => handleChange('overtime', e.target.value)}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="overtime"
                  value="No"
                  checked={predictions.overtime === 'No'}
                  onChange={(e) => handleChange('overtime', e.target.value)}
                />
                No
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="totalPoints">Total points scored</label>
            <input
              id="totalPoints"
              type="number"
              value={predictions.totalPoints}
              onChange={(e) => handleChange('totalPoints', e.target.value)}
              placeholder="e.g., 48"
              className="number-input"
              min="0"
            />
          </div>
        </div>

        {/* Commercial Predictions */}
        <div className="form-section">
          <h3>📺 Commercial Predictions</h3>

          <div className="form-group">
            <label htmlFor="carCommercials">How many car commercials?</label>
            <input
              id="carCommercials"
              type="number"
              value={predictions.carCommercials}
              onChange={(e) => handleChange('carCommercials', e.target.value)}
              placeholder="e.g., 12"
              className="number-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Which beer brand will have the most ads?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="beerBrand"
                  value="Bud Light"
                  checked={predictions.beerBrand === 'Bud Light'}
                  onChange={(e) => handleChange('beerBrand', e.target.value)}
                />
                Bud Light
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="beerBrand"
                  value="Michelob Ultra"
                  checked={predictions.beerBrand === 'Michelob Ultra'}
                  onChange={(e) => handleChange('beerBrand', e.target.value)}
                />
                Michelob Ultra
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="beerBrand"
                  value="Coors"
                  checked={predictions.beerBrand === 'Coors'}
                  onChange={(e) => handleChange('beerBrand', e.target.value)}
                />
                Coors
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="beerBrand"
                  value="Other"
                  checked={predictions.beerBrand === 'Other'}
                  onChange={(e) => handleChange('beerBrand', e.target.value)}
                />
                Other
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Will there be a crypto ad?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="cryptoAd"
                  value="Yes"
                  checked={predictions.cryptoAd === 'Yes'}
                  onChange={(e) => handleChange('cryptoAd', e.target.value)}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="cryptoAd"
                  value="No"
                  checked={predictions.cryptoAd === 'No'}
                  onChange={(e) => handleChange('cryptoAd', e.target.value)}
                />
                No
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bestCommercial">Best commercial (fill in after watching)</label>
            <input
              id="bestCommercial"
              type="text"
              value={predictions.bestCommercial}
              onChange={(e) => handleChange('bestCommercial', e.target.value)}
              placeholder="Brand or product name"
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weirdestCommercial">Weirdest commercial (fill in after watching)</label>
            <input
              id="weirdestCommercial"
              type="text"
              value={predictions.weirdestCommercial}
              onChange={(e) => handleChange('weirdestCommercial', e.target.value)}
              placeholder="Brand or product name"
              className="text-input"
            />
          </div>
        </div>

        {/* Halftime Show */}
        <div className="form-section">
          <h3>🎤 Halftime Show Predictions</h3>

          <div className="form-group">
            <label htmlFor="openingSong">Opening song</label>
            <input
              id="openingSong"
              type="text"
              value={predictions.openingSong}
              onChange={(e) => handleChange('openingSong', e.target.value)}
              placeholder="Song title"
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="closingSong">Closing song</label>
            <input
              id="closingSong"
              type="text"
              value={predictions.closingSong}
              onChange={(e) => handleChange('closingSong', e.target.value)}
              placeholder="Song title"
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalSongs">Total number of songs</label>
            <input
              id="totalSongs"
              type="number"
              value={predictions.totalSongs}
              onChange={(e) => handleChange('totalSongs', e.target.value)}
              placeholder="e.g., 8"
              className="number-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialGuest">Special guest? Who?</label>
            <input
              id="specialGuest"
              type="text"
              value={predictions.specialGuest}
              onChange={(e) => handleChange('specialGuest', e.target.value)}
              placeholder="Guest name or 'None'"
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="costumeChanges">Number of costume changes</label>
            <input
              id="costumeChanges"
              type="number"
              value={predictions.costumeChanges}
              onChange={(e) => handleChange('costumeChanges', e.target.value)}
              placeholder="e.g., 3"
              className="number-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Will they play their biggest hit?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="playBiggestHit"
                  value="Yes"
                  checked={predictions.playBiggestHit === 'Yes'}
                  onChange={(e) => handleChange('playBiggestHit', e.target.value)}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="playBiggestHit"
                  value="No"
                  checked={predictions.playBiggestHit === 'No'}
                  onChange={(e) => handleChange('playBiggestHit', e.target.value)}
                />
                No
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Submit Predictions
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;

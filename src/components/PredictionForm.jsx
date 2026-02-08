import { useState } from 'react';
import './PredictionForm.css';

const PredictionForm = ({ onSubmit, existingPlayers, onCancel, teamNames, categories, theme, onUpdateTheme }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [predictions, setPredictions] = useState(() => {
    // Initialize state dynamically based on categories
    const initial = {};
    categories.forEach(cat => {
      initial[cat.key] = '';
    });
    // Ensure composite fields are initialized
    initial.finalScoreTeam1 = '';
    initial.finalScoreTeam2 = '';
    return initial;
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

        {/* Dynamic Game Predictions */}
        <div className="form-section">
          <h3>🏈 Game Predictions</h3>

          {categories.map(cat => {
            // Special handling for Final Score (Composite field)
            if (cat.key === 'finalScore') {
              return (
                <div key={cat.key} className="form-group">
                  <label>{cat.label}</label>
                  <div className="score-inputs">
                    <input
                      type="number"
                      value={predictions.finalScoreTeam1 || ''}
                      onChange={(e) => handleChange('finalScoreTeam1', e.target.value)}
                      placeholder={teamNames.team1}
                      className="number-input"
                      min="0"
                    />
                    <span className="score-separator">-</span>
                    <input
                      type="number"
                      value={predictions.finalScoreTeam2 || ''}
                      onChange={(e) => handleChange('finalScoreTeam2', e.target.value)}
                      placeholder={teamNames.team2}
                      className="number-input"
                      min="0"
                    />
                  </div>
                </div>
              );
            }

            // Special handling for Team Selection
            if (cat.type === 'team') {
              return (
                <div key={cat.key} className="form-group">
                  <label>{cat.label}</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={cat.key}
                        value={teamNames.team1}
                        checked={predictions[cat.key] === teamNames.team1}
                        onChange={(e) => handleChange(cat.key, e.target.value)}
                      />
                      {teamNames.team1}
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={cat.key}
                        value={teamNames.team2}
                        checked={predictions[cat.key] === teamNames.team2}
                        onChange={(e) => handleChange(cat.key, e.target.value)}
                      />
                      {teamNames.team2}
                    </label>
                  </div>
                </div>
              );
            }

            // Special handling for Beer Brand (Custom options)
            if (cat.key === 'beerBrand') {
              return (
                <div key={cat.key} className="form-group">
                  <label>{cat.label}</label>
                  <div className="radio-group">
                    {['Bud Light', 'Michelob Ultra', 'Coors', 'Other'].map(brand => (
                      <label key={brand} className="radio-label">
                        <input
                          type="radio"
                          name={cat.key}
                          value={brand}
                          checked={predictions[cat.key] === brand}
                          onChange={(e) => handleChange(cat.key, e.target.value)}
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                </div>
              );
            }

            // Standard renderers based on type
            return (
              <div key={cat.key} className="form-group">
                <label htmlFor={cat.key}>{cat.label}</label>

                {cat.type === 'text' && (
                  <input
                    id={cat.key}
                    type="text"
                    value={predictions[cat.key] || ''}
                    onChange={(e) => handleChange(cat.key, e.target.value)}
                    placeholder={`Enter ${cat.label.toLowerCase()}`}
                    className="text-input"
                  />
                )}

                {cat.type === 'number' && (
                  <input
                    id={cat.key}
                    type="number"
                    value={predictions[cat.key] || ''}
                    onChange={(e) => handleChange(cat.key, e.target.value)}
                    placeholder="e.g., 0"
                    className="number-input"
                    min="0"
                  />
                )}

                {cat.type === 'radio' && (
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={cat.key}
                        value="Yes"
                        checked={predictions[cat.key] === 'Yes'}
                        onChange={(e) => handleChange(cat.key, e.target.value)}
                      />
                      Yes
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={cat.key}
                        value="No"
                        checked={predictions[cat.key] === 'No'}
                        onChange={(e) => handleChange(cat.key, e.target.value)}
                      />
                      No
                    </label>
                  </div>
                )}
              </div>
            );
          })}
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

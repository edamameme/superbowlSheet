import { useState } from 'react';
import './MyPredictions.css';

const MyPredictions = ({ predictions, scores, categories, onSelectPlayer, currentPlayer, onUpdatePrediction, predictionsLocked, theme, onUpdateTheme }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(currentPlayer || (predictions.length > 0 ? predictions[0].playerName : null));
  const [isEditing, setIsEditing] = useState(false);
  const [editedPredictions, setEditedPredictions] = useState({});

  const player = predictions.find(p => p.playerName === selectedPlayer);

  const handleSelectPlayer = (playerName) => {
    setSelectedPlayer(playerName);
    setIsEditing(false);
    onSelectPlayer(playerName);
  };

  const handleEditClick = () => {
    if (!player) return;
    setEditedPredictions({ ...player });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPredictions({});
  };

  const handleSaveEdit = () => {
    if (window.confirm(`Save changes to ${selectedPlayer}'s predictions?`)) {
      onUpdatePrediction(selectedPlayer, editedPredictions);
      setIsEditing(false);
    }
  };

  const handleChange = (key, value) => {
    setEditedPredictions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getPredictionValue = (key) => {
    if (key === 'finalScore') {
      const team1 = isEditing ? editedPredictions.finalScoreTeam1 : player?.finalScoreTeam1;
      const team2 = isEditing ? editedPredictions.finalScoreTeam2 : player?.finalScoreTeam2;
      return `${team1 || '?'} - ${team2 || '?'}`;
    }
    return isEditing ? (editedPredictions[key] || '-') : (player?.[key] || '-');
  };

  const getPointsForCategory = (key) => {
    const category = categories.find(c => c.key === key);
    return category?.pointValue || 0;
  };

  if (!player && !isEditing) {
    return (
      <div className="my-predictions">
        <h2>My Predictions</h2>
        <p>No predictions found. Please submit your predictions first!</p>
      </div>
    );
  }

  return (
    <div className="my-predictions">
      <div className="predictions-header">
        <h2>📋 View & Edit Predictions</h2>

        <div className="player-selector">
          <label>Select Player:</label>
          <select
            value={selectedPlayer}
            onChange={(e) => handleSelectPlayer(e.target.value)}
            className="player-select"
          >
            {predictions.map(p => (
              <option key={p.id} value={p.playerName}>
                {p.playerName} ({scores[p.playerName] || 0} pts)
              </option>
            ))}
          </select>
        </div>
      </div>

      {player && (
        <div className="player-predictions-view">
          <div className="player-info-header">
            <div>
              <h3>{player.playerName}'s Predictions</h3>
              <p className="player-score">Current Score: <strong>{scores[player.playerName] || 0} points</strong></p>
            </div>
            <div className="edit-buttons">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => onUpdateTheme(theme === 'seahawks' ? 'patriots' : 'seahawks')}
                    className={`switch-teams-btn ${theme === 'seahawks' ? 'patriots-style' : 'seahawks-style'}`}
                  >
                    Switch Teams
                  </button>
                  <button
                    onClick={handleEditClick}
                    className={`edit-button ${predictionsLocked ? 'locked' : ''}`}
                    disabled={predictionsLocked}
                    title={predictionsLocked ? 'Predictions are locked by admin' : 'Edit your predictions'}
                  >
                    {predictionsLocked ? '🔒 TOO LATE!' : '✏️ Edit Predictions'}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleSaveEdit} className="save-button">
                    ✅ Save Changes
                  </button>
                  <button onClick={handleCancelEdit} className="cancel-button">
                    ❌ Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="predictions-grid">
            {categories.map((cat) => (
              <div key={cat.key} className="prediction-item">
                <div className="prediction-label">
                  <span>{cat.label}</span>
                  <span className="points-badge">{cat.pointValue} pts</span>
                </div>
                <div className="prediction-answer">
                  {isEditing ? (
                    cat.key === 'finalScore' ? (
                      <div className="score-edit">
                        <input
                          type="number"
                          value={editedPredictions.finalScoreTeam1 || ''}
                          onChange={(e) => handleChange('finalScoreTeam1', e.target.value)}
                          className="score-input"
                          placeholder="Team 1"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          value={editedPredictions.finalScoreTeam2 || ''}
                          onChange={(e) => handleChange('finalScoreTeam2', e.target.value)}
                          className="score-input"
                          placeholder="Team 2"
                        />
                      </div>
                    ) : cat.type === 'number' ? (
                      <input
                        type="number"
                        value={editedPredictions[cat.key] || ''}
                        onChange={(e) => handleChange(cat.key, e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <input
                        type="text"
                        value={editedPredictions[cat.key] || ''}
                        onChange={(e) => handleChange(cat.key, e.target.value)}
                        className="edit-input"
                      />
                    )
                  ) : (
                    <span className="answer-text">{getPredictionValue(cat.key)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPredictions;

import { useState } from 'react';
import './AdminView.css';

const AdminView = ({
  predictions,
  scores,
  onUpdateScore,
  teamNames,
  onUpdateTeamNames,
  theme,
  onUpdateTheme,
  categories,
  onUpdateCategories,
  onAddCategory,
  onRemoveCategory,
  onUpdateCategoryPoints,
  onUpdatePrediction,
  predictionsLocked,
  onToggleLock
}) => {
  const [showPrintView, setShowPrintView] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Local state for settings
  const [team1Name, setTeam1Name] = useState(teamNames.team1);
  const [team2Name, setTeam2Name] = useState(teamNames.team2);
  const [selectedTheme, setSelectedTheme] = useState(theme);

  // New category form
  const [newCategoryKey, setNewCategoryKey] = useState('');
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('text');
  const [newCategoryPoints, setNewCategoryPoints] = useState(10);

  const awardPoints = (playerName, category) => {
    const defaultPoints = category.pointValue || 10;
    const customPoints = prompt(
      `Award points to ${playerName} for "${category.label}"?\nDefault: ${defaultPoints} points\n\nEnter custom amount:`,
      defaultPoints
    );

    if (customPoints !== null && customPoints !== '') {
      const points = parseInt(customPoints);
      if (!isNaN(points) && points > 0) {
        onUpdateScore(playerName, points);
      } else {
        alert('Please enter a valid positive number');
      }
    }
  };

  const getPredictionValue = (prediction, key) => {
    if (key === 'finalScore') {
      return `${prediction.finalScoreTeam1 || '?'} - ${prediction.finalScoreTeam2 || '?'}`;
    }
    return prediction[key] || '-';
  };

  const handleEditPrediction = (playerName, key) => {
    const prediction = predictions.find(p => p.playerName === playerName);
    if (!prediction) return;

    const currentValue = key === 'finalScore'
      ? `${prediction.finalScoreTeam1 || ''} - ${prediction.finalScoreTeam2 || ''}`
      : prediction[key] || '';

    const newValue = prompt(
      `Edit ${key} for ${playerName}:\n\nCurrent value: ${currentValue}\n\nEnter new value:`,
      currentValue
    );

    if (newValue !== null && newValue !== currentValue) {
      if (key === 'finalScore') {
        const [team1, team2] = newValue.split('-').map(s => s.trim());
        onUpdatePrediction(playerName, {
          finalScoreTeam1: team1 || '',
          finalScoreTeam2: team2 || ''
        });
      } else {
        onUpdatePrediction(playerName, {
          [key]: newValue
        });
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveTeamNames = () => {
    onUpdateTeamNames(team1Name, team2Name);
    alert('Team names updated!');
  };

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    onUpdateTheme(newTheme);
  };

  const handleAddCategory = () => {
    if (!newCategoryKey || !newCategoryLabel) {
      alert('Please fill in key and label');
      return;
    }

    const newCategory = {
      key: newCategoryKey,
      label: newCategoryLabel,
      type: newCategoryType,
      pointValue: parseInt(newCategoryPoints)
    };

    onAddCategory(newCategory);

    // Reset form
    setNewCategoryKey('');
    setNewCategoryLabel('');
    setNewCategoryType('text');
    setNewCategoryPoints(10);
  };

  if (showPrintView) {
    return (
      <div className="print-view">
        <button onClick={() => setShowPrintView(false)} className="close-print-button">
          Close Print View
        </button>
        <button onClick={handlePrint} className="print-button">
          Print 🖨️
        </button>

        <div className="print-content">
          <h2>Super Bowl Predictions - All Players</h2>

          {predictions.map((prediction) => (
            <div key={prediction.id} className="player-predictions-print">
              <h3>{prediction.playerName}</h3>
              <div className="predictions-grid-print">
                {categories.map((cat) => (
                  <div key={cat.key} className="prediction-item-print">
                    <strong>{cat.label}:</strong>{' '}
                    {getPredictionValue(prediction, cat.key)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="settings-view">
        <div className="settings-header">
          <h2>⚙️ Game Settings</h2>
          <button onClick={() => setShowSettings(false)} className="nav-button">
            Back to Scoring
          </button>
        </div>

        {/* Team Names */}
        <div className="settings-section">
          <h3>🏈 Team Names</h3>
          <div className="team-names-form">
            <div className="form-group">
              <label>Team 1 Name:</label>
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="text-input"
                placeholder="e.g., Seattle Seahawks"
              />
            </div>
            <div className="form-group">
              <label>Team 2 Name:</label>
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="text-input"
                placeholder="e.g., New England Patriots"
              />
            </div>
            <button onClick={handleSaveTeamNames} className="save-button">
              Save Team Names
            </button>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="settings-section">
          <h3>🎨 Color Theme</h3>
          <div className="theme-selector">
            <div
              className={`theme-option ${selectedTheme === 'seahawks' ? 'active' : ''}`}
              onClick={() => handleThemeChange('seahawks')}
            >
              <div className="theme-preview seahawks-theme"></div>
              <span>Seahawks (Navy & Green)</span>
            </div>
            <div
              className={`theme-option ${selectedTheme === 'patriots' ? 'active' : ''}`}
              onClick={() => handleThemeChange('patriots')}
            >
              <div className="theme-preview patriots-theme"></div>
              <span>Patriots (Navy & Red)</span>
            </div>
          </div>
        </div>

        {/* Point Values */}
        <div className="settings-section">
          <h3>🎯 Point Values & Categories</h3>
          <div className="categories-manager">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.key}>
                    <td>{cat.label}</td>
                    <td>{cat.type}</td>
                    <td>
                      <input
                        type="number"
                        value={cat.pointValue}
                        onChange={(e) => onUpdateCategoryPoints(cat.key, parseInt(e.target.value))}
                        className="points-input"
                        min="0"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => onRemoveCategory(cat.key)}
                        className="remove-button"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="add-category-form">
              <h4>Add New Category</h4>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Key (e.g., mvpPrediction)"
                  value={newCategoryKey}
                  onChange={(e) => setNewCategoryKey(e.target.value)}
                  className="text-input"
                />
                <input
                  type="text"
                  placeholder="Label (e.g., MVP Prediction)"
                  value={newCategoryLabel}
                  onChange={(e) => setNewCategoryLabel(e.target.value)}
                  className="text-input"
                />
                <select
                  value={newCategoryType}
                  onChange={(e) => setNewCategoryType(e.target.value)}
                  className="select-input"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="radio">Yes/No</option>
                </select>
                <input
                  type="number"
                  placeholder="Points"
                  value={newCategoryPoints}
                  onChange={(e) => setNewCategoryPoints(e.target.value)}
                  className="points-input"
                  min="0"
                />
                <button onClick={handleAddCategory} className="add-button">
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-view">
      <div className="admin-header">
        <h2>Admin / Host View</h2>
        <div className="header-buttons">
          <button
            onClick={onToggleLock}
            className={`lock-button ${predictionsLocked ? 'locked' : 'unlocked'}`}
            title={predictionsLocked ? 'Click to unlock predictions' : 'Click to lock predictions'}
          >
            {predictionsLocked ? '🔒 Predictions Locked' : '🔓 Lock Predictions'}
          </button>
          <button onClick={() => setShowSettings(true)} className="settings-button">
            ⚙️ Settings
          </button>
          <button onClick={() => setShowPrintView(true)} className="print-button">
            Print View 🖨️
          </button>
        </div>
      </div>

      <div className="current-settings">
        <span><strong>Teams:</strong> {teamNames.team1} vs {teamNames.team2}</span>
        <span><strong>Theme:</strong> {theme}</span>
        <span><strong>Categories:</strong> {categories.length}</span>
      </div>

      <div className="predictions-table-container">
        <table className="predictions-table">
          <thead>
            <tr>
              <th className="category-header">Category (Points)</th>
              {predictions.map((p) => (
                <th key={p.id} className="player-header">
                  {p.playerName}
                  <div className="player-score">
                    Score: {scores[p.playerName] || 0}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.key}>
                <td className="category-cell">
                  {cat.label} <span className="point-badge">({cat.pointValue}pts)</span>
                </td>
                {predictions.map((p) => (
                  <td key={p.id} className="prediction-cell">
                    <div
                      className="prediction-value clickable"
                      onClick={() => handleEditPrediction(p.playerName, cat.key)}
                      title="Click to edit"
                    >
                      {getPredictionValue(p, cat.key)}
                      <span className="edit-icon">✏️</span>
                    </div>
                    <div className="point-buttons">
                      <button
                        onClick={() => awardPoints(p.playerName, cat)}
                        className="point-button award-points"
                      >
                        +{cat.pointValue}
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="desktop-only-notice">
        <p>💻 Admin view is optimized for desktop. Please use a larger screen for the best experience.</p>
      </div>
    </div>
  );
};

export default AdminView;

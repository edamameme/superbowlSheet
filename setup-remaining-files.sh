#!/bin/bash

# This script creates all remaining component files for the Super Bowl app

echo "Creating component files..."

# Create AdminView component
cat > src/components/AdminView.jsx << 'ENDADMIN'
import { useState } from 'react';
import './AdminView.css';

const AdminView = ({ predictions, scores, onUpdateScore }) => {
  const [showPrintView, setShowPrintView] = useState(false);

  const categories = [
    { key: 'firstTDTime', label: 'First TD Time', type: 'text' },
    { key: 'firstScoreTeam', label: 'First Score Team', type: 'radio' },
    { key: 'finalScore', label: 'Final Score', type: 'score' },
    { key: 'overtime', label: 'Overtime?', type: 'radio' },
    { key: 'totalPoints', label: 'Total Points', type: 'number' },
    { key: 'carCommercials', label: 'Car Commercials', type: 'number' },
    { key: 'beerBrand', label: 'Beer Brand Most Ads', type: 'radio' },
    { key: 'cryptoAd', label: 'Crypto Ad?', type: 'radio' },
    { key: 'bestCommercial', label: 'Best Commercial', type: 'text' },
    { key: 'weirdestCommercial', label: 'Weirdest Commercial', type: 'text' },
    { key: 'openingSong', label: 'Opening Song', type: 'text' },
    { key: 'closingSong', label: 'Closing Song', type: 'text' },
    { key: 'totalSongs', label: 'Total Songs', type: 'number' },
    { key: 'specialGuest', label: 'Special Guest', type: 'text' },
    { key: 'costumeChanges', label: 'Costume Changes', type: 'number' },
    { key: 'playBiggestHit', label: 'Play Biggest Hit?', type: 'radio' }
  ];

  const awardPoints = (playerName, points, category) => {
    const confirmed = window.confirm(
      \`Award \${points} points to \${playerName} for "\${category}"?\`
    );

    if (confirmed) {
      onUpdateScore(playerName, points);
    }
  };

  const getPredictionValue = (prediction, key) => {
    if (key === 'finalScore') {
      return \`\${prediction.finalScoreTeam1 || '?'} - \${prediction.finalScoreTeam2 || '?'}\`;
    }
    return prediction[key] || '-';
  };

  const handlePrint = () => {
    window.print();
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

  return (
    <div className="admin-view">
      <div className="admin-header">
        <h2>Admin / Host View</h2>
        <button onClick={() => setShowPrintView(true)} className="print-button">
          Print View 🖨️
        </button>
      </div>

      <div className="scoring-guide">
        <h3>Scoring Guide</h3>
        <ul>
          <li><strong>Exact match</strong> (time/numbers): 10 points</li>
          <li><strong>Close predictions</strong> (within range): 5 points</li>
          <li><strong>Correct Yes/No or team choice</strong>: 5 points</li>
          <li><strong>Most votes for best/weirdest commercial</strong>: 15 points</li>
        </ul>
      </div>

      <div className="predictions-table-container">
        <table className="predictions-table">
          <thead>
            <tr>
              <th className="category-header">Category</th>
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
                <td className="category-cell">{cat.label}</td>
                {predictions.map((p) => (
                  <td key={p.id} className="prediction-cell">
                    <div className="prediction-value">
                      {getPredictionValue(p, cat.key)}
                    </div>
                    <div className="point-buttons">
                      <button
                        onClick={() => awardPoints(p.playerName, 5, cat.label)}
                        className="point-button small-points"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => awardPoints(p.playerName, 10, cat.label)}
                        className="point-button big-points"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => awardPoints(p.playerName, 15, cat.label)}
                        className="point-button huge-points"
                      >
                        +15
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="manual-scoring">
        <h3>Manual Point Adjustment</h3>
        <p>Use the buttons above to award points, or manually adjust scores below:</p>
        {predictions.map((p) => (
          <div key={p.id} className="manual-score-row">
            <span>{p.playerName}: </span>
            <button
              onClick={() => onUpdateScore(p.playerName, -5)}
              className="adjust-button"
            >
              -5
            </button>
            <button
              onClick={() => onUpdateScore(p.playerName, -1)}
              className="adjust-button"
            >
              -1
            </button>
            <strong>{scores[p.playerName] || 0}</strong>
            <button
              onClick={() => onUpdateScore(p.playerName, 1)}
              className="adjust-button"
            >
              +1
            </button>
            <button
              onClick={() => onUpdateScore(p.playerName, 5)}
              className="adjust-button"
            >
              +5
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminView;
ENDADMIN

echo "AdminView component created"

# Create Leaderboard component
cat > src/components/Leaderboard.jsx << 'ENDLEAD'
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './Leaderboard.css';

const Leaderboard = ({ predictions, scores }) => {
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [celebratedWinner, setCelebratedWinner] = useState(false);

  useEffect(() => {
    const playersWithScores = predictions.map(p => ({
      name: p.playerName,
      score: scores[p.playerName] || 0,
      id: p.id
    }));

    playersWithScores.sort((a, b) => b.score - a.score);
    setSortedPlayers(playersWithScores);

    if (playersWithScores.length > 0 && playersWithScores[0].score > 0 && !celebratedWinner) {
      const hasScores = playersWithScores.some(p => p.score > 0);
      if (hasScores) {
        setTimeout(() => {
          celebrateWinner();
          setCelebratedWinner(true);
        }, 500);
      }
    }
  }, [predictions, scores, celebratedWinner]);

  const celebrateWinner = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0044cc', '#cc0000', '#FFD700', '#FFF']
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0044cc', '#cc0000', '#FFD700', '#FFF']
      });
    }, 50);
  };

  const getMedalEmoji = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '';
    }
  };

  const triggerManualCelebration = () => {
    celebrateWinner();
  };

  return (
    <div className="leaderboard">
      <h2>🏆 Leaderboard 🏆</h2>

      <div className="leaderboard-content">
        {sortedPlayers.length === 0 ? (
          <p className="no-players">No players yet!</p>
        ) : (
          <>
            <div className="podium">
              {sortedPlayers.slice(0, 3).map((player, index) => (
                <div
                  key={player.id}
                  className={\`podium-place place-\${index + 1}\`}
                >
                  <div className="medal">{getMedalEmoji(index)}</div>
                  <div className="player-name">{player.name}</div>
                  <div className="player-score">{player.score} pts</div>
                </div>
              ))}
            </div>

            <div className="rankings-list">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={\`ranking-item rank-\${index + 1}\`}
                >
                  <div className="rank-number">
                    {index + 1}
                    {getMedalEmoji(index) && (
                      <span className="medal-small">{getMedalEmoji(index)}</span>
                    )}
                  </div>
                  <div className="player-info">
                    <div className="player-name">{player.name}</div>
                    <div className="player-score-bar">
                      <div
                        className="score-fill"
                        style={{
                          width: \`\${sortedPlayers[0].score > 0
                            ? (player.score / sortedPlayers[0].score) * 100
                            : 0}%\`
                        }}
                      />
                      <span className="score-text">{player.score} points</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="leaderboard-actions">
              <button onClick={triggerManualCelebration} className="celebrate-button">
                Celebrate! 🎉
              </button>
            </div>

            {sortedPlayers[0].score > 0 && (
              <div className="winner-announcement">
                <h3>
                  {sortedPlayers[0].name} is in the lead with {sortedPlayers[0].score} points!
                </h3>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
ENDLEAD

echo "Leaderboard component created"
echo "All component files created successfully!"

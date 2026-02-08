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
                  className={`podium-place place-\${index + 1}`}
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
                  className={`ranking-item rank-\${index + 1}`}
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
                          width: `\${sortedPlayers[0].score > 0
                            ? (player.score / sortedPlayers[0].score) * 100
                            : 0}%`
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

# 🎨 Customization Guide

This guide will help you customize the Super Bowl Prediction Party App for your specific game.

## Quick Customization Checklist

- [ ] Update team names in prediction form
- [ ] Customize team colors
- [ ] Adjust maximum number of players (optional)
- [ ] Add team logos (optional)

## 1. Team Names

### Location: `src/components/PredictionForm.jsx`

Find and replace "Team 1" and "Team 2" with actual team names in **TWO PLACES**:

#### First Score Team (Line ~86-109)

```jsx
<div className="form-group">
  <label>Which team scores first?</label>
  <div className="radio-group">
    <label className="radio-label">
      <input
        type="radio"
        name="firstScoreTeam"
        value="Kansas City Chiefs"  // ⬅️ CHANGE THIS
        checked={predictions.firstScoreTeam === 'Kansas City Chiefs'}
        onChange={(e) => handleChange('firstScoreTeam', e.target.value)}
      />
      Kansas City Chiefs  // ⬅️ CHANGE THIS
    </label>
    <label className="radio-label">
      <input
        type="radio"
        name="firstScoreTeam"
        value="Philadelphia Eagles"  // ⬅️ CHANGE THIS
        checked={predictions.firstScoreTeam === 'Philadelphia Eagles'}
        onChange={(e) => handleChange('firstScoreTeam', e.target.value)}
      />
      Philadelphia Eagles  // ⬅️ CHANGE THIS
    </label>
  </div>
</div>
```

#### Final Score Labels (Line ~112-130)

```jsx
<div className="form-group">
  <label>Final Score Prediction</label>
  <div className="score-inputs">
    <input
      type="number"
      value={predictions.finalScoreTeam1}
      onChange={(e) => handleChange('finalScoreTeam1', e.target.value)}
      placeholder="Kansas City Chiefs"  // ⬅️ CHANGE THIS
      className="number-input"
      min="0"
    />
    <span className="score-separator">-</span>
    <input
      type="number"
      value={predictions.finalScoreTeam2}
      onChange={(e) => handleChange('finalScoreTeam2', e.target.value)}
      placeholder="Philadelphia Eagles"  // ⬅️ CHANGE THIS
      className="number-input"
      min="0"
    />
  </div>
</div>
```

## 2. Team Colors

### Location: `src/App.css`

Update the CSS variables at the top of the file (lines 7-17):

```css
:root {
  /* Primary team color (usually home team) */
  --primary-blue: #0044cc;

  /* Secondary team color (usually away team) */
  --primary-red: #cc0000;

  /* Darker shades (for hover effects) */
  --dark-blue: #002266;
  --dark-red: #990000;

  /* Lighter shades (for backgrounds) */
  --light-blue: #4488ff;
  --light-red: #ff4444;

  /* Keep these as-is */
  --gold: #FFD700;
  --white: #ffffff;
  --light-gray: #f5f5f5;
  --gray: #cccccc;
  --dark-gray: #666666;
  --text-dark: #1a1a1a;
  --success: #28a745;
  --danger: #dc3545;
}
```

### Popular NFL Team Colors

```css
/* Kansas City Chiefs */
--primary-blue: #E31837;  /* Red */
--primary-red: #FFB81C;   /* Gold */
--dark-blue: #AA0000;
--dark-red: #CC9416;

/* Philadelphia Eagles */
--primary-blue: #004C54;  /* Midnight Green */
--primary-red: #A5ACAF;   /* Silver */
--dark-blue: #003840;
--dark-red: #869397;

/* San Francisco 49ers */
--primary-blue: #AA0000;  /* Red */
--primary-red: #B3995D;   /* Gold */
--dark-blue: #880000;
--dark-red: #937D4A;

/* New England Patriots */
--primary-blue: #002244;  /* Navy */
--primary-red: #C60C30;   /* Red */
--dark-blue: #001833;
--dark-red: #9E0A26;

/* Dallas Cowboys */
--primary-blue: #003594;  /* Royal Blue */
--primary-red: #869397;   /* Silver */
--dark-blue: #002766;
--dark-red: #6A7679;

/* Green Bay Packers */
--primary-blue: #203731;  /* Green */
--primary-red: #FFB612;   /* Gold */
--dark-blue: #192B26;
--dark-red: #CC9410;
```

## 3. Number of Players

### Location: `src/App.jsx`

Change the maximum number of players (default is 4):

```jsx
// Line ~107
<h3>Players ({predictions.length}/6)</h3>  // Change 4 to 6 (or any number)

// Line ~111
{predictions.length < 6 && (  // Change 4 to 6 (same number as above)
  <button
    onClick={() => setView('form')}
    className="primary-button"
  >
    Enter Your Predictions
  </button>
)}
```

## 4. Page Title

### Location: `index.html`

Change the browser tab title:

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Super Bowl LIX Predictions</title>  <!-- ⬅️ CHANGE THIS -->
</head>
```

### Location: `src/App.jsx`

Change the main heading:

```jsx
<header className="app-header">
  <h1>🏈 Super Bowl LIX Prediction Party 🏈</h1>  {/* ⬅️ CHANGE THIS */}
  ...
</header>
```

## 5. Scoring Rules (Optional)

### Location: `src/components/AdminView.jsx`

Modify the scoring guide displayed to users (lines ~65-72):

```jsx
<div className="scoring-guide">
  <h3>Scoring Guide</h3>
  <ul>
    <li><strong>Exact match</strong> (time/numbers): 10 points</li>
    <li><strong>Close predictions</strong> (within range): 5 points</li>
    <li><strong>Correct Yes/No or team choice</strong>: 5 points</li>
    <li><strong>Most votes for best/weirdest commercial</strong>: 15 points</li>
  </ul>
</div>
```

## 6. Add Team Logos (Advanced)

1. **Add logo images to `public/` folder:**
   - `public/team1-logo.png`
   - `public/team2-logo.png`

2. **Update `src/components/PredictionForm.jsx`:**

```jsx
<label className="radio-label">
  <input type="radio" ... />
  <img src="/team1-logo.png" alt="Team 1" style={{width: '30px', marginRight: '8px'}} />
  Kansas City Chiefs
</label>
```

3. **Update header in `src/App.jsx`:**

```jsx
<header className="app-header">
  <div style={{display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center'}}>
    <img src="/team1-logo.png" alt="Team 1" style={{height: '60px'}} />
    <h1>🏈 Super Bowl LIX 🏈</h1>
    <img src="/team2-logo.png" alt="Team 2" style={{height: '60px'}} />
  </div>
  ...
</header>
```

## Testing Your Changes

After making changes:

1. **Save all files**
2. **Refresh your browser** (the dev server auto-reloads)
3. **Check all views:**
   - Home page
   - Prediction form
   - Admin view
   - Leaderboard

## Common Issues

**Colors not updating?**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check for typos in CSS color codes
- Make sure you're editing `src/App.css`, not `src/index.css`

**Team names not showing?**
- Verify you updated ALL instances in PredictionForm.jsx
- Check that strings match exactly (including spaces)
- Look for console errors in browser DevTools

**Images not loading?**
- Images must be in the `public/` folder
- Use forward slashes: `/logo.png` not `\logo.png`
- Check image file names match exactly (case-sensitive)

## Need More Help?

Check the main README.md file for additional information or open an issue on GitHub.

---

**Happy customizing!** 🎨🏈

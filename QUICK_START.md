# 🚀 Quick Start Guide

Get your Super Bowl Prediction Party app running in 5 minutes!

## Installation (First Time Only)

```bash
# 1. Navigate to the project folder
cd superbowlSheet

# 2. Install dependencies
npm install

# 3. Start the app
npm run dev
```

The app will open at: **http://localhost:5173**

## Game Day Usage

### Before the Game

1. **Start the app** (if not already running):
   ```bash
   npm run dev
   ```

2. **Have each player enter predictions:**
   - Open http://localhost:5173 on their phone/computer
   - Click "Enter Your Predictions"
   - Fill out the form
   - Submit

3. **Host opens Admin View:**
   - Click "Admin View"
   - Keep this open on a laptop/tablet during the game

### During the Game

**As events happen:**

1. **Check predictions in Admin View**
2. **Click point buttons** to award points:
   - +5 for close/correct answers
   - +10 for exact matches
   - +15 for commercial votes

3. **View Leaderboard** anytime to see standings

### After the Game

1. **Click "Print View"** to save/print results
2. **Celebrate the winner!** (Confetti included 🎉)

## Quick Customization

### Change Team Names

Edit `src/components/PredictionForm.jsx` and replace "Team 1" and "Team 2":

```jsx
// Line ~94
value="Kansas City Chiefs"  // Your team name
// Line ~98
Kansas City Chiefs  // Your team name (display)

// Line ~103
value="Philadelphia Eagles"  // Your team name
// Line ~107
Philadelphia Eagles  // Your team name (display)

// Line ~121
placeholder="Kansas City Chiefs"  // Team 1 name

// Line ~129
placeholder="Philadelphia Eagles"  // Team 2 name
```

### Change Colors

Edit `src/App.css` lines 7-8:

```css
--primary-blue: #0044cc;  /* Team 1 color */
--primary-red: #cc0000;   /* Team 2 color */
```

For more customization options, see [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)

## Troubleshooting

**"npm: command not found"**
- Install Node.js from https://nodejs.org

**Port 5173 already in use**
- The app is already running! Check your browser
- Or close the other instance and restart

**Changes not showing**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache

**Predictions not saving**
- Make sure browser allows localStorage/cookies
- Try a different browser (Chrome recommended)

## Deployment

### Quick Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Quick Deploy to Netlify (Free)

```bash
# Build the project
npm run build

# Drag and drop the 'dist' folder to netlify.com
```

## Commands Reference

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Tips

- **Mobile Friendly:** Players can submit predictions from their phones
- **Multiple Devices:** Host can view admin panel on laptop while players use phones
- **Print View:** Perfect for keeping score offline if needed
- **Reset:** Use "Reset All Data" button to start fresh for next year

## Support

For detailed documentation, see [README.md](README.md)

For customization help, see [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)

---

**Ready to play? Run `npm run dev` and enjoy the game!** 🏈🎉

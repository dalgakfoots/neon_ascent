# Neon Ascent Jump

A 2D platformer game built with p5.js, featuring mobile and desktop support with touch and keyboard controls.

## Project Structure
```
neon-ascent-jump/
├── src/                    # JavaScript source files
│   ├── game.js            # Main game logic
│   ├── ui.js              # UI rendering and touch controls
│   ├── player.js          # Player movement and input handling
│   ├── platforms.js       # Platform generation and collision
│   ├── enemies.js         # Enemy spawning and behavior
│   ├── bullets.js         # Bullet mechanics
│   ├── items.js           # Item spawning and collection
│   ├── skills.js          # Skill selection and effects
│   ├── utils.js           # Utility functions
├── public/                 # Static files
│   ├── index.html         # Main HTML file
│   ├── assets/            # Placeholder for images/sounds
├── .gitignore             # Git ignore file
├── README.md              # Project documentation
```

## Setup and Running
1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/neon-ascent-jump.git
   cd neon-ascent-jump
   ```
2. **Install a local server** (if not already installed):
   ```bash
   npm install -g http-server
   ```
3. **Run the game**:
   ```bash
   http-server -p 8080
   ```
   Open `http://localhost:8080/public/` in a browser.
4. **Play**:
   - Desktop: Use ←/→ for movement, Space for jump, K for skill selection.
   - Mobile: Use touch buttons for movement, jump, and skill selection.

## Development
- **Dependencies**: p5.js (loaded via CDN).
- **Build**: No build step required; uses ES modules.
- **Contributing**: Create a branch, make changes, and submit a pull request.

## Features
- Platformer gameplay with climbing mechanics.
- Mobile touch controls (left, right, jump, skill buttons).
- Passive skill selection with UI display.
- Dynamic camera and enemy spawning.
- Debug mode (toggle with P key).

## License
MIT License
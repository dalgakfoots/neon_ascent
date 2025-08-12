import {
  initPlayer,
  updatePlayer,
  handlePlayerInput,
  drawAvatar,
} from "./player.js";
import {
  initPlatforms,
  updatePlatforms,
  checkPlatformCollision,
  drawPlatforms,
} from "./platforms.js";
import { spawnEnemies, updateEnemies, drawEnemies } from "./enemies.js";
import { updateBullets, drawBullets } from "./bullets.js";
import { spawnSkillItem, updateItems, drawItems } from "./items.js";
import {
  generateSkillChoices,
  applySkill,
  drawSkillSelection,
  selectSkill,
} from "./skills.js";
import {
  updateFire,
  updateCamera,
  drawNeonWalls,
  drawFire,
  drawUI,
  drawGameOver,
  resetGame,
  drawTouchControls,
  handleTouchInput,
} from "./ui.js";

const GameState = {
  avatarX: 0,
  avatarY: 0,
  avatarSize: 10,
  avatarHP: 10,
  velocityY: 0,
  gravity: 0.5,
  isOnPlatform: true,
  jumpCount: 0,
  maxJumps: 2,
  moveSpeed: 5,
  platforms: [],
  score: 0,
  gameOver: false,
  enemies: [],
  bullets: [],
  expItems: [],
  skillItems: [],
  exp: 0,
  maxExp: 100,
  level: 1,
  lastAttack: 0,
  attackSpeed: 350,
  attackDamage: 1,
  lastEnemySpawn: 0,
  spawnInterval: 3000,
  lastSkillItemSpawn: 0,
  skillItemSpawnInterval: 10000,
  lastPlatformSpawn: 0,
  platformSpawnInterval: 1000,
  targetCameraOffset: 0,
  currentCameraOffset: 0,
  skillSelection: false,
  skillChoices: [],
  fireHeight: -100,
  startTime: 0,
  fireStartTime: 0,
  fireDelay: 30000,
  showControlsTimer: 300,
  boss: null,
  bossActive: false,
  fireSpeed: 0.05,
  lastBossScore: -100,
  isDebugMode: false,
  lastEnemySpawnX: 0,
  lastEnemySpawnY: 0,
  passiveItemsCount: 0,
  bossBullets: [],
  isMobile: false,
  canvasWidth: 400,
  canvasHeight: 600,
  leftButton: { x: 20, w: 60, h: 60, active: false },
  rightButton: { x: 100, w: 60, h: 60, active: false },
  jumpButton: { x: 0, w: 70, h: 70, active: false },
  skillButton: { x: 0, w: 60, h: 60, active: false },
};

function setup() {
  console.log("Setup called, initializing game...");
  GameState.isMobile =
    window.innerWidth <= 500 || /Mobi|Android/i.test(navigator.userAgent);
  GameState.canvasWidth = GameState.isMobile
    ? Math.min(window.innerWidth, 400)
    : 400;
  GameState.canvasHeight = GameState.isMobile
    ? Math.min(window.innerHeight, 600)
    : 600;
  createCanvas(GameState.canvasWidth, GameState.canvasHeight);
  initPlayer(GameState);
  initPlatforms(GameState);
  GameState.startTime = millis();
  GameState.fireStartTime = GameState.startTime + GameState.fireDelay;
  GameState.currentCameraOffset = 0;
  GameState.targetCameraOffset = 0;
  console.log("GameState initialized, buttons:", {
    leftButton: GameState.leftButton,
    rightButton: GameState.rightButton,
    jumpButton: GameState.jumpButton,
    skillButton: GameState.skillButton,
  });
  window.addEventListener("resize", () => {
    GameState.isMobile = window.innerWidth <= 500;
    console.log("Window resized, isMobile:", GameState.isMobile);
  });
}

function draw() {
  background(51);

  if (GameState.skillSelection) {
    drawSkillSelection(GameState);
    return;
  }

  if (!GameState.gameOver) {
    updatePlayer(GameState);
    updatePlatforms(GameState);
    updateEnemies(GameState);
    updateBullets(GameState);
    updateItems(GameState);
    updateFire(GameState);
    updateCamera(GameState);
    drawNeonWalls(GameState);
    drawFire(GameState);
    drawPlatforms(GameState);
    drawEnemies(GameState);
    drawBullets(GameState);
    drawItems(GameState);
    drawAvatar(GameState);
    drawUI(GameState);
    if (GameState.isMobile) {
      drawTouchControls(GameState);
    }
  } else {
    drawGameOver(GameState);
  }
}

function keyPressed() {
  handlePlayerInput(GameState, keyCode);
  if (keyCode === 80) {
    // 'p' 키
    GameState.isDebugMode = !GameState.isDebugMode;
  }
}

function mousePressed() {
  if (GameState.gameOver) {
    resetGame(GameState);
  } else if (GameState.skillSelection) {
    selectSkill(GameState);
  }
}

function touchStarted() {
  if (GameState.gameOver) {
    resetGame(GameState);
  } else if (GameState.skillSelection) {
    selectSkill(GameState);
  } else {
    handleTouchInput(GameState, true);
  }
  return false;
}

function touchEnded() {
  handleTouchInput(GameState, false);
  return false;
}

// Register p5.js functions in global scope
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;
window.mousePressed = mousePressed;
window.touchStarted = touchStarted;
window.touchEnded = touchEnded;

export {
  GameState,
  setup,
  draw,
  keyPressed,
  mousePressed,
  touchStarted,
  touchEnded,
};

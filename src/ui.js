import { GameState } from "./game.js";
import { generateSkillChoices } from "./skills.js";
import { initPlatforms } from "./platforms.js";

function updateFire(state) {
  if (!state.skillSelection && millis() > state.fireStartTime) {
    state.fireHeight =
      (millis() - state.fireStartTime) *
      state.fireSpeed *
      (1 + state.score * 0.005 + (millis() - state.fireStartTime) * 0.00000005);
  }
  if (state.avatarY > state.canvasHeight - state.fireHeight) {
    state.gameOver = true;
  }
}

function updateCamera(state) {
  if (state.score >= 10) {
    let idealAvatarScreenY = state.canvasHeight * 0.6;
    state.targetCameraOffset = -(state.avatarY - idealAvatarScreenY);
  } else {
    state.targetCameraOffset = 0;
  }
  state.currentCameraOffset = lerp(
    state.currentCameraOffset,
    state.targetCameraOffset,
    0.03
  );
}

function drawNeonWalls(state) {
  stroke(0, 255, 0, 100);
  for (let i = 0; i < state.canvasHeight; i += 40) {
    line(50, i, 50, i + 20);
    line(state.canvasWidth - 50, i, state.canvasWidth - 50, i + 20);
    line(0, i + 10, 50, i + 10);
    line(state.canvasWidth, i + 10, state.canvasWidth - 50, i + 10);
  }
}

function drawFire(state) {
  let fireStartY =
    state.canvasHeight - state.fireHeight + state.currentCameraOffset;
  if (fireStartY < state.canvasHeight) {
    for (let y = Math.max(fireStartY, 0); y < state.canvasHeight; y += 10) {
      fill(255, 100, 0, 100 - (y - fireStartY) * 0.1);
      noStroke();
      rect(0, y, state.canvasWidth, 10);
    }
  }
}

function drawUI(state) {
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text("Height: " + state.score * 10 + "m", 10, 25);
  text("Level: " + state.level, 10, 45);
  fill(255, 0, 0);
  rect(10, 50, 100, 10);
  fill(0, 255, 0);
  rect(10, 50, (state.avatarHP / 10) * 100, 10);
  fill(255);
  textSize(14);
  text("Passive Skills: " + state.passiveItemsCount, 10, 85); // Moved to y: 85, smaller text
  stroke(0, 255, 0, 150);
  fill(100, 100, 100, 200);
  rect(0, state.canvasHeight - 20, state.canvasWidth, 10);
  noStroke();
  fill(255, 255, 0, 255);
  rect(
    0,
    state.canvasHeight - 20,
    (state.exp / state.maxExp) * state.canvasWidth,
    10
  );
  fill(255);
  textAlign(CENTER);
  textSize(14);
  text(
    "EXP: " + state.exp + "/" + state.maxExp,
    state.canvasWidth / 2,
    state.canvasHeight - 30
  ); // Adjusted to y: canvasHeight - 30

  if (state.passiveItemsCount > 0 && !state.skillSelection && !state.gameOver) {
    fill(0, 255, 0);
    textSize(14);
    textAlign(CENTER);
    text(
      "Press K to Choose a Passive Skill!",
      state.canvasWidth / 2,
      state.canvasHeight - 140
    ); // Moved to y: canvasHeight - 140
    console.log("Drawing passiveItemsCount:", state.passiveItemsCount);
  }

  if (state.showControlsTimer > 0) {
    fill(0, 255, 0);
    textSize(14);
    textAlign(CENTER);
    text(
      "←/→: Move, Space: Jump, K: Select Passive, P: Toggle Debug",
      state.canvasWidth / 2,
      state.canvasHeight - 50
    );
    state.showControlsTimer--;
  }

  if (state.isDebugMode) {
    drawDebugInfo(state);
  }
}

function drawGameOver(state) {
  textSize(32);
  textAlign(CENTER);
  fill(255, 0, 0);
  text("Connection Lost!", state.canvasWidth / 2, state.canvasHeight / 2 - 20);
  text(
    "Height: " + state.score * 10 + "m",
    state.canvasWidth / 2,
    state.canvasHeight / 2 + 20
  );
  textSize(16);
  text("Click to restart", state.canvasWidth / 2, state.canvasHeight / 2 + 50);
}

function drawDebugInfo(state) {
  fill(255);
  textSize(14);
  textAlign(LEFT);
  text("Fire Height: " + nf(state.fireHeight, 1, 2), 10, 65);
  text(
    "Fire Speed: " +
      nf(
        state.fireSpeed *
          (1 +
            state.score * 0.005 +
            (millis() - state.fireStartTime) * 0.00000005),
        1,
        4
      ),
    10,
    85
  );
  text(
    "Fire Start Time: " +
      nf((state.fireStartTime - state.startTime) / 1000, 1, 1) +
      "s",
    10,
    105
  );
  text("Score: " + state.score, 10, 125);
  text("Camera Offset: " + nf(state.currentCameraOffset, 1, 2), 10, 145);
  text("Enemy Count: " + state.enemies.length, 10, 165);
  text("Boss HP: " + (state.boss ? state.boss.hp : "N/A"), 10, 185);
  text(
    "Boss Active: " +
      state.bossActive +
      ", Last Boss Score: " +
      state.lastBossScore,
    10,
    205
  );
  text("Boss Bullets: " + state.bossBullets.length, 10, 225);
  text("Avatar HP: " + state.avatarHP, 10, 245);
  text("Level: " + state.level, 10, 265);
  text("Attack Damage: " + state.attackDamage, 10, 285);
  text("Attack Speed: " + state.attackSpeed, 10, 305);
  text(
    "Last Enemy Spawn: (" +
      nf(state.lastEnemySpawnX, 1, 1) +
      ", " +
      nf(state.lastEnemySpawnY, 1, 1) +
      ")",
    10,
    325
  );
  text("Velocity Y: " + nf(state.velocityY, 1, 2), 10, 345);
  text("Platform Count: " + state.platforms.length, 10, 365);
  text("On Platform: " + state.isOnPlatform, 10, 385);
  text("Passive Items: " + state.passiveItemsCount, 10, 405);
}

function resetGame(state) {
  state.platforms = [];
  state.enemies = [];
  state.bullets = [];
  state.bossBullets = [];
  state.expItems = [];
  state.skillItems = [];
  state.score = 0;
  state.gameOver = false;
  state.avatarHP = 10;
  state.exp = 0;
  state.level = 1;
  state.avatarX = state.canvasWidth / 2;
  state.avatarY = state.canvasHeight - state.avatarSize - 10;
  state.velocityY = 0;
  state.isOnPlatform = true;
  state.jumpCount = 0;
  state.passiveItemsCount = 0;
  state.lastEnemySpawn = 0;
  state.spawnInterval = 3000;
  state.lastSkillItemSpawn = 0;
  state.lastPlatformSpawn = 0;
  state.targetCameraOffset = 0;
  state.currentCameraOffset = 0;
  state.skillSelection = false;
  state.skillChoices = [];
  state.fireHeight = -100;
  state.startTime = millis();
  state.fireStartTime = state.startTime + state.fireDelay;
  state.showControlsTimer = 300;
  state.boss = null;
  state.bossActive = false;
  state.lastBossScore = -100;
  state.isDebugMode = false;
  state.lastEnemySpawnX = 0;
  state.lastEnemySpawnY = 0;
  state.attackSpeed = 350;
  state.attackDamage = 1;
  initPlatforms(state);
}

function drawTouchControls(state) {
  if (!state.isMobile) return;

  // Dynamically set button positions
  state.leftButton.y = state.canvasHeight - 80;
  state.rightButton.y = state.canvasHeight - 80;
  state.jumpButton.x = state.canvasWidth - 100;
  state.jumpButton.y = state.canvasHeight - 80;
  state.skillButton.x = state.canvasWidth - 100;
  state.skillButton.y = state.canvasHeight - 160;

  noStroke();
  fill(
    state.leftButton.active ? color(50, 255, 50, 200) : color(50, 255, 50, 100)
  );
  rect(
    state.leftButton.x,
    state.leftButton.y,
    state.leftButton.w,
    state.leftButton.h,
    10
  );
  fill(
    state.rightButton.active ? color(50, 255, 50, 200) : color(50, 255, 50, 100)
  );
  rect(
    state.rightButton.x,
    state.rightButton.y,
    state.rightButton.w,
    state.rightButton.h,
    10
  );
  fill(
    state.jumpButton.active ? color(50, 255, 50, 200) : color(50, 255, 50, 100)
  );
  rect(
    state.jumpButton.x,
    state.jumpButton.y,
    state.jumpButton.w,
    state.jumpButton.h,
    10
  );
  if (state.passiveItemsCount > 0 && !state.skillSelection && !state.gameOver) {
    fill(
      state.skillButton.active
        ? color(0, 255, 255, 200)
        : color(0, 255, 255, 100)
    );
    rect(
      state.skillButton.x,
      state.skillButton.y,
      state.skillButton.w,
      state.skillButton.h,
      10
    );
  }
  fill(255);
  textSize(Math.min(state.canvasWidth * 0.04, 16));
  textAlign(CENTER);
  text(
    "←",
    state.leftButton.x + state.leftButton.w / 2,
    state.leftButton.y + state.leftButton.h / 2 + 5
  );
  text(
    "→",
    state.rightButton.x + state.rightButton.w / 2,
    state.rightButton.y + state.rightButton.h / 2 + 5
  );
  text(
    "Jump",
    state.jumpButton.x + state.jumpButton.w / 2,
    state.jumpButton.y + state.jumpButton.h / 2 + 5
  );
  if (state.passiveItemsCount > 0 && !state.skillSelection && !state.gameOver) {
    text(
      "Skill",
      state.skillButton.x + state.skillButton.w / 2,
      state.skillButton.y + state.skillButton.h / 2 + 5
    );
  }
}

function handleTouchInput(state, isTouchStart) {
  if (isTouchStart && touches.length > 0) {
    let x = touches[0].x;
    let y = touches[0].y;
    console.log("Touch coordinates:", { x, y });
    console.log("Jump button area:", {
      x: state.jumpButton.x,
      y: state.jumpButton.y,
      w: state.jumpButton.w,
      h: state.jumpButton.h,
    });
    state.leftButton.active =
      x > state.leftButton.x &&
      x < state.leftButton.x + state.leftButton.w &&
      y > state.leftButton.y &&
      y < state.leftButton.y + state.leftButton.h;
    state.rightButton.active =
      x > state.rightButton.x &&
      x < state.rightButton.x + state.rightButton.w &&
      y > state.rightButton.y &&
      y < state.rightButton.y + state.rightButton.h;
    state.jumpButton.active =
      x > state.jumpButton.x &&
      x < state.jumpButton.x + state.jumpButton.w &&
      y > state.jumpButton.y &&
      y < state.jumpButton.y + state.jumpButton.h;
    if (
      state.passiveItemsCount > 0 &&
      !state.skillSelection &&
      !state.gameOver
    ) {
      state.skillButton.active =
        x > state.skillButton.x &&
        x < state.skillButton.x + state.skillButton.w &&
        y > state.skillButton.y &&
        y < state.skillButton.y + state.skillButton.h;
      if (state.skillButton.active) {
        console.log("Skill button triggered, entering skill selection");
        state.passiveItemsCount--;
        state.skillSelection = true;
        state.skillChoices = generateSkillChoices();
      }
    }
    console.log("Jump button touched:", state.jumpButton.active);
  } else if (!isTouchStart) {
    state.leftButton.active = false;
    state.rightButton.active = false;
    state.jumpButton.active = false;
    state.skillButton.active = false;
  }
  console.log("Button states:", {
    leftButton: state.leftButton,
    rightButton: state.rightButton,
    jumpButton: state.jumpButton,
    skillButton: state.skillButton,
  });
}

export {
  updateFire,
  updateCamera,
  drawNeonWalls,
  drawFire,
  drawUI,
  drawGameOver,
  drawDebugInfo,
  resetGame,
  drawTouchControls,
  handleTouchInput,
};

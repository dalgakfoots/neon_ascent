import { GameState } from "./game.js";

function initPlatforms(state) {
  state.platforms.push({
    x: state.canvasWidth / 2,
    y: state.canvasHeight - 10,
    width: 80,
    color: color(random(100, 200), 0, random(100, 200), 150),
    type: "normal",
  });
}

function updatePlatforms(state) {
  if (millis() - state.lastPlatformSpawn >= state.platformSpawnInterval) {
    let topPlatform = state.platforms[0];
    let spawnY = topPlatform
      ? topPlatform.y - random(80, 120)
      : state.canvasHeight - random(80, 120);
    let type = random() < 0.7 ? "normal" : random() < 0.5 ? "moving" : "spring";
    let platform = {
      x: random(50, state.canvasWidth - 50),
      y: spawnY,
      width: random(50, 100),
      color: color(random(100, 200), 0, random(100, 200), 150),
      type: type,
    };
    if (type === "moving") {
      platform.speed = random(1, 2) * (random() < 0.5 ? 1 : -1);
    }
    state.platforms.unshift(platform);
    state.lastPlatformSpawn = millis();
    state.score = floor((state.canvasHeight - state.avatarY) / 10);
  }

  for (let platform of state.platforms) {
    if (platform.type === "moving") {
      platform.x += platform.speed;
      if (
        platform.x - platform.width / 2 < 0 ||
        platform.x + platform.width / 2 > state.canvasWidth
      ) {
        platform.speed *= -1;
      }
    }
  }

  state.platforms = state.platforms.filter(
    (platform) =>
      platform.y + state.currentCameraOffset <= state.canvasHeight + 50
  );
}

function checkPlatformCollision(state) {
  state.isOnPlatform = false;
  for (let platform of state.platforms) {
    if (
      state.avatarX > platform.x - platform.width / 2 &&
      state.avatarX < platform.x + platform.width / 2 &&
      state.avatarY + state.avatarSize > platform.y - 10 &&
      state.avatarY + state.avatarSize < platform.y + 10 &&
      state.velocityY >= 0
    ) {
      state.avatarY = platform.y - state.avatarSize;
      state.velocityY = platform.type === "spring" ? -15 : 0;
      state.isOnPlatform = true;
      state.jumpCount = 0;
      if (platform.type === "moving") {
        state.avatarX += platform.speed;
        if (state.avatarX < state.avatarSize) state.avatarX = state.avatarSize;
        if (state.avatarX > state.canvasWidth - state.avatarSize)
          state.avatarX = state.canvasWidth - state.avatarSize;
      }
      break;
    }
  }
}

function drawPlatforms(state) {
  for (let platform of state.platforms) {
    let platformY = platform.y + state.currentCameraOffset;
    if (platformY > -30 && platformY < state.canvasHeight + 30) {
      stroke(0, 255, 0);
      fill(platform.color);
      rect(platform.x - platform.width / 2, platformY, platform.width, 30);
      if (platform.type === "moving") {
        stroke(255, 0, 255);
        line(
          platform.x - platform.width / 2,
          platformY + 15,
          platform.x + platform.width / 2,
          platformY + 15
        );
      }
    }
  }
}

export {
  initPlatforms,
  updatePlatforms,
  checkPlatformCollision,
  drawPlatforms,
};

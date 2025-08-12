import { GameState } from "./game.js";
import { checkPlatformCollision } from "./platforms.js";
import { generateSkillChoices } from "./skills.js";

function initPlayer(state) {
  state.avatarX = state.canvasWidth / 2;
  state.avatarY = state.canvasHeight - state.avatarSize - 10;
  state.velocityY = 0;
  state.isOnPlatform = true;
  state.jumpCount = 0;
}

function updatePlayer(state) {
  if (keyIsDown(LEFT_ARROW) || state.leftButton.active) {
    state.avatarX -= state.moveSpeed;
    if (state.avatarX < state.avatarSize) state.avatarX = state.avatarSize;
  }
  if (keyIsDown(RIGHT_ARROW) || state.rightButton.active) {
    state.avatarX += state.moveSpeed;
    if (state.avatarX > state.canvasWidth - state.avatarSize)
      state.avatarX = state.canvasWidth - state.avatarSize;
  }
  if (
    state.jumpButton.active &&
    state.jumpCount < state.maxJumps &&
    !state.gameOver &&
    !state.skillSelection
  ) {
    state.velocityY = -10;
    state.isOnPlatform = false;
    state.jumpCount++;
    state.jumpButton.active = false; // Prevent continuous jumping
  }

  if (!state.isOnPlatform) {
    state.velocityY += state.gravity;
    state.avatarY += state.velocityY;
  }

  checkPlatformCollision(state);
}

function handlePlayerInput(state, keyCode) {
  if (
    keyCode === 32 &&
    state.jumpCount < state.maxJumps &&
    !state.gameOver &&
    !state.skillSelection
  ) {
    state.velocityY = -10;
    state.isOnPlatform = false;
    state.jumpCount++;
  } else if (
    keyCode === 75 &&
    state.passiveItemsCount > 0 &&
    !state.gameOver &&
    !state.skillSelection
  ) {
    state.passiveItemsCount--;
    state.skillSelection = true;
    state.skillChoices = generateSkillChoices();
  }
}

function drawAvatar(state) {
  let avatarDisplayY = state.avatarY + state.currentCameraOffset;
  if (
    avatarDisplayY > -state.avatarSize &&
    avatarDisplayY < state.canvasHeight + state.avatarSize
  ) {
    noStroke();
    fill(0, 255, 255);
    ellipse(state.avatarX, avatarDisplayY, state.avatarSize * 2);
    rect(
      state.avatarX - state.avatarSize / 2,
      avatarDisplayY + state.avatarSize,
      state.avatarSize,
      state.avatarSize * 2
    );
    fill(255, 0, 0);
    rect(state.avatarX - 15, avatarDisplayY - state.avatarSize - 8, 30, 4);
    fill(0, 255, 0);
    rect(
      state.avatarX - 15,
      avatarDisplayY - state.avatarSize - 8,
      (state.avatarHP / 10) * 30,
      4
    );
  }
}

export { initPlayer, updatePlayer, handlePlayerInput, drawAvatar };

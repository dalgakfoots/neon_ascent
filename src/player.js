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
  // 좌우 이동 처리
  if (keyIsDown(LEFT_ARROW) || state.leftButton.active) {
    state.avatarX -= state.moveSpeed;
    if (state.avatarX < state.avatarSize) state.avatarX = state.avatarSize;
  }
  if (keyIsDown(RIGHT_ARROW) || state.rightButton.active) {
    state.avatarX += state.moveSpeed;
    if (state.avatarX > state.canvasWidth - state.avatarSize)
      state.avatarX = state.canvasWidth - state.avatarSize;
  }

  // 점프 처리 - 터치와 키보드 모두 처리
  // 터치 점프: 버튼이 활성화되었고 이전 프레임에서 비활성화 상태였다면 점프
  if (
    state.jumpButton.active &&
    !state.jumpButton.wasActive &&
    state.jumpCount < state.maxJumps &&
    !state.gameOver &&
    !state.skillSelection
  ) {
    state.velocityY = -10;
    state.isOnPlatform = false;
    state.jumpCount++;
    console.log("Jump executed via touch, jumpCount:", state.jumpCount);
  }

  // 이전 프레임의 점프 버튼 상태 저장
  state.jumpButton.wasActive = state.jumpButton.active;

  // 중력 적용
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

import { GameState } from "./game.js";
import { star } from "./utils.js";

function spawnSkillItem(state) {
  let spawnX = random(state.canvasWidth);
  let spawnY = state.avatarY - 100 + random(-50, 50);
  state.skillItems.push({ x: spawnX, y: spawnY, size: 10 });
}

function updateItems(state) {
  if (millis() - state.lastSkillItemSpawn >= state.skillItemSpawnInterval) {
    if (random() < 0.2) {
      spawnSkillItem(state);
    }
    state.lastSkillItemSpawn = millis();
  }

  for (let i = state.expItems.length - 1; i >= 0; i--) {
    let item = state.expItems[i];
    let dx = state.avatarX - item.x;
    let dy = state.avatarY - item.y;
    let distToAvatar = dist(item.x, item.y, state.avatarX, state.avatarY);
    if (distToAvatar > 0) {
      item.x += dx * 0.05;
      item.y += dy * 0.05;
    }
    if (distToAvatar < state.avatarSize) {
      state.exp += 10;
      if (state.exp >= state.maxExp) {
        state.exp = 0;
        state.level++;
        state.passiveItemsCount++;
      }
      state.expItems.splice(i, 1);
    }
  }

  for (let i = state.skillItems.length - 1; i >= 0; i--) {
    let item = state.skillItems[i];
    let distToAvatar = dist(item.x, item.y, state.avatarX, state.avatarY);
    if (distToAvatar < 30) {
      state.passiveItemsCount++;
      state.skillItems.splice(i, 1);
    }
  }
}

function drawItems(state) {
  for (let item of state.expItems) {
    let itemDisplayY = item.y + state.currentCameraOffset;
    if (
      itemDisplayY > -item.size &&
      itemDisplayY < state.canvasHeight + item.size
    ) {
      noStroke();
      fill(255, 255, 0);
      ellipse(item.x, itemDisplayY, item.size);
    }
  }

  for (let item of state.skillItems) {
    let itemDisplayY = item.y + state.currentCameraOffset;
    if (
      itemDisplayY > -item.size &&
      itemDisplayY < state.canvasHeight + item.size
    ) {
      noStroke();
      fill(0, 255, 255);
      star(item.x, itemDisplayY, 5, 10, 5);
    }
  }
}

export { spawnSkillItem, updateItems, drawItems };

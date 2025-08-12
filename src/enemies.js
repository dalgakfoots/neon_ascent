import { GameState } from "./game.js";

function spawnEnemies(state) {
  let enemyCount = Math.min(4 + Math.floor(millis() / 20000), 8);
  for (let i = 0; i < enemyCount; i++) {
    let direction = Math.floor(random(8));
    let spawnX, spawnY;
    let margin = 50;

    let worldTop = -state.currentCameraOffset - margin;
    let worldBottom = -state.currentCameraOffset + state.canvasHeight + margin;
    let worldLeft = -margin;
    let worldRight = state.canvasWidth + margin;

    switch (direction) {
      case 0:
        spawnX = random(0, state.canvasWidth);
        spawnY = worldTop;
        break;
      case 1:
        spawnX = random(0, state.canvasWidth);
        spawnY = worldBottom;
        break;
      case 2:
        spawnX = worldLeft;
        spawnY = random(worldTop, worldBottom);
        break;
      case 3:
        spawnX = worldRight;
        spawnY = random(worldTop, worldBottom);
        break;
      case 4:
        spawnX = worldLeft;
        spawnY = worldTop;
        break;
      case 5:
        spawnX = worldLeft;
        spawnY = worldBottom;
        break;
      case 6:
        spawnX = worldRight;
        spawnY = worldTop;
        break;
      case 7:
        spawnX = worldRight;
        spawnY = worldBottom;
        break;
    }

    state.lastEnemySpawnX = spawnX;
    state.lastEnemySpawnY = spawnY;
    state.enemies.push({
      x: spawnX,
      y: spawnY,
      size: 15,
      speed: 1,
      hp: 2,
      maxHp: 2,
    });
  }
}

function updateEnemies(state) {
  if (
    !state.bossActive &&
    millis() - state.lastEnemySpawn >= state.spawnInterval
  ) {
    spawnEnemies(state);
    state.spawnInterval = Math.max(2000, state.spawnInterval - 500);
    state.lastEnemySpawn = millis();
  }

  if (!state.skillSelection) {
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      let enemy = state.enemies[i];
      let enemyDisplayY = enemy.y + state.currentCameraOffset;
      if (
        enemyDisplayY > -enemy.size &&
        enemyDisplayY < state.canvasHeight + enemy.size
      ) {
        let dx = state.avatarX - enemy.x;
        let dy = state.avatarY - enemy.y;
        let mag = Math.sqrt(dx * dx + dy * dy);
        if (mag > 0) {
          enemy.x += (dx / mag) * enemy.speed;
          enemy.y += (dy / mag) * enemy.speed;
        }
        if (
          dist(enemy.x, enemy.y, state.avatarX, state.avatarY) <
          enemy.size + state.avatarSize
        ) {
          state.avatarHP--;
          state.enemies.splice(i, 1);
          if (state.avatarHP <= 0) state.gameOver = true;
        }
      }
    }
  }

  if (
    state.score >= 200 &&
    state.score >= state.lastBossScore + 200 &&
    !state.boss &&
    !state.bossActive
  ) {
    state.boss = {
      x: state.canvasWidth / 2,
      y: state.avatarY - 100,
      size: 30,
      hp: 30,
      maxHp: 30,
      lastAttack: 0,
    };
    state.bossActive = true;
    state.lastBossScore = state.score;
    state.spawnInterval = Infinity;
  }

  if (state.boss) {
    if (millis() - state.boss.lastAttack > 1000) {
      let dx = state.avatarX - state.boss.x;
      let dy = state.avatarY - state.boss.y;
      let mag = Math.sqrt(dx * dx + dy * dy);
      if (mag > 0) {
        state.bossBullets.push({
          x: state.boss.x,
          y: state.boss.y,
          dx: dx / mag,
          dy: dy / mag,
          speed: 5,
          lifespan: 300,
        });
        state.boss.lastAttack = millis();
      }
    }
  }
}

function drawEnemies(state) {
  for (let enemy of state.enemies) {
    let enemyDisplayY = enemy.y + state.currentCameraOffset;
    if (
      enemyDisplayY > -enemy.size &&
      enemyDisplayY < state.canvasHeight + enemy.size
    ) {
      noStroke();
      fill(255, 0, 0);
      ellipse(enemy.x, enemyDisplayY, enemy.size);
      fill(255, 0, 0);
      rect(enemy.x - 10, enemyDisplayY - enemy.size - 5, 20, 3);
      fill(0, 255, 0);
      rect(
        enemy.x - 10,
        enemyDisplayY - enemy.size - 5,
        (enemy.hp / enemy.maxHp) * 20,
        3
      );
    }
  }

  if (state.boss) {
    let bossDisplayY = state.boss.y + state.currentCameraOffset;
    if (
      bossDisplayY > -state.boss.size &&
      bossDisplayY < state.canvasHeight + state.boss.size
    ) {
      noStroke();
      fill(200, 0, 0);
      ellipse(state.boss.x, bossDisplayY, state.boss.size);
      fill(255, 0, 0);
      rect(state.boss.x - 30, bossDisplayY - state.boss.size - 5, 60, 5);
      fill(0, 255, 0);
      rect(
        state.boss.x - 30,
        bossDisplayY - state.boss.size - 5,
        (state.boss.hp / state.boss.maxHp) * 60,
        5
      );
    }
  }
}

export { spawnEnemies, updateEnemies, drawEnemies };

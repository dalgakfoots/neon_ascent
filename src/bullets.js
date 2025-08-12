import { GameState } from "./game.js";

function updateBullets(state) {
  if (
    (state.enemies.length > 0 || state.boss) &&
    millis() - state.lastAttack > state.attackSpeed
  ) {
    let nearest = null;
    let nearestDist = Infinity;
    if (
      state.boss &&
      state.boss.y + state.currentCameraOffset > 0 &&
      state.boss.y + state.currentCameraOffset < state.canvasHeight
    ) {
      nearest = state.boss;
      nearestDist = dist(
        state.boss.x,
        state.boss.y,
        state.avatarX,
        state.avatarY
      );
    } else if (state.enemies.length > 0) {
      for (let enemy of state.enemies) {
        let enemyDisplayY = enemy.y + state.currentCameraOffset;
        if (enemyDisplayY > 0 && enemyDisplayY < state.canvasHeight) {
          let d = dist(enemy.x, enemy.y, state.avatarX, state.avatarY);
          if (d < nearestDist) {
            nearest = enemy;
            nearestDist = d;
          }
        }
      }
    }
    if (nearest) {
      state.bullets.push({
        x: state.avatarX,
        y: state.avatarY,
        startX: state.avatarX,
        startY: state.avatarY,
        target: nearest,
        speed: 10,
        maxDistance: 1000,
        lifespan: 300,
      });
      state.lastAttack = millis();
    }
  }

  let bulletsToRemove = [];
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    let bullet = state.bullets[i];
    bullet.lifespan--;
    if (bullet.lifespan <= 0) {
      bulletsToRemove.push(i);
      continue;
    }
    if (
      bullet.target &&
      (state.enemies.includes(bullet.target) || bullet.target === state.boss)
    ) {
      let dx = bullet.target.x - bullet.x;
      let dy = bullet.target.y - bullet.y;
      let mag = Math.sqrt(dx * dx + dy * dy);
      if (mag > 0) {
        bullet.x += (dx / mag) * bullet.speed;
        bullet.y += (dy / mag) * bullet.speed;
      }
    } else {
      bullet.x += bullet.dx * bullet.speed || 0;
      bullet.y += bullet.dy * bullet.speed || 0;
    }
    let distanceTraveled = dist(
      bullet.x,
      bullet.y,
      bullet.startX,
      bullet.startY
    );
    if (distanceTraveled > bullet.maxDistance) {
      bulletsToRemove.push(i);
      continue;
    }
    if (
      state.boss &&
      dist(bullet.x, bullet.y, state.boss.x, state.boss.y) < state.boss.size
    ) {
      state.boss.hp -= state.attackDamage;
      if (state.boss.hp <= 0) {
        state.passiveItemsCount++;
        state.boss = null;
        state.bossActive = false;
        state.spawnInterval = 3000;
        state.lastEnemySpawn = millis();
      }
      bulletsToRemove.push(i);
      continue;
    }
    for (let j = state.enemies.length - 1; j >= 0; j--) {
      if (
        dist(bullet.x, bullet.y, state.enemies[j].x, state.enemies[j].y) < 20
      ) {
        state.enemies[j].hp -= state.attackDamage;
        if (state.enemies[j].hp <= 0) {
          state.expItems.push({
            x: state.enemies[j].x,
            y: state.enemies[j].y,
            size: 8,
          });
          state.enemies.splice(j, 1);
        }
        bulletsToRemove.push(i);
        break;
      }
    }
    if (
      bullet.x < 0 ||
      bullet.x > state.canvasWidth ||
      bullet.y + state.currentCameraOffset < 0 ||
      bullet.y + state.currentCameraOffset > state.canvasHeight
    ) {
      bulletsToRemove.push(i);
    }
  }
  for (let i of bulletsToRemove.reverse()) {
    state.bullets.splice(i, 1);
  }

  let bossBulletsToRemove = [];
  for (let i = state.bossBullets.length - 1; i >= 0; i--) {
    let bullet = state.bossBullets[i];
    bullet.x += bullet.dx * bullet.speed;
    bullet.y += bullet.dy * bullet.speed;
    bullet.lifespan--;
    if (
      bullet.lifespan <= 0 ||
      bullet.x < 0 ||
      bullet.x > state.canvasWidth ||
      bullet.y + state.currentCameraOffset < 0 ||
      bullet.y + state.currentCameraOffset > state.canvasHeight
    ) {
      bossBulletsToRemove.push(i);
      continue;
    }
    if (
      dist(bullet.x, bullet.y, state.avatarX, state.avatarY) <
      state.avatarSize + 5
    ) {
      state.avatarHP--;
      bossBulletsToRemove.push(i);
      if (state.avatarHP <= 0) state.gameOver = true;
    }
  }
  for (let i of bossBulletsToRemove.reverse()) {
    state.bossBullets.splice(i, 1);
  }
}

function drawBullets(state) {
  for (let bullet of state.bullets) {
    let bulletDisplayY = bullet.y + state.currentCameraOffset;
    noStroke();
    fill(0, 255, 0);
    ellipse(bullet.x, bulletDisplayY, 5);
  }

  for (let bullet of state.bossBullets) {
    let bulletDisplayY = bullet.y + state.currentCameraOffset;
    noStroke();
    fill(255, 0, 0);
    ellipse(bullet.x, bulletDisplayY, 5);
  }
}

export { updateBullets, drawBullets };

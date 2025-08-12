import { GameState } from "./game.js";

function generateSkillChoices() {
  let skills = [
    {
      name: "Faster Attacks",
      effect: () =>
        (GameState.attackSpeed = Math.max(100, GameState.attackSpeed - 50)),
    },
    { name: "Stronger Bullets", effect: () => (GameState.attackDamage += 1) },
    {
      name: "More Health",
      effect: () => {
        GameState.avatarHP += 2;
        if (GameState.avatarHP > 10) GameState.avatarHP = 10;
      },
    },
  ];
  return skills;
}

function applySkill(skill) {
  skill.effect();
}

function drawSkillSelection(state) {
  fill(0, 0, 0, 200);
  rect(0, 0, state.canvasWidth, state.canvasHeight);
  fill(0, 255, 0);
  textSize(24);
  textAlign(CENTER);
  text(
    "Level Up! Choose a Skill",
    state.canvasWidth / 2,
    state.canvasHeight / 2 - 100
  );
  for (let i = 0; i < state.skillChoices.length; i++) {
    let skill = state.skillChoices[i];
    let x = state.canvasWidth / 2 - 150 + i * 100;
    let y = state.canvasHeight / 2 - 50;
    fill(50, 50, 50, 200);
    rect(x, y, 80, 100, 10);
    fill(0, 255, 0);
    textSize(14);
    textAlign(CENTER);
    text(skill.name, x + 40, y + 50);
  }
}

function selectSkill(state) {
  for (let i = 0; i < state.skillChoices.length; i++) {
    let skill = state.skillChoices[i];
    let x = state.canvasWidth / 2 - 150 + i * 100;
    let y = state.canvasHeight / 2 - 50;
    if (mouseX > x && mouseX < x + 80 && mouseY > y && mouseY < y + 100) {
      applySkill(skill);
      state.skillSelection = false;
      state.skillChoices = [];
      break;
    }
  }
}

export { generateSkillChoices, applySkill, drawSkillSelection, selectSkill };

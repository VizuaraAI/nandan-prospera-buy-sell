const navButtons = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".view");
const jumpButtons = document.querySelectorAll("[data-jump]");
const answerButtons = document.querySelectorAll("#answerGrid button");
const explanation = document.querySelector("#explanation");
const startSprint = document.querySelector("#startSprint");
const timer = document.querySelector("#timer");
const segmentedButtons = document.querySelectorAll(".segments button");

function showPanel(panelName) {
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === panelName));
  panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === panelName));
}

navButtons.forEach((button) => button.addEventListener("click", () => showPanel(button.dataset.view)));
jumpButtons.forEach((button) => button.addEventListener("click", () => showPanel(button.dataset.jump)));
segmentedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    segmentedButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    answerButtons.forEach((item) => item.classList.remove("correct", "wrong"));
    const isCorrect = button.dataset.correct === "true";
    button.classList.add(isCorrect ? "correct" : "wrong");
    document.querySelector('#answerGrid button[data-correct="true"]').classList.add("correct");
    explanation.textContent = isCorrect
      ? "Correct. Substitute x = y + 1 into 3x + 2y = 18, so 3(y + 1) + 2y = 18. That gives 5y = 15, y = 3, and x = 4."
      : "Close. Rewrite x - y = 1 as x = y + 1. Substitute that into the first equation, solve for y, then find x.";
  });
});

let sprintInterval;
startSprint.addEventListener("click", () => {
  showPanel("practice");
  clearInterval(sprintInterval);
  let seconds = 20 * 60;
  timer.textContent = "20:00";
  sprintInterval = setInterval(() => {
    seconds -= 1;
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    timer.textContent = `${minutes}:${remainingSeconds}`;
    if (seconds <= 0) {
      clearInterval(sprintInterval);
      timer.textContent = "Done";
    }
  }, 1000);
});

const canvas = document.querySelector("#meshCanvas");
const context = canvas.getContext("2d");
const nodes = Array.from({ length: 34 }, (_, index) => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.55,
  vy: (Math.random() - 0.5) * 0.55,
  r: index % 6 === 0 ? 4.8 : 3.1,
}));

function drawMesh() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "rgba(85, 214, 255, 0.34)");
  gradient.addColorStop(1, "rgba(86, 240, 184, 0.32)");
  nodes.forEach((node) => {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 20 || node.x > canvas.width - 20) node.vx *= -1;
    if (node.y < 20 || node.y > canvas.height - 20) node.vy *= -1;
  });
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 126) {
        context.strokeStyle = `rgba(85, 214, 255, ${1 - distance / 126})`;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }
  }
  nodes.forEach((node) => {
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    context.fill();
  });
  requestAnimationFrame(drawMesh);
}

drawMesh();

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentScene = 1;

// Game Variables
let score = 0;
let gameInterval;
let heartSpawnInterval;
let timeLeft = 15;
let gameActive = false;

// ==========================================
// SCENE NAVIGATION
// ==========================================
function goToScene(sceneNum) {
  // Hide all scenes completely
  document.querySelectorAll('.scene').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none'; 
  });
  
  // Show the target scene
  const targetScene = document.getElementById(`scene-${sceneNum}`);
  if (targetScene) {
    targetScene.classList.add('active');
    targetScene.style.display = 'block';
  } else {
    console.error(`Scene ${sceneNum} not found! Check your button onclick logic.`);
  }
  
  // Start game if entering scene 6
  if(sceneNum === 6) { 
    startGame(); 
  }
}

// ==========================================
// GAME LOGIC (SCENE 6)
// ==========================================
function startGame() {
  const gameArea = document.getElementById('game-area');
  
  if(!gameArea) return; // Prevent errors if game area is missing

  // Clear any existing hearts and hide end screen
  document.querySelectorAll('.falling-heart-anim').forEach(el => el.remove());
  document.getElementById('game-end-screen').style.display = 'none';
  document.getElementById('game-continue-btn').style.display = 'none';

  score = 0;
  timeLeft = 15;
  gameActive = true;
  document.getElementById('score-text').innerText = `Hearts caught: ${score}`;
  document.getElementById('timer-text').innerText = `0:${timeLeft}`;

  // Timer logic
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    timeLeft--;
    if(timeLeft <= 0) {
      endGame();
    } else {
      document.getElementById('timer-text').innerText = `0:${timeLeft < 10 ? '0'+timeLeft : timeLeft}`;
    }
  }, 1000);

  // Spawn hearts
  clearInterval(heartSpawnInterval);
  heartSpawnInterval = setInterval(() => {
    if(!gameActive) return;
    createHeart(gameArea);
  }, 450);
}

function createHeart(container) {
  const heart = document.createElement('div');
  const hearts = ['❤️', '💖', '💗'];
  heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
  heart.className = 'falling-heart-anim';
  
  heart.style.left = Math.random() * (container.clientWidth - 40) + 'px';
  
  const duration = Math.random() * 1.5 + 2.5; 
  heart.style.animationDuration = duration + 's';
  
  container.appendChild(heart);

  heart.addEventListener('pointerdown', (e) => {
    if(!gameActive) return;
    score++;
    document.getElementById('score-text').innerText = `Hearts caught: ${score}`;
    
    showPlusOne(e.clientX, e.clientY, container);
    heart.remove();
  });

  setTimeout(() => {
    if(document.body.contains(heart)) heart.remove();
  }, duration * 1000);
}

function showPlusOne(x, y, container) {
    const plus = document.createElement('div');
    plus.className = 'floating-plus-one';
    plus.innerText = '+1';
    
    const rect = container.getBoundingClientRect();
    plus.style.left = (x - rect.left - 10) + 'px';
    plus.style.top = (y - rect.top - 20) + 'px';
    
    container.appendChild(plus);
    
    setTimeout(() => {
      if(container.contains(plus)) plus.remove();
    }, 800);
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(heartSpawnInterval);
  document.getElementById('timer-text').innerText = "0:00";
  
  document.querySelectorAll('.falling-heart-anim').forEach(el => el.remove());
  
  document.getElementById('final-score-text').innerHTML = `You caught ${score} hearts &mdash; just like<br>every time you catch my heart.<br><br><span style="font-family: 'Caveat', cursive; font-size: 24px;">Nice catch!</span>`;
  document.getElementById('game-end-screen').style.display = 'flex';
  
  document.getElementById('game-continue-btn').style.display = 'block';
}

// ==========================================
// INITIALIZATION
// ==========================================
window.onload = () => {
    goToScene(1);
};

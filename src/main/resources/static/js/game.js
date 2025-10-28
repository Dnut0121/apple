class AppleGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.basket = document.getElementById('basket');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        this.appleInterval = null;
        this.apples = [];
        
        this.init();
    }
    
    init() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        this.gameArea.addEventListener('mousemove', (e) => this.moveBasket(e));
        this.gameArea.addEventListener('click', (e) => this.moveBasket(e));
        
        this.updateDisplay();
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            
            this.startAppleGeneration();
        }
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            
            if (this.gamePaused) {
                this.pauseBtn.textContent = '계속하기';
                this.pauseAppleGeneration();
            } else {
                this.pauseBtn.textContent = '일시정지';
                this.startAppleGeneration();
            }
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '일시정지';
        
        this.clearApples();
        this.pauseAppleGeneration();
        this.updateDisplay();
        
        // 게임 오버 화면 숨기기
        const gameOverScreen = document.querySelector('.game-over');
        if (gameOverScreen) {
            gameOverScreen.classList.add('hidden');
        }
    }
    
    startAppleGeneration() {
        if (this.appleInterval) {
            clearInterval(this.appleInterval);
        }
        
        const interval = Math.max(1000 - (this.level * 100), 300); // 레벨이 올라갈수록 빨라짐
        
        this.appleInterval = setInterval(() => {
            if (!this.gamePaused) {
                this.createApple();
            }
        }, interval);
    }
    
    pauseAppleGeneration() {
        if (this.appleInterval) {
            clearInterval(this.appleInterval);
            this.appleInterval = null;
        }
    }
    
    createApple() {
        const apple = document.createElement('div');
        apple.className = 'apple';
        
        // 랜덤한 x 위치
        const maxX = this.gameArea.offsetWidth - 30;
        const randomX = Math.random() * maxX;
        
        apple.style.left = randomX + 'px';
        apple.style.animationDuration = Math.max(2000 - (this.level * 200), 800) + 'ms'; // 레벨이 올라갈수록 빨라짐
        
        this.gameArea.appendChild(apple);
        this.apples.push(apple);
        
        // 사과가 바닥에 닿았을 때
        apple.addEventListener('animationend', () => {
            this.removeApple(apple);
            this.loseLife();
        });
        
        // 사과 클릭 이벤트
        apple.addEventListener('click', (e) => {
            e.stopPropagation();
            this.catchApple(apple);
        });
    }
    
    catchApple(apple) {
        this.score += 10;
        this.removeApple(apple);
        this.updateDisplay();
        
        // 레벨 업 체크
        if (this.score > 0 && this.score % 100 === 0) {
            this.levelUp();
        }
        
        // 사과 잡기 효과
        this.showCatchEffect(apple);
    }
    
    removeApple(apple) {
        const index = this.apples.indexOf(apple);
        if (index > -1) {
            this.apples.splice(index, 1);
        }
        if (apple.parentNode) {
            apple.parentNode.removeChild(apple);
        }
    }
    
    clearApples() {
        this.apples.forEach(apple => {
            if (apple.parentNode) {
                apple.parentNode.removeChild(apple);
            }
        });
        this.apples = [];
    }
    
    loseLife() {
        this.lives--;
        this.updateDisplay();
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    levelUp() {
        this.level++;
        this.updateDisplay();
        
        // 레벨 업 효과
        this.showLevelUpEffect();
    }
    
    gameOver() {
        this.gameRunning = false;
        this.pauseAppleGeneration();
        this.clearApples();
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        this.showGameOverScreen();
    }
    
    moveBasket(e) {
        if (this.gameRunning && !this.gamePaused) {
            const rect = this.gameArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const basketWidth = this.basket.offsetWidth;
            const maxX = this.gameArea.offsetWidth - basketWidth;
            
            let newX = x - basketWidth / 2;
            newX = Math.max(0, Math.min(newX, maxX));
            
            this.basket.style.left = newX + 'px';
        }
    }
    
    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        this.levelElement.textContent = this.level;
    }
    
    showCatchEffect(apple) {
        const effect = document.createElement('div');
        effect.style.position = 'absolute';
        effect.style.left = apple.style.left;
        effect.style.top = apple.style.top;
        effect.style.color = '#FFD700';
        effect.style.fontSize = '20px';
        effect.style.fontWeight = 'bold';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '100';
        effect.textContent = '+10';
        
        this.gameArea.appendChild(effect);
        
        // 애니메이션 효과
        effect.style.transition = 'all 0.5s ease';
        effect.style.transform = 'translateY(-30px)';
        effect.style.opacity = '0';
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 500);
    }
    
    showLevelUpEffect() {
        const effect = document.createElement('div');
        effect.style.position = 'absolute';
        effect.style.top = '50%';
        effect.style.left = '50%';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.color = '#FF6347';
        effect.style.fontSize = '30px';
        effect.style.fontWeight = 'bold';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '100';
        effect.textContent = `레벨 ${this.level}!`;
        
        this.gameArea.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }
    
    showGameOverScreen() {
        const gameOverScreen = document.createElement('div');
        gameOverScreen.className = 'game-over';
        
        gameOverScreen.innerHTML = `
            <div class="game-over-content">
                <h2>게임 오버!</h2>
                <p>최종 점수: ${this.score}</p>
                <p>최종 레벨: ${this.level}</p>
                <button class="btn" onclick="this.parentElement.parentElement.classList.add('hidden')">닫기</button>
            </div>
        `;
        
        document.body.appendChild(gameOverScreen);
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new AppleGame();
});

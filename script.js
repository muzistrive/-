const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const tileSize = 60; // 每个格子的大小
let map = [];
let player = { x: 0, y: 0 }; // 小松鼠的初始位置
let totalChestnuts = 0; // 地图上板栗的总数
let collectedChestnuts = 0; // 已收集的板栗数量
let timeLeft = 30; // 每关限时 30 秒
let timer;

// 初始化游戏
function initGame() {
    generateMap();
    drawMap();
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('close-popup').addEventListener('click', () => {
        document.getElementById('card-popup').classList.add('hidden');
    });
    document.getElementById('start-game').addEventListener('click', startGame);
}

// 开始游戏
function startGame() {
    document.getElementById('intro-popup').classList.add('hidden');
    resetGame();
    startTimer();
}

// 生成随机地图
function generateMap() {
    map = [];
    totalChestnuts = 0;
    for (let y = 0; y < 8; y++) {
        map[y] = [];
        for (let x = 0; x < 8; x++) {
            const tile = Math.random() < 0.2 ? '🌰' : ''; // 20% 的概率生成板栗
            if (tile === '🌰') totalChestnuts++;
            map[y][x] = tile;
        }
    }
    // 确保至少有一个板栗
    if (totalChestnuts === 0) {
        const x = Math.floor(Math.random() * 8);
        const y = Math.floor(Math.random() * 8);
        map[y][x] = '🌰';
        totalChestnuts++;
    }
    // 添加障碍物和狐狸
    map[3][3] = '🪨'; // 石头
    map[5][5] = '🦊'; // 狐狸
}

// 绘制地图
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial'; // 增大字体
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const tile = map[y][x];
            if (tile) {
                ctx.fillText(tile, x * tileSize + 20, y * tileSize + 40);
            }
        }
    }
    // 绘制小松鼠
    ctx.fillText('🐿️', player.x * tileSize + 20, player.y * tileSize + 40);
}

// 处理键盘事件
function handleKeyPress(event) {
    let newX = player.x;
    let newY = player.y;
    switch (event.key) {
        case 'ArrowUp': newY--; break;
        case 'ArrowDown': newY++; break;
        case 'ArrowLeft': newX--; break;
        case 'ArrowRight': newX++; break;
    }
    if (isValidMove(newX, newY)) {
        player.x = newX;
        player.y = newY;
        checkTile(newX, newY);
        drawMap();
    }
}

// 检查移动是否有效
function isValidMove(x, y) {
    if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false; // 超出地图
    if (map[y][x] === '🪨') return false; // 碰到石头
    return true;
}

// 检查当前格子的内容
function checkTile(x, y) {
    const tile = map[y][x];
    if (tile === '🌰') {
        collectedChestnuts++;
        map[y][x] = ''; // 移除板栗
        document.getElementById('score').textContent = `剩余板栗: ${totalChestnuts - collectedChestnuts}`;
        if (collectedChestnuts >= totalChestnuts) {
            clearInterval(timer);
            showCardPopup();
        }
    } else if (tile === '🦊') {
        clearInterval(timer);
        alert('被狐狸抓住了！游戏结束。');
        resetGame();
    }
}

// 显示卡片弹窗
function showCardPopup() {
    const card = getRandomCard();
    document.getElementById('card-title').textContent = card.title;
    document.getElementById('card-description').textContent = card.description;
    document.getElementById('card-popup').classList.remove('hidden');
}

// 随机获取一张卡片
function getRandomCard() {
    const cards = [
        { title: '板栗的历史', description: '板栗在中国已有2000多年的种植历史，是传统的健康食品。' },
        { title: '板栗的文化', description: '板栗在亚洲文化中象征着丰收和幸福。' },
        { title: '板栗的营养', description: '板栗富含维生素C和膳食纤维，有助于增强免疫力。' }
    ];
    return cards[Math.floor(Math.random() * cards.length)];
}

// 重置游戏
function resetGame() {
    player = { x: 0, y: 0 };
    collectedChestnuts = 0;
    timeLeft = 30;
    generateMap();
    document.getElementById('score').textContent = `剩余板栗: ${totalChestnuts}`;
    document.getElementById('timer').textContent = `剩余时间: ${timeLeft} 秒`;
    drawMap();
}

// 开始计时器
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `剩余时间: ${timeLeft} 秒`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('时间到！游戏结束。');
            resetGame();
        }
    }, 1000);
}

// 初始化游戏
initGame();
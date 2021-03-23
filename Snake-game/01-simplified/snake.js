let canvas = document.getElementById('main-canvas');
let ctx = canvas.getContext('2d');
let canvasHeight = canvas.clientHeight;
let canvasWidth = canvas.clientWidth;
let box = 10;
let snake = [];
let timerId;
let apple = [0, 40];
let appleCount = 0;

let directions = [
    [box, 0], // right
    [0, box], //down
    [(-1 * box), 0], // left
    [0, (-1 * box)] // up
];


let actDirection = directions[0];

// --------------------------- Print Table -----------------------------------------

function startGame() {

    const snakeBody = { widthP: box, heightP: 10 };
    snake.push(snakeBody);
    printTable();
    timerId = setInterval(moveSnake, 150);
};

startGame();

function printTable() {
    //board
    ctx.fillStyle = "#ADFF2F"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    //apple
    ctx.fillStyle = "red";
    ctx.fillRect(apple[0], apple[1], box, box);
    //snake
    ctx.fillStyle = "darkgreen";
    for (let key in snake) {
        ctx.fillRect(snake[key].widthP, snake[key].heightP, 10, 10);
    }
}
printTable();

// -------------------------- Move snake, move!! -------------------------------


function moveSnake() {

    let headOfSnake = snake[snake.length - 1];
    let newHeadPosition = ([headOfSnake.widthP + actDirection[0], headOfSnake.heightP + actDirection[1]]);
    const newBody = {
        widthP: newHeadPosition[0],
        heightP: newHeadPosition[1]
    };
    snake.push(newBody);
    snake.shift();
    printTable();
    hasCollision();
    checkEating();
}

window.addEventListener('keydown', (event) => {
    if (event.code === "ArrowDown") {
        event.preventDefault();
        actDirection = directions[1];
    }
    if (event.code === "ArrowUp") {
        event.preventDefault();
        actDirection = directions[3];
    }
    if (event.code === "ArrowRight") {
        event.preventDefault();
        actDirection = directions[0];
    }
    if (event.code === "ArrowLeft") {
        event.preventDefault();
        actDirection = directions[2];
    }
});

// ---------------------------------------- Eating ----------------------------------

function checkEating() {
    let headOfSnake = snake[snake.length - 1];
    if (headOfSnake.widthP === apple[0] && headOfSnake.heightP === apple[1]) {
        const newBodyPart = {
            widthP: apple[0],
            heightP: apple[1]
        };
        snake.push(newBodyPart);
        apple = [Math.floor(Math.random() * (canvasWidth / 10)) * 10, Math.floor(Math.random() * (canvasHeight / 10)) * 10];
        appleCount++;
    }
};

// ----------------------------------- Collision ---------------------------------

function hasCollision() {
    let headOfSnake = snake[snake.length - 1];
    if (headOfSnake.widthP >= canvasWidth || headOfSnake.heightP >= canvasHeight || headOfSnake.widthP < 0 || headOfSnake.heightP < 0) {
        clearInterval(timerId);
        alert('Game Over! Score: ' + appleCount);
    }

    for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i].widthP === headOfSnake.widthP && snake[i].heightP === headOfSnake.heightP) {
            clearInterval(timerId);
            alert('Game Over! Score: ' + appleCount);
        }
    }
};

// ----------------------------------- GAME OVER -------------------------------------
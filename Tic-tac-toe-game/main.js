let boxes = document.getElementsByClassName("box");
let winnerText = document.getElementById("winnerPlayerText");
let winnerBox = document.getElementById("winner-box");
let newGameButton = document.getElementById("new-game");
let playerOnePointsText = document.getElementById("playerOnePoints");
let playerTwoPointsText = document.getElementById("playerTwoPoints");
let turnText = document.getElementById("turn")

let playerOneTurn = true;
let playerTwoTurn = false;
let playerOneWin = false;
let playerTwoWin = false;
let playerOneBoxes = [];
let playerTwoBoxes = [];
let playerOneScore = 0;
let playerTwoScore = 0;
let usedBoxes = 0;

let winningOptions = [
    [1, 2, 3],
    [2, 3, 4],
    [1, 5, 9],
    [5, 9, 13],
    [2, 6, 10],
    [6, 10, 14],
    [3, 7, 11],
    [7, 11, 15],
    [4, 8, 12],
    [8, 12, 16],
    [5, 6, 7],
    [6, 7, 8],
    [9, 10, 11],
    [10, 11, 12],
    [13, 14, 15],
    [14, 15, 16],
    [1, 6, 11],
    [6, 11, 16],
    [13, 10, 7],
    [10, 7, 4],
    [5, 10, 15],
    [9, 6, 3],
    [14, 11, 8],
    [2, 7, 12]
];

switchTurns = () => {
    playerTwoTurn = !playerTwoTurn;
    playerOneTurn = !playerOneTurn;
    if (playerOneTurn) {
        turnText.innerText = "Next player: O"
    } else {
        turnText.innerText = "Next player: X"
    }

};

resetTable = () => {
    winnerBox.classList.remove("winner-box");
    winnerText.innerText = "";
    playerOneBoxes = [];
    playerTwoBoxes = [];
    playerOneWin = false;
    playerTwoWin = false;
    usedBoxes = 0;
    for (let index in boxes) {
        boxes[index].innerText = "";
    }
    newGameButton.style.display = "none";

};


startGame = () => {
    resetTable();
    for (let index in boxes) {
        boxes[index].onclick = function() {
            switchTurns();
            if (playerOneTurn) {
                boxes[index].innerText = "X";
                playerOneBoxes.push(Number(boxes[index].dataset.number));
                usedBoxes++;
                checkIfWin();


            } else if (playerTwoTurn) {
                boxes[index].innerText = "O";
                playerTwoBoxes.push(Number(boxes[index].dataset.number));
                usedBoxes++;
                checkIfWin();
            }

            if (boxes[index].innerText == "O" || "X") {
                boxes[index].classList.add("disabled");
            } else if (boxes[index].innerHTML == "") {
                boxes[index].classList.remove("disabled");
            }
        };
    }
};

startGame();

checkIfWin = () => {
    for (let winningOption of winningOptions) {
        if (winningOption.every((boxes) => playerTwoBoxes.includes(boxes))) {
            endGame();
            playerOneWin = true;
            winnerText.innerText = "Player One Wins the Game!";
            countPoints();
        }
        if (winningOption.every((boxes) => playerOneBoxes.includes(boxes))) {
            endGame();
            playerTwoWin = true;
            winnerText.innerText = "Player Two Wins the Game!";
            countPoints();
        }

        if (usedBoxes == 16) {
            endGame();
            winnerText.innerText = "Draw";
        }
    }
};



endGame = () => {

    winnerBox.classList.add("winner-box");
    newGameButton.style.display = "block";
};

countPoints = () => {
    if (playerOneWin) {
        playerOneScore++;
        playerOnePointsText.innerText = playerOneScore;
    }
    if (playerTwoWin) {
        playerTwoScore++;
        playerTwoPointsText.innerText = playerTwoScore;
    }
};

newGameButton.onclick = function() {
    resetTable();
    startGame();
    for (let box of boxes) {
        box.classList.remove("disabled");
    }
};
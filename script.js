const shadow = document.getElementById("shadow");
const ChangeNamesForm = document.getElementById("ChangeNames");
const inputP1 = document.getElementById("playerOne");
const inputP2 = document.getElementById("playerTwo");
const saveBtn = document.getElementById("saveBtn");
const editBtn = document.getElementById("editBtn");
const startBtn =document.getElementById("startBtn");
const turnDisplayer = document.getElementById("turns");
const gameboardDisplayer = document.getElementById("gameboard");
const gameoverDisplayer = document.getElementById("GameOver");
const winnerDisplayer = document.getElementById("winner");
const restartBtn = document.getElementById("restartBtn");

const GameBoard = ( () => {
    let board = ["","","","","","","","",""];

    const render = () => {
        gameboardDisplayer.replaceChildren();
        if (Game.getGameStarted()) {
            board.forEach((item,index) => {
                const cell = document.createElement("div");
                cell.innerText = item ;
                cell.id = index;
                if (item == "") {
                    cell.classList.add("cell");
                    cell.addEventListener("click",Game.handleclick);
                }else if (item == "X") {
                    cell.classList.add("cell","blocked","red");
                }else {
                    cell.classList.add("cell","blocked","blue");
                }
                gameboardDisplayer.appendChild(cell);
            });
        }
        
    }

    const updateGameboard = (index, value) => {
        board[index] = value;
        render();
    }

    const getGameboard = () => {
        return board ;
    }

    return {
        render, updateGameboard, getGameboard
    }
})();

const Game = (() => {
    let players = [
        {
            name: "Player One",
            mark: "X",
            color: "red"
        },
        {
            name: "Player Two",
            mark: "O",
            color: "blue"
        }
    ];
    let currentPlayerIndex;
    let gameStarted = false ;

    const start = () => {
        currentPlayerIndex = 0;
        gameStarted = true;
        for (let i=0; i<9; i++) {
            GameBoard.updateGameboard(i,"");
        } 
        displayTurns();
        GameBoard.render();
        restartBtn.classList.remove("hidden");
    }

    const restart = () => {
        currentPlayerIndex = 0;
        gameStarted = true;
        for (let i=0; i<9; i++) {
            GameBoard.updateGameboard(i,"");
        } 
        displayTurns();
    }

    const displayTurns = () => {
        turnDisplayer.replaceChildren();
        if (!gameStarted) {
            const span1 = document.createElement("span");
            span1.innerText = players[0].name;
            span1.classList.add(players[0].color);
            turnDisplayer.appendChild(span1);
            
            turnDisplayer.innerHTML += "   vs   ";

            const span2 = document.createElement("span");
            span2.innerText = players[1].name;
            span2.classList.add(players[1].color);
            turnDisplayer.appendChild(span2);
        } else {
            const span = document.createElement("span");
            span.innerText = players[currentPlayerIndex].name;
            span.classList.add(players[currentPlayerIndex].color);
            turnDisplayer.appendChild(span);

            turnDisplayer.innerHTML += "'s turn";
        }
    }

    const changePlayersName = (index, value) => {
        players[index].name = value;
    }

    const checkForWin = (board) => {
        const winningCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];

        for (let i=0; i< winningCombinations.length;i++) {
            const [a,b,c] = winningCombinations[i];
            if (board[a] && board[a] == board[b] && board[b] == board[c])
                return true ;
        }
        return false;
    }

    const checkForTie = (board) => {
      const newBoard = board.filter(cell => cell == "");
      return newBoard.length ? false : true ;
    }

    const displayGameOver = (messages,color) => {
        winnerDisplayer.replaceChildren();
        if (messages[0] !== "") {
            const span = document.createElement("span");
            span.innerText = messages[0];
            span.className = color;
            winnerDisplayer.appendChild(span);
        }

        winnerDisplayer.innerHTML += messages[1];
        gameoverDisplayer.classList.remove("hidden");
        shadow.classList.remove("hidden");

        setTimeout(() => {
            gameoverDisplayer.classList.add("hidden");
            shadow.classList.add("hidden");
            restartBtn.classList.add("hidden");
            GameBoard.render();
        },2000);

    }

    const handleclick = (event) => {
        const index = parseInt(event.target.id);
        GameBoard.updateGameboard(index, players[currentPlayerIndex].mark);

        if (checkForWin(GameBoard.getGameboard())) {
            gameStarted = false;
            displayGameOver([players[currentPlayerIndex].name,"won!"],players[currentPlayerIndex].color);
        } else if (checkForTie(GameBoard.getGameboard())) {
            gameStarted = false;
            displayGameOver(["","It's a tie!"],"");
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0 ;
        displayTurns();
    }

    const getGameStarted = () => {
        return gameStarted;
    }

    return {
        start, restart, displayTurns, changePlayersName, handleclick, getGameStarted
    }
})();

editBtn.addEventListener("click", () => {
    ChangeNamesForm.classList.remove("hidden");
    shadow.classList.remove("hidden");
})

saveBtn.addEventListener("click", () => {
    event.preventDefault();
    const p1 = inputP1.value.trim();
    const p2 = inputP2.value.trim();

    p1 && Game.changePlayersName(0, p1);
    p2 && Game.changePlayersName(1, p2);
    Game.displayTurns();

    inputP1.value = "";
    inputP2.value = "";
    ChangeNamesForm.classList.add("hidden");
    shadow.classList.add("hidden");
});

startBtn.addEventListener("click", () => {
    Game.start();
})

restartBtn.addEventListener("click", () => {
    Game.restart();
})


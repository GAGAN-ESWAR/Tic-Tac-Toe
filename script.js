/*
** The Gameboard represents the state of the board
** Each square holds a Cell (defined later)
*/

function gameboard() {
    let rows = 3;
    let columns= 3;
    let board = [];

    // Create a 2d array that will represent the state of the game board
    // For this 2d array, row 0 will represent the top row and
    // column 0 will represent the left-most column.
    // This nested-loop technique is a simple and common way to create a 2d array.
    for(let i=0;i<rows;i++){
        board[i]=[];
        for(let j=0;j<columns;j++){
            board[i].push(cell());
        }
    }

    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;

    // In order to change value of cell, we need to find what the 
    // selected cell is containing, *then* change that cell's value 
    // to the player value.
    const changevalue = (row,column,playerValue) => {
        if(board[row][column].getValue() !== " ") return;
        board[row][column].addValue(playerValue);
    };

    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = ()=>{
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
    }

    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return {
        getBoard,
        changevalue,
        printBoard
    };
}

/*
** A Cell represents one "square" on the board and can have one of
** " ": no token is in the square,
** "x": Player One's token,
** "o": Player 2's token
*/

function cell() {
    let value = " ";

    // Accept a player's token to change the value of the cell
    const addValue = (playerValue)=>{
        value = playerValue;
    };

    // How we will retrieve the current value of this cell through closure
    const getValue = ()=>value;

    return {
        addValue,
        getValue
    };
}

/* 
** The GameController will be responsible for controlling the 
** flow and state of the game's turns, as well as whether
** anybody has won the game
*/

function gameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
)   {
    const board = gameboard();

    const players = [
        {
            name: playerOneName,
            value:"x"
        },
        {
            name: playerTwoName,
            value: "o"
        }
    ];

    let activePlayer = players[0];
    let winner = null;

    const switchPlayer = ()=>{
        activePlayer = activePlayer === players[0]?players[1]:players[0];
    };

    const getActivePlayer = ()=> activePlayer;

    const printNewRound = ()=>{
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const checkWinner = () => {
        const b = board.getBoard().map(row => row.map(cell => cell.getValue()));

        // rows
        for (let i = 0; i < 3; i++) {
            if (b[i][0] !== " " && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0];
        }
        // cols
        for (let j = 0; j < 3; j++) {
            if (b[0][j] !== " " && b[0][j] === b[1][j] && b[1][j] === b[2][j]) return b[0][j];
        }
        // diagonals
        if (b[0][0] !== " " && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0];
        if (b[0][2] !== " " && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2];

        // draw check
        if (b.every(row => row.every(cell => cell !== " "))) return "draw";

        return null;
    };

    const playRound =(row,column)=>{
        if(winner) return;

        board.changevalue(row,column,getActivePlayer().value)

         // check if move ended the game
        winner = checkWinner();
        if (!winner) switchPlayer();

        // printNewRound();
    };

    return {
        playRound,
        getActivePlayer,
        getBoard : board.getBoard,
        getWinner: () => winner,
        isOver: () => winner !== null
    };
}

function screenController() {
    const game = gameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = ()=>{
        // clear the board
        boardDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        if (game.isOver()) {
            const winner = game.getWinner();
            if (winner === "draw") {
                playerTurnDiv.textContent = "It's a draw! 🤝";
            } else {
                playerTurnDiv.textContent = `${winner === "x" ? "Player One" : "Player Two"} wins! 🎉`;
            }
        } 
        else {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        }

        // Render board squares
        board.forEach((row,indexRow) => {
            row.forEach((cell,indexCol) => {
                // Anything clickable should be a button!!
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                // Create a data attribute to identify the column and row
                // This makes it easier to pass into our `playRound` function
                cellButton.dataset.column = indexCol;
                cellButton.dataset.row = indexRow;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    };

    // Add event listener for the board
    function clickHandlerBoard (e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if(!selectedColumn) return;

        game.playRound(selectedRow,selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener("click",clickHandlerBoard);

    // Initial render
    updateScreen();

    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

screenController();
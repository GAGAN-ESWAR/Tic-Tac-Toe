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

    const switchPlayer = ()=>{
        activePlayer = activePlayer === players[0]?players[1]:players[0];
    };

    const getActivePlayer = ()=> activePlayer;

    const printNewRound = ()=>{
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const playRound =(row,column)=>{
        board.changevalue(row,column,getActivePlayer().value)

        /*  This is where we would check for a winner and handle that logic,
        such as a win message. */

        // Switch player turn
        switchPlayer();
        printNewRound();
    };

    return {
        playRound,
        getActivePlayer
    };
}

const game = gameController();
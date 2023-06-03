const statusText = document.querySelector(".status");
const restartBtn = document.querySelector(".restart-Btn");
const streakLine = document.querySelector(".streakLine");
const cellBoxs = document.querySelectorAll(".cell-box");

let turnCount = 0;  // count the times clicked on empty cell  
let currentPlayer = 'X';  // current player sign 'X' or 'O' 
let gameStatus = "Playing";  // current gameStatus 
let options = ['', '', '', '', '', '', '', '', ''];  // values at each cell 

// all cells index where winning condition is true 
let winConditions = [  
    [0, 1, 2],  // 3 => total 
    [0, 3, 6],  // 9
    [0, 4, 8],  // 12
    [1, 4, 7],  // 12
    [2, 4, 6],  // 12
    [3, 4, 5],  // 12
    [2, 5, 8],  // 15
    [6, 7, 8]   // 21
];

statusText.textContent = `${currentPlayer}'s Turn`;

// check for click on box and perform the opeations 
cellBoxs.forEach((cellBox) => {
    cellBox.addEventListener("click", () => {

        // check the cell is empty or not 
        if(checkCellBox(cellBox))
        {
            turnCount++;  // increase the played count 
            if(!checkWinner())  // check the player won  
            {
                // update player sign and status text 
                changePlayer();
                statusText.textContent = `${currentPlayer}'s Turn`;

                checkDraw();  // check for the draw condition 
            }
        }
    });
});

// update current player and their signs 
const changePlayer = () => {
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
}

// if the box already contain a value prevent it from updating (return false)
// else add the value/sign of current player (return true) 
const checkCellBox = (cellBox) => {

    if(options[cellBox.getAttribute("cellIndex")] !== '' || gameStatus !== "Playing")
        return false;
    
    // if the cell is empty, change the textColor and add the currentPlayer sign to the cell 
    cellBox.style.color = (currentPlayer === 'X') ? "red" : "#12f821";
    cellBox.textContent = currentPlayer;

    // update the cellIndex value in "options" array 
    options[cellBox.getAttribute("cellIndex")] = currentPlayer;
    return true;
}

// check for the winning condition return boolean 
const checkWinner = () => {
  
    for(let i = 0; i < winConditions.length; i++)
    {
        // select one sub-array from the 2D array (winConditions) and disturbute its 3 values to each variables 
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        // if any of the cells is empty, skip 
        if(cellA === '' || cellB === '' || cellC === '')
            continue;
        
        // if all the 3 cells have same value, its win! 
        if(cellA === cellB && cellB === cellC)
        {
            // change gameStatus & statusText 
            gameStatus = "End";
            statusText.textContent = `${currentPlayer} Won!`;

            // draw the winning streak line 
            streakLine.id = drawWinningLine(condition);
            streakLine.classList.add("drawStreakLine");
            return true;
        }
    }
    return false;
}

// draw the winning line by assigning the correct ID, return idName 
const drawWinningLine = (points) => {
    
    let total = 0;
    let idName;
    
    // sum the 3 indexs of winning condition 
    for(let num of points)
        total += num;
    
    // assign the ID as per the total 
    switch(total)
    {
        case 3:
            idName = "firstRow";
            break;
        case 9:
            idName = "firstColumn";
            break;
        case 12:
            // there are 4 cases for the total of 12 
            // each has different value at there [0] index 
            idName = validateTwelve(points[0]);
            break;
        case 15:
            idName = "thirdColumn";
            break;
        case 21:
            idName = "thirdRow";
            break;
        default:
            return null;
    }

    return idName;
}

// return the corrent ID as per there [0] index value 
const validateTwelve = (number) => {

    switch(number)
    {   
        case 0:
            return "leftDiagonal";
        case 1:
            return "secondCloumn";
        case 2:
            return "rightDiagonal";
        case 3:
            return "secondRow";
        default:
            return null;
    }
}

// if player turnCount reaches value 9 it means all CELLS are filled and no one won 
const checkDraw = () => {
    if(turnCount === 9)
    {
        // change gameStatus & statusText 
        gameStatus = "Draw";
        // using setHTML method is more safe and support the basic formatting, also santizies the input 
        statusText.setHTML("Game Tie! <br> Click the restart button below.");
    }
}

// Game Restart Button event - reset all varibales 
restartBtn.addEventListener("click", () => {

    // erase the streakLine and remove ID, classes 
    streakLine.id = '';
    streakLine.classList.remove("drawStreakLine");

    turnCount = 0;
    gameStatus = "Playing";
    currentPlayer = 'X';

    // erase the "options" array values and content of Cells 
    options = options.map(() => option = '');
    cellBoxs.forEach((cellBox) => cellBox.textContent = null);

    statusText.textContent = `${currentPlayer}'s Turn`;
});

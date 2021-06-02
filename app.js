let canvas;
let context;
let gameBoardHeight = 20;
let gameBoardWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;
let winOrLose = 'Playing';
let tetrisLogo;

let coordinateArray = [...Array(gameBoardHeight)].map(e => Array(gameBoardWidth).fill(0));

let currentTetrimino = [[1,0],[0,1],[1,1],[2,1]];
let currentTetriminoColor;

let tetrominos = [];
let tetrominoColors = ['purple','cyan','blue','yellow','orange','green','red'];

let gameBoardArray = [...Array(gameBoardHeight)].map(e => Array(gameBoardWidth).fill(0));

let stoppedShapeArray = [...Array(gameBoardHeight)].map(e => Array(gameBoardWidth).fill(0));

let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};

let direction;

class Coordinates {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

document.addEventListener("DOMContentLoaded", setupCanvas);

function createCoordinateArray() {
    let i = 0;
    let j = 0;

    for(let y = 9;y <= 446;y+=23) {
        for(let x = 11;x <= 264;x+=23) {
            coordinateArray[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}

function setupCanvas() {
    canvas = document.getElementById('my_canvas');
    context = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    context.scale(2,2);

    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height);

    context.strokeStyle = 'black';
    context.strokeRect(8,8,280,462);

    tetrisLogo = new Image(161, 54);
    tetrisLogo.onload = drawTetrisLogo;
    tetrisLogo.src = "index.jpg";

    context.fillStyle = 'black';
    context.font = '21px Arial';

    context.fillText("SCORE", 300, 98);
    context.strokeRect(300, 107, 161, 24);
    context.fillText(score.toString(), 310, 127);
    
    context.fillText("LEVEL", 300, 157);
    context.strokeRect(300, 171, 161, 24);
    context.fillText(level.toString(), 310, 190);
 
    context.fillText("WIN / LOSE", 300, 221);
    context.fillText(winOrLose, 310, 261);
    context.strokeRect(300, 232, 161, 95);
    
    context.fillText("CONTROLS", 300, 354);
    context.strokeRect(300, 366, 161, 104);
    context.font = '19px Arial';
    context.fillText("A : Move Left", 310, 388);
    context.fillText("D : Move Right", 310, 413);
    context.fillText("S : Move Down", 310, 438);
    context.fillText("E : Rotate Right", 310, 463);

    document.addEventListener('keydown',handleKeyPressed);
    createTetrominos();
    createTetromino();

    createCoordinateArray();
    drawTetrimino();
}

function drawTetrisLogo(){
    context.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function createTetrominos() {
    tetrominos.push([[1,0],[0,1],[1,1],[2,1]]);
    tetrominos.push([[0,0],[1,0],[2,0],[3,0]]);
    tetrominos.push([[1,0],[2,0],[0,1],[1,1]]);
    tetrominos.push([[0,0],[0,1],[1,0],[1,1]]);
    tetrominos.push([[2,0],[0,1],[1,1],[2,1]]);
    tetrominos.push([[0,0],[0,1],[1,1],[2,1]]);
    tetrominos.push([[0,0],[1,0],[1,1],[2,1]]);
}

function createTetromino() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);

    currentTetrimino = tetrominos[randomTetromino];

    currentTetriminoColor = tetrominoColors[randomTetromino];
}

function drawTetrimino() {
    for(let i = 0;i<currentTetrimino.length;i++) {
        let x = currentTetrimino[i][0] + startX;
        let y = currentTetrimino[i][1] + startY;
        
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        context.fillStyle = currentTetriminoColor;
        context.fillRect(coorX,coorY,21,21);
    }
}

function deleteTetromino() {
    for(let i = 0;i<currentTetrimino.length;i++) {
        let x = currentTetrimino[i][0] + startX;
        let y = currentTetrimino[i][1] + startY;

        gameBoardArray[x][y] = 0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        context.fillStyle = 'white';
        context.fillRect(coorX,coorY,21,21);

    }
}

function hittingWalls() {
    for(let i = 0; i < currentTetrimino.length; i++){
        let newX = currentTetrimino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT) {
            return true;
        }else if(newX >= 11 && direction === DIRECTION.RIGHT) {
            return true;
        }
    }
    return false;
}

function handleKeyPressed(key) {
    if(winOrLose != "Game Over") {
        if(key.keyCode === 65) {
            direction = DIRECTION.LEFT;
            if(!hittingWalls() && !checkForHorizontalCollision()) {
                deleteTetromino();
                startX--;
                drawTetrimino();
            }
        } else if(key.keyCode === 68) {
            direction = DIRECTION.RIGHT;
            if(!hittingWalls() && !checkForHorizontalCollision()) {
                deleteTetromino();
                startX++;
                drawTetrimino();
            }
        }else if(key.keyCode === 83) {
            moveTetrominoDown();
        }else if(key.keyCode === 69) {
            RotateTetromino();
        }
    }
}

function moveTetrominoDown() {
    direction = DIRECTION.DOWN;
    if(!checkForVerticalCollision()) {
        deleteTetromino();
        startY++;
        drawTetrimino();
    }
}

window.setInterval(function() {
    if(winOrLose != "Game Over") {
        moveTetrominoDown();
    }
},1000);

function checkForVerticalCollision() {
    let tempTetromino = currentTetrimino;
    let collision = false;

    for(let i = 0;i<tempTetromino.length;i++) {
        let sq = tempTetromino[i];
        let x = sq[0] + startX;
        let y = sq[1] + startY;

        if(direction === DIRECTION.DOWN) {
            y++;
        }
        if(typeof stoppedShapeArray[x][y+1] === 'string') {
            deleteTetromino();
            startY++;
            drawTetrimino();
            collision = true;
            break;
        }
        if(y >= 20) {
                collision = true;
                break;
        }
    }

    if(collision) {
        if(startY <= 2) {
            winOrLose = "Game Over";
            context.fillStyle = 'white';
            context.fillRect(310,242,140,30);
            context.fillStyle = 'black';
            context.fillText(winOrLose,310,261);
        }else {
            for(let i = 0;i<tempTetromino.length;i++) {
                let sq = tempTetromino[i];
                let x = sq[0] + startX;
                let y = sq[1] + startY;
                stoppedShapeArray[x][y] = currentTetriminoColor;
            }
            checkForCompletedRows();
            createTetromino();
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            drawTetrimino();
        }
    }       
}

function checkForHorizontalCollision() {
    let tempTetromino = currentTetrimino;
    let collision = false;

    for(let i = 0;i<tempTetromino.length;i++) {
        let sq = tempTetromino[i];
        let x = sq[0] + startX;
        let y = sq[1] + startY;

        if(direction === DIRECTION.LEFT) {
            x--;
        }else if(direction === DIRECTION.RIGHT) {
            x++;
        }

        let stoppedShapeValue = stoppedShapeArray[x][y];
        if(typeof stoppedShapeValue === 'string') {
            collision = true;
            break;
        }
    }

    return collision;
}

function checkForCompletedRows() {
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    for(let y = 0;y<gameBoardHeight;y++) {
        let completed = true;

        for(let x = 0;x<gameBoardWidth;x++) {
            let sq = stoppedShapeArray[x][y];
            if(sq === 0 || (typeof sq === 'undefined')) {
                completed = false;
                break;
            }
        }

        if(completed) {
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            for(let i = 0;i<gameBoardWidth;i++) {
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;

                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;

                context.fillStyle = 'white';
                context.fillRect(coorX,coorY,21,21);
            }
        }
    }

    if(rowsToDelete > 0) {
        score += 10;
        context.fillStyle = 'white';
        context.fillRect(310, 109, 140, 19);
        context.fillStyle = 'black';
        context.fillText(score.toString(), 310, 127);
        moveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

function moveAllRowsDown(rowsToDelete, startOfDeletion){
    console.error("I am Here")
    for (var i = startOfDeletion-1; i >= 0; i--)
    {
        for(var x = 0; x < gameBoardWidth; x++)
        {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];
 
            if (typeof square === 'string')
            {
                nextSquare = square;
                gameBoardArray[x][y2] = 1; // Put block into GBA
                stoppedShapeArray[x][y2] = square; // Draw color into stopped
 
                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                context.fillStyle = nextSquare;
                context.fillRect(coorX, coorY, 21, 21);
 
                square = 0;
                gameBoardArray[x][i] = 0; // Clear the spot in GBA
                stoppedShapeArray[x][i] = 0; // Clear the spot in SSA
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                context.fillStyle = 'white';
                context.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

function RotateTetromino()
{
    let newRotation = new Array();
    let tetrominoCopy = currentTetrimino;
    let curTetrominoBU;
 
    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        curTetrominoBU = [...currentTetrimino];
 
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    deleteTetromino();
 
    try{
        currentTetrimino = newRotation;
        drawTetromino();
    }
    catch (e){ 
        if(e instanceof TypeError) {
            currentTetrimino = curTetrominoBU;
            deleteTetromino();
            drawTetromino();
        }
    }
}

function GetLastSquareX()
{
    let lastX = 0;
     for(let i = 0; i < currentTetrimino.length; i++)
    {
        let square = currentTetrimino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}


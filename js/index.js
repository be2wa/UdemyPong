let canvas;
let canvasContext;
let ballX = 5;
let ballY = 5;
let ballSpeedX = 10;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;

let showingWinScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

const calculateMousePos = e => {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    let mouseX = e.clientX - rect.left - root.scrollLeft;
    let mouseY = e.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}

const handleMouseClick = () => {
    if(showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    
    const framesPerSecond = 60;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);
    
    canvas.addEventListener('mousedown', handleMouseClick);
    
    canvas.addEventListener('mousemove', 
        function(e){
            const mousePos = calculateMousePos(e);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    });
}

ballReset = () => {
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }
    
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

computerMovement = () => {
    const paddle2YCenter = paddle2Y+(PADDLE_HEIGHT/2);
    if(paddle2YCenter < ballY-35) {
        paddle2Y += 6;
    } else if(paddle2YCenter > ballY+35) {
        paddle2Y -= 6;
    }
}

moveEverything = () => {
    if(showingWinScreen) {
        return;
    }
    
    computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    if(ballX <= PADDLE_THICKNESS) {
        if (ballY > paddle1Y &&
            ballY < paddle1Y+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            
            const deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++; // must be BEFORE ballReset()
            ballReset();
        }
    }
    if (ballX >= canvas.width - PADDLE_THICKNESS) {
        if (ballY > paddle2Y &&
            ballY < paddle2Y+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            const deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player1Score++;
            ballReset();
        }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

drawNet = () => {
    for(var i = 10; i < canvas.height; i += 40) {
        colorRect(canvas.width/2-1, i, 2, 20, '#E5E5D9');
    }
}

drawEverything = () => {
    // black screen
    colorRect(0, 0, canvas.width, canvas.height, '#121211');
    
    if(showingWinScreen) {
        canvasContext.fillStyle = '#E5E5D9';
        canvasContext.font = '20px sans-serif';
        canvasContext.textAlign = 'center';
        
        if(player1Score >= WINNING_SCORE) {
            canvasContext.fillText('Left Player Won!', canvas.width / 2, canvas.height / 2 - 25);
        } else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText('Right Player Won!', canvas.width / 2, canvas.height / 2 - 25);
        }
        canvasContext.font = '16px sans-serif';
        canvasContext.fillText('click to continue', canvas.width / 2, canvas.height / 2 + 25);
        return;
    }
    
    drawNet();
    
    // left paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, '#E5E5D9');
    
    // right paddle
    colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, '#E5E5D9');
    
    // ball
    colorCircle(ballX, ballY, 10, '#E5E5D9');
    
    // player1 score
    canvasContext.font = '14px sans-serif';
    canvasContext.fillText(player1Score, 50, 50);
    
    // player2 score
    canvasContext.fillText(player2Score, canvas.width-50, 50);
}

colorCircle = (centerX, centerY, radius, drawColor) => {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

colorRect = (leftX, topY, width, height, drawColor) => {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}
let canvas = document.querySelector('#pong-board');
let context = canvas.getContext('2d');
let ballX = 50;
let ballSpeedX = 10;
let ballY = 50;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;

let paddle1Y = 50;
let paddle2Y = 50;
const paddleHeight = 100;
const paddleThickness = 10;

const winScore = 7;
let showingWinScreen = false;

function calcMousePos(e) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = e.clientX - rect.left - root.scrollLeft;
    let mouseY = e.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function computerMovement() {
    const centerOfPaddle2 = paddle2Y + (paddleHeight / 2);

    if (centerOfPaddle2 < ballY - 35) {
        paddle2Y += 6;
    } else if (centerOfPaddle2 > ballY + 35) {
        paddle2Y -= 6;
    }
}

function moveStuff() {
    if (showingWinScreen) {
        return;
    }

    computerMovement();

    if (ballX + 10 === canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;

            let deltaY = ballY - (paddle2Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;

        } else {
            player1Score++;
            resetBall();
        }
    }
    else if (ballX === 0 && ballSpeedX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
            ballSpeedX = Math.abs(ballSpeedX);

            let deltaY = ballY - (paddle1Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++;
            resetBall();
        }
    }
    if (ballY + 10 === canvas.height && ballSpeedY > 0) {
        ballSpeedY = -ballSpeedY;
    }
    else if (ballY === 0 && ballSpeedY < 0) {
        ballSpeedY = Math.abs(ballSpeedY);
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width/2 - 1, i, 2, 20, 'white'); 
    }
}

function drawCanvas() {
    // canvas background and paddles
    colorRect(0, 0, canvas.width, canvas.height, 'black'); // 0 0 is the x and y pos of top left corner of rect (from top left of window)
    if (showingWinScreen) {
        context.fillStyle = 'white';
        if (player1Score === winScore) {
            context.fillText("Left Player Won!", 350, 200);
        } else if (player2Score === winScore) {
            context.fillText("Right Player Won!", 350, 200);
        }
        context.fillText("Click to continue", 350, 500);
        return;
    }
    colorRect(0, paddle1Y, paddleThickness, paddleHeight, 'white'); // left player paddle

    // right computer paddle
    colorRect(canvas.width - paddleThickness, paddle2Y, paddleThickness, 100, 'white');

    drawNet();

    // drawing ball
    colorCircle(ballX, ballY, 10, 'white');

    // scores
    context.fillText(player1Score, 100, 100);
    context.fillText(player2Score, canvas.width - 100, 100);

}

function colorCircle(centerX, centerY, radius, drawColor) {
    context.fillStyle = drawColor;
    context.beginPath();
    context.arc(centerX, centerY, 10, 0, Math.PI * 2, true); // first 2 args x and y pos, 3rd is radius 10px
    context.fill();

}

function colorRect(leftX, topY, width, height, drawColor) {
    context.fillStyle = drawColor;
    context.fillRect(leftX, topY, width, height);
}

function resetBall() {
 
    if (player1Score === winScore || player2Score === winScore) {
        showingWinScreen = true;
    }
   
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;

}

window.onload = () => {
    const fps = 30;
    setInterval(() => {
        drawCanvas();
        moveStuff();
    }, 1000 / fps);

    canvas.addEventListener('mousedown', () => {
        if (showingWinScreen) {
            player1Score = 0;
            player2Score = 0;
            showingWinScreen = false;
        }
    } );

    canvas.addEventListener('mousemove', (e) => {
        const mousePos = calcMousePos(e);
        paddle1Y = mousePos.y - (paddleHeight / 2);
    });
}
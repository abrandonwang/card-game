const gameContainer = document.getElementById('game-container');
let totalCards;
let numCorrect;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let curr_r;
let curr_c;
let move_counter;
let startTime;
let timerInterval;
let time;

const cardColors = [
    '#d7d9b1', '#84acce', '#114b5f', '#1a936f', '#ff6663',
    '#4b7c97', '#aec3c0', '#8d7d69', '#c67266', '#62866c',
    '#da3b17', '#c4d024', '#22c124', '#ca2ba5', '#4620b6'
]; // Size is 15
updateSize(3, 4);

function updateSize(rows, cols) {
    clearInterval(timerInterval);
    startTime = Date.now();
    document.getElementById('timer').innerHTML = `0 s`;
    timerInterval = setInterval(() => {
        time = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').innerHTML = `${time} s`;
    }, 1000);
    move_counter = 0;
    document.getElementById('moves').innerHTML = `0 m`;
    curr_r = rows;
    curr_c = cols;
    reset();
    numCorrect = 0;
    gameContainer.innerHTML = '';
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
    <p class = "message"></p>
    <button class = "play-button" onclick= "playAgain()">
        <div class = "top"> Play Again </div>
        <div class = "bottom"></div>
    </button>
    `;
    gameContainer.appendChild(overlay);
    document.documentElement.style.setProperty('--grid-cols', cols);
    document.documentElement.style.setProperty('--grid-rows', rows);

    totalCards = rows * cols;
    for (let i = 0; i < totalCards; i++) {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = i + 1;

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        card.addEventListener('click', () => {
            if (lockBoard || card === firstCard) return;
            card.classList.add('flipped');

            if (!firstCard) {
                firstCard = card
            } else {
                secondCard = card;
                checkMatch();
            }
        })
        gameContainer.appendChild(card);
    }
    let colorArray = [];
    let usedColors = {}
    for (let i = 0; i < (totalCards / 2); i++) {
        let card_color;
        do {
            card_color = Math.floor(Math.random() * 15);
        } while (card_color in usedColors);
        usedColors[card_color] = true;  // mark as used
        colorArray.push(card_color);
        colorArray.push(card_color);
    }

    fisher_yates(colorArray);
    const cards = gameContainer.querySelectorAll('.card');
    for (let i = 0; i < totalCards; i++) {
        const cardBack = cards[i].querySelector('.card-back');
        cardBack.style.background = cardColors[colorArray[i]];
        cardBack.textContent = cardColors[colorArray[i]];
    }
}

function fisher_yates (arr) {
    for (let i = arr.length -1; i >= 0; i--) {
        let x = Math.floor(Math.random() * arr.length);
        let temp = arr[i];
        arr[i] = arr[x];
        arr[x] = temp;
    }
    console.log(arr);
    return arr;
}

function reset() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    gameContainer.classList.remove('completed');
}

function checkMatch() {
    const first = firstCard.querySelector('.card-back');
    const second = secondCard.querySelector('.card-back');
    move_counter++;
    document.getElementById('moves').innerHTML = `${move_counter} m`;

    if (first.style.background === second.style.background) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        numCorrect++;
        reset();
        if (numCorrect == totalCards / 2) {
            gameOver();
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            reset();
        }, 1000);
    }
}


function gameOver() {
    // Match like cards together, show you beat the game screen!
    setTimeout(() => {
        clearInterval(timerInterval);
        document.querySelectorAll('.card').forEach(card => {
            card.querySelector('.card-front').style.background = "#f7f7f8";
            card.querySelector('.card-front').textContent = "";
            card.classList.remove('flipped');
        });
        setTimeout(() => {
            gameContainer.querySelector('.message').textContent = `Completed in ${move_counter} moves and ${time} seconds!`;
            gameContainer.classList.add('completed');
        }, 700);
    }, 1500); // for now
}

function playAgain() {
    updateSize(curr_r, curr_c);
}
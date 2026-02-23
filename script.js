const gameContainer = document.getElementById('game-container');
let totalCards;
let numCorrect;
let currentNum = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let curr_r;
let curr_c;
let move_counter;
let time = 0;

const cardColors = [
    '#d7d9b1', '#84acce', '#114b5f', '#1a936f', '#ff6663',
    '#4b7c97', '#aec3c0', '#8d7d69', '#c67266', '#62866c',
    '#da3b17', '#c4d024', '#22c124', '#ca2ba5', '#4620b6'
]; // Size is 15
updateSize(3, 4);

function updateSize(rows, cols) {
    move_counter = 0;
    curr_r = rows;
    curr_c = cols;
    reset();
    numCorrect = 0;
    gameContainer.innerHTML = '';
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
    <p class = "message"><p>
    <button class = "play-button" onclick= "playAgain()">
        <div class = "top"> Play Again </div>
        <div class = "bottom"></div>
    </button>'
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
    let color_arr = [];
    let my_dict = {}
    for (let i = 0; i < (totalCards / 2); i++) {
        let card_color;
        do {
            card_color = Math.floor(Math.random() * 15);
        } while (card_color in my_dict);
        my_dict[card_color] = true;  // mark as used
        color_arr.push(card_color);
        color_arr.push(card_color);
    }

    fisher_yates(color_arr);
    const cards = gameContainer.querySelectorAll('.card');
    for (let i = 0; i < totalCards; i++) {
        const cardBack = cards[i].querySelector('.card-back');
        cardBack.style.background = cardColors[color_arr[i]];
        cardBack.textContent = cardColors[color_arr[i]];
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

function toggle() {
    document.querySelector('.drop-down').classList.toggle('open');
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
    return;
}

function playAgain() {
    updateSize(curr_r, curr_c);
}
const gameContainer = document.getElementById('game-container');
let totalCards;

const cardColors = [
    '#d7d9b1', '#84acce', '#114b5f', '#1a936f', '#ff6663',
    '#4b7c97', '#aec3c0', '#8d7d69', '#c67266', '#62866c',
    '#da3b17', '#c4d024', '#22c124', '#ca2ba5', '#4620b6'
]; // Size is 15

updateSize(3, 4);

function updateSize(rows, cols) {
    gameContainer.innerHTML = '';
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
            card.classList.toggle('flipped');
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
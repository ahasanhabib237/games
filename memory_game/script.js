document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const messageDisplay = document.getElementById('message');
    const resetButton = document.getElementById('resetButton');
    const scoresDisplay = document.getElementById('scores');
    const playerCountSelect = document.getElementById('playerCount');
    const startButton = document.getElementById('startButton');

    const cardValues = ['🍎', '🍌', '🍒', '🍇', '🍋', '🍊', '🍓', '🍉'];
    let cards = [];
    let flippedCards = [];
    let matchedCards = 0;
    let canFlip = false;
    let playerCount = 2;
    let currentPlayer = 0;
    let scores = [];

    function initializeGame() {
        playerCount = parseInt(playerCountSelect.value);
        scores = Array(playerCount).fill(0);
        currentPlayer = 0;
        matchedCards = 0;
        canFlip = true;
        gameBoard.innerHTML = '';
        messageDisplay.textContent = '';
        updateScores();

        const shuffledValues = [...cardValues, ...cardValues].sort(() => Math.random() - 0.5);

        shuffledValues.forEach((value, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = value;
            card.dataset.index = index;

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = '?';

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            cardBack.textContent = value;

            card.appendChild(cardFront);
            card.appendChild(cardBack);

            card.addEventListener('click', () => flipCard(card));
            gameBoard.appendChild(card);
            cards.push(card);
        });
    }

    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            canFlip = false;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedCards += 2;
            scores[currentPlayer]++;
            flippedCards = [];
            canFlip = true;
            updateScores();
            checkGameEnd();
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
                currentPlayer = (currentPlayer + 1) % playerCount;
                updateScores();
            }, 1000);
        }
    }

    function updateScores() {
        scoresDisplay.innerHTML = '';
        for (let i = 0; i < playerCount; i++) {
            const playerScore = document.createElement('p');
            playerScore.textContent = `Player ${i + 1}: ${scores[i]}`;
            if (i === currentPlayer) {
                playerScore.style.fontWeight = 'bold';
            }
            scoresDisplay.appendChild(playerScore);
        }
    }

    function checkGameEnd() {
        if (matchedCards === cards.length) {
            canFlip = false;
            let maxScore = -1;
            let winners = [];
            for (let i = 0; i < playerCount; i++) {
                if (scores[i] > maxScore) {
                    maxScore = scores[i];
                    winners = [i + 1];
                } else if (scores[i] === maxScore) {
                    winners.push(i + 1);
                }
            }

            if (winners.length > 1) {
                messageDisplay.textContent = `It's a tie between Players ${winners.join(', ')}!`;
            } else {
                messageDisplay.textContent = `Player ${winners[0]} wins!`;
            }
        }
    }

    startButton.addEventListener('click', initializeGame);
    resetButton.addEventListener('click', initializeGame);
});
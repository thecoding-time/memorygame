/*******************************************************************************
Credits:

These two Udacity study jam sessions helped me to implement the basic functions:
Memory Game tutorial by Yahya Elharony: https://youtu.be/G8J13lmApkQ?t=9
Memory Game webinar by Mike Wales: https://youtu.be/_rUH-sEs68Y?t=2

A tutorial that I used to make the timer stop:
https://scotch.io/tutorials/how-to-build-a-memory-matching-game-in-javascript

The code for the modal box was taken from the following tutorial and adapted to
my memory project: https://sabe.io/tutorials/how-to-create-modal-popup-box

*******************************************************************************/
/* TODO: What do I want to implement next?

		1. Learn to implement CSS animations from scratch and without a library
		2. Maybe add animation to the stars in the pop-up-window
		3. Fix the bug that you can turn around more than two cards when you click quickly
		4. Maybe add a "future updates" section to the README with plans for this project for the future
		
 */

/*
 * Create a list that holds all of your cards
 */

/* An array with the variables that contain the FontAwesome Icons. I need 16 cards
so I have to add every icon twice. */
const icons = [
	"fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o",
	"fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube",
	"fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb",
]

// This variable contains the deck (the square behind the cards)
const deck = document.querySelector(".deck");

// This variable selects all the card elements
const cards = document.querySelectorAll('.card');

// This variable creates an empty array for the newly created card deck
const cardDeck = [];

// These variables are needed for the timer
const timer = document.querySelector(".timer");
let minutes = document.querySelector(".minutes");
let seconds = document.querySelector(".seconds");
let minute = 0;
let second = 0;
let interval;
let endTime;

// Declare variables for the clickCard function
let openedCards = 0;
let flippedCards = [];
let matchedCards = [];
let cardOne = flippedCards[0];
let cardTwo = flippedCards[1];

// Variables for the moves counter
const countedMoves = document.querySelector(".moves");
let moves = 0;

// The stars for the star rating
const starOne = document.querySelector(".star-one");
const starTwo = document.querySelector(".star-two");
const starThree = document.querySelector(".star-three");

// The variables for the modal box
const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		while (currentIndex !== 0) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
		}

		return array;
}

// This function creates the cards
function createCard() {
	for (let i = 0; i < icons.length; i ++) {
		const oneCard = document.createElement("li");
		oneCard.classList.add("card");
		oneCard.innerHTML = "<i class=" + "'fa " + icons[i] + "'></i>";
		deck.appendChild(oneCard);
		cardDeck.push(oneCard);
	}
}

//This function creats the deck of cards
function createDeck() {
	// Shuffle the items in the icons array
	shuffle(icons);
	/* Loop thrugh each card and create its html */
	createCard();
}

// This function runs when a card is clicked
function clickCard() {
	const cards = document.querySelectorAll('.card');
	/* Loop through all the cards. */
	for (let i = 0; i < cards.length; i++) {
		function openCards() {
			cards[i].classList.remove("animated", "shake");
			if (flippedCards >= 1) {
				for (let i = 0; cards.length < i; i++) {
					cards[i].classList.add("animated", "flipInY");
					cards[i].classList.add("disableClick");
				}
			}
			else {
				cards[i].classList.add("animated", "flipInY");
				cards[i].classList.add("open", "show");
				openedCards++;
			}

			// Make the timer start on the first click
			if (openedCards == 1) {
				startTimer();
			}
			else {
				return;
			}
		}
		function pushCards() {
			if (flippedCards.length < 2) {
				flippedCards.push(cards[i]);
			}

			if (flippedCards.length === 1) {
				cards[i].classList.add("disableClick");
			}
			if (flippedCards.length === 2) {
				for (let i = 0; cards.length < i; i++) {
					cards[i].classList.add("disableClick");
				}
				cardOne = flippedCards[0];
				cardTwo = flippedCards[1];
				pairCards();
			}
		}
		function clickEventListener() {
			cards[i].addEventListener('click', openCards);
			cards[i].addEventListener('click', pushCards);
		}
		function removeEventListener() {
			cards[i].removeEventListener('click', openCards);
			cards[i].removeEventListener('click', pushCards);
		}
		if (flippedCards.length >= 2) {
			removeEventListener();
		}
		else {
			clickEventListener();
		}
	}
}

// When both cards match, call this function
function cardsMatch() {
	/* If the cards match, add the class "match" to them and push them into
	a new array. */
	for (let i = 0; cards.length < i; i++) {
		cards[i].classList.add("disableClick");
	}
	flippedCards[0].classList.remove("animated", "flipInY");
	flippedCards[0].classList.add("match", "animated", "bounce");
	flippedCards[1].classList.remove("animated", "flipInY");
	flippedCards[1].classList.add("match", "animated", "bounce");
	matchedCards.push(cardOne, cardTwo);
	flippedCards = [];

	//Find out if all cards are matched and if the game is over
	gameOver();
}

// When both cards don't match, call this function
function noMatch() {
	//Set a timeout: turn the cards after one second if they don't match
	flippedCards = [];
	for (let i = 0; cards.length < i; i++) {
		cards[i].classList.add("disableClick");
	}
	cardOne.classList.remove("animated", "flipInY");
	cardTwo.classList.remove("animated", "flipInY");
	setTimeout(function() {
		cardOne.classList.add("animated", "shake");
		cardTwo.classList.add("animated", "shake");
		cardOne.classList.remove("open", "show", "disableClick");
		cardTwo.classList.remove("open", "show", "disableClick");
	}, 300);
}

// Add a function to compare the cards
function compareCards() {
	//compare flippedCards
	if (flippedCards[0].innerHTML === flippedCards[1].innerHTML) {

		cardsMatch();

	} else {

			noMatch();

	}
	//empty the array again
	flippedCards = [];
}

// When two cards are in the flippedCards-array, call this function
function pairCards() {

	//Count the moves
	movesCounter();

	//Adjust star star rating
	starRating();

	//Compare the cards
	compareCards();
}

// Add a function that counts the moves
function movesCounter() {
	moves++;
	countedMoves.innerHTML = moves;
}

// Add a function with the timer
function startTimer() {
// Implement the interval by which the timer should increase
	interval = setInterval(function() {
		second++;
		minutes.innerHTML = minute;
		seconds.innerHTML = second;
		if (second == 59) {
			minute++;
			second = -1;
		}
	}, 1000);
}

// Add a function to stop the timer
function stopTimer() {
	timer.innerHTML = "Time: <span class=\"minutes\">" + minute + "</span> mins, <span class=\"seconds\">" + second + "</span> secs";
	clearInterval(interval);

	// Add a final score panel with the latest data to the modal box
	let scorePanel = document.querySelector(".score-panel");
	let scorePanelClone = scorePanel.cloneNode(true);
	let finalScore = document.querySelector(".final-score");
	let finalScorePanel = finalScore.appendChild(scorePanelClone);

	// Adapt the final score panel
	finalScorePanel.setAttribute("id", "modal-score");
	let oldReset = finalScorePanel.lastElementChild;
	oldReset.remove();
}

// Add the star rating functionality
function starRating() {
	if (moves <= 16) {
		starOne.classList.add("orange");
		starTwo.classList.add("orange");
		starThree.classList.add("orange");
	}
	if (17 <= moves && moves <= 23) {
		starThree.classList.remove("orange");
	}
	if (moves >= 24) {
		starTwo.classList.remove("orange");
	}
}

// Add reset button
const restartButton = document.querySelector(".restart");
restartButton.addEventListener("click", function() {
	window.location.reload();
});

/* When 16 cards are matched, the game is finished */
function gameOver() {
	if (matchedCards.length === icons.length) {
		toggleModal();
		stopTimer();
	}
}

// The basic code for the modal box: It starts when a button is clicked
function toggleModal() {
	modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
	if (event.target === modal) {
		toggleModal();
	}
}

closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

// Add restart button to the modal box
const finalRestartButton = document.querySelector("#final-restart");
finalRestartButton.addEventListener("click", function() {
	window.location.reload();
});

// This function initialises a new game
function startGame() {
	let invisibleHeading = document.querySelector(".invisible");
	invisibleHeading.remove();

	//Create the Deck
	createDeck();

	//Open cards
	clickCard();
}

// Start the game for the first time
startGame();



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

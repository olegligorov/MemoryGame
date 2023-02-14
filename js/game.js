// setting up firebase
const firebaseApp = firebase.initializeApp({
    apiKey: "API-KEY",
    authDomain: "AUTH-DOMAIN",
    projectId: "PROJECTID",
    storageBucket: "STORAGEBUCKET",
    messagingSenderId: "SENDERID",
    appId: "APPID",
    measurementId: "MEASURMENTID"
});


const size16Btn = document.querySelector(".btn16");
const size36Btn = document.querySelector(".btn36");
const size64Btn = document.querySelector(".btn64");

size16Btn.addEventListener('click', event=> {
    size16Btn.classList.add('selected-size');
    size36Btn.classList.remove('selected-size');
    size64Btn.classList.remove('selected-size');
})

size36Btn.addEventListener('click', event=> {
    size16Btn.classList.remove('selected-size');
    size36Btn.classList.add('selected-size');
    size64Btn.classList.remove('selected-size');
})

size64Btn.addEventListener('click', event=> {
    size16Btn.classList.remove('selected-size');
    size36Btn.classList.remove('selected-size');
    size64Btn.classList.add('selected-size');
})


const db = firebaseApp.firestore();

const startBtn = document.querySelector(".start-btn");
const cardsContainer = document.querySelector(".cards");
const settings = document.querySelector(".game-size");
const cardTimer = document.querySelector(".timer");
const popupContainer = document.querySelector('.popup-container')

let cardsSize = 16;
let remainingCards = cardsSize;
let blockUserFromClicking = true;
let timer;
let firstCard, secondCard;
let openedCards = [];


let currentUser = sessionStorage.getItem('currentUser');
console.log('Current user: ' + currentUser);

function createCards() {
    cardsContainer.innerHTML = "";

    let arr = [];
    for (let i = 1; i <= cardsSize / 2; ++i) {
        arr.push(`
        <div class="view front-view">
            <span class="icon">?</span>
        </div>
        <div class="view back-view">
            <img src="img/new-image-${i}.jpg" alt="card-image">
        </div>
        `);
        arr.push(`
        <div class="view front-view">
            <span class="icon">?</span>
        </div>
        <div class="view back-view">
            <img src="img/new-image-${i}.jpg" alt="card-image">
        </div>
        `);
    }
    shuffleArray(arr);
    //<img src="images/img-${i}.png" alt="card-image">

    arr.forEach(card => {
        let li = document.createElement("li");
        li.classList.add(`card`);
        li.classList.add(`card${cardsSize}`);
        li.innerHTML += card;
        cardsContainer.appendChild(li);
    })
}
createCards();

settings.addEventListener('click', event => {
    cardsSize = event.target.innerText;
    //3 cases for 16 36 and 64 cards!
    const wrapper = document.querySelector(".wrapper");
    if (cardsSize == 16) {
        wrapper.classList.add('wrapper16');
        wrapper.classList.remove('wrapper36');
        wrapper.classList.remove('wrapper64');
    }
    else if (cardsSize == 36) {
        wrapper.classList.remove('wrapper16');
        wrapper.classList.add('wrapper36');
        wrapper.classList.remove('wrapper64');

    } else if (cardsSize == 64) {
        wrapper.classList.remove('wrapper16');
        wrapper.classList.remove('wrapper36');
        wrapper.classList.add('wrapper64');
    }
    createCards();

});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

startBtn.addEventListener('click', event => {
    blockUserFromClicking = false;
    clearInterval(timer);
    openedCards = [];
    createCards();
    timer = startTimer();
    remainingCards = cardsSize;
});

cardsContainer.addEventListener('click', flipCard);
function flipCard(event) {
    let card = event.target;

    if (openedCards.includes(card.querySelector('img').src)) {
        return;
    }

    if (card !== firstCard && !blockUserFromClicking) {
        // console.log(card)
        // console.log(firstCard);
        card.classList.add('flipped');

        //if this is the first card then it is opened
        if (!firstCard) {
            // console.log('first card here');
            firstCard = card;
            return;
        }

        secondCard = card;
        // console.log('second card here')
        //check if it is the second card
        blockUserFromClicking = true;
        let firstImg = firstCard.querySelector('img').src;
        let secondImg = secondCard.querySelector('img').src;

        if (firstImg == secondImg) {
            openedCards.push(firstImg);
            remainingCards -= 2;
            // console.log(`remaining: ${remainingCards}`);
            if (remainingCards == 0) {
                clearInterval(timer);
                saveRecord();
                //display the popup
                popupContainer.classList.toggle('hidden');
                popupContainer.querySelector('.time-result').innerHTML = `Your time was ${cardTimer.innerText}`;
            }
            firstCard = null;
            secondCard = null;
            blockUserFromClicking = false;
            return;
        }
        setTimeout
        setTimeout(() => {
            firstCard.classList.add('shake');
            secondCard.classList.add('shake');
        }, 200);

        setTimeout(() => {
            firstCard.classList.remove('flipped', "shake");
            secondCard.classList.remove('flipped', "shake");
            firstCard = null;
            secondCard = null;
            blockUserFromClicking = false;
        }, 1000);
    }
}

//timer 
function startTimer() {
    let sec = 0;
    let min = 0;
    timer = setInterval(() => {

        min = parseInt(sec / 60);
        sec = sec % 60;
        if (min <= 9) {
            min = '0' + min;
        }
        if (sec <= 9) {
            sec = '0' + sec;
        }
        cardTimer.innerHTML = min + ':' + sec;
        sec++;
    }, 1000);

    return timer;
}

const stopGameBtn = document.querySelector('.stop-btn')
stopGameBtn.addEventListener('click', event => {
    clearInterval(timer);
    blockUserFromClicking = true;
})


//POPUP
const restartGameBtn = document.querySelector('.restart-game-btn');
const closePopupBtn = document.querySelector('.close-popup-btn');
closePopupBtn.addEventListener('click', event => {
    popupContainer.classList.toggle('hidden');

});
restartGameBtn.addEventListener('click', event => {
    popupContainer.classList.toggle('hidden');
    //start the game again
    let restartEvent = new Event('click');
    startBtn.dispatchEvent(restartEvent);
});

const logoutBtn = document.querySelector(".logout-btn")
logoutBtn.addEventListener('click', event => {
    sessionStorage.clear();
    window.location.replace('index.html');
})

async function saveRecord() {
    if (await isUsersBestRecord()) {
        db.collection('records').add({
            "user": currentUser,
            "time": cardTimer.innerText,
            "mode": `${cardsSize}cards`
        })
    }
}

async function isUsersBestRecord() {
    let bestRecord = true;
    const snapshot = await db.collection('records').get();

    snapshot.forEach(doc => {
        // console.log(doc);
        let docUser = doc.data()['user'];
        let docMode = doc.data()['mode'];
        if (docMode == `${cardsSize}cards` && docUser == currentUser) {
            if (doc.data()['time'] <= cardTimer.innerText) {
                bestRecord = false;
            }
        }
    });

    //remove the users's older record 
    if (bestRecord === true) {
        snapshot.forEach(doc => {
            let docUser = doc.data()['user'];
            let docMode = doc.data()['mode'];
            let id = doc['id']
            if (docMode == `${cardsSize}cards` && docUser == currentUser) {
                db.collection('records').doc(id).delete();
            }
        })
    }
    return bestRecord;
}



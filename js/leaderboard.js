const firebaseApp = firebase.initializeApp({
    apiKey: "API-KEY",
    authDomain: "AUTH-DOMAIN",
    projectId: "PROJECTID",
    storageBucket: "STORAGEBUCKET",
    messagingSenderId: "SENDERID",
    appId: "APPID",
    measurementId: "MEASURMENTID"
});

const db = firebaseApp.firestore();
const leaderboardList = document.querySelector('.leaderboard-list');

let currentUser = sessionStorage.getItem('currentUser');
console.log('Current user: ' + currentUser)

if (!currentUser) {
    const loginOrRegister = document.querySelector(".login-register");
    loginOrRegister.innerHTML = `<li class="login-btn"> <a href="login-page.html">Login</a></li>
    <li class="register-btn"> <a href="register-page.html">Register</a></li>
`    
} else {
    const logoutBtn = document.querySelector(".logout-btn")
logoutBtn.addEventListener('click', event => {
    sessionStorage.clear();
    window.location.replace('index.html');
})
}

let mp = []
let sortedMp = []
db.collection('records').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        let obj = {
            "user": doc.data()['user'],
            "time": doc.data()['time'],
            "mode": doc.data()['mode']
        }
        mp.push(obj)
    })
    sortedMp = mp.sort((a, b) => {
                return (a['time'] > b['time']) ? 1 : (a['time'] < b['time']) ? -1 : 0
    })
    sortedMp.forEach(el => {
        let li = document.createElement('li');
        li.innerHTML = `<div>${el['user']}</div> <div>${el['mode']}, ${el['time']}</div>`;
        li.classList.add('leaderboard-item');
        console.log(el["mode"]);
        li.classList.add(`${el['mode']}`)
        if(currentUser == el['user']) {
            li.classList.add('current-user-item');
        }
        leaderboardList.appendChild(li);
    })
})


const btn16 = document.querySelector(".btn16");
const btn36 = document.querySelector(".btn36");
const btn64 = document.querySelector(".btn64");
const btnAll = document.querySelector('.btnall');

function displayCards(cardsSize) {
    Array.from(leaderboardList.children).forEach(node => {
        if (node.classList.contains(`${cardsSize}cards`)) {
            node.classList.remove('hidden');
        } else {
            node.classList.add('hidden');
        }
    });
}

btnAll.addEventListener('click', event => {
    Array.from(leaderboardList.children).forEach(node => {
        node.classList.remove('hidden');
    })
    btnAll.classList.add('toggled');
    btn16.classList.remove('toggled');
    btn36.classList.remove('toggled');
    btn64.classList.remove('toggled');
})

btn16.addEventListener('click', event => {
    displayCards(16);
    btnAll.classList.remove('toggled');
    btn16.classList.add('toggled');
    btn36.classList.remove('toggled');
    btn64.classList.remove('toggled');
});

btn36.addEventListener('click', event => {
    displayCards(36);
    btn16.classList.remove('toggled');
    btnAll.classList.remove('toggled');
    btn36.classList.add('toggled');
    btn64.classList.remove('toggled');
});

btn64.addEventListener('click', event => {
    displayCards(64);
    btn16.classList.remove('toggled');
    btnAll.classList.remove('toggled');
    btn36.classList.remove('toggled');
    btn64.classList.add('toggled');
});

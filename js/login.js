// setting up firebase
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC2zNL3GKuSVTDBAZdf_p37I9tNqkk0SHM",
    authDomain: "memory-game-21039.firebaseapp.com",
    projectId: "memory-game-21039",
    storageBucket: "memory-game-21039.appspot.com",
    messagingSenderId: "370026617263",
    appId: "1:370026617263:web:dbbcc1db7bfa593c85375a",
    measurementId: "G-ECZ0ZSBDT7"
});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

const password = document.getElementById('password');

const registerbtn = document.querySelector('.submit-register-btn');
const email = document.getElementById('email');

const loginBtn = document.querySelector('.submit-login-btn');

loginBtn.addEventListener('click', event=> {
    event.preventDefault();
    
    auth.signInWithEmailAndPassword(email.value, password.value)
    .then((result) => {
        //save the current user
        sessionStorage.setItem("currentUser", email.value);
        console.log(sessionStorage)
        window.location.replace('game.html');
    })
    .catch(function(error) {
        var errorCode = error.code; 
        var errorMessage = error.message;
        const errordiv = document.querySelector(".error");
        errordiv.innerText = "Invalid username or password";
        errordiv.classList.remove('hidden');
        email.setCustomValidity("Invalid email or password");
        // console.log(errorCode);
        // console.log(errorMessage);
    });
})

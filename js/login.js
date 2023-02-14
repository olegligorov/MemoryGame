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

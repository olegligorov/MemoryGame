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
const confirmPassword = document.getElementById('confirm_password');
const registerbtn = document.querySelector('.submit-register-btn');
const email = document.getElementById('email');

password.addEventListener('change', validatePassword);
confirmPassword.addEventListener('keyup', validatePassword);

registerbtn.addEventListener('click', event => {
    if (validateEmail(email.value) == false) {
        //invalid email or pw
        return;
    }

    event.preventDefault();
    auth.createUserWithEmailAndPassword(email.value, password.value)
    .then((result) => {
        console.log("You are signed up")
        console.log(result);

        //save the data about the current user for one day
        sessionStorage.setItem("currentUser", email.value);

        window.location.replace('game.html');
    })
    .catch(function(error) {
        var errorCode = error.code; 
        var errorMessage = error.message;
        confirmPassword.setCustomValidity(errorCode);
        
        console.log(errorCode);
        console.log(errorMessage);
    });
})

function validateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex)) {
        email.setCustomValidity('');
        return true;
    } else {
        email.setCustomValidity("Invalid email address");
        return false;
    }
}

function validatePassword() {
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords Don't Match");
        return false;
    } else {
        confirmPassword.setCustomValidity('');
        return true;
    }
}

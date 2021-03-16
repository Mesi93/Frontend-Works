let nameInput = document.form.username;
let emailInput = document.form.email;
let passwordInput = document.form.password;
let rePasswordInput = document.form.repassword;

let usernameIsValid = false;
let emailIsValid = false;
let passwordIsValid = false;
let passwordsAreSame = false;


(function checkUserSingedIn() {
    let userAlreadySindIn = localStorage.getItem('user') ? true : false;
    if (userAlreadySindIn) {
        createSignOutLink();
    }
})();


nameInput.onchange = () => {
    let username = nameInput.value;
    // let userValid = false;
    // if(username.length > 5){
    //     userValid = true;
    // }
    userNameIsValid = username.length > 5 ? true : false;
    document.querySelector('.error-username').style.display = userNameIsValid ? 'none' : 'block';
    document.querySelector('button').disabled = allInputAreInValid();
};
emailInput.onchange = () => {
    let email = emailInput.value;
    emailIsValid = email.length > 5 && email.includes('@') ? true : false;
    document.querySelector('.error-email').style.display = emailIsValid ? 'none' : 'block';
    document.querySelector('button').disabled = allInputAreInValid();
};

passwordInput.onchange = () => {
    let password = passwordInput.value;
    passwordIsValid = password.length > 5 ? true : false;
    document.querySelector('.error-password').style.display = passwordIsValid ? 'none' : 'block';
    document.querySelector('button').disabled = allInputAreInValid();
};

rePasswordInput.onchange = () => {
    let rePassword = rePasswordInput.value;
    let originPassword = passwordInput.value;
    passwordsAreSame = rePassword.length > 5 && rePassword === originPassword ? true : false;
    document.querySelector('.error-repassword').style.display = passwordsAreSame ? 'none' : 'block';
    document.querySelector('button').disabled = allInputAreInValid();
};

document.querySelector('button').addEventListener('click', () => {
    alert('Sikeres regisztráció!');
})

function allInputAreInValid() {
    let allInValid = false;
    if (usernameIsValid && emailIsValid && passwordIsValid && passwordsAreSame) {
        allInValid = true;
    }
    return allInValid;
}

//**********************************POST************************** */

const button = document.querySelector('button');
button.addEventListener("click", () => {
    console.log("asd");

    const user = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value

    }

    let jsonUser = JSON.stringify(user);
    const httpClient = new XMLHttpRequest();
    const URL = 'http://localhost:3000/users/';
    httpClient.open('POST', URL);
    httpClient.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    httpClient.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {
            const savedUser = JSON.parse(this.responseText);
            signInUser();
            setCookie(savedUser.id);
            alert(savedUser.name + ' saved');
        }
    }
    httpClient.send(jsonUser);
    return user;
})

/*********************COOKIE********************** */

function signInUser() {
    localStorage.setItem('user', ' signed in');
    createSignOutLink();
}

function setCookie(userId) {
    let now = new Date();
    now.setTime(now.getTime() + (1000 * 60 * 60))
    const expires = now.toUTCString();
    document.cookie = `user_id=${userId}; expires=${expires}; path=/;`
}

function createSignOutLink() {
    const nav = document.querySelector(".nav-svg");
    const signOut = document.createElement("a");
    signOut.innerHTML = "Kilépés";
    signOut.style.color = "teal";
    signOut.style.fontSize = "1em";
    signOut.style.cursor = "pointer";
    signOut.style.fontWeight = "bold";
    signOut.style.margin = "0.6em"

    signOut.onclick = function() {
        localStorage.removeItem('user');
        document.cookie = `user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        signOut.remove();
    }
    nav.appendChild(signOut);
}
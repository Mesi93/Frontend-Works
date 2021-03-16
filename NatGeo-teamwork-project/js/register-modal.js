//LOGIN / REGISTER MODAL
let loginModalBtn = document.querySelector('.footer-form-click-login');
let loginModalBg = document.querySelector('.login-modal-bg');
let modalCloseBtn = document.querySelector('.register-modal-close');
let registerModalBg = document.querySelector('.register-modal-bg');
let forgotModalBg = document.querySelector('.forgot-password-modal-bg');
let alertModal = document.querySelector('.alert-modal');
let rememberMeIsChecked = false;
let registerOpenBtn;
let userRegisterBtn;
let database3 = firebase.firestore();

// validators
let acceptTerms = false;
let regUserNameIsValid = false;
let regUserNameIsFree = false;
let regFullNameIsValid = false;
let regUserEmailIsValid = false;
let regUserPwIsValid = false;
let regUserPwAgainIsValid = false;

let navLoginBtn = document.querySelector('#nav-navbar-login-button')

navLoginBtn.addEventListener('click', function() {
    loginModalBg.style.visibility = 'visible';
    loginModalBg.style.opacity = '1';
    loginModalBg.style.top = '0';
})



const renderAlert = () => {
    let alertUnsubTemplate =
        `
    <div class="alert">
    <h3 class="alert-text"></h3>
    </div>
    `
    alertModal.innerHTML = alertUnsubTemplate;
}

function closeAlert() {
    alertModal.style.display = "none";
}


createLoginModal();

function openLoginModal() {
    let userAlreadySingIn = localStorage.getItem('user') ? true : false;
    if (!userAlreadySingIn) {
       
        loginModalBg.style.visibility = 'visible';
        loginModalBg.style.opacity = '1';
        loginModalBg.style.top = '0';
    } else {
       
    }
};

loginModalBg.onclick = function(e) {
    if (e.target == loginModalBg) {
        loginModalBg.style.visibility = 'hidden';
        loginModalBg.style.opacity = '0';
        document.querySelector('#loginUsername').value = '';
        document.querySelector('#loginPassword').value = '';
        document.querySelector('.login-error').style.display = 'none';
    }
}

registerModalBg.onclick = function(e) {
    if (e.target == registerModalBg) {
        registerModalBg.style.visibility = 'hidden';
        registerModalBg.style.opacity = '0';
    }
}

forgotModalBg.onclick = function(e) {
    if (e.target == forgotModalBg) {
        forgotModalBg.style.visibility = 'hidden';
        forgotModalBg.style.opacity = '0';
    }
}



//DISPLAY LOGIN MODAL
loginModalBtn.addEventListener('click', function() {
    loginModalBg.style.visibility = 'visible';
    loginModalBg.style.opacity = '1';
    loginModalBg.style.top = '0';
});

//DISPLAY REGISTER MODAL

registerOpenBtn.addEventListener('click', function() {
    loginModalBg.style.visibility = 'hidden';
    loginModalBg.style.opacity = '0';


    createRegisterModal();

    registerModalBg.style.visibility = 'visible';
    registerModalBg.style.opacity = '1';
    registerModalBg.style.top = '0';
});

//DISPLAY

const forgotModalClose = () => {
    forgotModalBg.style.visibility = 'hidden';
    forgotModalBg.style.opacity = '0';
   
    location.reload(true / false)
   
}

(function checkForgotLocalStorage() {
    let checkForgotModal = localStorage.getItem('forgotModal') ? true : false;
    if (checkForgotModal) {
        renderAlert();
        document.querySelector('.alert-text').innerText = `Your password has succesfully changed.`;
        setTimeout(closeAlert, 4000);
        localStorage.removeItem('forgotModal')
      
    }
})();

const forgotModalCloseWithoutReload = () => {
    forgotModalBg.style.visibility = 'hidden';
    forgotModalBg.style.opacity = '0';
}


const basicModalClose = () => {
    loginModalBg.style.visibility = 'hidden';
    loginModalBg.style.opacity = '0';

    registerModalBg.style.visibility = 'hidden';
    registerModalBg.style.opacity = '0';

    document.querySelector('#loginUsername').value = '';
    document.querySelector('#loginPassword').value = '';
    document.querySelector('.login-error').style.display = 'none';


}

const randomNumModalClose = () => {
    randomNumToConfirmBg.style.visibility = 'hidden';
    randomNumToConfirmBg.style.opacity = '0';
}

//login modal bezárás
window.onclick = function(event) {
    if (event.target == loginModalBg) {
        loginModalBg.style.visibility = 'hidden';
        loginModalBg.style.opacity = '0';
    }
}

//register modal bezárás
window.onclick = function(event) {
    if (event.target == registerModalBg) {
        registerModalBg.style.visibility = 'hidden';
        registerModalBg.style.opacity = '0';
    }
}

//LOGIN MODAL TEMPLATE
function createLoginModal() {

    let loginModalTemplate =
        `
  <div class="register-modal">
    <h2>Sign in</h2>
  <label for="loginUsername">Username</label>
   <input type="text" name="loginUsername" id="loginUsername">
  <label for="loginPassword">Password</label>
   <input type="password" name="loginPassword" id="loginPassword" class="logPassword">
   <span id="logPw-field" class="fa fa-eye" onclick="hideAndShowLogPassword()"></span>
   <div id="remember-forgot-wrapper">
   <div class="remember-me-holder">
   <label for="remember-me">Remember me</label>
   <input type="checkbox" id="rememberMe" class="remember-me" name="remember-me" value="remember-me">
   </div>
   <a href="#" id="forgotPassword">Forgot password?</a>
   </div>
  <button class="login-modal-btn" id="signInBtn" disabled>Sign in</button>
  <p class="login-error" style="display:none; color:red">Login failed: Invalid username or password.</p>
  <a href="#" class="home-uploaded open-register">Click here to register</a>
  <span class="register-modal-close" onclick="basicModalClose()">&times;</span>
   </div>
 `
    loginModalBg.innerHTML = loginModalTemplate;
    registerOpenBtn = document.querySelector(".open-register");
}


const validators = {
        patterns: {
            userNamePattern: /^[a-zéáűőúóíüöA-ZÉÁŰÚŐÍÖÜÓ\d?]+$/,
            fullNamePattern: /^[a-zéáűőúóíüöA-ZÉÁŰÚŐÍÖÜÓ]+( [a-zéáűőúóíüöA-ZÉÁŰÚÍŐÖÜÓ]+)+$/,
            emailPattern: /\S+@\S+\.\S+/,
            passwordPattern: /^[a-zéáűőúóíüöA-ZÉÁŰÚŐÍÖÜÓ0-9!?]{8,}$/,
        },
        validate: function(text, type) {
            return text.match(this.patterns[type]) ? true : false;
        }
    }
    //REGISTER MODAL TEMPLATE


function createRegisterModal() {
    let registerModalTemplate =
        `
  <div class="register-modal">
    <h2>Register</h2>
  <label for="regUsername">Username</label>
   <input class="regUsername" type="text" name="regUsername" onchange="regUserNameValidator(); getUserNameWhileRegistrate()" maxlength="32" placeholder="min 8 - max 32 characters">
  <small class ="regUsername-error" style="display: none">Wrong username!</small>
  <small class ="regUsername-taken-error" style="display: none">This username is already being used!</small>

   <label for="regFullname">Full name</label>
   <input class="regFullname" type="text" name="regFullname" onchange="regUserFullNameValidator()" placeholder="John Dodo">
   <small class ="regFullName-error" style="display: none">Wrong name!</small>

  <label for="regEmail">Email</label>
   <input class="regEmail" type="email" name="regEmail" onchange="regUserEmailValidator(); getBeforeRegistration(); getBeforeSubscribe()" placeholder="example@example.com">
   <small class ="regEmail-error" style="display: none">Wrong email!</small>
   <small class ="existedEmail-error" style="display: none">The email address you have entered is already registered</small>

  <label for="regPw">Password</label>
   <input class="regPw" type="password" name="regPw" onchange="regUserPwValidator()" placeholder="min 8 characters">
   <span id="regPw-field" class="fa fa-eye" onclick="hideAndShowRegPassword()"></span>
   <small class ="regPw-error" style="display: none">Your password is not long enough or contains invalid special characters</small>

  <label for="regPwAgain">Password again</label>
   <input class="regPwAgain" type="password" name="regPwAgain" onchange="regUserPwAgainValidator()" placeholder="min 8 characters">
   <span id="reRegPw-field" class="fa fa-eye" onclick="hideAndShowRegRePassword()"></span>
   <small class ="regPwAgain-error" style="display: none">Passwords do not match!</small>

   <div class="checkbox-container" id="subscribe-conatiner">
   <input type="checkbox" class="subscribe" id="subscribe" name="subscribe" value="subscribe" onchange="acceptSubscribeCheckbox()">
   <label for="subscribe"> I want to subscribe and receive exciting news.</label>
  </div>
  <small class ="subscribe-error" style="display: none">This email address has already been subscribed</small>

  <div class="checkbox-container">
   <input type="checkbox" id="terms" class="terms" name="terms" value="terms" onchange="acceptTermsValidator()">
   <label for="terms"> I have read and accept <a href="https://privacy.microsoft.com/en-GB/privacystatement" target="_blank">Terms and Conditions</a></label><br>
   </div>
   <small class ="terms-error" style="display: none" >You have to read and accept terms and conditions.</small>
   

  <button class="register-modal-btn" onclick="subscribeUser(); registerUser()"; disabled>Register</button>
  <span class="register-modal-close" onclick="basicModalClose()">&times;</span>
   </div>
 `
    registerModalBg.innerHTML = registerModalTemplate;
}
//hide and show password
function hideAndShowRegPassword() {
    let regPassword = document.querySelector(".regPw");
    regPassword.type === "password" ? regPassword.type = "text" : regPassword.type = "password";
    let icon = document.getElementById("regPw-field");
    icon.classList.toggle('fa-eye-slash');
}

function hideAndShowRegRePassword() {
    let reRegPassword = document.querySelector(".regPwAgain");
    reRegPassword.type === "password" ? reRegPassword.type = "text" : reRegPassword.type = "password";
    let icon = document.getElementById("reRegPw-field");
    icon.classList.toggle('fa-eye-slash');
}


function hideAndShowLogPassword() {
    let logPassword = document.querySelector(".logPassword");
    logPassword.type === "password" ? logPassword.type = "text" : logPassword.type = "password";
    let icon = document.getElementById("logPw-field");
    icon.classList.toggle('fa-eye-slash');
}


function hideAndShowNewPassword() {
    let newPassword = document.querySelector(".newPassword");
    newPassword.type === "password" ? newPassword.type = "text" : newPassword.type = "password";
    let icon = document.getElementById("newPw-field");
    icon.classList.toggle('fa-eye-slash');
}

function hideAndShowReNewPassword() {
    let reNewPassword = document.querySelector(".reNewPassword");
    reNewPassword.type === "password" ? reNewPassword.type = "text" : reNewPassword.type = "password";
    let icon = document.getElementById("reNewPw-field");
    icon.classList.toggle('fa-eye-slash');
}

function getUserNameWhileRegistrate() {
    let regUserName = document.querySelector('.regUsername')
    let userNameIsTakenError = document.querySelector('.regUsername-taken-error')

    database3.collection("users")
        .doc("o7LaLJt4kg1JSncGrTnH")
        .collection("profiles")
        .where("userName", "==", regUserName.value)
        .get()
        .then((dataList) => {
            userNameIsTakenError.style.display = 'none';
            regUserNameIsFree = true;
            dataList.forEach(user => {
                if (regUserName.value == user.data().userName) {
                    userNameIsTakenError.style.display = 'block';
                    regUserNameIsFree = false;
                }
            })
        })
        .catch(err => console.log(err));
}
let acceptSubscribe = false;

function subscribeUser() {
    if (acceptSubscribe == true) {
        console.log(acceptSubscribe);
        postToSubscribe()
    }
}

function registerUser() {
    if (newEmail == true) {
        postToRegister();
    }
}

/* --------- check if email is already registrated----------*/

let newEmail = false;

function getBeforeRegistration() {
    let userEmail = document.querySelector('.regEmail').value;
    database3.collection("users")
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('profiles')
        .where("email", "==", userEmail)
        .get()
        .then((dataList) => {
            document.querySelector(".existedEmail-error").style.display = 'none';
            newEmail = true;
            dataList.forEach(user => {
                if (user.data().email === userEmail) {
                    document.querySelector(".existedEmail-error").style.display = 'block';
                    newEmail = false;
                }
            })
        })
        .catch(err => console.log(err));
}


/*------ post registration ------*/

function postToRegister() {
    let regUserName = document.querySelector('.regUsername');
    let regFullName = document.querySelector('.regFullname');
    let userEmail = document.querySelector('.regEmail');
    let userPw = document.querySelector('.regPw');
    let userPwAgain = document.querySelector('.regPwAgain');

    const user = {
        userName: regUserName.value,
        fullName: regFullName.value,
        email: userEmail.value,
        password: btoa(userPw.value),
        lastLoggedIn: false
    }

    database3.collection('users').doc('o7LaLJt4kg1JSncGrTnH').collection('profiles').add(user)
        .then(profile => {
            console.log("Profile saved with: " + profile.id)
            regUserName.value = '';
            regFullName.value = '';
            userEmail.value = '';
            userPw.value = '';
            userPwAgain.value = '';
        })
        .catch(err => console.log(err))
    basicModalClose()
    renderAlert();
    document.querySelector('.alert-text').innerText = "You have succesfully registrated!"
    setTimeout(closeAlert, 4000);
}



// --------- check if email is already subscribed ----------

async function getBeforeSubscribe() {
    let newEmailForSubscribe = true;
    const emailToSearch = document.querySelector('.regEmail').value;
    database3.collection("users")
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('subscribers')
        .where("email", "==", emailToSearch)
        .get()
        .then((dataList) => {
            dataList.forEach(user => {
                if (user.data().email === emailToSearch) {
                    console.log('nem ment')
                    newEmailForSubscribe = false;
                    document.querySelector('.subscribe-error').style.display = "block";
                    document.querySelector('#subscribe').disabled = true;
                }
            })
            if (newEmailForSubscribe) {
                console.log('ment')
                newEmailForSubscribe = true
                document.querySelector('.subscribe-error').style.display = "none";
                document.querySelector('#subscribe').disabled = false;
            }
        })
        .catch(err => console.log(err));
}

function acceptSubscribeCheckbox() {
    let subscribeCheckbox = document.querySelector('#subscribe');
    if (subscribeCheckbox.checked === true) {
        acceptSubscribe = true
    } else {
        acceptSubscribe = false
    }
}

//------ subscribe width registration ------//

function postToSubscribe() {
    let regFullName = document.querySelector('.regFullname');
    let userEmail = document.querySelector('.regEmail');
    const user = {
        name: regFullName.value,
        email: userEmail.value,
    }

    database3.collection("users")
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('subscribers')
        .add(user)
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

//accept terms
function acceptTermsValidator() {
    let termsCheckbox = document.querySelector('.terms');
    let termsError = document.querySelector('.terms-error');
    if (termsCheckbox.checked == true) {
        acceptTerms = true;
    } else {
        acceptTerms = false;
    };

    document.querySelector('.register-modal-btn').disabled = InputFieldsNotValid();
    termsError.style.display = acceptTerms ? 'none' : 'block'
}

//felhaszn név
function regUserNameValidator() {
    let userName = document.querySelector('.regUsername');
    let userNameError = document.querySelector('.regUsername-error')
    regUserNameIsValid = validators.validate(userName.value, "userNamePattern");
    document.querySelector('.register-modal-btn').disabled = InputFieldsNotValid();
    userNameError.style.display = regUserNameIsValid ? 'none' : 'block';


}


//teljes név
function regUserFullNameValidator() {
    let fullName = document.querySelector('.regFullname');
    regFullNameIsValid = validators.validate(fullName.value, "fullNamePattern");
    document.querySelector('.register-modal-btn').disabled = InputFieldsNotValid();
    document.querySelector(".regFullName-error").style.display = regFullNameIsValid ? 'none' : 'block'
}

//email
function regUserEmailValidator() {
    let userEmail = document.querySelector('.regEmail');
    regUserEmailIsValid = validators.validate(userEmail.value, "emailPattern");
    document.querySelector('.register-modal-btn').disabled = InputFieldsNotValid();
    document.querySelector(".regEmail-error").style.display = regUserEmailIsValid ? 'none' : 'block'
}


//jelszó
function regUserPwValidator() {
    let userPw = document.querySelector('.regPw');
    regUserPwIsValid = validators.validate(userPw.value, "passwordPattern");
    document.querySelector('.register-modal-btn').disabled = InputFieldsNotValid();
    document.querySelector(".regPw-error").style.display = regUserPwIsValid ? 'none' : 'block'
}


//jelszó
function regUserPwAgainValidator() {
    let userPw = document.querySelector('.regPw');
    let userPwAgain = document.querySelector('.regPwAgain');
    regUserPwAgainIsValid = userPwAgain.value === userPw.value ? true : false;
    document.querySelector('.register-modal-btn').disabled = InputFieldsNotValid();
    document.querySelector(".regPwAgain-error").style.display = regUserPwAgainIsValid ? 'none' : 'block'
}



function InputFieldsNotValid() {
    return !(regUserNameIsValid && regUserNameIsFree && regFullNameIsValid && regUserEmailIsValid && regUserPwIsValid && regUserPwAgainIsValid && acceptTerms);
}



//------------------------------------LOGIN & FORGOT PASSWORD & COOKIE & LOCAL STORAGE----------------------------------------------
//FORGOT PASSWORD MODAL TEMPLATE


let forgotPasswordBtn = document.getElementById('forgotPassword');

function createForgotPwModal() {

    let forgotPawssordModalTemplate =
        `
   <div class="register-modal">
     <h2>Create New Password</h2>
   <label for="forgotUsername">Username</label>
    <input type="text" name="forgotUsername" id="forgotUsername">
   <label for="forgotPassword">New Password</label>
    <input type="password" onchange="forgotPwValidator()" name="forgotPasswordInput" id="forgotPasswordInput" placeholder="min 8 characters" class="newPassword" disabled>
    <span id="newPw-field" class="fa fa-eye" onclick="hideAndShowNewPassword()"></span>
   <label for="reforgotPassword">Re-New Password</label>
    <input type="password" name="reForgotPasswordInput" placeholder="min 8 characters" id="reForgotPasswordInput" class="reNewPassword" disabled>
    <span id="reNewPw-field" class="fa fa-eye" onclick="hideAndShowReNewPassword()"></span>
  <button class="login-modal-btn" id="newPasswordSaveBtn" disabled>Save</button>
   <p class="forgot-username-error" style="display:none; color:red">The username specified was invalid!</p>
   <p class="forgot-password-error" style="display:none; color:red">Passwords do not match!</p>
   <p class="forgot-password-regex-error" style="display:none; color:red">Your password is not long enough or contains invalid special characters!</p>

   <span class="register-modal-close" onclick="forgotModalClose()">&times;</span>
   </div>
  `

    forgotModalBg.innerHTML = forgotPawssordModalTemplate;
    registerOpenBtn = document.querySelector(".open-register");
}
createForgotPwModal();

forgotPasswordBtn.addEventListener('click', function() {
    basicModalClose();
    forgotModalBg.style.visibility = 'visible';
    forgotModalBg.style.opacity = '1';
    forgotModalBg.style.top = 0;
});


function forgotPwValidator() {
    let newPw = document.querySelector('.newPassword');
    let newPwIsValid = validators.validate(newPw.value, "passwordPattern");
    document.querySelector(".forgot-password-regex-error").style.display = newPwIsValid ? 'none' : 'block'
}

//USER OBJEKTUMOK

let loginUserNameInput = document.getElementById('loginUsername');
let loginPasswordInput = document.getElementById('loginPassword');
let signInBtn = document.getElementById('signInBtn');
let loginError = document.querySelector('.login-error');

function getUser() {
    let loginUserNameInput = document.getElementById('loginUsername');


    // let userObjList = [];
    database3.collection('users')
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('profiles')
        .where('userName', '==', loginUserNameInput.value)
        .get()
        .then((dataList) => {
            loginError.style.display = 'block';
            dataList.forEach(user => {
                loginToPage(user.data());
            })

        })

    .catch(err => console.log(err))
}

//BEJELENTKEZÉS
function loginToPage(obj) {

    //BEIRT ADAT A SZERVERREL ÖSSZEHASONLTÁS
    let loginUserNameInputToMatch = document.getElementById('loginUsername');
    let loginPasswordInputToMatch = document.getElementById('loginPassword');


    if (loginUserNameInputToMatch.value === obj.userName && loginPasswordInputToMatch.value === atob(obj.password)) {


        signInBtn.disabled = false;
        loginError.style.display = 'none';
        signInBtn.addEventListener('click', function() {
            checkCheckBox(); //remember me

            //LOCAL STORAGE ÉS COOKIEK BEÁLLITÁSA
            setLocalStorage(obj.userName);
            setCookie(obj.userName);

            setTimeout(basicModalClose, 500);
            setTimeout(setnavBarUserName(obj.userName), 0);

            renderAlert();
            document.querySelector('.alert-text').innerText = `You have succesfully signed in ${obj.userName}!`;
            setTimeout(closeAlert, 4000);

        })

    } else {
        loginError.style.display = 'block';
    }
}


loginPasswordInput.addEventListener('change', function() {
    getUser();
});


//COOKIES
//LOCAL STORAGE TARTALMÁNAK VIZSGÁLATA
(function checkLocalStorage() {
    let userAlreadySingIn = localStorage.getItem('user') ? true : false;
    if (userAlreadySingIn) {
        createSignOutLink();
        let localStorageUser = JSON.parse(window.localStorage.getItem('user'));
        setnavBarUserName(localStorageUser.name);
    }
})();


function openAdminPanel() {
    if (JSON.parse(localStorage.getItem('user')).name === 'Admin') {
        localStorage.setItem('btn', JSON.stringify({
            btnStatus: false,
        }));
        window.location.href = "http://127.0.0.1:5502/html/admin/admin.html";
    }
}

//LOCAL STORAGE TARTALMÁNAK BEÁLLITÁSA
function setLocalStorage(userName) {
    localStorage.setItem('user', JSON.stringify({
        name: userName,
        signedIn: 'signed in'
    }));
    createSignOutLink();
    openAdminPanel()

}

function setnavBarUserName(obj) {
    let navBarUserName = document.querySelector('#nav-signedIn-user');
    navBarUserName.innerText = obj;
    navBarUserName.classList.add = ('nav-click');
    navBarUserName.style.padding = '5px';
}


let navBarUserName = document.querySelector('#nav-signedIn-user');
navBarUserName.addEventListener("click", () => {
    if (JSON.parse(localStorage.getItem('user')).name === 'Admin') {
        window.location.href = "http://127.0.0.1:5502/html/admin/admin.html";
    }
})


//COOKIE TARTALMÁNAK BEÁLLITÁSA
function setCookie(userId) {

    let now = new Date();
    now.setTime(now.getTime() + (1000 * 60 * 60));

    let utcString = now.toUTCString();

    document.cookie = `user_id=${userId}; expires=${utcString}; path=/;`;
}

//KIJELENTKEZŐ GOMB, LOCAL STORAGE ÉS COOKIEK TÖRLÉSE


function createSignOutLink() {
    //FOOTER
    let footerLoginBtn = document.querySelector('#footer-login-btn');
    let footerToLoginHolder = document.getElementById('footer-to-login-holder');
    let footerTologin = document.getElementById('footer-to-login');
    let signOutBtn = document.createElement('button');
    let userBtn = document.getElementById('nav-signedIn-user');

    //NAVBAR
    let navLoginLi = document.getElementById('nav-login-li');
    let navLoginBtn = document.getElementById('nav-navbar-login-button');

    let navbarSignOutBtn = document.createElement('a');
    navbarSignOutBtn.innerText = 'Sign Out';

    navLoginBtn.style.display = 'none';

    navbarSignOutBtn.classList.add('nav-link');
    navbarSignOutBtn.classList.add('nav-click');
    navbarSignOutBtn.style.cursor = 'pointer';


    //FOOTER
    footerLoginBtn.style.display = 'none';
    footerTologin.style.display = 'none';

    signOutBtn.classList.add("footer-form-click-login");
    signOutBtn.innerText = 'Sign Out';


    function signOutAndClearData() {
        localStorage.clear();
        document.cookie = `user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        signOutBtn.style.display = 'none';

        navbarSignOutBtn.style.display = 'none';
        loginUserNameInput.value = '';
        loginPasswordInput.value = '';

        //OLDAL FRISSITÉSE

        location.reload(true / false);

        footerToLoginHolder.removeChild(signOutBtn);
        footerLoginBtn.style.display = 'block';
        footerTologin.style.display = 'block';
        navLoginBtn.style.display = 'block';
    }

    signOutBtn.addEventListener('click', function() {
        signOutAndClearData()
    })

    navbarSignOutBtn.addEventListener('click', function() {
        signOutAndClearData()
    })

    navLoginLi.appendChild(navbarSignOutBtn);
    footerToLoginHolder.appendChild(signOutBtn);

    userBtn.style.display = "inline";
}


//FORGOT PASSWORD GET
let currentUserNameAndId = [];

let forgotUserNameInput = document.getElementById('forgotUsername');
let forgotPasswordInput = document.getElementById('forgotPasswordInput');
let reforgotPasswordInput = document.getElementById('reForgotPasswordInput');
let newPasswordSaveBtn = document.getElementById('newPasswordSaveBtn');

let passwordChangeAvailable = false;
let passwordsAreSame = false;

//ELFELEJTETT JELSZÓHOZ ADATOK LEKÉRÉSE

let userIdToChangePw;

function getUserName() {
    let userVerified = false;
    let userNameToSearch = forgotUserNameInput.value;
    database3.collection("users")
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('profiles')
        .where("userName", "==", userNameToSearch)
        .get()
        .then((dataList) => {
            dataList.forEach(element => {
                console.log(element.data().userName);
                console.log(element.id);
                if (element.data().userName === userNameToSearch) {
                    userVerified = true;
                    userNameIsMatch(element.data())
                    userIdToChangePw = element.id;
                    setTimeout(createGenerateRandomNumModal, 300);
                    setTimeout(forgotModalCloseWithoutReload, 280)
                    setTimeout(function() {
                        randomNumToConfirmBg.style.visibility = 'visible';
                        randomNumToConfirmBg.style.opacity = '1';
                        randomNumToConfirmBg.style.top = '0';
                    }, 350);
                }
            })
            if (!userVerified) {
                forgotUserNameError.style.display = 'block';
            }
        })
        .catch(err => console.log(err));
}



let forgotUserNameError = document.querySelector('.forgot-username-error');
let forgotPasswordError = document.querySelector('.forgot-password-error');

function userNameIsMatch(obj) {

    if (forgotUserNameInput.value === obj.userName) {
        let currentUserName = obj.userName; //array0
        let currentFullName = obj.fullName; //array1
        let currentEmail = obj.email; //array2
        let currentAdmin = obj.admin; //array3
        let currentId = obj.id;

        currentUserNameAndId.push({
            currentUserName: currentUserName,
            currentFullName: currentFullName,
            currentEmail: currentEmail,
            currentAdmin: currentAdmin,
            currentId: currentId
        });

        passwordChangeAvailable = true;
        forgotUserNameError.style.display = 'none';


    } else {
        forgotPasswordInput.disabled = true;
        reforgotPasswordInput.disabled = true;
        passwordChangeAvailable = false;
        forgotUserNameError.style.display = 'block';

    }
}

function passwordsAreMatch() {
    if (forgotPasswordInput.value === reforgotPasswordInput.value) {

        forgotPasswordError.style.display = 'none';
        passwordsAreSame = true;
    } else {
        forgotPasswordError.style.display = 'block';
        passwordsAreSame = false;
    }
}

forgotUserNameInput.addEventListener('change', function() {
    getUserName();
});


reforgotPasswordInput.addEventListener('change', function() {
    passwordsAreMatch();
    if (passwordChangeAvailable === true && passwordsAreSame === true) {
        newPasswordSaveBtn.disabled = false;
    }
});


newPasswordSaveBtn.addEventListener('click', function() {
    //ÚJ JELSZÓ TÖMBE PUSHOLÁSA
    currentUserNameAndId.push({
        newPassword: btoa(forgotPasswordInput.value)
    });
    //PUTRA ELŐKÉSZITÉS
    let userForgot = {
        userName: currentUserNameAndId[0].currentUserName,
        fullName: currentUserNameAndId[0].currentFullName,
        email: currentUserNameAndId[0].currentEmail,
        password: currentUserNameAndId[1].newPassword,
        //admin: currentUserNameAndId[0].currentAdmin
    }

    let userID = userIdToChangePw;

    passwordChanging(userID, userForgot);
    //alert('sikeresen jelszó változtatás');
    //OLDAL FRISSITÉSE
    //location.reload(true / false)
    //location.reload(true / false);
    setTimeout(currentUserNameAndId = [], 0);
});


//PASSWORD CHANGE

function passwordChanging(id, user) {

    //console.log(userID[0]);
    database3.collection('users')
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('profiles')
        .doc(id)
        .update(user)
        .then(() => console.log('pw changed'))
        .catch(err => console.log(err));

    //OLDAL FRISSITÉSE
   
    localStorage.setItem('forgotModal', true);
    setTimeout(forgotModalClose, 500);



    //setTimeout(location.reload(true / false), 2000)
}





// ----------------------- FIREBASE RANDOM NUM -------------------------------------


function getRandomNum() {
    //---------------
    database3
        .collection('randomNum')
        .doc('fpuWjLLT7vHo49XKl990')
        .collection('firstLetter')
        .get()
        .then((numList) => {
            numList.forEach(num => {
                readFirstNum(Object.values(num.data())[0])
            });
        })
        .catch(err => console.log(err))

    //-------------------
    database3
        .collection('randomNum')
        .doc('fpuWjLLT7vHo49XKl990')
        .collection('secondLetter')
        .get()
        .then((numList) => {
            numList.forEach(num => {
                readSecondNum(Object.values(num.data())[0])
            });
        })
        .catch(err => console.log(err))

    //-------------------
    database3
        .collection('randomNum')
        .doc('fpuWjLLT7vHo49XKl990')
        .collection('thirdLetter')
        .get()
        .then((numList) => {
            numList.forEach(num => {
                readThirdNum(Object.values(num.data())[0])
            });
        })
        .catch(err => console.log(err))

    //-------------------
    database3
        .collection('randomNum')
        .doc('fpuWjLLT7vHo49XKl990')
        .collection('fourthLetter')
        .get()
        .then((numList) => {
            numList.forEach(num => {
                readFourthNum(Object.values(num.data())[0])
            });
        })
        .catch(err => console.log(err))
}

let first,
    second,
    third,
    fourth;

function readFirstNum(num) {
    first = num;
}

function readSecondNum(num) {
    second = num;
}

function readThirdNum(num) {
    third = num;
}

function readFourthNum(num) {
    fourth = num;
}
let randomNum = 0;

function buildRandomNum() {
    getRandomNum();
    let numArr = [];
    numArr.push(first, second, third, fourth);
    randomNum = +numArr.join('');
    return randomNum;
}



//ELSŐ RANDOM SZÁMHOZ KELL
getRandomNum();

let randomNumTryCounter = 3;
const randomNumToConfirmBg = document.querySelector('.generate-confirm-code-modal-bg');

function createGenerateRandomNumModal() {

    let generateRandomNumModalTemplate =
        `
   <div class="register-modal">
     <h2>Enter the code below to confirm...</h2>
     <p id="randomNumHolder" style="font-size: 5rem">${buildRandomNum()}</p>
   <label for="confirmRandomNum">Enter the number</label>
   <div class="random-num-input-holder">
   <input type="text"  name="confirmRandomNum" id="randomNum1" 
        onkeyup="autotab('randomNum1', '1', 'randomNum2')" 
        maxlength="1" class="confirmRandomNumInput">


   <input type="text"  name="confirmRandomNum1" id="randomNum2" maxlength="1" 
          onkeyup="autotab('randomNum2', '1', 'randomNum3')"
        class="confirmRandomNumInput">


   <input type="text"  name="confirmRandomNum2" id="randomNum3" maxlength="1" 
      onkeyup="autotab('randomNum3', '1', 'randomNum4')"
         class="confirmRandomNumInput">


   <input type="text" onchange="validateRandomNum()" name="confirmRandomNum3" id="randomNum4" 
       onkeyup="autotab('randomNum4', '1', 'randomNum1')"
         maxlength="1" class="confirmRandomNumInput">
         
  </div>
    <small class="validate-random-num-error">Remaining tries:<small id="random-num-try">${randomNumTryCounter}</small></small>

   <span class="register-modal-close" onclick="randomNumModalClose()">&times;</span>
   </div>
   `

    randomNumToConfirmBg.innerHTML = generateRandomNumModalTemplate;
    registerOpenBtn = document.querySelector(".open-register");
}


function autotab(field1, len, field2) {
    if (document.getElementById(field1).value.length == len) {
        document.getElementById(field2).focus();
    }
}
//forgot pw modal újra látható
function changeForgotPwVisibility() {
    forgotModalBg.style.visibility = 'visible';
    forgotModalBg.style.opacity = '1';
}

function validateRandomNum() {
    let confirmNumInputArr = document.querySelectorAll('.confirmRandomNumInput');
    let strRandomNum = "" + randomNum;
    let randomNumArr = strRandomNum.split('');



    if ((confirmNumInputArr[0].value === randomNumArr[0]) &&
        (confirmNumInputArr[1].value === randomNumArr[1]) &&
        (confirmNumInputArr[2].value === randomNumArr[2]) &&
        (confirmNumInputArr[3].value === randomNumArr[3])) {
        setTimeout(randomNumModalClose, 400);
        setTimeout(changeForgotPwVisibility, 300);
        /* forgotModalBg.style.visibility = 'visible';
        forgotModalBg.style.opacity = '1'; */
        forgotUserNameInput.disabled = true;
        forgotPasswordInput.disabled = false;
        reforgotPasswordInput.disabled = false;
    } else {

        randomNumTryCounter--;
        //KÖVETKEZŐ RANDOM SZÁMOK
        buildRandomNum();
        setTimeout(document.querySelector('#randomNumHolder').innerText = randomNum, 0)
        for (let letter of confirmNumInputArr) {
            letter.value = '';
        }
        document.getElementById('random-num-try').innerHTML = randomNumTryCounter;
        setTimeout(runOutOfRandomNumTry, 200)
    }
}

function runOutOfRandomNumTry() {
    if (randomNumTryCounter === 0) {
        randomNumModalClose();
        setTimeout(forgotModalClose, 0);
        randomNumTryCounter = 3
    }
}


// ----------------------------------- REMEMBER ME -------------------------------------------

function checkCheckBox() {
    let checkBox = document.querySelector('#rememberMe');
    if (checkBox.checked) {
        setTimeout(requestUsers, 0)
            //requestUsers();
        rememberMeIsChecked = true;
    } else {
        setTimeout(requestUsers, 0)
        rememberMeIsChecked = false;

    }
}



function requestUsers() {
    database3.collection('users')
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('profiles')
        .get()
        .then((userList) => {
            let listOfUsers = []
            let listOfUserIds = []
            userList.forEach(user => {

                listOfUsers.push(user.data());
                listOfUserIds.push(user.id);

            })
            if (rememberMeIsChecked) {
                getUserToRemember(listOfUsers, listOfUserIds);
            } else {
                setUsersNotToRemember(listOfUserIds);
            }
        })
        .catch(err => console.log(err))
}


let userNameToRemember = document.getElementById('loginUsername');
function getUserToRemember(array, idArray) {

    //let userToRemember = [];
    //let indexOfUserId;
    let rememberUserId = [];
    for (let user in array) {
        if (userNameToRemember.value === array[user].userName) {
            userToRemember = array.splice(array.indexOf(array[user]), 1);
            indexOfUserId = array.indexOf(array[user]);
            rememberUserId = idArray.splice(array.indexOf(array[user]), 1);

        }
    }


    setTimeout(setUsersNotToRemember(idArray), 0);

    let changeLoggedInStatus = {
        lastLoggedIn: true
    }


    database3.collection("users")
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('profiles')
        .doc(rememberUserId[0])
        .update(changeLoggedInStatus)
        .then(() => console.log('updated'))
        .catch(err => console.log(err));


}


//--------------- MINDEN FELHASZNÁLÓ -1 SET FALSE --------------------- 

function setUsersNotToRemember(idArray) {


    for (let id of idArray) {
        let userToSetFalse = {
            lastLoggedIn: false
        }
        database3.collection("users")
            .doc('o7LaLJt4kg1JSncGrTnH')
            .collection('profiles')
            .doc(id)
            .update(userToSetFalse)
            .then(() => console.log('updated'))
            .catch(err => console.log(err));
    }

}


//---------------------- SET REMEMBERED USER DATAS ----------------------

(function setLastLoggedInUser() {
    let userToRemList = []
    database3.collection("users")
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('profiles')
        .where("lastLoggedIn", "==", true)
        .get()
        .then((userList) => {
            userList.forEach(user => {
                userToRemList.push(user.data())
            });
            setRemberedUserDatas(userToRemList)
        })
        .catch(err => console.log(err));
})();


function setRemberedUserDatas(user) {
    let loginUserNameInput = document.getElementById('loginUsername');
    let loginPasswordInput = document.getElementById('loginPassword');
    if (user.length > 0) {
        signInBtn.disabled = false;
        document.querySelector('#rememberMe').checked = true;
        loginUserNameInput.value = user[0].userName;
        loginPasswordInput.value = atob(user[0].password);
        getUser();
    } else {
        signInBtn.disabled = true;
        document.querySelector('#rememberMe').checked = false;
    }

}
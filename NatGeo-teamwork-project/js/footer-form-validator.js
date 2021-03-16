let nameInput = document.querySelector(".footer-form-name-input");
let emailInput = document.querySelector(".footer-form-email-input");
let subButton = document.querySelector(".footer-top-form-button-subscribe");
let unSubButton = document.querySelector(".footer-top-form-button-unsubscribe");
let modalUnsubButton = document.querySelector(".footer-modal-button");
let subscribeModalBg = document.querySelector('.subs-modal-bg');
let failModalBg = document.querySelector('.subs-fail-modal-bg');
let unSubModalBg = document.querySelector('.unSub-modal-bg');
let alertModalUnsub = document.querySelector('.alert-modal');
let database4 = firebase.firestore();




// --- INPUT VALIDATION ------


let nameInputValid = false;
let emailInputValid = false;

const validator = {
    name: /^[a-zéáűőúóíüöA-ZÉÁŰÚŐÍÖÜÓ]+( [a-zéáűőúóíüöA-ZÉÁŰÚÍŐÖÜÓ]+)+$/,
    email: /\S+@\S+\.\S+/,
    validate: function(input, type) {
        return input.match(this[type]) ? true : false;
    }
}

nameInput.onchange = () => {
    nameInputValid = validator.validate(nameInput.value, "name");
    subButton.disabled = allInputAreInValid();
}

emailInput.onchange = () => {
    emailInputValid = validator.validate(emailInput.value, "email")
    subButton.disabled = allInputAreInValid();
}


function allInputAreInValid() {
    return !(nameInputValid && emailInputValid);
}





function subsModalClose() {
    subscribeModalBg.style.visibility = 'hidden';
    subscribeModalBg.style.opacity = '0';
    failModalBg.style.visibility = 'hidden';
    failModalBg.style.opacity = '0';
    unSubModalBg.style.visibility = 'hidden';
    unSubModalBg.style.opacity = '0';

}



//-------------- SUCCES MODAL ---------------

const renderSuccesModal = () => {
    let succesTemplate =

        ` 
    <div class="register-modal" id="register-modal">
    <h2>Succesful subscription ${nameInput.value}!</h2>
    <p class="modal-body">
    We have sent an email to the given email address:  ${emailInput.value} 
    ` +
        `<br>` +
        ` 
    Please confirm it!
    </p>
    <p class="modal-footer">Thank you for choosing us!</p>
    <span class="register-modal-close" onclick="subsModalClose()">&times;</span>
    </div>
    
    `
    subscribeModalBg.innerHTML = succesTemplate;
}

//-------------- FAIL MODAL ---------------

const renderFailModal = () => {
    let failModalTemplate =
        `
    <div class="register-modal" id="fail-modal">
    <h2>Sorry to say that  ${nameInput.value}, but...</h2>
    <p class="modal-body">
    The given email address:  ${emailInput.value} ` +
        `<br>` +
        ` is already being used!
    </p>
    <p class="modal-footer">Please try another!</p>
    <span class="register-modal-close" onclick="subsModalClose()">&times;</span>
    </div>
    `
    failModalBg.innerHTML = failModalTemplate;
}

//-------------- UNSUB MODAL ---------------



const renderUnsubModal = () => {
    let unSubModalTemplate =
        `
    <div class="register-modal" id="unsub-modal">
    <h2>We're sorry, you chose that</h2>
    <p class="modal-body">
    Please enter your email address that you want to unsubscribe from` +
        `<input onchange="getBeforeDelete()" class="footer-modal-unsub-email" type="text" id="modalemail" name="modalemail"  placeholder="Your email address">` +
        `<br>` +
        ` 
    </p>
    <p class="modal-footer"><button id="unsub-modal-button" class="footer-modal-button register-modal-btn" onclick="clickAndDeleteUser()"  type="submit" disabled>UNSUBSCRIBE</button></p>
    <span class="register-modal-close" onclick="subsModalClose()">&times;</span>
    </div>
    `
    unSubModalBg.innerHTML = unSubModalTemplate;
}


const renderAlertUnsub = () => {
    let alertUnsubTemplate =
        `
    <div class="alert">
    <h3 class="alert-text"></h3>
    </div>
    `

    alertModalUnsub.innerHTML = alertUnsubTemplate;
}


//-------------- SUCCES MODAL ---------------

subButton.onclick = () => {
    //console.log('valami lesz');
    getBeforeSubmit();
}


subscribeModalBg.onclick = function(e) {
    if (e.target == subscribeModalBg) {
        subscribeModalBg.style.visibility = 'hidden';
        subscribeModalBg.style.opacity = '0';
        //saveUserToSubscribers();
    }
}


//--------- FAIL MODAL --------------


failModalBg.onclick = function(e) {
    if (e.target == failModalBg) {
        failModalBg.style.visibility = 'hidden';
        failModalBg.style.opacity = '0';
    }
}


//--------- UNSUB MODAL --------------

unSubButton.onclick = () => {
    //console.log('valami lesz');
    renderUnsubModal();
    unSubModalBg.style.visibility = 'visible';
    unSubModalBg.style.opacity = '1';
    unSubModalBg.style.top = '0';
}

unSubModalBg.onclick = function(e) {
    if (e.target == unSubModalBg) {
        unSubModalBg.style.visibility = 'hidden';
        unSubModalBg.style.opacity = '0';
    }
}




// ---------------FIREBASE REQUEST ---------------------


function saveUserToSubscribers() {
    const user = {
        name: nameInput.value,
        email: emailInput.value
    }
    database4.collection('users').doc('o7LaLJt4kg1JSncGrTnH').collection('subscribers').add(user)
        .then(data => console.log("user saved with: " + data.id))
        .catch(err => console.log(err))

}



function getBeforeSubmit() {
    let validSubsEmail = true;
    const emailToSearch = emailInput.value;
    database4.collection("users")
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('subscribers')
        .get()
        .then((dataList) => {
            dataList.forEach(user => {
                console.log(user.data())
                if (user.data().email === emailToSearch) {
                    console.log('nem ment')
                    validSubsEmail = false;
                    renderFailModal();
                    nameInput.value = '',
                    emailInput.value = '',
                    failModalBg.style.visibility = 'visible';
                    failModalBg.style.opacity = '1';
                    failModalBg.style.top = '0';
                }
            });
            if (validSubsEmail) {
                console.log('ment')
                renderSuccesModal();
                saveUserToSubscribers();
                nameInput.value = '',
                emailInput.value = '',
                subscribeModalBg.style.visibility = 'visible';
                subscribeModalBg.style.opacity = '1';
                subscribeModalBg.style.top = '0';
            }
        })
        .catch(err => console.log(err));
}



let userGlobalID;

function getBeforeDelete() {
    let unsubEmailInput = document.querySelector(".footer-modal-unsub-email").value;
    database4.collection("users")
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('subscribers')
        .where('email', '==', unsubEmailInput)
        .get()
        .then((dataList) => {
            dataList.forEach(user => {
                console.log(user.id);
                userGlobalID = user.id;
                document.querySelector('#unsub-modal-button').disabled = false;
            })
        })
}


function clickAndDeleteUser() {
    deleteFromServer();
    document.querySelector(".footer-modal-unsub-email").value = "";
    subsModalClose();  //modal bezárás
    renderAlertUnsub();  //oldal visszajelzés
    document.querySelector(".alert-text").innerText = "You have successfully unsubscribed.";
    setTimeout(closeAlert, 4000);
}

function closeAlert() {
    alertModalUnsub.style.display = "none";
}

function deleteFromServer() {
    //let unsubEmailInput = document.querySelector(".footer-modal-unsub-email");
    database4.collection('users')
        .doc('o7LaLJt4kg1JSncGrTnH')
        .collection('subscribers')
        // .doc(userGlobalID)
        .doc(userGlobalID)
        .delete()
        .then(() => console.log('user with' + userGlobalID + 'has been deleted'))
        .catch(err => console.log(err))



}
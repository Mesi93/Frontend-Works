// <!-- HEADER / NAVBAR --- J. GÁBOR -->

//HAMBURGER ICON
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector('.nav-toggle');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
    })
});

//DROP DOWN NAVBAR
const mainMenu = document.querySelector('.nav-main-menu');
const toggle = document.querySelector('.nav-toggle');


let switching = false;

(function mainMenuStyleTop() {
    if (switching !== true) {
        mainMenu.style.top = '-120%';
        document.body.style.overflow = 'auto';
    }
})();


toggle.addEventListener('click', () => {
    switching = !switching;

    if (switching) {
        mainMenu.style.display = 'flex';
        mainMenu.style.top = '0';
        mainMenu.style.zIndex = '100';
        document.body.style.overflow = 'hidden';

    } else {
        mainMenu.style.top = '-120%';
        document.body.style.overflow = 'auto';
    }
});

//WINDOW SIZE CHECKING
(function() {
    window.onresize = displayWindowSize;
    window.onload = displayWindowSize;

    let nameMenu = document.querySelectorAll('.nav-click')
    const navToggle = document.querySelector('.nav-toggle');

    function displayWindowSize() {
        let toggle = document.querySelector('.nav-toggle');
        let myWidth = window.innerWidth;
        //WIDE SCREEN 
        if (myWidth >= 1024) {
            mainMenu.style.display = '';
            mainMenu.style.top = '0%';
            document.body.style.overflow = 'auto';
            //document.body.style.overflowX = 'hidden';

            toggle.classList.remove('active');
            switching = false;

            //NAVBAR FIELDS CLICK 
            for (let i = 0; i < nameMenu.length; i++) {
                nameMenu[i].addEventListener('click', function() {

                    mainMenu.style.top = '0%';
                    document.body.style.overflow = 'auto';
                    navToggle.classList = 'nav-toggle';
                    switching = false;
                })
            }
        }


        //MOBIL AND TABLET VIEW
        if (myWidth < 1024) {
            for (let i = 0; i < nameMenu.length; i++) {
                nameMenu[i].addEventListener('click', function() {

                    mainMenu.style.top = '0%';
                    navToggle.classList = 'nav-toggle';
                    switching = false;
                    document.body.style.overflow = 'auto';
                })
            }


            for (let i = 0; i < nameMenu.length; i++) {
                nameMenu[i].addEventListener('click', function() {

                    mainMenu.style.top = '-120%';
                    navToggle.classList = 'nav-toggle';
                    switching = false;
                    document.body.style.overflow = 'auto';
                })

            }
        }
    };
})()

//PHOTO UPLOAD MODAL
let modalBtn = document.querySelector('.home-button');
let modalBg = document.querySelector('.home-modal-bg');

modalBtn.addEventListener('click', function() {

    modalBg.style.visibility = 'visible';
    modalBg.style.opacity = '1';
    modalBg.style.top = '0';
});


const modalClose = () => {
    modalBg.style.visibility = 'hidden';
    modalBg.style.opacity = '0';

}

window.onclick = function(event) {
    if (event.target == modalBg) {
        modalBg.style.visibility = 'hidden';
        modalBg.style.opacity = '0';
        modalBg.innerHTML = '';

    }
}


//FIREBASE

let dataBase5 = firebase.firestore();
let learnMoreBtn = document.querySelector('.home-button');
learnMoreBtn.addEventListener('click', function() {
    let topicList = ["wildlife", "cities", "people", "landscapes", "adventure", "goldenhour"];
    let getRandomNum = Math.floor(Math.random() * topicList.length);
    let randomTopic = topicList[getRandomNum];
    let blogList = [];
    dataBase5
        .collection("blogs")
        .doc('1iNgBmOfYxCRVaCfYwEF')
        .collection(`${randomTopic}`)
        .where("allowedToPost", "==", true)
        .get()
        .then((dataList) => {
            dataList.forEach(blog => {
                blogList.push(blog.data());

            });
            setTimeout(getModal(blogList), 600);
        })
        .catch(err => console.log(err));
})

function getModal(blogList) {
    for (let i = 0; i < blogList.length; i++) {
        let randomNum = Math.floor(Math.random() * blogList.length);
        let modalTemplate = '';
        modalTemplate =
            `
    <div class="home-modal">
      <h2>${blogList[randomNum].title}</h2>
      <div class="home-modal-img-holder">
      <img src="${blogList[randomNum].url}" alt="">
      </<div>
      <p>Author: ${blogList[randomNum].author}</p>
    <a href="../html/blog/article.html#categories-wrapper" class="home-uploaded"; onclick="setPhotoModalLocalStorage()";>Upload your images</a>
    <span class="home-modal-close" onclick="modalClose()">&times;</span>
      </div>
    
    `
        modalBg.innerHTML = modalTemplate;
    }

}

function setPhotoModalLocalStorage() {
    localStorage.setItem('PhotoModal', 'True');
}
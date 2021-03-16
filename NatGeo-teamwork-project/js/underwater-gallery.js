// <!-- UNDERWATER-GALLERY LIGHTBOX --- G. EMESE -->

const mySlides = document.querySelectorAll(".mySlides");
//console.log(mySlides);


//******************** GET ********************

const photos = [];

window.addEventListener("load", function() {

    const URL = "http://localhost:3000/photos";
    const param = {
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        method: 'GET'
    }
    const result = fetch(URL, param);
    result
        .then(data => data.json())
        .then(response => {
            let photoList = response;
            for (let photo of photoList) {
                photos.push({
                    url: photo.url
                })
            }
            renderBasicGallery();
            renderLightBox();
            renderSmallPics();
        })
        .catch(error => console.log(error))
});


//******************** ID generátor ********************
function IDgenerator() {
    let id = 1;
    for (let i = 0; i < photos.length; i++) {
        photos[i].id = id;
        id++
    }
}

//******************* Render gallery ********************
const renderBasicGallery = () => {
    IDgenerator();
    let htmlTemplate = "";
    for (let i = 0; i < photos.length; i++) {
        /* console.log(photos[i]); */
        htmlTemplate +=
            `
            <div class="img-container";>
                  <img onclick="openModal();currentSlide(${photos[i].id})" src="${photos[i].url}" alt="underwater-photo">
              </div>
           
           `;
    }
    let row = `<div class='row'>${htmlTemplate}</div>`
    document.querySelector('.underwater-gallery').innerHTML += row;
}

const renderLightBox = () => {
    let htmlTemplate2 = "";
    for (let i = 0; i < photos.length; i++) {
        htmlTemplate2 +=
            `
        <div class="mySlides fade">
              <img src="${photos[i].url}" alt="underwater-photo" style="width:100%; max-height:750px; id="top">
          </div>
       `;
    }
    document.querySelector('.modal-content').innerHTML += htmlTemplate2;
}

const renderSmallPics = () => {
    IDgenerator();
    let htmlTemplate3 = "";
    for (let i = 0; i < photos.length; i++) {
        htmlTemplate3 +=
            `
        <div class="img-container">
              <img src="${photos[i].url}" onclick="currentSlide(${photos[i].id});" class="mini-pic cursor" alt="underwater-photo" style="width:100%;">
          </div>
       `;
    }
    document.querySelector('.modal-content').innerHTML += htmlTemplate3;
}



//******************* Open Modal ********************
let style = document.createElement("style");

function openModal() {
    if (window.innerWidth > 768) {
        document.getElementById("myModal").style.display = "block";
    }
    style.innerHTML = `body::-webkit-scrollbar{width: 0px; background: transparent;}`;
    document.head.appendChild(style);
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
    style.innerHTML = `body::-webkit-scrollbar-thumb{all:unset}`;
    document.head.appendChild(style);
}

let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides() {
    let slides = document.getElementsByClassName("mySlides");
    //console.log(slides);
    let miniPics = document.getElementsByClassName("mini-pic");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < miniPics.length; i++) {
        miniPics[i].className = miniPics[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    miniPics[slideIndex - 1].className += " active";
    if (slideIndex === 1) {
        let prev = document.querySelector('.prev');
        prev.style.display = 'none';
    } else {
        prev.style.display = 'block';
    }
    if (slideIndex === 24) {
        let next = document.querySelector('.next');
        next.style.display = 'none';
    } else {
        next.style.display = 'block';
    }
}


let modal = document.querySelector('.underwater-gallery');
modal.onclick = function() {
    let closeBtn = document.getElementById("close");
    closeBtn.scrollIntoViewIfNeeded();
}
// <!-- HEADER / NAVBAR --- J. GÁBOR -->
let listOfData = [];

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
(function () {
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

      toggle.classList.remove('active');
      switching = false;

      //NAVBAR FIELDS CLICK 
      for (let i = 0; i < nameMenu.length; i++) {
        nameMenu[i].addEventListener('click', function () {

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
        nameMenu[i].addEventListener('click', function () {

          mainMenu.style.top = '0%';
          document.body.style.overflow = 'auto';
          navToggle.classList = 'nav-toggle';
          switching = false;
        })
      }


      for (let i = 0; i < nameMenu.length; i++) {
        nameMenu[i].addEventListener('click', function () {

          mainMenu.style.top = '-120%';
          document.body.style.overflow = 'auto';
          navToggle.classList = 'nav-toggle';
          switching = false;
        })

      }
    }
  };
})()




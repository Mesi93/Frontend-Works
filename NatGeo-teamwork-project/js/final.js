let dataBase2 = firebase.firestore();

const storyContainer = document.getElementById('slidestory-container');
const imgContainer = document.getElementById('slideshow-container');
let stories = [];
let images = [];
window.addEventListener('load', () => {


    function renderStoryList(parent) { //HTML elem gyártósor STORY
        for (let i = 0; i < stories.length; i++) {
            let story = stories[i];
            let timeStampMsc = Date.parse(story.date);
            let timeStampDate = new Date(timeStampMsc);
            let timeStampCorrectDate = timeStampDate.toDateString();

            const slideStory = document.createElement('div');
            slideStory.className = 'mySlides ';
            slideStory.id = 'mySlides-id';

            const slideTitle = document.createElement('span');
            slideTitle.id = 'slide-title';
            slideTitle.innerHTML = story.title.toUpperCase();

            const numbertext = document.createElement('p');
            numbertext.id = 'numbertext';
            numbertext.innerHTML = 'UPLOADED: ' + timeStampCorrectDate;

            const slideAuthor = document.createElement('p');
            slideAuthor.id = 'slide-author';
            slideAuthor.innerHTML = 'BY ' + story.author.toUpperCase();

            const slideArticle = document.createElement('p');
            slideArticle.id = 'slide-article';
            slideArticle.innerHTML = story.article;

            slideStory.appendChild(slideTitle);
            slideStory.appendChild(numbertext);
            slideStory.appendChild(slideAuthor);
            slideStory.appendChild(slideArticle);
            parent.appendChild(slideStory);
        }
    }

    function renderImgList(parent2) { //HTML elem gyártósor IMG
        for (let i = 0; i < images.length; i++) {
            let img = images[i];

            const mySlides = document.createElement('div');
            mySlides.className = 'mySlides fade';

            const imgBlock = document.createElement('img');
            imgBlock.src = img.url;
            //imgBlock.className = 'setHeightImg';

            mySlides.appendChild(imgBlock);
            parent2.appendChild(mySlides);

        }
    }
    //-------------------------- FIREBASE

    getBlogList()


    function startSortFunction(a, b) {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateA < dateB ? 1 : -1;
    };


    function getBlogList() {
        //READ KÉRÉS

        dataBase2.collection("blogs")
            .doc('1iNgBmOfYxCRVaCfYwEF')
            .collection("adventure")
            .where("allowedToPost", "==", true)
            .get()
            .then((dataList) => {
                stories = [];
                images = [];
                let id = 1;
                dataList.forEach(blog => {
                    //console.log(blog.data());
                    stories.unshift({
                        title: blog.data().title,
                        author: blog.data().author,
                        article: blog.data().article,
                        date: blog.data().date,
                        id: id
                    })
                    images.unshift({
                        url: blog.data().url
                    });
                    id++;
                })
                stories.sort(startSortFunction);
                renderStoryList(storyContainer);
                renderImgList(imgContainer);

                showSlides(1, 0);
                showSlides(1, 1);

            })
            .catch(err => console.log(err));
    }


    //-----------------------FIREBASE ^

})

// ---------------------------------------------------------- ONLOAD VÉGE ------------------------------------------------


function generateSlideArrows() {
    slideArrowsTemplate = `
        <a class="prev" onclick="navAllSlides(-1)">&#10094;</a>  
        <a class="next" onclick="navAllSlides(1)">&#10095;</a>
    `
    imgContainer.innerHTML = slideArrowsTemplate;
}



//----------------------------------- FIREBASE
function getBlogList(actTopic) {
    //READ KÉRÉS
    imgContainer.innerHTML = '';
    storyContainer.innerHTML = '';
    generateSlideArrows();

    dataBase2.collection("blogs")
        .doc('1iNgBmOfYxCRVaCfYwEF')
        .collection(actTopic)
        .where("allowedToPost", "==", true)
        .get()
        .then((dataList) => {
            //console.log(actTopic)
            stories = [];
            images = [];
            dataList.forEach(blog => {
                //console.log(blog.data());
                stories.unshift({
                    title: blog.data().title,
                    author: blog.data().author,
                    article: blog.data().article,
                    date: blog.data().date,
                })
                images.unshift({
                    url: blog.data().url
                });
            })
            stories.sort(sortFunction);
            renderActStoryList(storyContainer);
            renderActImgList(imgContainer);

            showSlides(1, 0);
            showSlides(1, 1);
        })
        .catch(err => console.log(err));
}

function sortFunction(a, b) {
    var dateA = new Date(a.date);
    var dateB = new Date(b.date);
    return dateA < dateB ? 1 : -1;
};


//---------------------------------- FIREBASE ^ 
function renderActStoryList(parent) { //HTML elem gyártósor STORY
    for (let i = 0; i < stories.length; i++) {
        let story = stories[i];
        let timeStampMsc = Date.parse(story.date);
        let timeStampDate = new Date(timeStampMsc);
        let timeStampCorrectDate = timeStampDate.toDateString();

        const slideStory = document.createElement('div');
        slideStory.className = 'mySlides '; //setHeightStory

        const slideTitle = document.createElement('span');
        slideTitle.id = 'slide-title';
        slideTitle.innerHTML = story.title.toUpperCase();

        const numbertext = document.createElement('p');
        numbertext.id = 'numbertext';
        numbertext.innerHTML = 'UPLOADED: ' + timeStampCorrectDate;

        const slideAuthor = document.createElement('p');
        slideAuthor.id = 'slide-author';
        slideAuthor.innerHTML = 'BY ' + story.author.toUpperCase();

        const slideArticle = document.createElement('p');
        slideArticle.id = 'slide-article';
        slideArticle.innerHTML = story.article;

        slideStory.appendChild(slideTitle);
        slideStory.appendChild(numbertext);
        slideStory.appendChild(slideAuthor);
        slideStory.appendChild(slideArticle);
        parent.appendChild(slideStory);
    }
}


function renderActImgList(parent2) { //HTML elem gyártósor IMG
    for (let i = 0; i < images.length; i++) {
        let img = images[i];

        const mySlides = document.createElement('div');
        mySlides.className = 'mySlides fade';

        const imgBlock = document.createElement('img');
        imgBlock.src = img.url;
        //imgBlock.className = 'setHeightImg';

        mySlides.appendChild(imgBlock);
        parent2.appendChild(mySlides);

    }
}

//--------------------------------------------------SLIDE-MŰKÖDÉS-------------------------------------------------------

let slideIndex = [0, 0]; //melyik szöveggel és melyik képpel kezd!!!!!!!!!!!!   
let slideId = ["slideshow-container", "slidestory-container"] //a két container


function navSlides(direction, whichSlide) { //melyik képet melyik slideból mozditom
    showSlides(slideIndex[whichSlide] += direction, whichSlide);
}

function navAllSlides(direction) {
    for (let i = 0; i < slideId.length; i++) { //i a két slide boxon megy végig, direction irányba mozdul egyet a direction 
        navSlides(direction, i); //irányába aka a kép id-ja nő vagy csökken.
    }
}

function showSlides(whichPicture, whichSlide) { //whichPicture === ImgWrapper divek

    let container = document.getElementById(slideId[whichSlide]);
    let allImgWrapper = container.getElementsByClassName('mySlides');

    if (whichPicture >= allImgWrapper.length) { slideIndex[whichSlide] = 0 }
    if (whichPicture < 0) { slideIndex[whichSlide] = allImgWrapper.length - 1 }
    for (let i = 0; i < allImgWrapper.length; i++) {
        allImgWrapper[i].style.display = "none";
    }
    allImgWrapper[slideIndex[whichSlide]].style.display = "block";
}


//----------------------------------BUTTONS-EFFECT------------------------------------------
let btns = document.getElementsByClassName("btn");
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}

//----------------------------------------MODAL--------------------------------------------------
let topicModal = document.getElementsByClassName("topic-register-modal-bg")[0];

function topicModalGenerator() {
    let topicModalTemplate = `
    <section class="form-container register-modal">
            <form action="javascript:void(0)" name="form">

                <label for="slideAuthor">Your Name</label>
                <input type="text" id="slideAuthor" name="slideAuthor" onchange="authorvalidator()">
                <small class="error-author">Wrong Name</small>

                <label for="topic">Choose a topic:</label>
                <select id="topic" name="topic" onchange="topicSelected()" value=''>
                      <option id="basic" selected disabled hidden value='basic'></option>
                      <option id="wildlife" value="wildlife">Wildlife</option>
                      <option id="landscapes" value="landscapes">Landscapes</option>
                      <option id="adventure" value="adventure">Adventure</option>
                      <option id="cities" value="cities">Cities</option>
                      <option id="people" value="people">People</option>
                      <option id="goldenhour" value="goldenhour">Goldenhour</option>
                    </select>
                <small class="error-topic">Choose a topic!</small>

                <label for="slideTitle">Article Title</label>
                <input type="text" id="slideTitle" name="slideTitle" onchange="titlevalidator()">
                <small class="error-title">Wrong Title</small>

                <label for="slideArticle">Article</label>
                <textarea id="slideArticle" name="slideArticle"></textarea>

                <label for="slideUrl">Img Url</label>
                <input type="text" id="slideUrl" name="slideUrl" onchange="urlvalidator()">
                <small class="error-url">Wrong Url</small>

                <button id="button" type="button" onclick="sendBlogData(); topicModalClose()" disabled>Send</button>

                <span class="topic-modal-close" onclick="topicModalClose()">&times;</span>

            </form>
        </section>
    `
    topicModal.innerHTML = topicModalTemplate
};

function openTopicModal() {
    let userAlreadySingIn = localStorage.getItem('user') ? true : false;
    if (userAlreadySingIn) {
        topicModalGenerator();
        topicModal.style.visibility = 'visible';
        topicModal.style.opacity = '1';
        topicModal.style.top = '0';
    }
};

topicModal.onclick = function(event) {
    if (event.target == topicModal) {
        topicModal.style.visibility = 'hidden';
        topicModal.style.opacity = '0';
    }
}

function topicModalClose() {
    topicModal.style.visibility = 'hidden';
    topicModal.style.opacity = '0';
};

(function checkPhotoModalLocalStorage() {
    let photoModalStorageTrue = localStorage.getItem('PhotoModal') ? true : false;
    if (photoModalStorageTrue) {
        openTopicModal();
        setTimeout(localStorage.removeItem('PhotoModal'), 1000);
    }
})();



/*********************** BLOG CARDS TO BLOGS **********************/


(function checkBlogLocalStorage() {
    if (localStorage.getItem('firstBlog')) {
        localStorage.removeItem('firstBlog');
        setTimeout(getfirstBlog, 500);
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        btns[3].className += " active";
    }
    if (localStorage.getItem('secondBlog')) {
        setTimeout(getsecondBlog(), 500)
        localStorage.removeItem('secondBlog');
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        btns[1].className += " active";
    }
    if (localStorage.getItem('thirdBlog')) {
        setTimeout(getthirdBlog(), 500)
        localStorage.removeItem('thirdBlog');
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        btns[1].className += " active";
    }
    if (localStorage.getItem('fourthBlog')) {
        setTimeout(getfourthBlog(), 500)
        localStorage.removeItem('fourthBlog');
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        btns[1].className += " active";

    }
})();


//-------------------- GET BLOGCARDS 

function getfirstBlog() {
    imgContainer.innerHTML = '';
    storyContainer.innerHTML = '';
    dataBase2.collection("blogs")
        .doc('1iNgBmOfYxCRVaCfYwEF')
        .collection("adventure")
        .where("title", "==", "TORRES DEL PAINE")
        .get()
        .then((dataList) => {
            stories = [];
            images = [];
            let id = 1;
            dataList.forEach(blog => {
                //console.log(blog.data());

                stories.unshift({
                    title: blog.data().title,
                    author: blog.data().author,
                    article: blog.data().article,
                    date: blog.data().date,
                    id: id
                })
                images.unshift({
                    url: blog.data().url
                });
                id++;
            })
            renderActStoryList(storyContainer);
            renderActImgList(imgContainer);
            showSlides(1, 0);
            showSlides(1, 1);
        })
        .catch(err => console.log(err));
}


function getsecondBlog() {
    imgContainer.innerHTML = '';
    storyContainer.innerHTML = '';
    dataBase2.collection("blogs")
        .doc('1iNgBmOfYxCRVaCfYwEF')
        .collection("landscapes")
        .where("title", "==", "PÓRSMÖRK IN ICELAND")
        .get()
        .then((dataList) => {
            stories = [];
            images = [];
            let id = 1;
            dataList.forEach(blog => {
                stories.unshift({
                    title: blog.data().title,
                    author: blog.data().author,
                    article: blog.data().article,
                    date: blog.data().date,
                    id: id
                })
                images.unshift({
                    url: blog.data().url
                });
                id++;
            })
            renderActStoryList(storyContainer);
            renderActImgList(imgContainer);
            showSlides(1, 0);
            showSlides(1, 1);
        })
        .catch(err => console.log(err));
}

function getthirdBlog() {
    imgContainer.innerHTML = '';
    storyContainer.innerHTML = '';
    dataBase2.collection("blogs")
        .doc('1iNgBmOfYxCRVaCfYwEF')
        .collection("landscapes")
        .where("title", "==", "MORAINE LAKE")
        .get()
        .then((dataList) => {
            stories = [];
            images = [];
            let id = 1;
            dataList.forEach(blog => {
                stories.unshift({
                    title: blog.data().title,
                    author: blog.data().author,
                    article: blog.data().article,
                    date: blog.data().date,
                    id: id
                })
                images.unshift({
                    url: blog.data().url
                });
                id++;
            })
            renderActStoryList(storyContainer);
            renderActImgList(imgContainer);
            showSlides(1, 0);
            showSlides(1, 1);
        })
        .catch(err => console.log(err));
}

function getfourthBlog() {
    imgContainer.innerHTML = '';
    storyContainer.innerHTML = '';
    dataBase2.collection("blogs")
        .doc('1iNgBmOfYxCRVaCfYwEF')
        .collection("landscapes")
        .where("title", "==", "Highest residental building in Asia")
        .get()
        .then((dataList) => {
            stories = [];
            images = [];
            let id = 1;
            dataList.forEach(blog => {
                stories.unshift({
                    title: blog.data().title,
                    author: blog.data().author,
                    article: blog.data().article,
                    date: blog.data().date,
                    id: id
                })
                images.unshift({
                    url: blog.data().url
                });
                id++;
            })
            renderActStoryList(storyContainer);
            renderActImgList(imgContainer);
            showSlides(1, 0);
            showSlides(1, 1);
        })
        .catch(err => console.log(err));
}
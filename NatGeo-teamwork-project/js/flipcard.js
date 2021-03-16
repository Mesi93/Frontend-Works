// <!-- FLIPCARD ONCLICK --- G. EMESE -->

let dataBase6 = firebase.firestore();
let blogIds = [];
/****************** RENDER FLIPCARDS FIREBASE *******************/

window.addEventListener("load", function() {
    let cardsArray = [];

    dataBase6.collection("blogs")
        .doc('1iNgBmOfYxCRVaCfYwEF')
        .collection('blogcards')
        .get()
        .then((dataList) => {
            dataList.forEach(blog => {
                cardsArray.push(blog.data());
                blogIds.push(blog.id);
            });
            setTimeout(renderBlogCards(cardsArray), 600);
        })
        .catch(err => console.log(err));
});

function renderBlogCards(cardsArray) {
    let urlToArticles = '../html/blog/article.html'
    blogCardHTML = "";
    let readmeId = 0;
    for (let card of cardsArray) {
        blogCardHTML +=
            `
    <div class="blog-card">
    <div class="blog-card-inner" onclick="flip(event); clickCard()"  style="transform:rotateY(0deg);">
        <div class="blog-card-front">
            <div class="blog-card-img-holder">
                <img src="${card.url}" alt="${card.backtitle}">
            </div>
            <div class="blog-card-text">
                <p>${card.title}</p>
                <p>${card.author}</p>
            </div>
        </div>
        <div class="blog-card-back">
            <h1>${card.backtitle}</h1>
            <p>${card.text}</p>
            <a href="${urlToArticles}" class="read-me-btn" id="blogId-${readmeId}">
                <div class="btn-toggle">
                    <span class="btn-span"></span>
                    <span class="btn-span"></span>
                    <span class="btn-span"></span>
                </div>READ MORE</a>
        </div>
    </div>
</div>
    `
        readmeId++
    }

    let blogPosts = document.querySelector(".blog-posts");
    blogPosts.innerHTML += blogCardHTML;
}



/********** READMORE TO BLOG ***********/


function clickCard() {
    let firstBtn = document.getElementById("blogId-0");
    firstBtn.onclick = function() {
        localStorage.setItem('firstBlog', 'True');
    }
    let secondBtn = document.getElementById("blogId-1");
    secondBtn.onclick = function() {
        localStorage.setItem('secondBlog', 'True');
    }
    let thirdBtn = document.getElementById('blogId-2');
    thirdBtn.onclick = function() {
        localStorage.setItem('thirdBlog', 'True');
    }
    let fourthBtn = document.getElementById('blogId-3');
    fourthBtn.onclick = function() {
        localStorage.setItem('fourthBlog', 'True');
    }
}


/********** FLIPCARD ANIMATION ***********/

function flip(event) {
    let element = event.currentTarget;
    if (element.className === "blog-card-inner") {
        if (element.style.transform == "rotateY(180deg)") {
            element.style.transform = "rotateY(0deg)";
        } else {
            element.style.transform = "rotateY(180deg)";
            flipOnlyOne();
        }
    }
};

function flipBack() {
    let blogCards = document.querySelectorAll(".blog-card-inner");
    for (let i = 0; i < blogCards.length; i++) {
        blogCards[i].style.transform = "rotateY(0deg)"
    }
};

function flipOnlyOne() {
    let blogCards = document.querySelectorAll(".blog-card-inner");
    for (let i = 0; i < blogCards.length; i++) {
        blogCards[i].addEventListener("click", function() {
            let rotatedCard = blogCards[i];
            let rotatedCardLength = 0;
            for (let y = 0; y < blogCards.length; y++) {
                if (blogCards[y].style.transform === "rotateY(180deg)") {
                    rotatedCardLength++;
                }
            }
            if (rotatedCardLength > 1) {
                flipBack();
                rotatedCard.style.transform = "rotateY(180deg)";
            }
        })
    }
}
//ADATBÁZIS
let dataBase = firebase.firestore();
let topics = ['adventure', 'cities', 'people', 'goldenhour', 'landscapes', 'wildlife'];
let blogIds = [];
let getBlogsSwitch = false;

let switchBtn = document.querySelector('.switch-input')

function setBtnStatusToLocalStorage() {
    localStorage.setItem('btn', JSON.stringify({
        btnStatus: getBlogsSwitch,
    }));
}

//CHECK BTN STATUS
(function checkBtnStatusLocalStorage() {
    if (JSON.parse(localStorage.getItem('btn')).btnStatus === false) {
        getBlogsSwitch = false;
    } else {
        let title = document.querySelector('#admin-title');
        title.innerHTML = `ADMIN PANEL 
        <svg height="10" width="80">
        <line x1="20" y1="0" x2="60" y2="0" style="stroke:#fffdfd;stroke-width:4" />
        </svg> 
        CONFIRMED`;
        getBlogsSwitch = true;
        switchBtn.checked = true;
    }
})();

(function getBlogList() {
    //READ KÉRÉS
    for (let i = 0; i < topics.length; i++) {
        let actTopic = topics[i];
        dataBase.collection("blogs")
            .doc('1iNgBmOfYxCRVaCfYwEF')
            .collection(`${topics[i]}`)
            .where("allowedToPost", "==", getBlogsSwitch)
            .get()
            .then((dataList) => {
                dataList.forEach(blog => {
                    if(getBlogsSwitch){
                        renderBlogCardsWithOneButton(blog.data(), actTopic);
                        blogIds.push(blog.id);
                    }else{
                        renderBlogCardsWithTwoButtons(blog.data(), actTopic);
                        blogIds.push(blog.id);
                    }
                });
            })
            .catch(err => console.log(err));
    }
})();



function switchBlogs(){
    if(switchBtn.checked){
        //console.log('checked');
        getBlogsSwitch = true;
        setBtnStatusToLocalStorage()
        setTimeout(location.reload(true/false), 400);
    } else {
        //console.log('unchecked');
        getBlogsSwitch = false;
        setBtnStatusToLocalStorage()
        setTimeout(location.reload(true/false), 400)       
    }
}


// if(getBlogsSwitch){
//     btns[i].style.display = 'none';
//     console.log('mivan');
// } 

function renderBlogCardsWithTwoButtons(blog, topic) {
    let adminTemplate = "";
    adminTemplate +=
        `
        <div class="admin-card-holder">
            <div class="admin-blog-holder">
                <div class="admin-blog-img-holder">
                    <img src="${blog.url}" alt="">
                </div>
                <div class="admin-blog-text-holder">
                    <h3>${blog.title}</h3>
                    <h5>Author: ${blog.author}</h5>
                    <h6 id="blogTopic">${topic}</h6>

                    <p>${blog.article}</p>
                </div>
            </div>
            <div class="admin-card-button-holder">
            <button class="admin-card-button" id="admin-confirm-button">CONFIRM <i class="fas fa-check"></i></button>
            <button class="admin-card-button admin-delete-btn" id="admin-decline-button">DELETE <i class="fas fa-times"></i></button>
            </div>
        </div>
`;

    let flexContainer = document.querySelector('.admin-flex-holder');
    flexContainer.innerHTML += adminTemplate;
}
function renderBlogCardsWithOneButton(blog, topic) {
    let adminTemplate = "";
    adminTemplate +=
        `
        <div class="admin-card-holder">
            <div class="admin-blog-holder">
                <div class="admin-blog-img-holder">
                    <img src="${blog.url}" alt="">
                </div>
                <div class="admin-blog-text-holder">
                    <h3>${blog.title}</h3>
                    <h5>Author: ${blog.author}</h5>
                    <h6 id="blogTopic">${topic}</h6>

                    <p>${blog.article}</p>
                </div>
            </div>
            <div class="admin-card-button-holder">
            <button class="admin-card-button admin-remove-btn" id="admin-decline-button">REMOVE <i class="fas fa-times"></i></button>
            </div>
        </div>
`;

    let flexContainer = document.querySelector('.admin-flex-holder');
    flexContainer.innerHTML += adminTemplate;
}


//CONFIM BUTTONS LEKÉRÉSE
function countButtons() {
    let btns = document.querySelectorAll("#admin-confirm-button");
    let declinebtns = document.querySelectorAll("#admin-decline-button");
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function() {
            let topic = document.querySelectorAll('#blogTopic')[i].innerText;
            postBlogs(blogIds[i], topic);
            let card = document.querySelectorAll('.admin-card-holder')[i];
            card.style.opacity = "0.3";
            btns[i].innerText = "CONFIRMED";
            declinebtns[i].disabled = true;
            declinebtns[i].style.background = "black";
            btns[i].disabled = true;
            btns[i].style.background = "black";
        })
    }
}


//DELETE BUTTONS LEKÉRÉSE
function countDeleteButtons() {
    let btns = document.querySelectorAll("#admin-confirm-button");
    let declinebtns = document.querySelectorAll(".admin-delete-btn");
    for (let i = 0; i < declinebtns.length; i++) {
        declinebtns[i].addEventListener('click', function() {
            let topic = document.querySelectorAll('#blogTopic')[i].innerText;
            declineBlogs(blogIds[i], topic);
            let card = document.querySelectorAll('.admin-card-holder')[i];
            card.style.opacity = "0.3";
            declinebtns[i].innerText = "DELETED";
            declinebtns[i].disabled = true;
            declinebtns[i].style.background = "black";
            btns[i].disabled = true;
            btns[i].style.background = "black";
        })
    }
}
//REMOVE BUTTONS LEKÉRÉSE
function countRemoveButtons() {
    let declinebtns = document.querySelectorAll(".admin-remove-btn");
    for (let i = 0; i < declinebtns.length; i++) {
        declinebtns[i].addEventListener('click', function() {
            let topic = document.querySelectorAll('#blogTopic')[i].innerText;
            removeBlogs(blogIds[i], topic);
            let card = document.querySelectorAll('.admin-card-holder')[i];
            card.style.opacity = "0.3";
            declinebtns[i].innerText = "REMOVED";
            declinebtns[i].disabled = true;
            declinebtns[i].style.background = "black";
        })
    }
}


//RenderBlogCards() BEVÁRÁSA
setTimeout(countButtons, 1500);

//RenderBlogCards() BEVÁRÁSA
setTimeout(countDeleteButtons, 1500);

//RenderBlogCards() BEVÁRÁSA
setTimeout(countRemoveButtons, 1500);



//PUT KÜLDÉS
function postBlogs(id, topic) {
    let switchAllowed = {
        allowedToPost: true
    }

    dataBase.collection("blogs")
        .doc('1iNgBmOfYxCRVaCfYwEF')
        .collection(topic)
        .doc(id)
        .update(switchAllowed)
        .then(() => console.log('updated'))
        .catch(err => console.log(err));
}
//PUT/remove KÜLDÉS
function removeBlogs(id, topic) {
    let switchAllowed = {
        allowedToPost: false
    }

    dataBase.collection("blogs")
        .doc('1iNgBmOfYxCRVaCfYwEF')
        .collection(topic)
        .doc(id)
        .update(switchAllowed)
        .then(() => console.log('removed'))
        .catch(err => console.log(err));
}

//ADATBÁZISBÓL TÖRLÉS
function declineBlogs(id, topic) {
    let declineBlogid = id;

    dataBase.collection("blogs")
        .doc('1iNgBmOfYxCRVaCfYwEF')
        .collection(topic)
        .doc(declineBlogid)
        .delete()
        .then(() => console.log('Blog with' + id + "has declined"))
        .catch(err => console.log(err));
}


function signAdminOut() {
    localStorage.clear();
    document.cookie = `user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

let titleIsValid = false;
let authorIsValid = false;
let urlIsValid = false;
let topicIsValid = false;

var topicValidators = {
    pattern: {
        titlePattern: /^[a-zéáöüűéA-ZÉÁŐÜÖÓÚ ]{2}/,
        authorPattern: /^[a-zéáűőúóíüöA-ZÉÁŰÚŐÍÖÜÓ]+( [a-zéáűőúóíüöA-ZÉÁŰÚÍŐÖÜÓ]+)+$/,
        urlPattern: /^https?:\/\/[a-zA-Z0-9\/\-\?=%\.&]{1,256}$/
    },
    validate: function(text, type) {
        return text.match(this.pattern[type]) ? true : false;
    }
}

function titlevalidator() {
    let titleInput = document.getElementById('slideTitle');
    titleIsValid = topicValidators.validate(titleInput.value, "titlePattern")
    document.querySelector('.error-title').style.display = titleIsValid ? 'none' : 'block';
    button.disabled = allInputAreNotValid();
    topicSelected();
}

function authorvalidator() {
    let authorInput = document.getElementById('slideAuthor');
    authorIsValid = topicValidators.validate(authorInput.value, "authorPattern")
    document.querySelector('.error-author').style.display = authorIsValid ? 'none' : 'block';
    button.disabled = allInputAreNotValid();
}

function urlvalidator() {
    let urlInput = document.getElementById('slideUrl');
    urlIsValid = topicValidators.validate(urlInput.value, "urlPattern")
    document.querySelector('.error-url').style.display = urlIsValid ? 'none' : 'block';
    button.disabled = allInputAreNotValid();
}

function topicSelected() {
    let topicInput = document.getElementById('topic');
    if (topicInput.value !== 'basic') {
        console.log(topicInput.options[topicInput.selectedIndex] + ' in true');
        topicIsValid = true;
    } else {
        console.log(topicInput.options[topicInput.selectedIndex] + ' in false');
        topicIsValid = false;

    }
    document.querySelector('.error-topic').style.display = topicIsValid ? 'none' : 'block';
    button.disabled = allInputAreNotValid();
}

function allInputAreNotValid() {

    return (titleIsValid && authorIsValid && urlIsValid && topicIsValid) !== true;
}
/*---------------------------------------------------------ONCLICK----POST-------------------------------------------------------*/
/* function postTopic(){
    let articleInput = document.getElementById('slideArticle');
    let authorInput = document.getElementById('slideAuthor');
    let titleInput = document.getElementById('slideTitle');
    let urlInput = document.getElementById('slideUrl');
    let topicInput = document.getElementById('topic');
    let chosenTopic = document.getElementById('topic').value;
    console.log(chosenTopic);
    const story = {
        title: titleInput.value,
        author: authorInput.value,
        article: articleInput.value,
        url: urlInput.value,
        topic: topicInput.value
    }
    let storyJson = JSON.stringify(story);
    const httpRequest = new XMLHttpRequest();
    const URL = 'http://localhost:3000/'+ chosenTopic;

    httpRequest.open('POST', URL);
    httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {
            const savedStory = JSON.parse(this.responseText);
            alert(savedStory.title + ' saved')
        }
    }

    httpRequest.send(storyJson);

    titleInput.value = '';
    authorInput.value = '';
    urlInput.value = '';
    articleInput.value = '';
    topicInput.value = '';
}; */

let db = firebase.firestore();

function sendBlogData(){
    let articleInput = document.getElementById('slideArticle');
    let authorInput = document.getElementById('slideAuthor');
    let titleInput = document.getElementById('slideTitle');
    let urlInput = document.getElementById('slideUrl');
    let topicInput = document.getElementById('topic');
    let chosenTopic = document.getElementById('topic').value;

    const blog = {
        allowedToPost: false,
        article: articleInput.value,
        author: authorInput.value,
        title: titleInput.value,
        url: urlInput.value,
        date: new Date().toUTCString()
    }

    console.log(blog);
    console.log(topicInput);
    console.log(chosenTopic);


    // CREATE METÓDUS
    db.collection('blogs')
    .doc('1iNgBmOfYxCRVaCfYwEF')
    .collection(`${chosenTopic}`)
    .add(blog)
    .then(data => console.log("blog saved with: " + data.id))
    .catch(err => console.log(err)) 

    //alert('Successful upload');
    //setTimeout(location.reload(true/false), 500);
    
}




let propertyNameInput = document.form.name;
let priceInput = document.form.price;
let imageInput = document.form.image;

let nameIsValid = false;
let priceIsValid = false;
let imageIsValid = false;

propertyNameInput.onchange = () => {
    let propertyName = propertyNameInput.value;
    const propertyNamePattern = /^[a-zA-Z]{7}[a-zéáöüűéA-ZÉÁŐÜÖÓÚ \d]{0,97}$/;
    let propertyNamePatternValid = propertyName.match(propertyNamePattern);
    nameIsValid = propertyNamePatternValid !== null ? true : false;
    document.querySelector('.error-name').style.display = nameIsValid ? 'none' : 'block';
    document.querySelector('button').disabled = allInputAreInValid();
};

priceInput.onchange = () => {
    let price = priceInput.value;
    const pricePattern = /^[0-9]{1,9999}$/;
    let pricePatternValid = price.match(pricePattern);
    priceIsValid = pricePatternValid !== null ? true : false;
    document.querySelector('.error-price').style.display = priceIsValid ? 'none' : 'block';
    document.querySelector('button').disabled = allInputAreInValid();
};

imageInput.onchange = () => {
    let image = imageInput.value;
    const imagePattern = /^https?:\/\/{1,264}/;
    let imagePatternValid = image.match(imagePattern);
    imageIsValid = imagePatternValid !== null ? true : false;
    document.querySelector('.error-image').style.display = imageIsValid ? 'none' : 'block';
    document.querySelector('button').disabled = allInputAreInValid();
};

document.querySelector('button').addEventListener('click', () => {
    alert('Sikeres regisztráció!');
})

function allInputAreInValid() {
    let allInValid = true;
    if (nameIsValid && priceIsValid && imageIsValid) {
        allInValid = false;
    }
    return allInValid;
}

//******************************************************************* */
const button = document.querySelector('button');


button.addEventListener("click", () => {
    const property = {
        propertyName: propertyNameInput.value,
        price: priceInput.value,
        imegUrl: imageInput.value
    }
    const URL = 'http://localhost:3000/properties';
    const param = {
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(property),
        method: 'POST',
    }
    const response = fetch(URL, param);
    response
        .then(data => data.json())
        .then(resp => resp)
        .catch(error => console.log(error))
})


/* button.addEventListener("click", () => {

    const property = {
        propertyName: propertyNameInput.value,
        price: priceInput.value,
        imegUrl: imageInput.value
    }
    const jsonProperty = JSON.stringify(property);
    const httpClient = new XMLHttpRequest();
    const URL = 'http://localhost:3000/properties/';
    httpClient.open('POST', URL);
    httpClient.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    httpClient.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {
            const savedUser = JSON.parse(this.responseText);
            alert(savedUser.property + ' saved');
        }
    }
    httpClient.send(jsonProperty);
}) */
const properties = [
    { propertyName: 'Napos lakás', price: 24500000, imegUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1506&q=80' },
    { propertyName: 'Eladó ház', price: 32700000, imegUrl: 'https://images.unsplash.com/photo-1483097365279-e8acd3bf9f18?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=999&q=80' },
    { propertyName: 'Vidéki ház', price: 15000000, imegUrl: 'https://images.unsplash.com/photo-1472224371017-08207f84aaae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80' },
    { propertyName: 'Felújított lakás', price: 42700000, imegUrl: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80' },
    { propertyName: 'Panel lakás', price: 29900000, imegUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1506&q=80' },
    { propertyName: 'vidéki nyaraló', price: 120500000, imegUrl: 'https://images.unsplash.com/photo-1483097365279-e8acd3bf9f18?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=999&q=80' },
    { propertyName: 'Kis ház', price: 107000000, imegUrl: 'https://images.unsplash.com/photo-1472224371017-08207f84aaae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80' },
];

document.addEventListener('DOMContentLoaded', () => {


    const renderPropertyList = () => {
        const wrapper = document.getElementById("house");

        for (let i = 0; i < properties.length; i++) {
            let property = properties[i];
            const article = document.createElement("article");
            article.setAttribute("id", "card-holder");
            const imgHolder = document.createElement("div");
            imgHolder.className = "house-img-wrapper";
            const img = document.createElement("img");
            img.src = property.imegUrl;
            const title = document.createElement("h2");
            title.innerHTML = property.propertyName;
            const text = document.createElement("p");
            text.innerHTML = `Ár: ${(property.price / 1000000).toFixed(2)} M Ft.-`;
            wrapper.appendChild(article);
            article.appendChild(imgHolder);
            imgHolder.appendChild(img);
            article.appendChild(title);
            article.appendChild(text);
        }
    }

    function get() {

        const URL = 'http://localhost:3000/properties';
        const param = {
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            method: 'GET',
        }
        const response = fetch(URL, param);
        response
            .then(data => data.json())
            .then(resp => {
                const propertyList = resp;
                console.log(propertyList);
                for (let property of propertyList) {
                    console.log(property);
                    properties.push({
                        propertyName: property.propertyName,
                        price: property.price,
                        imegUrl: property.imegUrl
                    })
                }
                renderPropertyList();
            })
            .catch(error => console.log(error))
    }
    get();

});
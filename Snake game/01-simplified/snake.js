// Adjunk alapértékeket a változókhoz

let canvas = document.getElementById('main-canvas');
let ctx = canvas.getContext('2d');

// Használd a canvas "getAttributumát, hogy a magasságát és szélességét elmentsd"
let canvasHeight = canvas.clientHeight;
let canvasWidth = canvas.clientWidth;

// Létrehozunk egy "box" változót, beállítjuk 10-re az értékét (ez fogja tárolni 
// az alap méretét az almának és a kigyó "egységnyi" testének)
// Deklarálunk egy üres "snake" listát, amiben a testrészei lesznek
// Kell egy "timerId", ami az időzítőt fogja tárolni. Nem kell alapérték neki.
// Deklarálunk egy "apple" elemet, ami indulásként két koordinátát fog tárolni
// (hogy hol legyen az alma induláskor a canvason) 

let box = 10;
let snake = [];
let timerId;
let apple = [0, 40];
let appleCount = 0;


//Irányok kezeléséhez segítségnek megadunk egy 2D listát, amit később fel tudunk használni:
// Ha x tengely mentén jobbra megyünk egy egységnyit ("box"),
// függőlegesen meg nem mozdulunk , akkor a lista első eleme jelenti az aktuális irányt és így tovább

let directions = [
    [box, 0], // right
    [0, box], //down
    [(-1 * box), 0], // left
    [0, (-1 * box)] // up
];

// Kezdésnek kitűzünk egy indulási irányt a "directions listából" (itt még nincs mozgás, csak az irányt kitűzzük)
// Ez az actDirection, mint aktuális irány fogja tárolni, hogy merre haladjon (nőjön a kígyó) 
let actDirection = directions[0];

// --------------------------- Print Table -----------------------------------------

// Kezdjünk játszani. Hozzunk létre egy start Game function-t.
// Hozzunk létre egy lokális Objektumot "snakeBody", ami két koordinátát fog tárolni.
// egyik property neve legyen: widthP, (szélességi pozició)
// másik property neve: heightP
// Így adjuk meg, hogy hol helyezkedjen el az induláskor. 
// Használjuk egységként a 'box' értéket:
// Pl: let snakeBody = { widthP: box, heightP: 0}; 
// Adjuk hozzá a snakeListánkhoz, mint induló "testrész";
// Itt fogjuk elindítani az időzítőt is kicsit később
// Még ebben a metódusban hívjunk meg egy "printTable()" függvényt,
// Amit a következőkben fogunk megírni


function startGame() {

    const snakeBody = { widthP: box, heightP: 10 };
    snake.push(snakeBody);
    printTable();
    timerId = setInterval(moveSnake, 150);
};

startGame();

//Első lépésnek meg kell rajzolni a világos zöld táblát, majd utána rá kell rajzolni
// a piros színű almát (haszáljuk a két induló értéket, koordinátaként, 
// majd a box egységet, hogy mekkora méretre fesse fel az almát => fillRect).
// Végül a kigyó sötétzöld testét is meg kell rajzolni. 
// Bár most még csak egy testrésze van, mindig ciklussal végig kell menni rajta és "felül"
// festeni a canvast(ctx.fillRect)
function printTable() {
    //board
    ctx.fillStyle = '#37966C';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    //apple
    ctx.fillStyle = "red";
    ctx.fillRect(apple[0], apple[1], box, box);

    //snake
    ctx.fillStyle = '#143A0F'
    for (let key in snake) {
        ctx.fillRect(snake[key].widthP, snake[key].heightP, 10, 10);
    }
}
printTable();



// -------------------------- Move snake, move!! -------------------------------

// Kezdjünk el mozogni.
// Hozzunk létre egy moveSnake függvényt, ami mozgatni fogja a kígyót.
// Elsőnek állapítsuk meg, "hol a feje a kígyónak". => a snake lista utolsó eleme lesz.
// Ha majd eszik a kigyó mindig nőni fog a lista a "feje" felé. Mentsük ki egy lokális
// változóba pl: 'headOfSnake'
// Hozzunk létre még egy lokális változót: "newHeadPosition"
// Ki kell számolnunk és ebbe kell belementenünk a két új koordinátát a headOfSnake és 
// a korábban létrehozott actDirection megfelelő értékeivel. (két elemű lista)
// Miután kiszámoltuk, megvannak a koordináták, hozzunk létre egy:
// "newBodyPart" Objektumot, hasonlóan mint a startGame-ben, adjuk át a megfelelő position-ket
// a newHeadPosition-ből.
// Már csak hozzá kell adnunk a snake listához az új testrészt. Végül vegyük ki az első elemet 
// a "kígyó farok részét". => shift() metódus .
// Így gyakorlatilag eltoljuk egy irányba a kígyót
// Megváltoztak a kigyó testjének koordinátái, újra kell rajzolnunk a táblát.
// Hívjuk meg a függvény végén a már megírt printTable() metódust, hogy az
// újra rajzolja a táblát a kígyó új testrészével együtt
// Még most nem láthatunk változást, hiszen a moveSnake függvényt is meg kell hívni
// De előtte még....

function moveSnake() {
    
    let headOfSnake = snake[snake.length - 1];
    let newHeadPosition = ([headOfSnake.widthP + actDirection[0], headOfSnake.heightP + actDirection[1]]);
    const newBody = {
        widthP: newHeadPosition[0],
        heightP: newHeadPosition[1]
    };
    snake.push(newBody);
    snake.shift();
    printTable();
    hasCollision();
    checkEating();
}


// Hozzunk létre egy EventListener-t, ami a billentyűk leütését figyeli és ennek megfelelően
// változtatja az "actDirection" irányát. 
// Segítségül egy iránynak megírtuk 

window.addEventListener('keydown', (event) => {
    if (event.code === "ArrowDown") {
        event.preventDefault();
        actDirection = directions[1];
    }
    if (event.code === "ArrowUp") {
        event.preventDefault();
        actDirection = directions[3];
    }
    if (event.code === "ArrowRight") {
        event.preventDefault();
        actDirection = directions[0];
    }
    if (event.code === "ArrowLeft") {
        event.preventDefault();
        actDirection = directions[2];
    }
});

// Ha most mindent jól csináltunk, akkor a nyilak leütésének megfelelően mindig változni
// fog az aktuális irány. Ideje élesítenünk a moveSnake() függvényt.
// Nincs már másra szükség, mint a startGame()-ben hozzunk létre egy setIntervalt, mondjuk 200ms-al
// adjuk meg callback function-ként a moveSnake-et:
// timerId = setInterval(moveSnake, 200);
// Mentés után már mozogni kell a pici kígyónknak a billentyűzet segítségével
// Addig ne menj tovább, amíg ezt a működést nem sikerül összehozni

// ---------------------------------------- Az Evés ----------------------------------

// Kezdjük el táplálni a háziállatunkat
// Létrehozzuk az étkezést ellenörző metódusunkat
// Mentsük ki egy lokális változóba a kigyó fejét (utolsó elem a listában)
// Nézzük meg, hogy mindkét koordináta megegyezik e a fej és alma esetén(egy helyen vannak)
// Ha igen, készítsünk egy "newBody" Objektet az alma koordinátáival
// Majd adjuk hozzá a kígyó testéhez, hogy nőni tudjon.
// helyezzük el az almát egy random helyen, vagyis generáljunk random koordinátát neki  

function checkEating() {
    let headOfSnake = snake[snake.length - 1];
    if (headOfSnake.widthP === apple[0] && headOfSnake.heightP === apple[1]) {
        const newBodyPart = {
            widthP: apple[0],
            heightP: apple[1]
        };
        snake.push(newBodyPart);
        apple = [Math.floor(Math.random() * (canvasWidth / 10)) * 10, Math.floor(Math.random() * (canvasHeight / 10)) * 10];
        appleCount++;
    }
};

// Még be kell kötnünk a megfelelő helyre a checkEating()-et. 
// Hívjuk meg a moveSnake()-ben legfelül. Most odáig kellett eljutnunk, hogy
// mozog a kígyó, nő a teste, ha almára lép, és random helyen jelenik meg az alma
// Nincs sok hátra. Ideje az ütközéseket ellenőrizni

// ----------------------------------- Az Ütközés ---------------------------------

// Ismét a fejét kell megvizsgálnunk.
// Mentsük ki egy változóba a fej objektumát. Nézzük meg, hogy a fej koordinátái
// túlnyúlnak e a canvas méretén (canvasWidth, canvasHeight változó)
// vagy bármelyik testrészének koordinátájával megegyeznek. Akkor térjen vissza true értékkel
// különben false. 
// Megj: figyeljünk arra, hogy a fej önmagával történő vizsgálatát elkerüljük
function hasCollision() {
    let headOfSnake = snake[snake.length - 1];
    if (headOfSnake.widthP >= canvasWidth || headOfSnake.heightP >= canvasHeight || headOfSnake.widthP < 0 || headOfSnake.heightP < 0) {
        clearInterval(timerId);
        alert('Game Over! Score: ' + appleCount);
    }

    for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i].widthP === headOfSnake.widthP && snake[i].heightP === headOfSnake.heightP) {
            clearInterval(timerId);
            alert('Game Over! Score: ' + appleCount);
        }
    }

};

// Már csak be kell kötnünk. Hívjuk meg legeslegfelül a moveSnake()-ben.
// Ha true értékkel tér vissza vége a játéknak. Töröljük a setInterval-t
// Valami üzenetet jelenítsünk meg a felhasználónak..
// Végére értünk! Gratulálunk, ha eljutottál idáig!
// További fejlesztési lehetőségek: Pontok kiíratása, ahogy nő a kígyó egyre gyorsabban halad

// ----------------------------------- GAME OVER -------------------------------------
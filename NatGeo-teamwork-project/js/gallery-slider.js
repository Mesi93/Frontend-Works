
let slider = document.getElementById('slider'),
    sliderCloseButton=document.getElementById('slider_close'),
    sliderItems = document.getElementById('items'),
    prev = document.getElementById('slider_prev'),
	next = document.getElementById('slider_next'),
	viewMoreButton = document.getElementById('view_more_button'),
	goldenSunriseButton = document.getElementById('golden_sunrise_button'),
	goldenSunriseButtonLink = document.getElementById('golden_sunrise_button_link'),
    sliderBigImage = document.getElementById('slider_big_image'),
	bigImageIndex=0,
	sliderThumbnails=document.getElementById('slider_thumbnails'),
	objectSize=0;
  /*  imagesArray=[["../03-project-nature-images/3719e37b51e4a5c43764d34f9b110bcb.jpeg","Forest"],
["../03-project-nature-images/64e04b54d716b0430190857f2733874c.jpeg","Flowers"],
["../03-project-nature-images/a80647e873eee83a33451f81b14755a0.jpeg","Lava"],
["../03-project-nature-images/c22bd5964de3d3febfb84d116938d48f.jpeg","Ice"],
["../03-project-nature-images/67dc897f27cd95fe8401e0e6e96457ba.jpeg","Wood"],
["../03-project-nature-images/e24c90f3a46893f790eecdb7782a1ee3.jpeg",alt="Vulcan"]
];
 */
let imagesObject={};

async function loader(){
const URL = 'http://localhost:3000/sonyawards2018winners';
const param = {
	headers: { "Content-Type": "application/json; charset=UTF-8" },
	method: 'GET',
}
const result = await fetch(URL, param)
	.then(data => data.json())
	.then(data => {
		imagesObject = data;
		sliderFunction();
	})
	.catch(err => console.log(err));
}

function changeImageTextBoxClass(){
	if(document.getElementById('imageTextBox').className==='imageTextBox2'){
		document.getElementById("imageTextBox").className= 'imageTextBox';
	}else{
		document.getElementById("imageTextBox").className= 'imageTextBox2';
	}
}

function sliderFunction(){
	objectSize = Object.keys(imagesObject).length;
	viewMoreButton.style.display='none';
	goldenSunriseButton.style.display='none';
slider.style.transition = 'all 2s';
slider.style.display = 'block';
sliderCloseButton.style.display = 'block';
if(bigImageIndex>0){
	prev.style.display = 'block';
}else{
	prev.style.display = 'none';
}
if(bigImageIndex<objectSize-1){
	next.style.display = 'block';
}else{
	next.style.display = 'none';
}
let imageTextBox='<div id="imageTextBox" class="imageTextBox" onclick="changeImageTextBoxClass()">'+'<p style="color:#facd3c; font-weight: bold;padding: 5px 0;">' + imagesObject[bigImageIndex].title + ' © ' +imagesObject[bigImageIndex].author +' - ' + imagesObject[bigImageIndex].from + '</p><p>' +imagesObject[bigImageIndex].description +'</p><p style="color:#facd3c;padding: 5px 0;">' +imagesObject[bigImageIndex].category + ', 2018 Sony World Photography Awards</p></div>';
sliderBigImage.innerHTML = '<img src="' + imagesObject[bigImageIndex].url + '" alt="' + imagesObject[bigImageIndex].title + '">' + imageTextBox ;
if(bigImageIndex>objectSize-5){
	let imageThumbArray=[];
	for(let i=objectSize-5;i<=objectSize-1;i++){
		if(i===bigImageIndex){
			imageThumbArray.push('<img src="' + imagesObject[i].url + '" alt="' + imagesObject[i].title + '" class="slider_thumbnail_selected_border">');
		}else{
				imageThumbArray.push('<img src="' + imagesObject[i].url + '" alt="' + imagesObject[i].title + '" class="slider_thumbnail_unselected_border">');
		}	
	}
	sliderThumbnails.innerHTML = imageThumbArray[0] + imageThumbArray[1] + imageThumbArray[2]+ imageThumbArray[3] +imageThumbArray[4];
}else{
	sliderThumbnails.innerHTML = '<img src="' + imagesObject[bigImageIndex].url + '" alt="' + imagesObject[bigImageIndex].title + '" class="slider_thumbnail_selected_border"><img src="' + imagesObject[bigImageIndex+1].url + '" alt="' + imagesObject[bigImageIndex+1].title + '" class="slider_thumbnail_unselected_border"><img src="' + imagesObject[bigImageIndex+2].url + '" alt="' + imagesObject[bigImageIndex+2].title + '" class="slider_thumbnail_unselected_border"><img src="' + imagesObject[bigImageIndex+3].url + '" alt="' + imagesObject[bigImageIndex+3].title + '" class="slider_thumbnail_unselected_border"><img src="' + imagesObject[bigImageIndex+4].url + '" alt="' + imagesObject[bigImageIndex+4].title + '" class="slider_thumbnail_unselected_border">';

}

 }
function sliderClose(){
	slider.style.display = 'none';
	sliderCloseButton.style.display = 'none';
	prev.style.display = 'none';
	next.style.display = 'none';
	viewMoreButton.style.display='block';
	goldenSunriseButton.style.display='block';
	goldenSunriseButtonLink.style.textDecoration='none';
}
function sliderPrev(){
	if(bigImageIndex>0){
		bigImageIndex--;
		sliderFunction();
	}
}
function sliderNext(){
	if(bigImageIndex<objectSize-1){
		bigImageIndex++;
		sliderFunction();
	}
}


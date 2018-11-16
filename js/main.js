/*globals tmdbKey*/



document.addEventListener("DOMContentLoaded", init);
let entertainmentList = document.getElementsByName("entertainment");
let entertainmentType = null;
let dateKey = "date";
let entertainmentKey = "entertainment";
let searchKey = "search";
const movieDataBaseURL= "https://api.themoviedb.org/3/";
let imageURL = null;
let imageSizes = [];

function init() {
    addEventListeners();
    getLocalStorageData();
    headerCheck();



}
function headerCheck(){
     if(entertainmentType == "tv"){
        document.querySelector(".recommendations").innerHTML = "Television Recommendations";
    }else if(entertainmentType == "movie"){
        document.querySelector(".recommendations").innerHTML = "Movie Recommendations";
    }else{
        document.querySelector(".recommendations").innerHTML = "Select Television or Movies from the preferences button";
    }
}

function radioButtonCheck(){
    if(entertainmentType == "movie"){
        console.log("hi1");
        document.querySelector("#movie").classList.add("checked");
        document.querySelector("#tv").classList.remove("checked");
    }else{
        console.log("hi2")
        document.querySelector("#movie").classList.remove("checked");
        document.querySelector("#tv").classList.add("checked");
    }
}
function addEventListeners(){
    document.querySelector("#modalButton").addEventListener("click", showOverlay);
    document.querySelector(".cancelButton").addEventListener("click", hideOverlay);
    document.querySelector(".saveButton").addEventListener("click", function (e) {
        for (let i = 0; i < entertainmentList.length; i++) {
            if (entertainmentList[i].checked) {
                entertainmentType = entertainmentList[i].value;
                break;
            }
        }
        hideOverlay(e);
        saveLocalStorageData();
        if(entertainmentType == "tv"){
        document.querySelector(".recommendations").innerHTML = "Television Recommendations";
    }else if(entertainmentType == "movie"){
        document.querySelector(".recommendations").innerHTML = "Movie Recommendations";
    }
    });
    document.querySelector(".search-button-div").addEventListener("click", function (){
        document.querySelector("#back-button-main").classList.add("show");
        document.querySelector("#back-button-main").classList.remove("hide");
        document.querySelector(".recommendations").innerHTML = "Results 1-20 from a total of ";
        document.querySelector(".inputs").style.transform= "translateY(-900%)";


    });
    document.querySelector(".back-button-div-mainpage").addEventListener("click", function (){
        document.querySelector("#back-button-main").classList.remove("show");
        document.querySelector("#back-button-main").classList.add("hide");
        document.querySelector(".recommendations").innerHTML = "Movie Recommendations";
        document.querySelector(".inputs").style.transform= "translateY(0%)";
    });

}

function saveLocalStorageData() {
    localStorage.setItem(entertainmentKey, JSON.stringify(entertainmentType));
    let now = new Date();
    localStorage.setItem(dateKey,  JSON.stringify(now)); // JSON.stringify() uses Date.toISOString() behind the scenes!!



}
function getLocalStorageData() {
    // First see if data exists in local storage
    if (localStorage.getItem(entertainmentKey)) {

        entertainmentType = JSON.parse(localStorage.getItem(entertainmentKey));
        console.log(entertainmentType);
    }else {
        console.log("entertainment type is not saved");
    }
    if (localStorage.getItem(dateKey)) {
            let savedDate = JSON.parse(localStorage.getItem(dateKey));
            savedDate = new Date(savedDate);

            let now = new Date();
            console.log(now);
        }else {
        console.log("date is not saved");


    }

    //check if image secure base url and sizes array are saved in local storage, if not call getPosterURLAndSizes()

    //if it is in local storage check if saved over 60 minues ago if true, then call getPosterURLAndSizes()

    //if saved in local storage and less than 60 minutes old then use from local storage
    getPosterURLAndSizes();
}
function showOverlay(e) {
    console.log("ouch"); //courtesy of Tony
    e.preventDefault();
    let overlay = document.querySelector(".overlay");
    overlay.classList.remove("hide");
    overlay.classList.add("show");
    showModal(e);

}

function showModal(e) {
    e.preventDefault();
    let modal = document.querySelector(".modal");
    modal.classList.remove("off");
    modal.classList.add("on");

}

function hideOverlay(e) {
    e.preventDefault();
    e.stopPropagation(); // don't allow clicks to pass through
    let overlay = document.querySelector(".overlay");
    overlay.classList.remove("show");
    overlay.classList.add("hide");
    hideModal(e);
}

function hideModal(e) {
    e.preventDefault();
    let modal = document.querySelector(".modal");
    modal.classList.remove("on");
    modal.classList.add("off");
}

function getPosterURLAndSizes(){
    let url = `${movieDataBaseURL}configuration?api_key=${tmdbKey}`;

    fetch(url)
    .then((response)=>{
        return response.json();
    })
    .then(function(data){
        console.log(data);
        imageURL = data.images.secure_base_url;
        imageSizes = data.images.poster_sizes;

        console.log(imageSizes, imageURL);
    })
    .catch( (error)=>{
        console.log(error);
    })
}

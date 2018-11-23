/*globals tmdbKey*/


/*Dylan Durbano
API Assignment
November 16th 2018 */


document.addEventListener("DOMContentLoaded", init);
let entertainmentList = document.getElementsByName("entertainment");
let entertainmentType = null;
let dateKey = "date";
let entertainmentKey = "entertainment";
let searchKey = "search";
const movieDataBaseURL = "https://api.themoviedb.org/3/";
let imageURL = null;
let imageSizes = [];
let searchString = "";
let timeKey = "timeKey";
let staleDataTimeOut = 3600;

function init() {
    addEventListeners();
    getLocalStorageData();
    headerCheck();




}

function headerCheck() {
    if (entertainmentType == "tv") {
        document.querySelector(".recommendations").innerHTML = "Television Recommendations";
    } else if (entertainmentType == "movie") {
        document.querySelector(".recommendations").innerHTML = "Movie Recommendations";
    } else {
        document.querySelector(".recommendations").innerHTML = "Select Television or Movies from the preferences button";
    }
}

function radioButtonCheck() {
    if (entertainmentType == "movie") {
        console.log("hi1");
        document.querySelector("#movie").classList.add("checked");
        document.querySelector("#tv").classList.remove("checked");
    } else {
        console.log("hi2")
        document.querySelector("#movie").classList.remove("checked");
        document.querySelector("#tv").classList.add("checked");
    }
}

function addEventListeners() {
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
        if (entertainmentType == "tv") {
            document.querySelector(".recommendations").innerHTML = "Television Recommendations";
        } else if (entertainmentType == "movie") {
            document.querySelector(".recommendations").innerHTML = "Movie Recommendations";
        }
    });
    document.querySelector(".back-button-div-mainpage").addEventListener("click", function () {
        document.querySelector("#back-button-main").classList.remove("show");
        document.querySelector("#back-button-main").classList.add("hide");
        if(entertainmentType == "movie"){
            document.querySelector(".recommendations").innerHTML =   "Movie Recommendations";
        }else if(entertainmentType == "tv"){
            document.querySelector(".recommendations").innerHTML =   "Television Recommendations";

        }

        document.querySelector(".inputs").style.transform = "translateY(0%)";
        document.querySelector("#search-input").value = document.querySelector("#search-input").defaultValue;
        document.querySelector("#search-results").classList.remove("show");
        document.querySelector("#search-results").classList.add("hide");
        document.querySelector("main").style.height = "500px";
    });
    let searchButton = document.querySelector(".search-button-div");
    searchButton.addEventListener("click", startSearch);

    document.querySelector(".back-button-div-searchresults").addEventListener("click", function () {
        document.querySelector("#search-results").classList.add("show");
        document.querySelector("#search-results").classList.remove("hide");
        document.querySelector("#recommend-results").classList.remove("show");
        document.querySelector("#recommend-results").classList.add("hide");
        document.querySelector("#back-button-main").classList.add("show");
        document.querySelector("#back-button-main").classList.remove("hide");
        document.querySelector("#back-button-search").classList.remove("show");
        document.querySelector("#back-button-search").classList.add("hide");
        document.querySelector("#recommend-results>.content").innerHTML = "";

    });
}

function saveLocalStorageData() {
    localStorage.setItem(entertainmentKey, JSON.stringify(entertainmentType));
    let now = new Date();
    localStorage.setItem(dateKey, JSON.stringify(now)); // JSON.stringify() uses Date.toISOString() behind the scenes!!



}

function getLocalStorageData() {
    // First see if data exists in local storage
    if (localStorage.getItem(entertainmentKey)) {

        entertainmentType = JSON.parse(localStorage.getItem(entertainmentKey));
        console.log(entertainmentType);
    } else {
        console.log("entertainment type is not saved");
    }
    if (localStorage.getItem(dateKey)) {
        let savedDate = JSON.parse(localStorage.getItem(dateKey));
        savedDate = new Date(savedDate);

        let now = new Date();
    } else {
        console.log("date is not saved");


    }



    if (localStorage.getItem(timeKey)) {
    console.log("Retrieving Saved Date from Local Storage");
    let savedDate = localStorage.getItem(timeKey); // get the saved date sting
    savedDate = new Date(savedDate); // use this string to initialize a new Date object
    console.log(savedDate);

    let seconds = calculateElapsedTime(savedDate);

   console.log(`Retrieving Saved Date from Local Storage Saved Date: ${savedDate}Current Date: ${new Date()} Elapsed Time: ${seconds} seconds`);

    if (seconds > staleDataTimeOut) {
      saveDateToLocalStorage();
        getPosterURLAndSizes();
    }
  } else {
    saveDateToLocalStorage();
      getPosterURLAndSizes();
  }


}
function saveDateToLocalStorage() {
  console.log("Saving current Date to Local Storage");
 console.log("Saving current Date to Local Storage");
  let now = new Date();
  localStorage.setItem(timeKey, now);
}
function calculateElapsedTime(savedDate) {
  let now = new Date(); // get the current time
  console.log(now);

  // calculate elapsed time
  let elapsedTime = now.getTime() - savedDate.getTime(); // this in milliseconds

  let seconds = Math.ceil(elapsedTime / 1000);
  console.log("Elapsed Time: " + seconds + " seconds");
  return seconds;
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

function getPosterURLAndSizes() {
    let url = `${movieDataBaseURL}configuration?api_key=${tmdbKey}`;

    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            imageURL = data.images.secure_base_url;
            imageSizes = data.images.poster_sizes;

            console.log(imageSizes, imageURL);
        })
        .catch((error) => {
            console.log(error);
        })
}

function moveSearch() {

    document.querySelector("#back-button-main").classList.add("show");
    document.querySelector("#back-button-main").classList.remove("hide");
    document.querySelector(".inputs").style.transform = "translateY(-400%)";
    document.querySelector("#search-results").classList.remove("hide");
    document.querySelector("#search-results").classList.add("show");
    document.querySelector("main").style.height = "auto";

}

function startSearch() {
    console.log("start search");
    searchString = document.getElementById("search-input").value;
    if (!searchString) {
        alert("Please enter search data");
        document.getElementById("search-input").focus;
        return;
    }

    // this is a new search so you should reset any existing page data
    document.querySelector("#search-results>.content").innerHTML = "";
    document.querySelector("#recommend-results>.content").innerHTML = "";
    moveSearch();
    getSearchResults(searchString);
}

// called from startSearch()
function getSearchResults(searchString) {
    // https://developers.themoviedb.org/3/search/search-movies  look up search movie (also TV Shows)

    let url = `${movieDataBaseURL}search/${entertainmentType}?api_key=${tmdbKey}&query=${searchString}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {


            //  create the page from data


            if(entertainmentType == "movie"){
            data.results.forEach(function (item) {


               let movie = {
                    title: item.original_title,
                    release_date: item.release_date,
                    vote_average: item.vote_average,
                    overview: item.overview,
                    poster_path: item.poster_path,
                    entID: item.id

                }
                let content = document.querySelector("#search-results>.content");

                let cards = []; // an array of document fragments

                // create some sample cards

                cards.push(createMovieCard(movie));
                let documentFragment = new DocumentFragment();

                cards.forEach(function (item) {
                    documentFragment.appendChild(item);
                });

                content.appendChild(documentFragment);

                let cardList = document.querySelectorAll(".content>div");
                cardList.forEach(function (item) {
                    item.addEventListener("click", getRecommendations);
                });

            })
            }
            else if(entertainmentType == "tv"){
                data.results.forEach(function (item) {


               let tv = {
                    title: item.original_name,
                    release_date: item.first_air_date,
                    vote_average: item.vote_average,
                    overview: item.overview,
                    poster_path: item.poster_path,
                    entID: item.id

                }
                let content = document.querySelector("#search-results>.content");

                let cards = []; // an array of document fragments

                // create some sample cards

                cards.push(createTvCard(tv));
                let documentFragment = new DocumentFragment();

                cards.forEach(function (item) {
                    documentFragment.appendChild(item);
                });

                content.appendChild(documentFragment);

                let cardList = document.querySelectorAll(".content>div");
                cardList.forEach(function (item) {
                    item.addEventListener("click", getRecommendations);
                });

            })

            }



            document.querySelector(".recommendations").innerHTML=("Search Results 1 - " + data.results.length);




        })
        .catch(error => console.log(error));

    //  navigate to "results";
    //recommendt url let url = `${movieDataBaseURL}search/${entertainmentType}?api_key=${tmdbKey}&query=${searchString}`;




}


function createMovieCard(movie) {
    let documentFragment = new DocumentFragment(); // use a documentFragment for performance
    let movieCard = document.createElement("div");
    let section = document.createElement("section");
    let image = document.createElement("img");
    let videoTitle = document.createElement("p");
    let videoDate = document.createElement("p");
    let videoRating = document.createElement("p");
    let videoOverview = document.createElement("p");

    // set up the content
    videoTitle.textContent = movie.title;
    videoDate.textContent = movie.release_date;
    videoRating.textContent = movie.vote_average;
    videoOverview.textContent = movie.overview;

    // set up image source URL
    image.src = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;

    // set up movie data attributes
    movieCard.setAttribute("data-title", movie.title);
    movieCard.setAttribute("ent-ID", movie.entID);

    // set up class names
    movieCard.className = "movieCard";
    section.className = "imageSection";

    // append elements
    section.appendChild(image);
    movieCard.appendChild(section);
    movieCard.appendChild(videoTitle);
    movieCard.appendChild(videoDate);
    movieCard.appendChild(videoRating);
    movieCard.appendChild(videoOverview);

    documentFragment.appendChild(movieCard);

    return documentFragment;
}
function createTvCard(tv) {
    let documentFragment = new DocumentFragment(); // use a documentFragment for performance
    let tvCard = document.createElement("div");
    let section = document.createElement("section");
    let image = document.createElement("img");
    let videoTitle = document.createElement("p");
    let videoDate = document.createElement("p");
    let videoRating = document.createElement("p");
    let videoOverview = document.createElement("p");

    // set up the content
    videoTitle.textContent = tv.title;
    videoDate.textContent = tv.release_date;
    videoRating.textContent = tv.vote_average;
    videoOverview.textContent = tv.overview;

    // set up image source URL
    image.src = `https://image.tmdb.org/t/p/w185${tv.poster_path}`;

    // set up movie data attributes
    tvCard.setAttribute("data-title", tv.title);
    tvCard.setAttribute("ent-ID", tv.entID);

    // set up class names
    tvCard.className = "tvCard";
    section.className = "imageSection";

    // append elements
    section.appendChild(image);
    tvCard.appendChild(section);
    tvCard.appendChild(videoTitle);
    tvCard.appendChild(videoDate);
    tvCard.appendChild(videoRating);
    tvCard.appendChild(videoOverview);

    documentFragment.appendChild(tvCard);

    return documentFragment;
}


function getRecommendations(e) {

    console.log(this);
    console.log(e.target);
    let movieTitle = this.getAttribute("data-title");
    let entID = this.getAttribute("ent-ID");
    console.log("you clicked: " + movieTitle + " with a movie id of " + entID);
    //https://api.themoviedb.org/3/movie/{movie_id}/recommendations?api_key=
    document.querySelector("#search-results").classList.add("hide");
    document.querySelector("#search-results").classList.remove("show");
    document.querySelector("#recommend-results").classList.remove("hide");
    document.querySelector("#recommend-results").classList.add("show");
    document.querySelector("#back-button-main").classList.remove("show");
    document.querySelector("#back-button-main").classList.add("hide");
    document.querySelector("#back-button-search").classList.add("show");
    document.querySelector("#back-button-search").classList.remove("hide");


    document.querySelector("#recommend-results>.content").innerHTML = "";

    let url = `${movieDataBaseURL}${entertainmentType}/${entID}/recommendations?api_key=${tmdbKey}&language=en-US&page=1`
    fetch(url)
        .then(response => response.json())
        .then(data => {


            //  create the page from data


        if(entertainmentType == "movie"){
        data.results.forEach(function (item) {
                let movie = {
                    title: item.original_title,
                    release_date: item.release_date,
                    vote_average: item.vote_average,
                    overview: item.overview,
                    poster_path: item.poster_path,
                    entID: item.id

                }
                let content = document.querySelector("#recommend-results>.content");

                let cards = []; // an array of document fragments


                cards.push(createMovieCard(movie));
                let documentFragment = new DocumentFragment();

                cards.forEach(function (item) {
                    documentFragment.appendChild(item);
                });

                content.appendChild(documentFragment);

                let cardList = document.querySelectorAll(".content>div");
                cardList.forEach(function (item) {
                    item.addEventListener("click", getRecommendations);
                });

            })
        }
        else if (entertainmentType == "tv"){
        data.results.forEach(function (item) {
                let tv = {
                    title: item.original_name,
                    release_date: item.first_air_date,
                    vote_average: item.vote_average,
                    overview: item.overview,
                    poster_path: item.poster_path,
                    entID: item.id

                }
                let content = document.querySelector("#recommend-results>.content");

                let cards = []; // an array of document fragments


                cards.push(createTvCard(tv));

                let documentFragment = new DocumentFragment();

                cards.forEach(function (item) {
                    documentFragment.appendChild(item);
                });

                content.appendChild(documentFragment);

                let cardList = document.querySelectorAll(".content>div");
                cardList.forEach(function (item) {
                    item.addEventListener("click", getRecommendations);
                });

            })
        }



            document.querySelector(".recommendations").innerHTML = ("Recommendation Results 1 - "  + data.results.length);
        })
        .catch(error => console.log(error));

}

'use strict'

//global variables store base url and API key
const apiKey = "uUyGLv3QND480LOuhxVnB7Pvdd73YyBaQCJDCA69";
const endpointURL = "https://developer.nps.gov/api/v1/parks";
 
//format parms object into a propery query string

function formatParameters(params) { 
    const queryItems = Object.keys(params).map(key=>`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join("&");
}
//Loop through returned JSON object and display relevant data in the DOM
function displayParkInfo(responseJson) {
    $("#js-results-list").empty();
    $(".error").empty();
console.log(`responseJson is:`);
console.log(responseJson);
    let dataArr = responseJson.data;//data is an array of objects
    if(dataArr.length < 1) {
        $("h2").append(`<p class="error">No items found. Please check the state spelling and try again.<p>`);
    }
    for(let i = 0; i < dataArr.length; i++) {
        let dataItemName = dataArr[i].fullName;
        let itemDirections = dataArr[i].directionsUrl;
        let dataItemDescrip = dataArr[i].description;
        let dataItemURL = dataArr[i].url;
        $("#js-results-list").append(`<li role="" id="js-results-info"><h3>${dataItemName} <a href="${dataItemURL}"> ${dataItemURL}</a></h3></li>
        <p>${dataItemDescrip}<br><a href="${itemDirections}"> Get Directions</a>`);
    }
    $("#js-results").removeClass("hidden");
}
function displayMultiParksInfo(responseJson) {
    let dataArr = responseJson.data;
    let multipleStates = dataArr[0]["states"];
console.log(`multipleStates is ${multipleStates}`)
}

function getMultiStateParks(multiSearch, maxResults) {
    const params = {
        api_key: apiKey,
        limit: maxResults,
    }
    let search = `stateCode=${multiSearch}`
    let queryString = formatParameters(params);
    let url = endpointURL+"?"+queryString+search;
//console.log(`url is ${url}`)
    fetch(url).then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJson => {
        console.log(`responseJson data is: `)
        console.log(responseJson.data);
        displayMultiParksInfo(responseJson)
    }).catch(err => {
        $("h2").append(`<p>OOPSIE POOPSIE! ${err.message}<p>`);
        $("#js-error-message").removeClass("hidden");
    })
}
//GET parks info w/ request to NPS API
function getStateInfo(singleSearch, maxResults) {
//create an object to store search parameters
    const params = {
        api_key: apiKey,
        limit: maxResults,
        q: singleSearch,
    }
    let queryString = formatParameters(params);
    let url = endpointURL+"?"+queryString;
console.log(`url is ${url}`);
    fetch(url).then(response => {
        if(response.ok) {
    
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJson => displayParkInfo(responseJson)).catch(err=> {
        $("h2").append(`<p>OOPSIE POOPSIE! ${err.message}<p>`);
        $("#js-error-message").removeClass("hidden");
    });
    
}
function getInputValues() {
    $("form").submit("#input-value", event => {
        event.preventDefault();
        let searchInput = $("#input-value").val();
        let maxInput = $("#max-values").val();
        if(searchInput.includes(",")) {
            getMultiStateParks(searchInput, maxInput);
        }
console.log(`searchInput is ${searchInput}`);
        
        getStateInfo(searchInput, maxInput);
    });

}

//when input submitted on form, get input values and store them in a variable; pass them to the GET function
function watchForm() {
    getInputValues();
  
      
}
//once page loads, call watchForm functon
$(watchForm)
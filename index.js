'use strict'

//global variables store base url and API key
const apiKey = "uUyGLv3QND480LOuhxVnB7Pvdd73YyBaQCJDCA69";
const endpointURL = "https://developer.nps.gov/api/v1/parks";
 
//format parms object into a propery query string
function formatParameters(params) {
    const queryItems = Object.keys(params).map(key=>`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join("&");

}
//GET parks info w/ request to NPS API
function getParksInfo(search, maxResults) {
//create an HTTP header object to store the API key in
    // const options = {
    //     headers: new Headers({
    //         "X-Api-Key": apiKey })
    // };
//create an object to store search parameters
    const params = {
        api_key: apiKey,
        limit: maxResults,
        q: search,
    }

    let queryString = formatParameters(params);
    let url = endpointURL+"?"+queryString;
console.log(`url is ${url}`);
    fetch(url).then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJson =>console.log(responseJson)).catch(err=> {
        $("#js-error-message").text(`OOPSIE POOPSIE! ${err.message}`);
    })
}

//when input submitted on form, get input values and store them in a variable; pass them to the GET function
function watchForm() {
    $("form").submit(event => {
        event.preventDefault();
        let searchInput = $("#input-values").val();
console.log(`searchInput is ${searchInput}`);
        let maxInput = $("#max-values").val();
console.log(`maxInput is ${maxInput}`);
    getParksInfo(searchInput, maxInput);
    });
    
}
//once page loads, call watchForm functon
$(watchForm)
'use strict';
const apiKey='WytqvqKq4XvUQ0CNtAIgE9dWtfCA3NkX27BD5TwO';
const baseURL='https://developer.nps.gov/api/v1/parks?';
const geoSource = 'https://maps.googleapis.com/maps/api/geocode/json?'

// setup for the rendering. alters some existing html as well
function renderResults(data,maxresults,stateSearch,id){
    // must designate iteration length by input data
    if(data.length <= maxresults){
        for(let i=0;i<data.length;i++){
            renderPark(data[i],stateSearch,id)            
        };
        // show how many results we should expect to see
        $('#results'+id).html(`${data.length}`)
    }
    else if (data.length > maxresults){
        for(let i=0;i<maxresults;i++){
            renderPark(data[i],stateSearch,id)             
        };
        // show how many results we should expect to see
        $('#results'+id).html(`${maxresults}`)
    }
    // if no data is available show a response
    if(data.length === 0){
        $('#other').text(`No Results Found`)
    } 

    // remove hidden
    $('.results').removeClass('hidden');
}

// render the html code
function renderPark(parkInfo, stateSearch,id){
    let parkHTML = ''
    getAddresses(parkInfo.latLong)
    .then(add => {
        parkHTML = generateParkItemHTML(parkInfo,add, stateSearch)
        $('#returned-results'+id).append(parkHTML)})    
}

// generate the html code for the li's
function generateParkItemHTML(parkInfo,add,stateSearch){
    console.log(stateSearch)
    return `<li class="needClass">
    <p><strong>${parkInfo.fullName}</strong>(<a href= ${parkInfo.url} target="_blank">Link</a>)</p>
    <p>State searched: ${stateSearch}</p>
    <p><em>Description</em>: ${parkInfo.description}</p>
    <p class="address"><em><em>Address: ${add}</em></p>
    </li>`
}

// fetch the address using reverse geocoding
async function getAddresses(input){
    // if the string is not empty, split it
    if (input !== ""){
        let inputSplit = input.toString().split(",")
        let latArr = inputSplit[0].split(":")
        let lat=latArr[1];
        let longArr = inputSplit[1].split(":")
        let long = longArr[1];
        const geoURL = geoSource+`latlng=${lat},${long}&key=AIzaSyCDm1-bN6rsQQoues6UA64S9O0TdCe_jE0`;
        
        const response = await fetch(geoURL)
        const result = await response.json()
        return result.results[0].formatted_address;
    }
    // if the string is empty, return No address listed
    else{
        return "No address listed"
    }
}

// Map the parameters
function mapParams(params){
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

// fetch the data
function getParks(stateSearch, maxresults,i){
    console.log(stateSearch)
    const params = {
        stateCode: stateSearch,
        limit: maxresults,
    }
    const query = mapParams(params);
    const source= baseURL+query+`&api_key=${apiKey}`;
    // const options={
    //     headers: new Headers({
    //         "X-Api-Key": apiKey
    //     })
    // };
    // I wanted to use a header for the api_key, but for some reason it wasn't working. I was getting an error for preflight not OK status.
    fetch(source)
    .then(response => {
        if (response.ok){
        return response.json()
        }
        throw new Error (response.Status)})
    .then(responseJson=> renderResults(responseJson.data, maxresults,stateSearch,i))
    .catch(err=>{
        $('#error').text(`Something went wrong: ${err.message}`);
        console.log(err.message)
    });
    
}

// watch for the submission
function watchForm(){
    $('form').submit(e=>{
        e.preventDefault();
        // clear the lists every time a new entry is made
        $('#results').empty();
        const maxresults=$('#max-hits').val();
        let val = [];
        $("input[name='state']:checked").each(function(i){
            val[i] = $(this).val();
        });
        console.log(val)
        for (let i=0;i<val.length;i++){
            $('#results').append(
                `<div id="${i}">
                <h2>Results for ${val[i]}:<p id="results${i}"></p></h2>
                     <ul id="returned-results${i}">
                         
                     </ul>
                </div>`)
            getParks(val[i],maxresults,i)
            console.log(val)
        }
    })          
}

$(watchForm)
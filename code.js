'use strict';
const apiKey='WytqvqKq4XvUQ0CNtAIgE9dWtfCA3NkX27BD5TwO';
const baseURL='https://developer.nps.gov/api/v1/parks?';
const geoSource = 'https://maps.googleapis.com/maps/api/geocode/json?'
// render the results in browser
function renderResults(responseJson,maxresults){
    $('#returned-results').empty();
    console.log(responseJson)
    // let addresses = createAddress(responseJson,maxresults);

    for(let i=0;i<maxresults;i++){
        // let ident = addresses[0];
        // let obj = addresses[1];
        // console.log(addresses)
        // console.log(obj)
        // console.log(ident[0])
        // console.log(typeof obj)
        // let address = getAddresses(responseJson[1])
        // console.log(adddress);
        $('#returned-results').append(
            `<li class="needClass">
            <p>${i+1}: <strong>${responseJson.data[i].fullName}</strong>(<a href= ${responseJson.data[i].url} target="_blank">Link</a>)</p>
            <p><em>Description</em>: ${responseJson.data[i].description}</p><br>
            </li>`)            
        // <p class="address"><em>Address: <em>Address: <script></script>${address[0].results[0].formatted_address}</em></p>
        // for(let j=0;j<ident.length;j++){
        //     if(ident[j]=== i+1){
        //         $('.needClass').append(`<p class="address"><em>Address: <em>Address: <script></script>${obj[0].results[0].formatted_address}</em></p>`);
        //     }
        // }

    };

    // full name, description, website url
    if(responseJson.length === 0){
        $('#other').text(`No Results Found`)
    }  
    $('.results').removeClass('hidden');
}
function getAddresses(responseJson){
    let input = responseJson.data.latLong;
    let inputSplit = input.split(",")
    let latArr = inputSplit[0].split(":")
    let lat=latArr[1];
    let longArr = inputSplit[1].split(":")
    let long = longArr[1];
    const geoURL = geoSource+`latlng=${latArr},${longArr}&key=AIzaSyCDm1-bN6rsQQoues6UA64S9O0TdCe_jE0`;
    console.log(geoURL)
        fetch(geoURL)
        .then(add => {
            if (add.ok){
                return add.json()
            }
            throw new Error (add.Status)})
        .then(add => console.log(add))
        .catch(err=>{
            $('#error').text(`Something went wrong: ${error.message}`);
            console.log(error.message)
        }); 
        return add   //will this return add from the whole function?
}
// create the address with reverse geocoding
// function createAddress(responseJson,maxresults){
//     // responseJson.data[i].latLong
//     let latArray = [];
//     let longArray = [];
//     for(let i=0;i<maxresults;i++){
        
//             let input = responseJson.data[i].latLong;
//             console.log(input)
//         if(input.length >0){ 
//             let inputSplit = input.split(",")

//             let latArr = inputSplit[0].split(":")
//             let lat=latArr[1];
//             latArray.push(lat)
//             let longArr = inputSplit[1].split(":")
//             let long = longArr[1];
//             longArray.push(long)
//         }   
//         if(input.length === 0){
//             latArray.push('none')
//             longArray.push('none')
//         }
//     }
//     console.log(latArray)
//     console.log(longArray)
    
//     const geoSource = 'https://maps.googleapis.com/maps/api/geocode/json?'
//     let result = [];
//     let list = [];
//     let combination =[];
//     for(let i=0;i<latArray.length;i++){
//         if(latArray[i] !== "none"){
//             const geoURL = geoSource+`latlng=${latArray[i]},${longArray[i]}&key=AIzaSyCDm1-bN6rsQQoues6UA64S9O0TdCe_jE0`;
//             fetch(geoURL)
//             .then(add => {
//                 if (add.ok){
//                     return add.json()
//                 }
//                 throw new Error (add.Status)})
//             .then(data => console.log(data))
//             .catch(err=>{
//                 $('#error').text(`Something went wrong: ${error.message}`);
//                 console.log(error.message)

//             });
//             list.push(i+1);
//         }
//     }
//     console.log(list)
//     console.log(result)
//     combination.push(list,result)
//     console.log(combination)
//     return combination;
// }

// Map the parameters
function mapParams(params){
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

// fetch the data
function getRepos(stateSearch, maxresults){
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
    .then(responseJson=> renderResults(responseJson, maxresults))
    .catch(err=>{
        $('#error').text(`Something went wrong: ${err.message}`);
        console.log(err.message)
    });
    
}

// watch for the submission
function watchForm(){
    $('form').submit(e=>{
        e.preventDefault();
        const stateSearch=$('#search').val().toLowerCase();
        const maxresults=$('#max-hits').val();
        getRepos(stateSearch,maxresults);
    })
}

$(watchForm)
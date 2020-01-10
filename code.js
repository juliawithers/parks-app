'use strict';
const apiKey='WytqvqKq4XvUQ0CNtAIgE9dWtfCA3NkX27BD5TwO';
const baseURL='https://developer.nps.gov/api/v1/parks?';
const geoSource = 'https://maps.googleapis.com/maps/api/geocode/json?'

// setup for the rendering. alters some existing html as well
function renderResults(data,maxresults,stateSearch){
    console.log(data)
    // clear the lists every time a new entry is made
    $('#returned-results').empty();

    // show how many results we should expect to see
    $('.results').html(`Results: ${data.length}`)

    // must designate iteration length by input data
    if(data.length <= maxresults){
        for(let i=0;i<data.length;i++){
            renderPark(data[i],stateSearch)            
        };
    }
    else if (data.length > maxresults){
        for(let i=0;i<maxresults;i++){
            renderPark(data[i],stateSearch)             
        };
    }

    // if no data is available show a response
    if(data.length === 0){
        $('#other').text(`No Results Found`)
    } 

    // remove hidden
    $('.results').removeClass('hidden');
}

// render the html code
function renderPark(parkInfo, stateSearch){
    let parkHTML = ''
    getAddresses(parkInfo.latLong)
    .then(add => {
        parkHTML = generateParkItemHTML(parkInfo,add, stateSearch)
        $('#returned-results').append(parkHTML)})    
}

// generate the html code for the li's
function generateParkItemHTML(parkInfo,add,stateSearch){
    console.log(stateSearch)
    return `<li class="needClass">
    <p><strong>${parkInfo.fullName}</strong>(<a href= ${parkInfo.url} target="_blank">Link</a>)</p>
    <p>State searched: ${stateSearch}</p>
    <p><em>Description</em>: ${parkInfo.description}</p><br>
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
function getParks(stateSearch, maxresults){
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
    .then(responseJson=> renderResults(responseJson.data, maxresults,stateSearch))
    .catch(err=>{
        $('#error').text(`Something went wrong: ${err.message}`);
        console.log(err.message)
    });
    
}

// watch for the submission
function watchForm(){
    $('form').submit(e=>{
        e.preventDefault();
        const maxresults=$('#max-hits').val();
        let val = [];
        $("input[name='state']:checked").each(function(i){
            val[i] = $(this).val();
        });
        console.log(val)
        for (let i=0;i<val.length;i++){
            getParks(val[i],maxresults)
        }
    })
}

// Try to make a nice drop down menu: 
// sample html code: 
{/* <select name="search-state" multiple="" id="search">
<div class="" value="">State</option>
<div class="item" value="AL">Alabama</div>
<div class="item" value="AK">Alaska</div>
<div class="item" value="AZ">Arizona</div>
<div class="item" value="AR">Arkansas</div>
<div class="item" value="CA">California</div>
<div class="item" value="CO">Colorado</div>
<div class="item" value="CT">Connecticut</div>
<div class="item" value="DE">Delaware</div>
<div class="item" value="DC">District Of Columbia</div>
<div class="item" value="FL">Florida</div>
<div class="item" value="GA">Georgia</div>
<div class="item" value="HI">Hawaii</div>
<div class="item" value="ID">Idaho</div>
<div class="item" value="IL">Illinois</div>
<div class="item" value="IN">Indiana</div>
<div class="item" value="IA">Iowa</div>
<div class="item" value="KS">Kansas</div>
<div class="item" value="KY">Kentucky</div>
<div class="item" value="LA">Louisiana</div>
<div class="item" value="ME">Maine</div>
<div class="item" value="MD">Maryland</div>
<div class="item" value="MA">Massachusetts</div>
<div class="item" value="MI">Michigan</div>
<div class="item" value="MN">Minnesota</div>
<div class="item" value="MS">Mississippi</div>
<div class="item" value="MO">Missouri</div>
<div class="item" value="MT">Montana</div>
<div class="item" value="NE">Nebraska</div>
<div class="item" value="NV">Nevada</div>
<div class="item" value="NH">New Hampshire</div>
<div class="item" value="NJ">New Jersey</div>
<div class="item" value="NM">New Mexico</div>
<div class="item" value="NY">New York</div>
<div class="item" value="NC">North Carolina</div>
<div class="item" value="ND">North Dakota</div>
<div class="item" value="OH">Ohio</div>
<div class="item" value="OK">Oklahoma</div>
<div class="item" value="OR">Oregon</div>
<div class="item" value="PA">Pennsylvania</div>
<div class="item" value="RI">Rhode Island</div>
<div class="item" value="SC">South Carolina</div>
<div class="item" value="SD">South Dakota</div>
<div class="item" value="TN">Tennessee</div>
<div class="item" value="TX">Texas</div>
<div class="item" value="UT">Utah</div>
<div class="item" value="VT">Vermont</div>
<div class="item" value="VA">Virginia</div>
<div class="item" value="WA">Washington</div>
<div class="item" value="WV">West Virginia</div>
<div class="item" value="WI">Wisconsin</div>
<div class="item" value="WY">Wyoming</div>
</select> */}
$(watchForm)
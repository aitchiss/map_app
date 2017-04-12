app = function(){
  var countryList = document.querySelector('#country-list')
  var regionList = document.querySelector('#region-list')
  regionList.onchange = handleRegionListChange

  var url = 'https://restcountries.eu/rest/v2'
  var selectionJson = localStorage.getItem('selection')
  
  if (selectionJson){
    var country = JSON.parse(selectionJson)[0]
    populateCountryInfo(country)
  }

  var container = document.querySelector('#map')
  var center = {lat: country.latlng[0], lng: country.latlng[1]}
  var mainMap = new MapWrapper(container, center, 5)

  makeRequest(url, requestComplete) 
  countryList.onchange = handleCountryListChange(mainMap); 
}

// selecting a country in the list

var requestComplete = function(){
  if (this.status !== 200) return
  var jsonString = this.responseText
  var countries = JSON.parse(jsonString)
  populateSelectMenu(countries)
}

var populateSelectMenu = function(countryArray){
  var countryList = document.querySelector('#country-list')
  while (countryList.hasChildNodes()){
    countryList.removeChild(countryList.firstChild)
  }

  var selectionJson = localStorage.getItem('selection')
    if (selectionJson){
      var savedCountry = JSON.parse(selectionJson)[0]
    }

  countryArray.forEach(function(country){
    var option = document.createElement('option')
    option.innerText = country.name

    if(country.name === savedCountry.name){
      option.selected = 'selected'
    }

    countryList.appendChild(option)
  })
}

var handleCountryListChange = function(mainMap){
  return function(){
    var selectedCountry = this.value
    var url = 'https://restcountries.eu/rest/v2/name/' + selectedCountry + '?fullText=true'
    makeRequest(url, requestCompleteSingleCountry(mainMap))
  }
}

var requestCompleteSingleCountry = function(mainMap){
  return function(){
    var jsonString = this.responseText
    localStorage.setItem('selection', jsonString)
    var country = JSON.parse(jsonString)[0]

    mainMap.googleMap.setCenter({lat: country.latlng[0], lng: country.latlng[1]})

    populateCountryInfo(country)
  }
}

var populateCountryDiv = function(div, country){
  var name = document.createElement('p')
  var population = document.createElement('p')
  var capital = document.createElement('p')

  while(div.hasChildNodes()){
    div.removeChild(div.firstChild)
  }

  name.innerText = 'Name: ' + country.name
  population.innerText = 'Population: ' + country.population
  capital.innerText = 'Capital: ' + country.capital

  div.appendChild(name)
  div.appendChild(population)
  div.appendChild(capital)
}

var populateCountryInfo = function(country){
  var div = document.querySelector('#country-info')
  div.classList.add('primary-country')
  populateCountryDiv(div, country)

  var neighbours = document.createElement('div')
  neighbours.classList.add('neighbouring-countries')

  var neighboursTitle = document.createElement('h3')
  neighboursTitle.innerText = 'Neighbouring Countries:'
  neighbours.appendChild(neighboursTitle)

  div.appendChild(neighbours)

  var neighboursArray = country.borders

  neighboursArray.forEach(function(countryCode){
    var url = 'https://restcountries.eu/rest/v2/alpha/' + countryCode
    makeRequest(url, requestCompleteNeighbours) 
  })
}

// setting up the display of neighbour details for a country

var requestCompleteNeighbours = function(){
  var jsonString = this.responseText
  var country = JSON.parse(jsonString)
  populateNeighbourInfo(country)
}

var populateNeighbourInfo = function(country){
  var neighbouringCountriesDiv = document.querySelector('.neighbouring-countries')
  var countryDiv = document.createElement('div')
  countryDiv.classList.add('neighbour')
  populateCountryDiv(countryDiv, country)
  neighbouringCountriesDiv.appendChild(countryDiv)
}

//selecting a region

var handleRegionListChange = function(){
  var selectedRegion = this.value

  if (selectedRegion === 'all'){
    var url = 'https://restcountries.eu/rest/v2'
  } else {
    var url = 'https://restcountries.eu/rest/v2/region/' + selectedRegion
  }
  makeRequest(url, requestComplete)
}


var makeRequest = function(url, callback){
  var request = new XMLHttpRequest()
  request.open("GET", url)
  request.onload = callback
  request.send()
}


window.onload = app
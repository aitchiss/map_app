app = function(){
  var countryList = document.querySelector('#country-list')
  var url = 'https://restcountries.eu/rest/v2'

  makeRequest(url, requestComplete) 

  countryList.onchange = handleCountryListChange
}

var handleCountryListChange = function(){
  var selectedCountry = this.value
  var url = 'https://restcountries.eu/rest/v2/name/' + selectedCountry + '?fullText=true'
  makeRequest(url, requestCompleteSingleCountry) 
}

var requestCompleteSingleCountry = function(){
  var name = document.createElement('p')
  var population = document.createElement('p')
  var capital = document.createElement('p')
  var jsonString = this.responseText
  var country = JSON.parse(jsonString)[0]
  var div = document.querySelector('#country-info')

  name.innerText = 'Name: ' + country.name
  population.innerText = 'Population: ' + country.population
  capital.innerText = 'Capital: ' + country.capital
  
  div.appendChild(name)
  div.appendChild(population)
  div.appendChild(capital)
}

var requestComplete = function(){
  if (this.status !== 200) return
  var jsonString = this.responseText
  var countries = JSON.parse(jsonString)
  console.log(countries)
  populateSelectMenu(countries)
}

var populateSelectMenu = function(countryArray){
  var countryList = document.querySelector('#country-list')

  countryArray.forEach(function(country){
    var option = document.createElement('option')
    option.innerText = country.name
    countryList.appendChild(option)
  })
}

var makeRequest = function(url, callback){
  var request = new XMLHttpRequest()
  request.open("GET", url)
  request.onload = callback
  request.send()
}


window.onload = app
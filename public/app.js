app = function(){
  var countryList = document.querySelector('#country-list')
  var url = 'https://restcountries.eu/rest/v2'
  var selectionJson = localStorage.getItem('selection')
  if (selectionJson){
    var country = JSON.parse(selectionJson)[0]
    populateCountryInfo(country)
  }
  

  makeRequest(url, requestComplete) 

  countryList.onchange = handleCountryListChange
}

var handleCountryListChange = function(){
  var selectedCountry = this.value

  var url = 'https://restcountries.eu/rest/v2/name/' + selectedCountry + '?fullText=true'
  makeRequest(url, requestCompleteSingleCountry) 
}

var requestCompleteSingleCountry = function(){
  var jsonString = this.responseText
  localStorage.setItem('selection', jsonString)

  var country = JSON.parse(jsonString)[0]
  populateCountryInfo(country)
}

var populateCountryInfo = function(country){
  var name = document.createElement('p')
  var population = document.createElement('p')
  var capital = document.createElement('p')

  var div = document.querySelector('#country-info')

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

var requestComplete = function(){
  if (this.status !== 200) return
  var jsonString = this.responseText
  var countries = JSON.parse(jsonString)
  console.log(countries)
  populateSelectMenu(countries)
}

var populateSelectMenu = function(countryArray){
  var countryList = document.querySelector('#country-list')

  var selectionJson = localStorage.getItem('selection')
    if (selectionJson){
      var savedCountry = JSON.parse(selectionJson)[0]
    }


  countryArray.forEach(function(country){
    var option = document.createElement('option')
    option.innerText = country.name

    if(country.name === savedCountry.name){
      console.log('match')
      option.selected = 'selected'
    }

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
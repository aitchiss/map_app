app = function(){
  var countryList = document.querySelector('#country-list')
  var url = 'https://restcountries.eu/rest/v2'

  makeRequest(url, requestComplete) 
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
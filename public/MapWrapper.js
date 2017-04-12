var MapWrapper = function(container, coords, zoom){

 this.googleMap = new google.maps.Map(container, { 
   center: coords, 
   zoom: zoom
 });

}

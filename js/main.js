$('.menu').on('click', function() {
  $(this).toggleClass('active');
  $('.overlay').toggleClass('menu-open');
  $('body').toggleClass('hide-overflow');
  $('.back-to-top').toggleClass('hide-content');
});


$('.nav a').on('click', function() {
  $('.menu').removeClass('active');
  $('.overlay').removeClass('menu-open');
  $('body').removeClass('hide-overflow');
  $('.back-to-top').removeClass('hide-content');
});

// ===== Scroll to Top ====
$(window).scroll(function() {
    if ($(this).scrollTop() >= 500) {        // If page is scrolled more than 50px
        $('.back-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('.back-to-top').fadeOut(200);   // Else fade out the arrow
    }
});

$(function(){
    $('.back-to-top').on('click', function() {      // When arrow is clicked
        $(this).toggleClass('active-top');
        $('body,html').animate({
            scrollTop : 0                       // Scroll to top of body
        }, 100);
        setTimeout(RemoveClass, 1500);
    		});
    function RemoveClass() {
        $('.back-to-top').removeClass('active-top');
    }
});

// ==== Map ====
const MAP = 'pk.eyJ1IjoibG9yZW56b21lbnRhIiwiYSI6ImNrNGI3MnNwdTBheDUzbm9nanlsbmtmZHQifQ.Ag_McrzQN8_QGxI7Bo9QYg';
var position;
var positionCoord;
var circle;
var destination;
var destinationCoord;
var routeControl;
let options = {profile: 'mapbox/walking', language: 'it'}


var map = L.map('map').setView([44.505833, 11.341667], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoibG9yZW56b21lbnRhIiwiYSI6ImNrNGI3MXRjbjBhdTgzbW14NnpqcHgyczUifQ.IrmWvBDIlTuzSi6qCrVUvA'
}).addTo(map);


// ==== Icons ====

var userIcon = L.icon({
  iconUrl: 'images/street-view.svg',
  iconSize:     [30, 60], // size of the icon
  iconAnchor:   [15, 40], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
});

var markerIcon = L.icon({
  iconUrl: 'images/map-marker.svg',
  iconSize:     [30, 60], // size of the icon
  iconAnchor:   [15, 40], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
});

for ( var i=0; i < markers.length; ++i )
{
   var markerLat = markers[i].lat;
   var markerLng = markers[i].lng;
   var marker = L.marker( [markers[i].lat, markers[i].lng] ,  {icon: markerIcon})
      .bindPopup('<a href="' + markers[i].url + '" target="_blank">' + markers[i].name + '</a>' + "<br>" + markers[i].lat + "°, " + markers[i].lng + "° <br><br><hr><br>" + '<a href="#clip">' + "Vai alla Clip!" + '</a>' )
      .addTo( map )
      marker.on('click', function(marker){
            destinationCoord = this.getLatLng();
            routeControl.setWaypoints([
                positionCoord,
                destinationCoord
              ])
        });
}
// ==== Geolocation and Routing ====

map.locate({setView: true, maxZoom: 13});

function onLocationFound(e) {
    var radius = e.accuracy;

    position = L.marker(e.latlng, {icon : userIcon}).addTo(map)
        .bindPopup("Ti trovi entro " + radius + " metri da questo punto").openPopup();

    positionCoord = e.latlng;

    console.log(positionCoord);

    circle = L.circle(e.latlng, radius).addTo(map);



    routeControl =  L.Routing.control({
          routeWhileDragging: true,
          router: new L.Routing.mapbox(MAP, options)
        }).addTo(map);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

//==== Geocoding ====

// create geocode error box element
  var geocodeErEl = document.createElement('div');
  geocodeErEl.setAttribute('id', 'geocodeError');

  // create close button for error box
  var geocoderErCloseEl = document.createElement('input');
  geocoderErCloseEl.setAttribute('id','errorCloseBtn');
  geocoderErCloseEl.setAttribute('type','button');
  geocoderErCloseEl.setAttribute('value', 'X');

  // create paragraph element to contain error text
  var geocodeErTextEl = document.createElement('p');
  geocodeErTextEl.setAttribute('id','errorText');

  // append elements to geocode error div
  jQuery(geocodeErEl).append(geocoderErCloseEl);
  jQuery(geocodeErEl).append(geocodeErTextEl);

  // append elememnts to map
  jQuery('#map').append(geocodeErEl);

  // container for address search results
  var addressSearchResults = new L.LayerGroup().addTo(map);

  // OSM Geocoder
  var osmGeocoder = new L.Control.OSMGeocoder({
      collapsed: false,
      position: 'bottomleft',
      text: 'Cerca',
      placeholder: 'Inserisci un indirizzo',
      callback: function(results) {
              // error box element
              var geocodeErrorBox = jQuery('#geocodeError');
              var geocodeErrorText = jQuery('#errorText');

              // close error box if it is open
              if (!geocodeErrorBox.css('display','none')) {
                  geocodeErrorBox.hide();
              }

              // If no results are found, add a message to the screen
              if (results.length == 0) {
          // placeholder="" is key to selecting DOM element
                  var searchText = jQuery('.leaflet-control-geocoder-form input[placeholder="Inserisci un indirizzo"]').val();
                  // get search text or result text and put that in box
                  geocodeErrorText.html('Nessun risultato per ' + searchText);
                  geocodeErrorBox.show();
                  return;
        }

              // clear previous geocode results
              addressSearchResults.clearLayers();

              // get coordinates for result
              positionCoord = L.latLng(results[0].lat,results[0].lon);

              if (position != undefined) {
                    map.removeLayer(position);
                    map.removeLayer(circle);
              };

              // create a marker for result
              position = L.marker(positionCoord, {
                  icon: userIcon
              }).addTo(map)
                  .bindPopup("Ti trovi qui").openPopup();

              map.setView([results[0].lat,results[0].lon],13);

              routeControl.setWaypoints([
                  undefined,
                  undefined
                ])

          }
      }).addTo(map);

  // add event listener to click event for error message close button
  jQuery('#errorCloseBtn').click(function() {
     jQuery('#geocodeError').hide();
  })

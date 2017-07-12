/* global google */
/* global _ */
/**
 * scripts.js
 *
 * Computer Science 50
 * Problem Set 8
 *
 * Global JavaScript.
 */

// Google Map
var map;

// markers for map
var markers = [];

// info window
var info = new google.maps.InfoWindow();

// execute when the DOM is fully loaded
$(function() {

    // styles for map
    // https://developers.google.com/maps/documentation/javascript/styling
    var styles = [

            { "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" } ] },
            { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
            { "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] },
            { "elementType": "labels.text.stroke", "stylers": [ { "color": "#f5f5f5" } ] },
            { "featureType": "administrative.land_parcel", "stylers": [ { "visibility": "off" } ] },
            { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#bdbdbd" } ] },
            { "featureType": "administrative.locality", "elementType": "geometry.fill", "stylers": [ { "visibility": "off" }, { "weight": 0.5 } ] },
            { "featureType": "administrative.neighborhood", "stylers": [ { "visibility": "off" } ] },
            { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] },
            { "featureType": "poi", "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] },
            { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] },
            { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [ { "color": "#c9e3c9" } ] },
            { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] },
            { "featureType": "road", "stylers": [ { "visibility": "off" } ] },
            { "featureType": "transit.line", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] },
            { "featureType": "transit.station", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] },
            { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#d7e1e5" } ] },
            
    ];

    // options for map
    // https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var options = {
        center: {lat: 37.4236, lng: -122.1619}, // Stanford, California
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 14,
        panControl: true,
        styles: styles,
        zoom: 13,
        zoomControl: true
    };

    // get DOM node in which map will be instantiated
    var canvas = $("#map-canvas").get(0);

    // instantiate map
    map = new google.maps.Map(canvas, options);

    // configure UI once Google Map is idle (i.e., loaded)
    google.maps.event.addListenerOnce(map, "idle", configure);

});

/**
 * Adds marker for place to map.
 */
function addMarker(place)
{
    markers = place;
    var myLatLng = {lat: parseFloat(place.latitude), lng: parseFloat(place.longitude)};
    var image = {
    url: '/img/icon31.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(55, 44),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32)
    };
    // initialize marker
    var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: image,
    title: place.place_name
    });
    marker.setMap(map);
    var news = "<ul>";
    var parameters = {
        geo: place.postal_code
    };
    
    // request to server
    
    $.getJSON("articles.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // iterate over rss data
        for(var k = 0; k < data.length; k++)
        {
            news += "<li><p><a href=" + data[k].link + ">"+data[k].title+"</a></p></li>";
        }
        news += "</ul>";
        // on click call showInfo
        marker.addListener('click',function(){
        showInfo(marker, news);
        });
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });

}

/**
 * Configures application.
 */
function configure()
{
    // update UI after map has been dragged
    google.maps.event.addListener(map, "dragend", function() {
        update();
    });

    // update UI after zoom level changes
    google.maps.event.addListener(map, "zoom_changed", function() {
        update();
    });

    // remove markers whilst dragging
    google.maps.event.addListener(map, "dragstart", function() {
        removeMarkers();
    });

    // configure typeahead
    // https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md
    $("#q").typeahead({
        autoselect: true,
        highlight: true,
        minLength: 1,
        hint: true
    },
    {
        source: search,
        templates: {
            empty: "no places found yet",
            suggestion: _.template("<p><%- place_name %>, <b><%- admin_name1 %></b>, <%- postal_code %></p>")
        }
    });

    // re-center map after place is selected from drop-down
    $("#q").on("typeahead:selected", function(eventObject, suggestion, name) {

        // ensure coordinates are numbers
        var latitude = (_.isNumber(suggestion.latitude)) ? suggestion.latitude : parseFloat(suggestion.latitude);
        var longitude = (_.isNumber(suggestion.longitude)) ? suggestion.longitude : parseFloat(suggestion.longitude);

        // set map's center
        map.setCenter({lat: latitude, lng: longitude});

        // update UI
        update();
    });

    // hide info window when text box has focus
    $("#q").focus(function(eventData) {
        hideInfo();
    });

    // re-enable ctrl- and right-clicking (and thus Inspect Element) on Google Map
    // https://chrome.google.com/webstore/detail/allow-right-click/hompjdfbfmmmgflfjdlnkohcplmboaeo?hl=en
    document.addEventListener("contextmenu", function(event) {
        event.returnValue = true; 
        event.stopPropagation && event.stopPropagation(); 
        event.cancelBubble && event.cancelBubble();
    }, true);

    // update UI
    update();

    // give focus to text box
    $("#q").focus();
}

/**
 * Hides info window.
 */
function hideInfo()
{
    info.close();
    return true;
}

/**
 * Removes markers from map.
 */
function removeMarkers()
{
    // TODO
    
    // remove marker from markers
    for (var i = 0, n = markers.length; i < n; i++)
    {
	markers[i].setMap(null);
    }

    // reset length to 0
    markers.length = 0;
}

/**
 * Searches database for typeahead's suggestions.
 */
function search(query, cb)
{
    // get places matching query (asynchronously)
    var parameters = {
        geo: query
    };
    $.getJSON("search.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // call typeahead's callback with search results (i.e., places)
        cb(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });
}

/**
 * Shows info window at marker with content.
 */
function showInfo(marker, content)
{
    // start div
    var div = "<div id='info'>";
    if (typeof(content) === "undefined")
    {
        // http://www.ajaxload.info/
        div += "<img alt='loading' src='img/ajax-loader.gif'/>";
    }
    else if(content == "<ul></ul>")
    {
        div += "<b>No, News Day!</b>";
    }
    else
    {
        div += content;
    }

    // end div
    div += "</div>";

    // set info window's content
    info.setContent(div);

    // open info window (if not already open)
    info.open(map, marker);
    
}

/**
 * Updates UI's markers.
 */
function update() 
{
    // get map's bounds
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    // get places within bounds (asynchronously)
    var parameters = {
        ne: ne.lat() + "," + ne.lng(),
        q: $("#q").val(),
        sw: sw.lat() + "," + sw.lng()
    };
    $.getJSON("update.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // remove old markers from map
        removeMarkers();

        // add new markers to map
        for (var i = 0; i < data.length; i++)
        {
            addMarker(data[i]);
        }
     })
     .fail(function(jqXHR, textStatus, errorThrown) {

         // log error to browser's console
         console.log(errorThrown.toString());
     });
     $("#form").show();
     hideInfo();
}
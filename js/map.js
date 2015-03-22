var googleMap;
var googlePlaces;

/**
 * Initialize google map to city
 */
function initializeMap() {
    googleMap = $('#map-canvas')[0];
    googleMap.latitude = LVM.city.lat;
    googleMap.longitude = LVM.city.lng;
    googleMap.zoom = 14;
    googleMap.disableDefaultUI = true;
    googleMap.apiKey = API_KEYS.google.api_key;
}


/**
 * Find nearby places that match the criteria
 */
function loadMapPlaces() {
    googlePlaces = googlePlaces || new google.maps.places.PlacesService(googleMap.map);

    var request = {
        location: LVM.city,
        radius: 1000,
        language: 'en',
        keyword: ''
    };

    googlePlaces.nearbySearch(request, function(results, status, nextPageToken) {
        if(status === "OK") {

            LVM.addLocations(results);
            LVM.filterLocations();
            //Get all pages of results (max 60 results, from 3 pages)
            if(nextPageToken.hasNextPage) {
                setTimeout(function() {
                    nextPageToken.nextPage();
                }, 500);
            }
        } else {
            console.error(status, results);
        }
    })
}


/**
 * Location
 *
 * @class Location
 * @param {PlaceResult} placeResult Google Places API result Object
 */
function Location(placeResult) {
    this.name = placeResult.name;
    this.placeId = placeResult.place_id;
    this.position = placeResult.geometry.location;
    this.icon = placeResult.icon;
    this.types = placeResult.types;
    this.blurbs = {};
    this.urls = {};

    //Create Google Maps marker for this
    this.markerIcon = {
        url: this.icon,
        scaledSize: new google.maps.Size(24,24),
        visible: this.types.anyExist(LVM.filter().keywords)
    };
    this.marker = new google.maps.Marker({
        map: googleMap.map,
        title: this.name,
        position: this.position,
        visible: true,
        icon: this.markerIcon
    });
    //Add Click to Marker
    google.maps.event.addListener(
        this.marker,
        'click',
        (function(loc) {
            return function() {
                loc.onClick();
            }
        })(this)
    );
}

//Click handler for Location
Location.prototype.onClick = function() {
    //Reset any changed markers
    var locs = LVM.allLocations();
    for(var i = 0; i < locs.length; i++) {
        var loc = locs[i];
        loc.marker.icon = loc.markerIcon;
        loc.marker.setMap(null);
        loc.marker.setMap(googleMap.map);
    }
    //Update this marker
    this.marker.icon = null;
    this.marker.setMap(null);
    this.marker.setMap(googleMap.map);

    //Query data from API(s) if necessary
    if(!this.blurbs.wiki) {
        wiki = wiki || new Wikipedia();
        wiki.query(
            this.name,
            (function(loc) {
                return function(results, status) {
                    if(status === 'success') {
                        var page = results.query.pages[Object.keys(results.query.pages)[0]];
                        loc.blurbs.wiki = page.extract || '<p>No Wikipedia results found</p>';
                        loc.urls.wiki = 'http://en.wikipedia.org/wiki/' + page.title;
                        LVM.setOverlay(loc);
                    }
                };
            })(this),
            (function(loc) {
                return function(error) {
                    var container = document.createElement('div');
                    var p1 = document.createElement('p');
                    p1.innerText = 'Wikipedia API has failed to load with the following error';
                    var message = document.createElement('p');
                    message.innerText = JSON.stringify(error);
                    container.appendChild(p1);
                    container.appendChild(message);
                    console.log(container);
                    loc.blurbs.wiki = container.innerHTML;
                    LVM.setOverlay(loc);
                };
            })(this));
    }
    //Update and call the overlay
    LVM.setOverlay(this);
};

function toggleSearch() {
    console.log('fuck fuck fuck');
}

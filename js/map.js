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
    var markerIcon = {
        url: this.icon,
        scaledSize: new google.maps.Size(24,24),
        visible: this.types.anyExist(LVM.filter().keywords)
    };
    this.marker = new google.maps.Marker({
        map: googleMap.map,
        title: this.name,
        position: this.position,
        visible: true,
        icon: markerIcon
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
    //Query data from API(s) if necessary
    if(!this.blurbs.wiki) {
        wiki = wiki || new Wikipedia();
        wiki.query(this.name, (function(loc) {
            return function(results, status) {
                if(status === 'success') {
                    var page = results.query.pages[Object.keys(results.query.pages)[0]];
                    loc.blurbs.wiki = page.extract || '<p>No Wikipedia results found</p>';
                    loc.urls.wiki = 'http://en.wikipedia.org/wiki/' + page.title;
                    LVM.setOverlay(loc);
                }
            };
        })(this));
    }
    //Update and call the overlay
    LVM.setOverlay(this);
};

var LocationViewModel = function() {
    //Map variables
    this.city = {
        name: 'Moscow, Russia',
        lat: 55.749792,
        lng: 37.632495
    };
    //Location results
    this.allLocations = ko.observableArray([]);
    this.filteredLocations = ko.observableArray([]);
    //Overlay variables
    this.currentLocation = ko.observable();
    this.overlayOpen = ko.observable(false);
    this.overlayTitle = ko.observable('');
    this.overlayContent = ko.observable('');
    //Search an Filters
    this.searchString = ko.observable('');
    this.filters = [
        {
            name: 'All',
            keywords: []
        },{
            name: 'Food',
            keywords: [
                'bakery', 'bar', 'cafe', 'food', 'meal_takeaway', 'meal_delivery',
                'night_club', 'restaurant'
            ],
            icon: 'maps:local-restaurant'
        },{
            name: 'Arts',
            keywords: ['art_gallery', 'movie_theater', 'museum', 'painter'],
            icon: 'image:palette'
        },{
            name: 'Shopping',
            keywords: [
                'beauty_salon', 'bicycle_store', 'book_store', 'clothing_store',
                'department_store', 'electronics_store', 'shoe_store', 'shopping_mall'
            ],
            icon: 'maps:local-mall'
        }
    ];
    this.filter = ko.observable(this.filters[0]);

};

/**
 * Set/update the data in the overlay, if not visible, show the overlay
 * @param {Location} location
 */
LocationViewModel.prototype.setOverlay = function(location) {
    this.currentLocation(location);
    this.overlayTitle(location.name);
    var content = location.blurbs.wiki;
    if(location.urls.wiki) content += '<a href="' + location.urls.wiki + ' "target="_blank" class="extinfo-link">Wikipedia</a>';
    this.overlayContent(content);
    if(!this.overlayOpen()) this.toggleOverlay();
};

//Toggle the open state of the overlay
LocationViewModel.prototype.toggleOverlay = function() {
    this.overlayOpen(!this.overlayOpen());
};

/**
 * Add a Location Object to the list of locations
 * @param {Array} results Array of PlaceResults Objects from Google Places API
 */
LocationViewModel.prototype.addLocations = function(results) {
    $.each(results, function(index, result) {
        LVM.allLocations.push(new Location(result));
    });
};

/**
 * Filter locations, and update the list of filteredLocations
 */
LocationViewModel.prototype.filterLocations = function() {
    var locs = this.allLocations();

    //Filter based on current 'Tab'
    if(this.filter().name !== 'All') {
        var filterTypes = LVM.filter().keywords;
        locs = $.map(locs, function(location) {
            return location.types.anyExist(filterTypes) ? location : null;
        });
    }
    //Then filter on searchString
    if(!!(this.searchString())) {
        locs = $.map(locs, function(location) {
            return location.name.toLowerCase().indexOf(LVM.searchString().toLowerCase()) > -1 ? location : null;
        });
    }
    //Update the visibilty of the Markers
    $.each(this.allLocations(), function(index, location) {
        location.marker.setVisible(locs.entryExists(location));
    });
    //Save the new array
    this.filteredLocations(locs);
};

/**
 * On load, initialize, attach events
 */
$(function() {
    // Start this pony
    window.LVM = new LocationViewModel();
    ko.applyBindings(LVM);

    //Init map
    initializeMap();
    var load = setTimeout(function() {
        alert('Google Maps API failed to load within 5 seconds.\nPlease try again.');
    }, 5000);
    googleMap.addEventListener('google-map-ready', function(e) {
        clearTimeout(load);
        loadMapPlaces();
    });

    //Init Wiki API querier
    window.wiki = window.wiki || new Wikipedia();

    //Attach clicks to tabs
    $('paper-tab').click(function(e) {
        var target = this.innerText;
        $.each(LVM.filters, function(index, filter) {
            if(filter.name === target) {
                LVM.filter(filter);
                LVM.filterLocations();
            }
        });
    });

    //Attach events to search box
    $('#searchicon').click(function(e) {
        $('#main_placesearch').toggleClass('open');
    });

    $('#main_placesearch').keyup(function(e) {
        LVM.searchString(e.target.value);
        LVM.filterLocations();
    });

    //Attach events to close overlay
    $('#overlay_backdrop').click(function(e) {
        e.stopPropagation();
        LVM.toggleOverlay();
    });

});


// Add utility functions to Array Class for cleaner code

Array.prototype.anyExist = function(arr) {
    //Check if any entries in `this` exist in `arr`
    for(var i = 0; i < this.length; i++) {
        if(arr.entryExists(this[i])) return true;
    }
    return false;
}

Array.prototype.entryExists = function(item) {
    //Check if `item` exists in `this`
    return this.indexOf(item) > -1;
}

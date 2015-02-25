/**
 * Wikipedia Object constructor
 *   Creates a shell for querying the wikipedia API
 */
var Wikipedia = function() {
    //Base URL for the query, titles will be appended to this
    this.urlBase =  'http://en.wikipedia.org/w/api.php' +
                    '?action=query' +
                    '&format=json' +
                    '&prop=extracts' +
                    '&exintro' +
                    '&redirects' +
                    '&continue' +
                    '&callback=?';

    //Base Arguments for ajax request, no url
    //Provides a generic callback that will log results to the console
    this.ajaxBase = {
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data, status) {
            console.log(data, status, this);
        },
        error: function(error) { console.error(error); }
    };

}

/**
 * Method to call a query to wikipedia
 *
 * @param {String} titles Title of Wikipedia Article to search for
 * @param {Function} callback Function to use in place of the default success callback
 * @method query
 */
Wikipedia.prototype.query = function(titles, callback) {
    var ajax = this.ajaxBase;
    if(callback instanceof Function) ajax['success'] = callback;

    var url =   this.urlBase +
                "&titles=" + titles;

    ajax['url'] = url;

    $.ajax(ajax);
};

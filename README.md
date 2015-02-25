# frontend-nanodegree-neighborhood-map

A single page app to showcase a neighborhood and the locations around it.

##To run:##
1. Fork this repo and setup locally
2. Edit js/api_keys.js to contain your API Keys
  - currently, only the google API key is needed
3. Run python.py to start a local webserver
4. Navigate your browser to `http://localhost:8000/build.html`


##To use:##
1. Click on a place name in the drawer panel, or a place's icon in the map region to open an overlay with more information on that place(retrieved via wikipedia).
2. Select a page [All|Food|Arts|Shopping] to trim down the list of places.
3. Type in the search box to further pare down the list of places.


##Notes when making changes:##
- Reference and make changes to index.html, master.css, and the js files directly.
- Build.html is built using vulcanize
  - To install: `npm install -g vulcanize`
  - To build: `vulcanize -o build.html index.html --inline`


##Other##
- Places are automatically retrieved from the Google Places API. 
  - Places within a 1000m radius are retrieved
  - A maximum of 60 places will be retrieved
- As places are retrieved from the Google Places API, some may not find any wikipedia data, or may find wiki data for something else by the same name.  ex. Mount Olympus in San Francisco's wiki data may refer to the Greek Mount Olympus instead of the park.
- Yelp API was also to be implemented, but does not seem to currently support CORS, or JSONP.
- Flcikr API was also to be implemented, but the Yahoo account signup page was broken as of 2/24/2015.


###References & Resources###
- [Knockout](http://knockoutjs.com/documentation/introduction.html)
- [Polymer](https://www.polymer-project.org/)
- [Google Web Components](https://googlewebcomponents.github.io/)
- [Wiki API](http://www.mediawiki.org/wiki/API:Main_page)
- [Maps API](https://developers.google.com/maps/)
- [Yelp API](https://www.yelp.com/developers/documentation)
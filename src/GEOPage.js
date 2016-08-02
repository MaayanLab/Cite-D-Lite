var GEOPage = {
	// Return true if user is on datasets search results page, false otherwise.
	isGEOSearchResultsPage: function() {
		if (Boolean(window.location.pathname.match(/\/gds/) && window.location.search.match(/\?term=/))) {
			// If is on search results page
			return true;
		}
		else if (Boolean(window.location.pathname.match(/\/gds/) && document.getElementById('database')[0].textContent.match('GEO DataSets'))) {
			// Else if is on subsequent page of search results page
			return true;
		}
	},

	// Return true if user is on GDS browser page, false otherwise.
	isGDSBrowserPage: function() {
		return Boolean(window.location.pathname.match(/\/sites\/GDSbrowser/) && window.location.search.match(/\?acc=GDS/));
	},

	// Return true if user is on GSE page, false otherwise.
	isGSEPage: function() {
		return Boolean(window.location.pathname.match(/\/geo\/query\/acc.cgi/) && window.location.search.match(/\?acc=GSE/));
	}
};

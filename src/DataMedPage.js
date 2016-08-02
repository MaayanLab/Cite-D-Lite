var DataMedPage = {
	isDataMed: function() {
		return Boolean(window.location.hostname.match(/datamed.org/));
	},

	isDataMedSearchResultsPage: function() {
		return Boolean(window.location.hostname.match(/datamed.org/) && window.location.pathname.match(/\/search.php/));
	},
	
	isDataMedItemPage: function() {
		return Boolean(window.location.hostname.match(/datamed.org/) && window.location.pathname.match(/\/display-item.php/));
	}
};

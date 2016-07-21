////////// ALL THINGS RELATED TO CHECKING TYPE OF PAGE //////////
// Return true if user is on datasets search results page, false otherwise.
var Page = {
	isDatasetSearchResultsPage: function() {
		if (Boolean(window.location.pathname.match(/\/gds/) && window.location.search.match(/\?term=/))) {
			// If is on search results page
			return true;
		}
		else if (Boolean(window.location.pathname.match(/\/gds/) && document.getElementById('database')[0].textContent.match('GEO DataSets'))) {
			// Else if is on subsequent page of search results page
			return true;
		}
	},

	// Return true if result on search results page is a dataset, false otherwise.
	isDataSet: function($object) { // $object is either $evtTarget or $elem
		if (this.isDatasetSearchResultsPage()) {
			if (Boolean($object.attr('class').match('citationbutton'))) { // $object is $evtTarget
				return Boolean($object.parent().parent().find('.src').text().match('DataSet'));
			}
			else { // $object is $elem
				return Boolean($object.parent().find('.src').text().match('DataSet'));
			}
		}
	},

	// Return true if result on search results page is a series, false otherwise.
	isSeries: function($object) { // $object is either $evtTarget or $elem
		if (this.isDatasetSearchResultsPage()) {
			if (Boolean($object.attr('class').match('citationbutton'))) { // $object is $evtTarget
				return Boolean($object.parent().parent().find('.src').text().match('Series'));
			}
			else { // $object is $elem
				return Boolean($object.parent().find('.src').text().match('Series'));
			}
		}
	},

	// Return true if user is on GDS browser page, false otherwise.
	isGDSBrowserPage: function() {
		return Boolean(window.location.pathname.match(/\/sites\/GDSbrowser/) && window.location.search.match(/\?acc=GDS/));
	},

	// Return true if user is on GSE page, false otherwise.
	isGSEPage: function() {
		return Boolean(window.location.pathname.match(/\/geo\/query\/acc.cgi/) && window.location.search.match(/\?acc=GSE/));
	},

	// Return true if user is on PubMed search results page or article abstract page, false otherwise.
	isPubMed: function() {
		return Boolean(window.location.pathname.match(/\/pubmed/) && document.getElementById('database')[0].textContent.match('PubMed'));
	},

	isPubMedSearchResultsPage: function() {
		if (Boolean(window.location.pathname.match(/\/pubmed/) && window.location.search.match(/\?term=/))) {
			// If is on search results page
			return true;
		}
		else if (Boolean(window.location.pathname.match(/\/pubmed/) && document.getElementById('database')[0].textContent.match('PubMed') && !document.getElementsByClassName('value')[0].textContent.match('Abstract'))) {
			// Else if is on subsequent page of search results page
			return true;
		}
	},

	isPubMedAbstractPage: function() {
		return Boolean(window.location.pathname.match(/\/pubmed/) && document.getElementsByClassName('value')[0].textContent.match('Abstract'));
	}
};

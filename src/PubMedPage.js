var PubMedPage = {
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

	// Return true if user is on PubMed abstract page, false otherwise.
	isPubMedAbstractPage: function() {
		return Boolean(window.location.pathname.match(/\/pubmed/) && document.getElementsByClassName('value')[0].textContent.match('Abstract'));
	}
};

var PreAjax = {
	getIntoGDSBrowserPage: function(format, ID, $evtTarget) {
	var baseURL = 'http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=GDS',
		searchURL = baseURL + ID;
	AjaxCall.GDSBrowserPage(format, ID, $evtTarget, searchURL);
	},

	getIntoGSEPage: function(format, series, $evtTarget) {
		var baseURL = 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=',
			searchURL = baseURL + series;
		AjaxCall.GSEPage(format, series, $evtTarget, searchURL);
	},

	getIntoAbstractPage: function(format, PubMedID, $evtTarget) {
		var baseURL = 'http://www.ncbi.nlm.nih.gov/pubmed/',
			searchURL = baseURL + PubMedID;
		AjaxCall.AbstractPage(format, PubMedID, $evtTarget, searchURL);
	},

	getPubMedAuthors: function($evtTarget, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI, searchURL) {
		var pubmedBaseURL = 'http://www.ncbi.nlm.nih.gov/sites/PubmedCitation?id=',
			pubmedSearchURL = pubmedBaseURL + PubMedID;
		AjaxCall.PubMedAuthorMatrix($evtTarget, pubmedSearchURL, format, ID, modifiedTitle, year, journal, abstract, DOI, searchURL);
	}
};

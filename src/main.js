function main() {
	var $parents = Interface.locateParents();
	Interface.load($parents);
	Interface.whenClicked();
}

function getIntoGDSBrowserPage(format, ID, $evtTarget) {
	var baseURL = 'http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=GDS',
		searchURL = baseURL + ID;
	AjaxCall.GDSBrowserPage(format, ID, $evtTarget, searchURL);
}

function getIntoGSEPage(format, series, $evtTarget) {
	var baseURL = 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=',
		searchURL = baseURL + series;
	AjaxCall.GSEPage(format, series, $evtTarget, searchURL);
}

function getIntoAbstractPage(format, PubMedID, $evtTarget) {
	var baseURL = 'http://www.ncbi.nlm.nih.gov/pubmed/',
		searchURL = baseURL + PubMedID;
	AjaxCall.AbstractPage(format, PubMedID, $evtTarget, searchURL);
}

function getPubMedAuthors($evtTarget, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI) {
	var pubmedBaseURL = 'http://www.ncbi.nlm.nih.gov/sites/PubmedCitation?id=',
		pubmedSearchURL = pubmedBaseURL + PubMedID;
	AjaxCall.PubMedAuthorMatrix($evtTarget, pubmedSearchURL, format, ID, modifiedTitle, year, journal, abstract, DOI);
}

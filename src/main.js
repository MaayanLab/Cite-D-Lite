function main() {
	var $parents = Interface.locateParents();
	Interface.load($parents);
	Interface.whenClicked();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Gets citation info from GDS browser page
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getAuthorMatrix($data, $evtTarget, searchURL, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI) {
	var authors,
		authorMatrix;	
	if ((Type.isDataSet($evtTarget)) || (Page.isGDSBrowserPage())) {
		authors = $data.find('.authors').text();
		authors = authors.slice(0,authors.length-2); // Get rid of extra space and punctuation at end of string
		authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
		authorMatrix = authors.split(","); // Divides string of authors into vector of authors
		for (i=0;i<authorMatrix.length;i++) { // Insert comma between last & first name
			authorMatrix[i] = authorMatrix[i].replace(' ',', ');
		}
		return authorMatrix;
	}
	else if ((Type.isSeries($evtTarget)) || (Page.isGSEPage())) {
		var pubmedBaseURL = 'http://www.ncbi.nlm.nih.gov/sites/PubmedCitation?id=',
			pubmedSearchURL = pubmedBaseURL + PubMedID;
		AjaxCall.PubMedAuthorMatrix($evtTarget, pubmedSearchURL, format, ID, modifiedTitle, year, journal, abstract, DOI);
	}
	else if (Page.isPubMed()) {
		authors = $data.find('.auths').text();
		authors = authors.slice(0,authors.length-1); // Get rid of punctuation at end of string
		authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
		authorMatrix = authors.split(","); // Divides string of authors into vector of authors
		for (i=0;i<authorMatrix.length;i++) {
			authorMatrix[i] = authorMatrix[i].replace(' ',', '); // Insert comma between last & first name
			authorMatrix[i] = authorMatrix[i].slice(0,authorMatrix[i].length-1); // Get rid of number after name
		}
		return authorMatrix;
	}
}

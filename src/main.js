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
	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: '',
		success: function(data) {
			AjaxSuccess.GDSBrowserPage(data , $evtTarget, searchURL, format, ID);
		},
		error: function() {
			alert('Sorry, something went wrong.');
		}
	});
}

function getIntoGSEPage(format, series, $evtTarget) {
	var baseURL = 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=',
		searchURL = baseURL + series;
	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: '',
		success: function(data) {
			AjaxSuccess.GSEPage(data, $evtTarget, searchURL, format, series);
		},
		error: function() {
			alert('Sorry, something went wrong.');
		}
	});
}

function getIntoAbstractPage(format, PubMedID, $evtTarget) {
	var baseURL = 'http://www.ncbi.nlm.nih.gov/pubmed/',
		searchURL = baseURL + PubMedID;
	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: '',
		success: function(data) {
			AjaxSuccess.AbstractPage(data, $evtTarget, searchURL, format, PubMedID);
		},
		error: function() {
			alert('Sorry, something went wrong.');
		}
	});
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
		$.ajax({
			url: pubmedSearchURL,
			type: 'GET',
			dataType: '',
			success: function(pubmedCitation) {
				var $pubmedCitation = $(pubmedCitation);
				authors = $pubmedCitation.find('.authors').text();
				authors = authors.slice(0,authors.length-1); // Get rid of extra space at end of string
				authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
				authorMatrix = authors.split(","); // Divides string of authors into vector of authors
				for (i=0;i<authorMatrix.length;i++) { // Insert comma between last & first name
					authorMatrix[i] = authorMatrix[i].replace(' ',', ');
				}
				CitationFile.assemble($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
			},
			error: function () {
				alert('Sorry, no citation available.');
			}
		});
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

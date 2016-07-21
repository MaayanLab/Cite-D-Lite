function main() {
	var $parents = Interface.locateParents();
	Interface.load($parents);
	Interface.whenClicked();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ALL THINGS RELATED TO AJAX CALLS //////////
// Gets citation info from GDS browser page
function getIntoGDSBrowserPage(format, ID, $evtTarget) {
	var baseURL = 'http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=GDS',
		searchURL = baseURL + ID;
	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: '',
		success: function(data) {
			var $data = $(data),
				series = '', // EMPTY
				title = ScreenScraper.getTitle($data, $evtTarget),
				modifiedTitle = 'GDS' + ID + ': ' + title,
				year = ScreenScraper.getYear($data, $evtTarget),
				PubMedID = '', // EMPTY
				journal = '', // EMPTY
				abstract = '', // EMPTY
				DOI = '', // EMPTY
				authorMatrix = getAuthorMatrix($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract, DOI);
			generateCitationAndDownload($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
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
			var $data = $(data),
				ID = '', // EMPTY
				title = ScreenScraper.getTitle($data, $evtTarget),
				modifiedTitle = series + ': ' + title,
				year = ScreenScraper.getYear($data, $evtTarget),
				PubMedID = $data.find('.pubmed_id').attr('id'),
				journal = '', // EMPTY
				abstract = '', // EMPTY
				DOI = ''; // EMPTY
			getAuthorMatrix($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract, DOI);
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
			var $data = $(data),
				ID = '', // EMPTY
				series = '', // EMPTY
				journal = ScreenScraper.getJournal($data),
				abstract = ScreenScraper.getAbstract($data),
				DOI = ScreenScraper.getDOI($data),
				modifiedTitle = ScreenScraper.getTitle($data, $evtTarget), // Title is only modified in the case of datasets & series
				year = ScreenScraper.getYear($data, $evtTarget),
				authorMatrix = getAuthorMatrix($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract, DOI);
			generateCitationAndDownload($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
		},
		error: function() {
			alert('Sorry, something went wrong.');
		}
	});
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getAuthorMatrix($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract, DOI) {
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
				generateCitationAndDownload($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ALL THINGS RELATED TO PUTTING THE CITATION TOGETHER //////////
function generateCitationAndDownload($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI) {
	var filename = CitationFile.fileName(format, modifiedTitle),
		citationbody = CitationFile.citationBody($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
	download(filename, citationbody);
}

// Downloads text file, bypasses server
function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

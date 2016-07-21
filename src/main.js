function main() {
	var $parents;
	if (Page.isGDSBrowserPage()) {
		$parents = $('.gds_panel');
	}
	else if (Page.isGSEPage()) {
		$parents = $('.pubmed_id').parent();
	}
	else if (Page.isDatasetSearchResultsPage()) {
		$parents = $('.rsltcont');
	}
	else if (Page.isPubMedAbstractPage()) {
		$parents = $('.resc.status');
	}
	else if (Page.isPubMedSearchResultsPage()) {
		$parents = $('.aux');
	}
	Interface.load($parents);
	Interface.whenClicked();
}

function addButtons($elem, iconURL, citationlabel) {
	if (Page.isGDSBrowserPage()) {
		$elem.after('<div class="citationstuff"><img alt="Citation Icon" src="'+iconURL+'" width="15" height="15"><b class="citationlabel">'+citationlabel+'</b><button class="citationbutton" id="ris">RIS (.ris)</button><button class="citationbutton" id="bib">BibTeX (.bib)</button><button class="citationbutton" id="enw">EndNote (.enw)</button></div>');			
	}
	else {
		$elem.append('<div class="citationstuff"><img alt="Citation Icon" src="'+iconURL+'" width="15" height="15"><b class="citationlabel">'+citationlabel+'</b><button class="citationbutton" id="ris">RIS (.ris)</button><button class="citationbutton" id="bib">BibTeX (.bib)</button><button class="citationbutton" id="enw">EndNote (.enw)</button></div>');			
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ALL THINGS RELATED TO GETTING INFO IN ORDER TO IMPLEMENT AJAX CALL //////////
// Gets ID number of dataset (from search results or GDS browser page)
function getID($evtTarget) {
	var ID;
	if (Page.isDatasetSearchResultsPage()) {
		ID = $evtTarget.parent().parent().find('.rprtid').eq(1).find('dd').text();
	}
	else if (Page.isGDSBrowserPage()) {
		ID = $evtTarget.parent().parent().find('.caption').find('th').text().slice(39,43);
	}
	return ID;
}

// Gets series (from search results or GSE page)
function getSeries($evtTarget) {
	var series;
	if (Page.isDatasetSearchResultsPage()) {
		series = $evtTarget.parent().parent().find('.rprtid').eq(0).find('dd').text();
	}
	else if (Page.isGSEPage()) {
		series = $evtTarget.parent().parent().parent().parent().find('tr').eq(0).find('strong').attr('id');
	}
	return series;
}

// Gets PubMedID of PubMed article (from search results or abstract page)
function getPubMedID($evtTarget) {
	var PubMedID;
	if (Page.isPubMedSearchResultsPage()) {
		PubMedID = $evtTarget.parent().parent().find('dd').text();
	}
	else if (Page.isPubMedAbstractPage()) {
		PubMedID = $evtTarget.parent().parent().parent().find('dd').eq(0).text();
	}
	return PubMedID;
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
				title = getTitle($data, $evtTarget),
				modifiedTitle = 'GDS' + ID + ': ' + title,
				year = getYear($data, $evtTarget),
				PubMedID = '', // EMPTY
				series = '', // EMPTY
				journal = '', // EMPTY
				abstract = '', // EMPTY
				DOI = '', // EMPTY
				authorMatrix = getAuthors($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract, DOI);
			generateCitationAndDownload($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
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
				title = getTitle($data, $evtTarget),
				modifiedTitle = series + ': ' + title,
				PubMedID = $data.find('.pubmed_id').attr('id'),
				year = getYear($data, $evtTarget),
				ID = '', // EMPTY
				journal = '', // EMPTY
				abstract = '', // EMPTY
				DOI = ''; // EMPTY
			getAuthors($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract, DOI);
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
				journal = getJournal($data),
				abstract = getAbstract($data),
				DOI = getDOI($data),
				modifiedTitle = getTitle($data, $evtTarget), // Title is only modified in the case of datasets & series
				year = getYear($data, $evtTarget),
				authorMatrix = getAuthors($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract, DOI);
			generateCitationAndDownload($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
		},
		error: function() {
			alert('Sorry, something went wrong.');
		}
	});
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ALL THINGS RELATED TO GETTING INFO WITHIN AJAX CALL //////////
function getTitle($data, $evtTarget) {
	var title;
	if ((Type.isDataSet($evtTarget)) || (Page.isGDSBrowserPage())) {
		title = $data.find('tbody').eq(1).find('tr').eq(1).find('td').eq(0).text();
	}
	else if ((Type.isSeries($evtTarget)) || (Page.isGSEPage())) {
		title = $data.find('tr').eq(19).find('td').eq(1).text();
	}
	else if (Page.isPubMed()) {
		title = $data.find('.rprt.abstract').find('h1').text();
		title = title.slice(0,title.length-1); // Get rid of extra space at end of string
	}
	return title;
}

function getAuthors($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract, DOI) {
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
				generateCitationAndDownload($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
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

function getYear($data, $evtTarget) {
	var year;
	if ((Type.isDataSet($evtTarget)) || (Page.isGDSBrowserPage())) {
		year = $data.find('tbody').eq(1).find('tr').eq(7).find('td').eq(1).text().slice(0,4);
	}
	else if ((Type.isSeries($evtTarget)) || (Page.isGSEPage())) {
		year = $data.find('tr').eq(18).find('td').eq(1).text().slice(18,22);
	}
	else if (Page.isPubMed()) {
		var periodIndex = $data.find('.cit').text().indexOf('.');
		year = $data.find('.cit').text().slice(periodIndex+2,periodIndex+6);
	}
	return year;
}

// Gets abbreviated journal title of PubMed article
function getJournal($data) {
	var periodIndex = $data.find('.cit').text().indexOf('.');
	var journal = $data.find('.cit').text().slice(0,periodIndex);
	return journal;
}

// Gets abstract of PubMed article
function getAbstract($data) {
	var abstract = $data.find('abstracttext').text();
	return abstract;
}

// Gets abstract of PubMed article
function getDOI($data) {
	var DOI = $data.find('.rprtid').eq(0).find('dd').eq(1).text();
	return DOI;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ALL THINGS RELATED TO PUTTING THE CITATION TOGETHER //////////
// Desired citation format of dataset
function getCitationFormat($evtTarget) {
	var format = $evtTarget.attr('id');
	return format;
}

function generateCitationAndDownload($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract, DOI) {
	var filename = generateFileName(format, modifiedTitle),
		citationbody = generateCitationBody($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
	download(filename, citationbody);
}

function generateFileName(format, modifiedTitle) {
	var filename;
	if (format == 'ris')
		filename = modifiedTitle + '.ris';
	else if (format == 'bib')
		filename = modifiedTitle + '.bib';
	else if (format == 'enw')
		filename = modifiedTitle + '.enw';
	return filename;
}

function generateCitationBody($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI) {
	var citationbody;
	if (format == 'ris') {
		citationbody = Citation.makeRIScitation($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
	}
	else if (format == 'bib') {
		citationbody = Citation.makeBibTeXcitation($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
	}
	else if (format == 'enw') {
		citationbody = Citation.makeEndNotecitation($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
	}
	return citationbody;
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
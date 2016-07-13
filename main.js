function main() {
	if (isDatasetSearchResultsPage()) {
		var $parents = $('.links.nohighlight');
	}
	else if (isGDSBrowserPage()) {
		var $parents = $('.gds_panel');
	}
	else if (isGSEPage()) {
		var $parents = $('.pubmed_id').parent();
	}
	else if (isPubMedSearchResultsPage()) {
		var $parents = $('.rprtid');
	}
	else if (isPubMedAbstractPage()) {
		var $parents = $('.rprtid').eq(1);
	}
	loadInterface($parents);
}

function loadInterface($parents) {
	$parents.each(function(i, elem) {
		var $elem = $(elem);
		if ((isDataSet($elem)) || (isGDSBrowserPage())) {
			$elem.append('<p></p>');
			$elem.append('<b>Cite Dataset </b>');
		}
		else if ((isSeries($elem)) || (isGSEPage())) {
			$elem.append('<p></p>');
			$elem.append('<b>Cite Series </b>');
		}
		else if (isPubMed()) {
			$elem.append('<p></p>');
			$elem.append('<b>PubMed Citation </b>');	
		}
		addButtons($elem);
	});
	$('.citationbutton').click(function(evt) {
		evt.preventDefault();
		var $evtTarget = $(evt.target);
		var format = getCitationFormat($evtTarget);
		if ((isDataSet($evtTarget)) || (isGDSBrowserPage()) || (isSeries($evtTarget)) || (isGSEPage())) {
			// If is related to citation for datasets or series
			if ((isDataSet($evtTarget)) || (isGDSBrowserPage())) {
				var ID = getID($evtTarget);
				getIntoGDSBrowserPage(format, ID, $evtTarget);
			}
			else if ((isSeries($evtTarget)) || (isGSEPage())) {
				var series = getSeries($evtTarget);
				getIntoGSEPage(format, series, $evtTarget);
			}
		}
		else if (isPubMed()) {
			// Else if is related to citation for PubMed articles
			var PubMedID = getPubMedID($evtTarget);
			getIntoAbstractPage(format, PubMedID, $evtTarget);
		}
	});
}

function addButtons($elem) {
	$elem.append('<button class="citationbutton" id="ris">RIS (.ris)</button>');
	$elem.append('<button class="citationbutton" id="bib">BibTeX (.bib)</button>');
	$elem.append('<button class="citationbutton" id="enw">EndNote (.enw)</button>');
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ALL THINGS RELATED TO CHECKING TYPE OF PAGE//////////
// Return true if user is on datasets search results page, false otherwise.
function isDatasetSearchResultsPage() {
	if (Boolean(window.location.pathname.match(/\/gds\//) && window.location.search.match(/\?term=/))) {
		// If is on search results page
		return true;
	}
	else if (Boolean(window.location.pathname.match(/\/gds\//) && document.getElementById('database')[0].textContent.match('GEO DataSets'))) {
		// Else if is on subsequent page of search results page
		return true;
	}
}

// Return true if result on search results page is a dataset, false otherwise.
function isDataSet($object) { // $object is either $evtTarget or $elem
	if (isDatasetSearchResultsPage()) {
		if (Boolean($object.attr('class').match('citationbutton'))) { // $object is $evtTarget
			return Boolean($object.parent().parent().find('.src').text().match('DataSet'));
		}
		else { // $object is $elem
			return Boolean($object.parent().find('.src').text().match('DataSet'));
		}
	}
}

// Return true if result on search results page is a series, false otherwise.
function isSeries($object) { // $object is either $evtTarget or $elem
	if (isDatasetSearchResultsPage()) {
		if (Boolean($object.attr('class').match('citationbutton'))) { // $object is $evtTarget
			return Boolean($object.parent().parent().find('.src').text().match('Series'));
		}
		else { // $object is $elem
			return Boolean($object.parent().find('.src').text().match('Series'));
		}
	}
}

// Return true if user is on GDS browser page, false otherwise.
function isGDSBrowserPage() {
	return Boolean(window.location.pathname.match(/\/sites\/GDSbrowser/) && window.location.search.match(/\?acc=GDS/));
}

// Return true if user is on GSE page, false otherwise.
function isGSEPage() {
	return Boolean(window.location.pathname.match(/\/geo\/query\/acc.cgi/) && window.location.search.match(/\?acc=GSE/));
}

// Return true if user is on PubMed search results page or article abstract page, false otherwise.
function isPubMed() {
	return Boolean(document.getElementById('database')[0].textContent.match('PubMed'));
}

function isPubMedSearchResultsPage () {
	return Boolean(window.location.pathname.match(/\/pubmed\//) && window.location.search.match(/\?term=/));
}

function isPubMedAbstractPage() {
	return Boolean(document.getElementsByClassName('value')[0].textContent.match('Abstract'));
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ALL THINGS RELATED TO GETTING INFO IN ORDER TO IMPLEMENT AJAX CALL//////////
// Gets ID number of dataset (from search results or GDS browser page)
function getID($evtTarget) {
	if (isDatasetSearchResultsPage()) {
		var ID = $evtTarget.parent().parent().find('.rprtid').eq(1).find('dd').text();
	}
	else if (isGDSBrowserPage()) {
		var ID = $evtTarget.parent().find('.caption').find('th').text().slice(39,43);
	}
	return ID;
}

// Gets series (from search results or GSE page)
function getSeries($evtTarget) {
	if (isDatasetSearchResultsPage()) {
		var series = $evtTarget.parent().parent().find('.rprtid').eq(0).find('dd').text();
	}
	else if (isGSEPage()) {
		var series = $evtTarget.parent().parent().parent().find('tr').eq(0).find('strong').attr('id');
	}
	return series;
}

// Gets PubMedID of PubMed article (from search results or abstract page)
function getPubMedID($evtTarget) {
	if (isPubMedSearchResultsPage()) {
		var PubMedID = $evtTarget.parent().find('dd').text();
	}
	else if (isPubMedAbstractPage()) {
		var PubMedID = $evtTarget.parent().parent().parent().find('.resc').eq(0).find('dd').eq(0).text();
	}
	return PubMedID;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ALL THINGS RELATED TO AJAX CALLS//////////
// Gets citation info from GDS browser page
function getIntoGDSBrowserPage(format, ID, $evtTarget) {
	var baseURL = 'http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=GDS';
	var searchURL = baseURL + ID;
	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: '',
		success: function(data) {
			var $data = $(data);
			var title = getTitle($data, $evtTarget);
			var modifiedTitle = 'GDS' + ID + ': ' + title;
			var year = getYear($data, $evtTarget);
			var PubMedID = ''; // EMPTY
			var series = ''; // EMPTY
			var journal = ''; // EMPTY
			var abstract = ''; // EMPTY
			var authorMatrix = getAuthors($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract);
			generateCitationAndDownload($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract);
		},
		error: function() {
			alert('Sorry, something went wrong.');
		}
	});
}

function getIntoGSEPage(format, series, $evtTarget) {
	var baseURL = 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=';
	var searchURL = baseURL + series;
	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: '',
		success: function(data) {
			var $data = $(data);
			var title = getTitle($data, $evtTarget);
			var modifiedTitle = 'GSE' + series + ': ' + title;
			var PubMedID = $data.find('.pubmed_id').attr('id');
			var year = getYear($data, $evtTarget);
			var ID = ''; // EMPTY
			var journal = ''; // EMPTY
			var abstract = ''; // EMPTY
			getAuthors($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract);
		},
		error: function() {
			alert('Sorry, something went wrong.');
		}
	});
}

function getIntoAbstractPage(format, PubMedID, $evtTarget) {
	var baseURL = 'http://www.ncbi.nlm.nih.gov/pubmed/';
	var searchURL = baseURL + PubMedID;
	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: '',
		success: function(data) {
			var $data = $(data);
			var ID = ''; // EMPTY
			var series = ''; // EMPTY
			var journal = getJournal($data);
			var abstract = getAbstract($data);
			var modifiedTitle = getTitle($data, $evtTarget); // Title is only modified in the case of datasets & series
			var year = getYear($data, $evtTarget);
			var authorMatrix = getAuthors($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract);
			debugger;
		},
		error: function() {
			alert('Sorry, something went wrong.');
		}
	});
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ALL THINGS RELATED TO GETTING INFO WITHIN AJAX CALL//////////
// Gets title of publication (from GDS browser or GSE page)
function getTitle($data, $evtTarget) {
	if ((isDataSet($evtTarget)) || (isGDSBrowserPage())) {
		var title = $data.find('tbody').eq(1).find('tr').eq(1).find('td').eq(0).text();
	}
	else if ((isSeries($evtTarget)) || (isGSEPage())) {
		var title = $data.find('tr').eq(19).find('td').eq(1).text();
	}
	else if (isPubMed()) {
		var title = $data.find('.rprt.abstract').find('h1').text();
	}
	return title;
}

// Gets authors of publication (from GDS browser or GSE page)
function getAuthors($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year, journal, abstract) {
	if ((isDataSet($evtTarget)) || (isGDSBrowserPage())) {
		var authors = $data.find('.authors').text();
		authors = authors.slice(0,authors.length-2); // Get rid of extra space and punctuation at end of string
		authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
		var authorMatrix = authors.split(","); // Divides string of authors into vector of authors
		for (i=0;i<authorMatrix.length;i++) { // Insert comma between last & first name
			authorMatrix[i] = authorMatrix[i].replace(' ',', ');
		}
		return authorMatrix;
	}
	else if ((isSeries($evtTarget)) || (isGSEPage())) {
		var pubmedBaseURL = 'http://www.ncbi.nlm.nih.gov/sites/PubmedCitation?id=';
		var pubmedSearchURL = pubmedBaseURL + PubMedID;
		$.ajax({
			url: pubmedSearchURL,
			type: 'GET',
			dataType: '',
			success: function(pubmedCitation) {
				var $pubmedCitation = $(pubmedCitation);
				var authors = $pubmedCitation.find('.authors').text();
				authors = authors.slice(0,authors.length-1); // Get rid of extra space at end of string
				authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
				var authorMatrix = authors.split(","); // Divides string of authors into vector of authors
				for (i=0;i<authorMatrix.length;i++) { // Insert comma between last & first name
					authorMatrix[i] = authorMatrix[i].replace(' ',', ');
				}
				generateCitationAndDownload($evtTarget, searchURL, format, ID, series, modifiedTitle, authors, authorMatrix, year, journal, abstract);
			},
			error: function () {
				alert('Sorry, no citation available.')
			}
		});
	}
	else if (isPubMed()) {
		var authors = $data.find('.auths').text();
		authors = authors.slice(0,authors.length-1); // Get rid of punctuation at end of string
		authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
		var authorMatrix = authors.split(","); // Divides string of authors into vector of authors
		for (i=0;i<authorMatrix.length;i++) {
			authorMatrix[i] = authorMatrix[i].replace(' ',', '); // Insert comma between last & first name
			authorMatrix[i] = authorMatrix[i].slice(0,authorMatrix[i].length-1); // Get rid of number after name
		}
		return authorMatrix;
	}
}

// Gets year of publication (from GDS browser or GSE page)
function getYear($data, $evtTarget) {
	if ((isDataSet($evtTarget)) || (isGDSBrowserPage())) {
		var year = $data.find('tbody').eq(1).find('tr').eq(7).find('td').eq(1).text().slice(0,4);
	}
	else if ((isSeries($evtTarget)) || (isGSEPage())) {
		var year = $data.find('tr').eq(18).find('td').eq(1).text().slice(18,22);
	}
	else if (isPubMed()) {
		var periodIndex = $data.find('.cit').text().indexOf('.');
		var year = $data.find('.cit').text().slice(periodIndex+2,periodIndex+6);
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ALL THINGS RELATED TO PUTTING THE CITATION TOGETHER//////////
// Desired citation format of dataset
function getCitationFormat($evtTarget) {
	var format = $evtTarget.attr('id');
	return format;
}

function generateCitationAndDownload($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract) {
	var filename = generateFileName(format, modifiedTitle);
	var citationbody = generateCitationBody($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract);
	download(filename, citationbody);
}

function generateFileName(format, modifiedTitle) {
	if (format == 'ris')
		var filename = modifiedTitle + '.ris';
	else if (format == 'bib')
		var filename = modifiedTitle + '.bib';
	else if (format == 'enw')
		var ilename = modifiedTitle + '.enw';
	return filename;
}

function generateCitationBody($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract) {
	if (format == 'ris') {
		var citationbody = makeRIScitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract);
	}
	else if (format == 'bib') {
		var citationbody = makeBibTeXcitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract);
	}
	else if (format == 'enw') {
		var citationbody = makeEndNotecitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract);
	}
	return citationbody;
}

function makeRIScitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract) {
	var citationbody = 'TY  - DATA\n';
	citationbody = citationbody + 'TI  - ' + modifiedTitle + '\n';
	citationbody = citationbody + 'PY  - ' + year + '\n';
	for (i=0; i<authorMatrix.length; i++) {
		// authorMatrix[i] = authorMatrix[i].replace(' ',', '); // Insert comma between last & first name
		// var commaIndex = authorMatrix[i].indexOf(',');
		// var spaceIndex = authorMatrix[i].slice(commaIndex+2).indexOf(' ');
		// if (spaceIndex == -1) { // No spaces after initials
		// 	spaceIndex = 0;
		// 	var amtInitials = (authorMatrix[i].slice(commaIndex+2,authorMatrix[i].length)).length;
		// }
		// else {
		// 	var amtInitials = (authorMatrix[i].slice(commaIndex+2,authorMatrix[i].length)).slice(0,spaceIndex).length;
		// }
		// for (j=3; j<=amtInitials*2+1; j+=2) {
		// 	// if (spaceIndex == 0) {
				
		// 	// 	debugger;
		// 	// }
		// 	authorMatrix[i] = authorMatrix[i].slice(0,commaIndex+j) + '.' + authorMatrix[i].slice(commaIndex+j,authorMatrix[i].length);
		// }
		// authorMatrix[i] = authorMatrix[i].replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
		citationbody = citationbody + 'AU  - ' + authorMatrix[i] + '\n';
	}
	if ((isDataSet($evtTarget)) || (isGDSBrowserPage())) {
		citationbody = citationbody + 'UR  - ' + searchURL + '\n';
	}
	else if ((isSeries($evtTarget)) || (isGSEPage())) {
		citationbody = citationbody + 'UR  - ' + searchURL + '\n';
	}
	citationbody = citationbody + 'DP  - National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO) Datasets\n';
	citationbody = citationbody + 'ER  - ';
	return citationbody;
}

function makeBibTeXcitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract) {
	var citationbody = '@techreport{GDS' + ID + '_' + year + ',\n'; // What kind of "entry" type?
	citationbody = citationbody + 'title = {' + modifiedTitle + '},\n';
	citationbody = citationbody + 'year = {' + year + '},\n';
	citationbody = citationbody + 'author = {';
	for (i=0; i<authorMatrix.length; i++) {
		var last_first = authorMatrix[i].split(' ');
		if (i == authorMatrix.length-1) {
			citationbody = citationbody + last_first[0] + ' ' + last_first[1] + '},\n';
		}
		else {
			citationbody = citationbody + last_first[0] + ' ' + last_first[1] + ' and ';
		}
	}
	if ((isDataSet($evtTarget)) || (isGDSBrowserPage())) {
		citationbody = citationbody + 'url = {' + searchURL +'},\n';
	}
	else if ((isSeries($evtTarget)) || (isGSEPage())) {
		citationbody = citationbody + 'url = {' + searchURL +'},\n';
	}
	citationbody = citationbody + 'note = {National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO) Datasets}\n';
	citationbody = citationbody + '}';
	return citationbody;
}

function makeEndNotecitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year, journal, abstract) {
	var citationbody = '%0 Dataset\n';
	citationbody = citationbody + '%T ' + modifiedTitle + '\n';
	citationbody = citationbody + '%D ' + year + '\n';
	for (i=0; i<authorMatrix.length; i++) {
		citationbody = citationbody + '%A ' + authorMatrix[i] + '\n';
	}
	if ((isDataSet($evtTarget)) || (isGDSBrowserPage())) {
		citationbody = citationbody + '%U ' + searchURL + '\n';
	}
	else if ((isSeries($evtTarget)) || (isGSEPage())) {
		citationbody = citationbody + '%U ' + searchURL + '\n';
	}
	citationbody = citationbody + '%W ' + 'National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO) Datasets\n';
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
main();
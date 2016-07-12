function main() {
	var $parents;
	if (isSearchResultsPage()) {
		$parents = $('.links.nohighlight');
	}
	else if (isGDSBrowserPage()) {
		$parents = $('.gds_panel');
	}
	else if (isGSEPage()) {
		$parents = $('.pubmed_id').parent();
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
		addButtons($elem);
	});
	$('.citationbutton').click(function(evt) {
		evt.preventDefault();
		var $evtTarget = $(evt.target);
		var format = getCitationFormat($evtTarget);

		if ((isDataSet($evtTarget)) || (isGDSBrowserPage())) {
			var ID = getID($evtTarget);
			getIntoGDSBrowserPage(format, ID, $evtTarget);
		}
		else if ((isSeries($evtTarget)) || (isGSEPage())) {
			var series = getSeries($evtTarget);
			getIntoGSEPage(format, series, $evtTarget);
		}
	});
}

function addButtons($elem) {
	$elem.append('<button class="citationbutton" id="ris">RIS (.ris)</button>');
	$elem.append('<button class="citationbutton" id="bib">BibTeX (.bib)</button>');
	$elem.append('<button class="citationbutton" id="enw">EndNote (.enw)</button>');
}

// Return true if result on search results page is a dataset, false otherwise.
function isDataSet($object) {
	if (isSearchResultsPage()) {
		if (Boolean($object.attr('class').match('citationbutton'))) { // $object is $evtTarget
			return Boolean($object.parent().parent().find('.src').text().match('DataSet'));
		}
		else { // $object is $elem
			return Boolean($object.parent().find('.src').text().match('DataSet'));
		}
	}
}

// Return true if result on search results page is a series, false otherwise.
function isSeries($object) {
	if (isSearchResultsPage()) {
		if (Boolean($object.attr('class').match('citationbutton'))) { // $object is $evtTarget
			return Boolean($object.parent().parent().find('.src').text().match('Series'));
		}
		else { // $object is $elem
			return Boolean($object.parent().find('.src').text().match('Series'));
		}
	}
}

// Return true if user is on search results page, false otherwise.
function isSearchResultsPage() {
	if (Boolean(window.location.pathname.match(/\/gds\//) && window.location.search.match(/\?term=/))) {
		return true;
	}
	else if (document.getElementsByClassName('res_name').length) {
		return true;
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
			var PubMedID = '';
			var series = '';
			var authors = getAuthors($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year);
			var authorMatrix = authors.split(","); // Divides string of authors into vector of authors
			for (i=0;i<authorMatrix.length;i++) { // Insert comma between last & first name
				authorMatrix[i] = authorMatrix[i].replace(' ',', ');
			}
			generateCitationAndDownload($evtTarget, searchURL, format, ID, series, modifiedTitle, authors, authorMatrix, year);
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
			var ID = '';
			getAuthors($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year);
			},
		error: function() {
			alert('Sorry, something went wrong.');
		}
	});
}

function generateCitationAndDownload($evtTarget, searchURL, format, ID, series, modifiedTitle, authors, authorMatrix, year) {
	var filename = generateFileName(format, modifiedTitle);
	var citationbody = generateCitationBody($evtTarget, searchURL, format, ID, series, modifiedTitle, authors, authorMatrix, year);
	download(filename, citationbody);
}

function generateFileName(format, modifiedTitle) {
	if (format == 'ris')
		filename = modifiedTitle + '.ris';
	else if (format == 'bib')
		filename = modifiedTitle + '.bib';
	else if (format == 'enw')
		filename = modifiedTitle + '.enw';
	return filename;
}

function generateCitationBody($evtTarget, searchURL, format, ID, series, modifiedTitle, authors, authorMatrix, year) {
	if (format == 'ris') {
		citationbody = makeRIScitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year);
	}
	else if (format == 'bib') {
		citationbody = makeBibTeXcitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year);
	}
	else if (format == 'enw') {
		citationbody = makeEndNotecitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year);
	}
	return citationbody;
}

function makeRIScitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year) {
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

function makeBibTeXcitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year) {
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

function makeEndNotecitation($evtTarget, searchURL, format, ID, series, modifiedTitle, authorMatrix, year) {
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Desired citation format of dataset
function getCitationFormat($evtTarget) {
	var format = $evtTarget.attr('id');
	return format;
}

// Gets ID number of dataset (from search results or GDS browser page)
function getID($evtTarget) {
	if (isSearchResultsPage()) {
		var ID = $evtTarget.parent().parent().find('.rprtid').eq(1).find('dd').text();
	}
	else if (isGDSBrowserPage()) {
		var ID = $evtTarget.parent().find('.caption').find('th').text().slice(39,43);
	}
	return ID;
}

// Gets series (from search results or GSE page)
function getSeries($evtTarget) {
	if (isSearchResultsPage()) {
		var series = $evtTarget.parent().parent().find('.rprtid').eq(0).find('dd').text();
	}
	else if (isGSEPage()) {
		var series = $evtTarget.parent().parent().parent().find('tr').eq(0).find('strong').attr('id');
	}
	return series;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Gets title of publication (from GDS browser or GSE page)
function getTitle($data, $evtTarget) {
	if ((isDataSet($evtTarget)) || (isGDSBrowserPage())) {
		var title = $data.find('tbody').eq(1).find('tr').eq(1).find('td').eq(0).text();
	}
	else if ((isSeries($evtTarget)) || (isGSEPage())) {
		var title = $data.find('tr').eq(19).find('td').eq(1).text();
	}
	return title;
}

// Gets authors of publication (from GDS browser or GSE page)
function getAuthors($data, $evtTarget, PubMedID, searchURL, format, ID, series, modifiedTitle, year) {
	if ((isDataSet($evtTarget)) || (isGDSBrowserPage())) {
		var authors = $data.find('.authors').text();
		authors = authors.slice(0,authors.length-1); // Get rid of extra space at end of string
		authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
		return authors;
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
				generateCitationAndDownload($evtTarget, searchURL, format, ID, series, modifiedTitle, authors, authorMatrix, year);
			},
			error: function () {
				alert('Sorry, no citation available.')
			}
		});
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
	return year;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

main();
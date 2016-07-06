function main() {
	var $parents;
	if (isSearchResultsPage()) {
		$parents = $('.links.nohighlight');
	}
	loadInterface($parents);
}

function loadInterface($parents) {
	$parents.each(function(i, elem) {
		// Add buttons
		var $elem = $(elem);
		$elem.append('<p></p>')
		$elem.append('<span>Cite Dataset</span>')
		$elem.append('<button class="citationbutton" id="ris">RIS Format (.ris)</button>');
		$elem.append('<button class="citationbutton" id="bib">BibTeX Format (.bib)</button>');
		$elem.append('<button class="citationbutton" id="enw">EndNote Format (.enw)</button>');
	});
	$('.citationbutton').click(function(evt) {
		evt.preventDefault();
		var evtTarget = evt.target;
		var format = getCitationFormat(evtTarget);
		var ID = getID(evtTarget);
		var series = getSeries(evtTarget);
		// var title = getTitle(evtTarget); (COMMENTED OUT)
		getIntoGDSBrowserPage(format, ID, series);
	});
}

// Return true if user is on search results page, false otherwise.
function isSearchResultsPage() {
	return Boolean(window.location.search.match(/term=/));
}

// Gets into GDS browser page
function getIntoGDSBrowserPage(format, ID, series) {
	var baseURL = 'http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=GDS';
	var searchURL = baseURL + ID;
	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: '',
		success: function(data) {
			var $data = $(data);
			var title = getTitle($data);
			var authors = getAuthors($data);
			authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
			var authorMatrix = authors.split(","); // Divides string of authors into vector of authors
			var year = getYear($data);
			generateCitationAndDownload(format, ID, series, title, authors, authorMatrix, year);
		},
		error: function() {
			alert('Sorry, something went wrong.');
		}
	});
}

function generateCitationAndDownload(format, ID, series, title, authors, authorMatrix, year) {
	var filename = generateFileName(format, ID, series, title);
	var citationbody = generateCitationBody(format, ID, series, title, authors, authorMatrix, year);
	download(filename, citationbody);
}

function generateFileName(format, ID, series, title) {
	var filename = series + ':' + title;
	if (format == 'ris')
		filename = filename + '.ris';
	else if (format == 'bib')
		filename = filename + '.bib';
	else if (format == 'enw')
		filename = filename + '.enw';
	else
		filename = filename + '.txt';
	return filename;
}

function generateCitationBody(format, ID, series, title, authors, authorMatrix, year) {
	if (format == 'ris') {
		citationbody = makeRIScitation(format, ID, series, title, authorMatrix, year);
	}
	else if (format == 'bib') {
		citationbody = makeBibTeXcitation(format, ID, series, title, authorMatrix, year);
	}
	else if (format == 'enw') {
		citationbody = makeEndNotecitation(format, ID, series, title, authorMatrix, year);
	}
	else {
		citationbody = series + ': ' + title + '. (' + year + '). ' + authors;
	}
	return citationbody;
}

function makeRIScitation(format, ID, series, title, authorMatrix, year) {
	var citationbody = 'TY  - DATA\n';
	citationbody = citationbody + 'TI  - ' + series + ': ' + title + '\n';
	citationbody = citationbody + 'PY  - ' + year + '\n';
	for (i=0; i<authorMatrix.length; i++) {
		citationbody = citationbody + 'AU  - ' + authorMatrix[i] + '\n';
	}
	citationbody = citationbody + 'UR  - ' + 'http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=GDS' + ID + '\n';
	citationbody = citationbody + 'DP  - National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO) Datasets\n';
	return citationbody;
}

function makeBibTeXcitation(format, ID, series, title, authorMatrix, year) {
	var citationbody = '@techreport{' + series + '_' + year + ',\n'; // what kind of "entry" type?
	citationbody = citationbody + 'title = {' + series + ': ' + title + '},\n';
	citationbody = citationbody + 'year = {' + year + '},\n';
	citationbody = citationbody + 'author = {';
	for (i=0; i<authorMatrix.length; i++) {
		var last_first = authorMatrix[i].split(' ');
		if (i == authorMatrix.length-1) {
			citationbody = citationbody + last_first[0] + ', ' + last_first[1] + '},\n';
		}
		else {
			citationbody = citationbody + last_first[0] + ', ' + last_first[1] + ' and ';
		}
	}
	citationbody = citationbody + 'url = {http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=GDS' + ID +'},\n';
	citationbody = citationbody + 'note = {National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO) Datasets}\n';
	citationbody = citationbody + '}'
	return citationbody;
}

function makeEndNotecitation(format, ID, series, title, authorMatrix, year) {
	var citationbody = '%0 Dataset\n';
	citationbody = citationbody + '%T ' + title + '\n';
	citationbody = citationbody + '%D ' + year + '\n';
	for (i=0; i<authorMatrix.length; i++) {
		citationbody = citationbody + '%A ' + authorMatrix[i] + '\n';
	}
	citationbody = citationbody + '%U ' + 'http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=GDS' + ID + '\n';
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
// Desired citation format of dataset from HTML of search results page
function getCitationFormat(evtTarget) {
	var format = $(evtTarget)[0].id;
	return format;
}

// Gets ID number of dataset from HTML of search results page
function getID(evtTarget) {
	var ID = $(evtTarget).parent().parent().find('.rprtid').eq(1).find('dd').text();
	return ID;
}

// Gets series code of dataset from HTML of search results page
function getSeries(evtTarget) {
	var series = $(evtTarget).parent().parent().parent().find('.details').eq(2).find('.lng_ln').eq(1).text();
	return series;
}

// Gets title of dataset from HTML of search results page (COMMENTED OUT)
// function getTitle(evtTarget) {
// 	var title = $(evtTarget).parent().parent().parent().find('.title').text();
// 	return title;
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Gets title of publication from HTML of GDS browser page
function getTitle($data) {
	var title = $data.find('tbody').eq(1).find('tr').eq(1).find('td').eq(0).text();
	return title;
}

// Gets authors of publication from HTML of GDS browser page
function getAuthors($data) {
	var authors = $data.find('.authors').text();
	var length = $data.find('.authors').text().length;
	authors = authors.slice(0,length-1);
	return authors;
}

// Gets year of publication from HTML of GDS browser page
function getYear($data) {
	var year = $data.find('tbody').eq(1).find('tr').eq(7).find('td').eq(1).text().slice(0,4);
	return year;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

main();
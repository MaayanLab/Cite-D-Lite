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
	loadInterface($parents);
}

function loadInterface($parents) {
	$parents.each(function(i, elem) {
		var $elem = $(elem),
			iconURL = chrome.extension.getURL("icon_128.png"),
			citationlabel;
		if (Page.isDataSet($elem)) {
			citationlabel = 'Cite Dataset';
			addButtons($elem, iconURL, citationlabel);
		}
		else if (Page.isGDSBrowserPage()) {
			citationlabel = 'Cite Dataset';
			addButtons($elem, iconURL, citationlabel);
		}
		else if ((Page.isSeries($elem)) || (Page.isGSEPage())) {
			citationlabel = 'Cite Series';
			addButtons($elem, iconURL, citationlabel);
		}
		else if (Page.isPubMed()) {
			citationlabel = 'PubMed Citation';
			addButtons($elem, iconURL, citationlabel);
		}
	});
	whenClicked();
}

function addButtons($elem, iconURL, citationlabel) {
	if (Page.isGDSBrowserPage()) {
		$elem.after('<div class="citationstuff"><img alt="Citation Icon" src="'+iconURL+'" width="15" height="15"><b class="citationlabel">'+citationlabel+'</b><button class="citationbutton" id="ris">RIS (.ris)</button><button class="citationbutton" id="bib">BibTeX (.bib)</button><button class="citationbutton" id="enw">EndNote (.enw)</button></div>');			
	}
	else {
		$elem.append('<div class="citationstuff"><img alt="Citation Icon" src="'+iconURL+'" width="15" height="15"><b class="citationlabel">'+citationlabel+'</b><button class="citationbutton" id="ris">RIS (.ris)</button><button class="citationbutton" id="bib">BibTeX (.bib)</button><button class="citationbutton" id="enw">EndNote (.enw)</button></div>');			
	}
}

function whenClicked() {
	$('.citationbutton').click(function(evt) {
		evt.preventDefault();
		var $evtTarget = $(evt.target),
			format = getCitationFormat($evtTarget);
		if ((Page.isDataSet($evtTarget)) || (Page.isGDSBrowserPage()) || (Page.isSeries($evtTarget)) || (Page.isGSEPage())) {
			// If is related to citation for datasets or series
			if ((Page.isDataSet($evtTarget)) || (Page.isGDSBrowserPage())) {
				var ID = getID($evtTarget);
				getIntoGDSBrowserPage(format, ID, $evtTarget);
			}
			else if ((Page.isSeries($evtTarget)) || (Page.isGSEPage())) {
				var series = getSeries($evtTarget);
				getIntoGSEPage(format, series, $evtTarget);
			}
		}
		else if (Page.isPubMed()) {
			// Else if is related to citation for PubMed articles
			var PubMedID = getPubMedID($evtTarget);
			getIntoAbstractPage(format, PubMedID, $evtTarget);
		}
	});
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
	if ((Page.isDataSet($evtTarget)) || (Page.isGDSBrowserPage())) {
		title = $data.find('tbody').eq(1).find('tr').eq(1).find('td').eq(0).text();
	}
	else if ((Page.isSeries($evtTarget)) || (Page.isGSEPage())) {
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
	if ((Page.isDataSet($evtTarget)) || (Page.isGDSBrowserPage())) {
		authors = $data.find('.authors').text();
		authors = authors.slice(0,authors.length-2); // Get rid of extra space and punctuation at end of string
		authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
		authorMatrix = authors.split(","); // Divides string of authors into vector of authors
		for (i=0;i<authorMatrix.length;i++) { // Insert comma between last & first name
			authorMatrix[i] = authorMatrix[i].replace(' ',', ');
		}
		return authorMatrix;
	}
	else if ((Page.isSeries($evtTarget)) || (Page.isGSEPage())) {
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
	if ((Page.isDataSet($evtTarget)) || (Page.isGDSBrowserPage())) {
		year = $data.find('tbody').eq(1).find('tr').eq(7).find('td').eq(1).text().slice(0,4);
	}
	else if ((Page.isSeries($evtTarget)) || (Page.isGSEPage())) {
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
main();

////////// ALL THINGS RELATED TO CHECKING TYPE OF PAGE //////////
// Return true if user is on datasets search results page, false otherwise.
var Page = {
	isDatasetSearchResultsPage: function() {
		if (Boolean(window.location.pathname.match(/\/gds/) && window.location.search.match(/\?term=/))) {
			// If is on search results page
			return true;
		}
		else if (Boolean(window.location.pathname.match(/\/gds/) && document.getElementById('database')[0].textContent.match('GEO DataSets'))) {
			// Else if is on subsequent page of search results page
			return true;
		}
	},

	// Return true if result on search results page is a dataset, false otherwise.
	isDataSet: function($object) { // $object is either $evtTarget or $elem
		if (this.isDatasetSearchResultsPage()) {
			if (Boolean($object.attr('class').match('citationbutton'))) { // $object is $evtTarget
				return Boolean($object.parent().parent().find('.src').text().match('DataSet'));
			}
			else { // $object is $elem
				return Boolean($object.parent().find('.src').text().match('DataSet'));
			}
		}
	},

	// Return true if result on search results page is a series, false otherwise.
	isSeries: function($object) { // $object is either $evtTarget or $elem
		if (this.isDatasetSearchResultsPage()) {
			if (Boolean($object.attr('class').match('citationbutton'))) { // $object is $evtTarget
				return Boolean($object.parent().parent().find('.src').text().match('Series'));
			}
			else { // $object is $elem
				return Boolean($object.parent().find('.src').text().match('Series'));
			}
		}
	},

	// Return true if user is on GDS browser page, false otherwise.
	isGDSBrowserPage: function() {
		return Boolean(window.location.pathname.match(/\/sites\/GDSbrowser/) && window.location.search.match(/\?acc=GDS/));
	},

	// Return true if user is on GSE page, false otherwise.
	isGSEPage: function() {
		return Boolean(window.location.pathname.match(/\/geo\/query\/acc.cgi/) && window.location.search.match(/\?acc=GSE/));
	},

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

	isPubMedAbstractPage: function() {
		return Boolean(window.location.pathname.match(/\/pubmed/) && document.getElementsByClassName('value')[0].textContent.match('Abstract'));
	}
};

var Citation = {
	makeRIScitation: function($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI) {
		var citationbody;
		if ((Page.isDataSet($evtTarget)) || (Page.isGDSBrowserPage()) || (Page.isSeries($evtTarget)) || (Page.isGSEPage())) {
		// If is related to citation for datasets or series
			citationbody = 'TY  - DATA\n';
			citationbody = citationbody + 'DP  - National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO) Datasets\n';
		}
		else if (Page.isPubMed()) {
		// Else if is related to citation for PubMed articles
			citationbody = 'TY  - JOUR\n';
			citationbody = citationbody + 'JO  - ' + journal + '\n';
			citationbody = citationbody + 'AB  - ' + abstract +'\n';
			citationbody = citationbody + 'DO  - ' + DOI +'\n';
			citationbody = citationbody + 'UR  - http://dx.doi.org/' + DOI + '},\n';
		}
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
		citationbody = citationbody + 'UR  - ' + searchURL + '\n';
		citationbody = citationbody + 'ER  - ';
		return citationbody;
	},

	makeBibTeXcitation: function($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI) {
		var citationbody;
		if ((Page.isDataSet($evtTarget)) || (Page.isGDSBrowserPage()) || (Page.isSeries($evtTarget)) || (Page.isGSEPage())) {
		// If is related to citation for datasets or series
			citationbody = '@techreport{' + authorMatrix[0].split(', ')[0] + '_' + year + ',\n'; // What kind of "entry" type?
			citationbody = citationbody + 'note = {National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO) Datasets},\n';
		}
		else if (Page.isPubMed()) {
		// Else if is related to citation for PubMed articles
			citationbody = '@article{' + modifiedTitle + '_' + year + ',\n';
			citationbody = citationbody + 'journal = {' + journal + '},\n';
			citationbody = citationbody + 'abstract = {' + abstract + '},\n';
			citationbody = citationbody + 'journal = {' + journal + '},\n';
			if (DOI !== '') {
			citationbody = citationbody + 'url = {http://dx.doi.org/' + DOI + '},\n';
			}
		}
		citationbody = citationbody + 'title = {' + modifiedTitle + '},\n';
		citationbody = citationbody + 'year = {' + year + '},\n';
		citationbody = citationbody + 'author = {';
		for (i=0; i<authorMatrix.length; i++) { // Formatting authors
			var last_first = authorMatrix[i].split(' ');
			if (i == authorMatrix.length-1) {
				citationbody = citationbody + last_first[0] + ' ' + last_first[1] + '},\n';
			}
			else {
				citationbody = citationbody + last_first[0] + ' ' + last_first[1] + ' and ';
			}
		}
		citationbody = citationbody + 'url = {' + searchURL +'},\n';
		citationbody = citationbody + '}';
		return citationbody;
	},

	makeEndNotecitation: function($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI) {
		var citationbody;
		if ((Page.isDataSet($evtTarget)) || (Page.isGDSBrowserPage()) || (Page.isSeries($evtTarget)) || (Page.isGSEPage())) {
		// If is related to citation for datasets or series
			citationbody = '%0 Dataset\n';
			citationbody = citationbody + '%W ' + 'National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO) Datasets\n';
		}
		else if (Page.isPubMed()) {
		// Else if is related to citation for PubMed articles
			citationbody = '%0 Journal Article\n';
			citationbody = citationbody + '%J ' + journal + '\n';
			citationbody = citationbody + '%X ' + abstract + '\n';
			citationbody = citationbody + '%U http://dx.doi.org/' + DOI + '\n';
		}
		citationbody = citationbody + '%T ' + modifiedTitle + '\n';
		citationbody = citationbody + '%D ' + year + '\n';
		for (i=0; i<authorMatrix.length; i++) {
			citationbody = citationbody + '%A ' + authorMatrix[i] + '\n';
		}
		citationbody = citationbody + '%U ' + searchURL + '\n';
		return citationbody;
	}
};

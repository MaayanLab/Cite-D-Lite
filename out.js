function main() {
	var $parents = Interface.locateParents();
	Interface.load($parents);
	Interface.whenClicked();
	if (PubMedPage.isPubMedAbstractPage()) {
		Abstract.highlight();
	}
}

var GEOPage = {
	// Return true if user is on datasets search results page, false otherwise.
	isGEOSearchResultsPage: function() {
		if (Boolean(window.location.pathname.match(/\/gds/) && window.location.search.match(/\?term=/))) {
			// If is on search results page
			return true;
		}
		else if (Boolean(window.location.pathname.match(/\/gds/) && document.getElementById('database')[0].textContent.match('GEO DataSets'))) {
			// Else if is on subsequent page of search results page
			return true;
		}
	},

	// Return true if user is on GDS browser page, false otherwise. [DATASET]
	isGDSBrowserPage: function() {
		return Boolean(window.location.pathname.match(/\/sites\/GDSbrowser/) && window.location.search.match(/\?acc=GDS/));
	},

	// Return true if user is on GSE page, false otherwise. [SERIES]
	isGSEPage: function() {
		return Boolean(window.location.pathname.match(/\/geo\/query\/acc.cgi/) && window.location.search.match(/\?acc=GSE/));
	},

	// Return true if user is on GSM page, false otherwise. [SAMPLE]
	isGSMPage: function() {
		return Boolean(window.location.pathname.match(/\/geo\/query\/acc.cgi/) && window.location.search.match(/\?acc=GSM/));
	}
};

var PubMedPage = {
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

	// Return true if user is on PubMed abstract page, false otherwise.
	isPubMedAbstractPage: function() {
		return Boolean(window.location.pathname.match(/\/pubmed/) && document.getElementsByClassName('value')[0].textContent.match('Abstract'));
	}
};

var DataMedPage = {
	isDataMed: function() {
		return Boolean(window.location.hostname.match(/datamed.org/));
	},

	isDataMedSearchResultsPage: function() {
		return Boolean(window.location.hostname.match(/datamed.org/) && window.location.pathname.match(/\/search.php/));
	},
	
	isDataMedItemPage: function() {
		return Boolean(window.location.hostname.match(/datamed.org/) && window.location.pathname.match(/\/display-item.php/));
	}
};

var GEOType = {
	// Return true if result on search results page is a dataset, false otherwise.
	isDataSet: function($object) { // $object is either $evtTarget or $elem
		if (GEOPage.isGEOSearchResultsPage()) {
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
		if (GEOPage.isGEOSearchResultsPage()) {
			if (Boolean($object.attr('class').match('citationbutton'))) { // $object is $evtTarget
				return Boolean($object.parent().parent().find('.src').text().match('Series'));
			}
			else { // $object is $elem
				return Boolean($object.parent().find('.src').text().match('Series'));
			}
		}
	},

	// Return true if result on search results page is a sample, false otherwise.
	isSample: function($object) { // $object is either $evtTarget or $elem
		if (GEOPage.isGEOSearchResultsPage()) {
			if (Boolean($object.attr('class').match('citationbutton'))) { // $object is $evtTarget
				return Boolean($object.parent().parent().find('.src').text().match('Sample'));
			}
			else { // $object is $elem
				return Boolean($object.parent().find('.src').text().match('Sample'));
			}
		}
	}	
};

var DataMedType = {
	// Return true if repository is GEO, false otherwise.
	isGEO: function() {
		if ((DataMedPage.isDataMedSearchResultsPage()) && ($('.label-repo').find('a').eq(0).text().includes('GEO'))) {
			// If repository is GEO on search results page
			return true;
		}
		else if ((DataMedPage.isDataMedItemPage()) && ($('.table-striped').find('td').eq(1).text().includes('GEO'))) {
			// Else if repository is GEO on item page
			return true;
		}
	}
};

var Interface = {
	locateParents: function() {
		var $parents;
		if (GEOPage.isGDSBrowserPage()) {
			$parents = $('.gds_panel');
		}
		else if (GEOPage.isGSEPage()) {
			$parents = $('.pubmed_id').parent();
		}
		else if (GEOPage.isGSMPage()) {
			$parents = $('td:contains("Data processing")').eq(5).parent().find('td').eq(1);
		}
		else if (GEOPage.isGEOSearchResultsPage()) {
			$parents = $('.rsltcont');
		}
		else if (PubMedPage.isPubMedAbstractPage()) {
			$parents = $('.resc.status');
		}
		else if (PubMedPage.isPubMedSearchResultsPage()) {
			$parents = $('.aux');
		}
		else if (DataMedPage.isDataMedItemPage()) {
			$parents = $('.heading');
		}
		else if (DataMedPage.isDataMedSearchResultsPage()) {
			$parents = $('.search-result').find('li');
		}
		return $parents;
	},

	load: function($parents) {
		var self = this;
		$parents.each(function(i, elem) {
			var $elem = $(elem),
				citationlabel;
			if ((GEOType.isDataSet($elem)) || (GEOPage.isGDSBrowserPage())) {
				citationlabel = ' Cite GEO Dataset';
			}
			else if ((GEOType.isSeries($elem)) || (GEOPage.isGSEPage())) {
				citationlabel = ' Cite GEO Series';
			}
			else if ((GEOType.isSample($elem)) || (GEOPage.isGSMPage())) {
				citationlabel = ' Cite GEO Sample';
			}
			else if (PubMedPage.isPubMed()) {
				citationlabel = ' PubMed Citation';
			}
			else if (DataMedType.isGEO()) {
				citationlabel = ' Cite GEO Sample';
			}
			self.addButtons($elem, citationlabel);
		});
	},

	whenClicked: function() {
		$('.citationbutton').click(function(evt) {
			evt.preventDefault();
			var $evtTarget = $(evt.target),
				format = ScreenScraper.getCitationFormat($evtTarget);
			if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage()) || (GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
				// If is related to citation for datasets or series
				if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage())) {
					var ID = ScreenScraper.getID($evtTarget);
					PreAjax.getIntoGDSBrowserPage(format, ID, $evtTarget);
				}
				else if ((GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
					var series = ScreenScraper.getSeries($evtTarget);
					PreAjax.getIntoGSEPage(format, series, $evtTarget);
				}
			}
			else if (PubMedPage.isPubMed()) {
				// Else if is related to citation for PubMed articles
				var PubMedID = ScreenScraper.getPubMedID($evtTarget);
				PreAjax.getIntoAbstractPage(format, PubMedID, $evtTarget);
			}
			else if (DataMedPage.isDataMed()) {
				alert('hi');
			}
		});
	},

	addButtons: function($elem, citationlabel) {
		var iconURL = chrome.extension.getURL("icon_720.png"),
			buttonHTMLdiv = '<div class="citationstuff"><img alt="Citation Icon" src="'+iconURL+'" width="15" height="15"><b class="citationlabel">'+citationlabel+'</b><button class="citationbutton" id="ris">RIS (.ris)</button><button class="citationbutton" id="bib">BibTeX (.bib)</button><button class="citationbutton" id="enw">EndNote (.enw)</button></div>';
		if (GEOPage.isGDSBrowserPage()) {
			$elem.after(buttonHTMLdiv);
		}
		else if (DataMedPage.isDataMed()) {
			if ((DataMedPage.isDataMedSearchResultsPage()) && (DataMedType.isGEO())) {
				$elem.append(buttonHTMLdiv);	
			}
			else if ((DataMedPage.isDataMedItemPage()) && (DataMedType.isGEO())) {
				$elem.after(buttonHTMLdiv);
			}
		}
		else {
			$elem.append(buttonHTMLdiv);			
		}
	}
};

var ScreenScraper = {
	// Desired citation format of dataset
	getCitationFormat: function($evtTarget) {
		var format = $evtTarget.attr('id');
		return format;
	},

	////////// ALL THINGS RELATED TO GETTING INFO IN ORDER TO IMPLEMENT AJAX CALL //////////
	// Gets ID number of dataset (from search results or GDS browser page)
	getID: function($evtTarget) {
		var ID;
		if (GEOPage.isGEOSearchResultsPage()) {
			ID = $evtTarget.parent().parent().find('.rprtid').eq(1).find('dd').text();
		}
		else if (GEOPage.isGDSBrowserPage()) {
			ID = $evtTarget.parent().parent().find('.caption').find('th').text().slice(39,43);
		}
		return ID;
	},

	// Gets series (from search results or GSE page)
	getSeries: function($evtTarget) {
		var series;
		if (GEOPage.isGEOSearchResultsPage()) {
			series = $evtTarget.parent().parent().find('.rprtid').eq(0).find('dd').text();
		}
		else if (GEOPage.isGSEPage()) {
			series = $evtTarget.parent().parent().parent().parent().find('tr').eq(0).find('strong').attr('id');
		}
		return series;
	},

	// Gets PubMedID of PubMed article (from search results or abstract page)
	getPubMedID: function($evtTarget) {
		var PubMedID;
		if (PubMedPage.isPubMedSearchResultsPage()) {
			PubMedID = $evtTarget.parent().parent().find('dd').text();
		}
		else if (PubMedPage.isPubMedAbstractPage()) {
			PubMedID = $evtTarget.parent().parent().parent().find('dd').eq(0).text();
		}
		return PubMedID;
	},

	////////// ALL THINGS RELATED TO GETTING INFO WITHIN AJAX CALL //////////
	getTitle: function($data, $evtTarget) {
		var title;
		if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage())) {
			title = $data.find('tbody').eq(1).find('tr').eq(1).find('td').eq(0).text();
		}
		else if ((GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
			title = $data.find('tr').eq(19).find('td').eq(1).text();
		}
		else if (PubMedPage.isPubMed()) {
			title = $data.find('.rprt.abstract').find('h1').text();
			title = title.slice(0,title.length-1); // Get rid of extra space at end of string
		}
		return title;
	},

	getYear: function($data, $evtTarget) {
		var year;
		if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage())) {
			year = $data.find('tbody').eq(1).find('tr').eq(7).find('td').eq(1).text().slice(0,4);
		}
		else if ((GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
			year = $data.find('tr').eq(18).find('td').eq(1).text().slice(18,22);
		}
		else if (PubMedPage.isPubMed()) {
			var periodIndex = $data.find('.cit').text().indexOf('.');
			year = $data.find('.cit').text().slice(periodIndex+2,periodIndex+6);
		}
		return year;
	},

	// Gets abbreviated journal title of PubMed article
	getJournal: function($data) {
		var periodIndex = $data.find('.cit').text().indexOf('.');
		var journal = $data.find('.cit').text().slice(0,periodIndex);
		return journal;
	},

	// Gets abstract of PubMed article
	getAbstract: function($data) {
		var abstract = $data.find('abstracttext').text();
		return abstract;
	},

	// Gets abstract of PubMed article
	getDOI: function($data) {
		var DOI = $data.find('.rprtid').eq(0).find('dd').eq(1).text();
		return DOI;
	},

	getAuthorMatrix: function($data, $evtTarget, searchURL, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI) {
		var authors,
		authorMatrix;	
		if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage())) {
			authors = $data.find('.authors').text();
			authors = authors.slice(0,authors.length-2); // Get rid of extra space and punctuation at end of string
			authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
			authorMatrix = authors.split(","); // Divides string of authors into vector of authors
			for (i=0; i<authorMatrix.length; i++) { // Insert comma between last & first name
				authorMatrix[i] = authorMatrix[i].replace(' ',', ');
			}
			return authorMatrix;
		}
		else if ((GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
			PreAjax.getPubMedAuthors($evtTarget, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI, searchURL);
		}
		else if (PubMedPage.isPubMed()) {
			authors = $data.find('.auths').text();
			authors = authors.slice(0,authors.length-1); // Get rid of punctuation at end of string
			authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
			authorMatrix = authors.split(","); // Divides string of authors into vector of authors
			for (i=0; i<authorMatrix.length; i++) {
				authorMatrix[i] = authorMatrix[i].replace(' ',', '); // Insert comma between last & first name
				authorMatrix[i] = authorMatrix[i].slice(0,authorMatrix[i].length-1); // Get rid of number after name
			}
			return authorMatrix;
		}
	}
};

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

var AjaxCall = {
	GDSBrowserPage: function(format, ID, $evtTarget, searchURL) {
		$.ajax({
			url: searchURL,
			type: 'GET',
			dataType: '',
			success: function(data) {
				AjaxSuccess.GDSBrowserPage(data, $evtTarget, searchURL, format, ID);
			},
			error: function() {
				alert('Sorry, something went wrong.');
			}
		});
	},

	GSEPage: function(format, series, $evtTarget, searchURL) {
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
	},

	AbstractPage: function(format, PubMedID, $evtTarget, searchURL) {
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
	},

	PubMedAuthorMatrix: function($evtTarget, pubmedSearchURL, format, ID, modifiedTitle, year, journal, abstract, DOI, searchURL) {
		$.ajax({
			url: pubmedSearchURL,
			type: 'GET',
			dataType: '',
			success: function(pubmedCitation) {
				AjaxSuccess.PubMedAuthorMatrix(pubmedCitation, $evtTarget, pubmedSearchURL, format, ID, modifiedTitle, year, journal, abstract, DOI, searchURL);
			},
			error: function () {
				alert('Sorry, no citation available.');
			}
		});
	}
};

var AjaxSuccess = {
	GDSBrowserPage: function(data, $evtTarget, searchURL, format, ID) {
		var $data = $(data),
			title = ScreenScraper.getTitle($data, $evtTarget),
			modifiedTitle = 'GDS' + ID + ': ' + title,
			year = ScreenScraper.getYear($data, $evtTarget),
			PubMedID = '', // EMPTY
			journal = '', // EMPTY
			abstract = '', // EMPTY
			DOI = '', // EMPTY
			authorMatrix = ScreenScraper.getAuthorMatrix($data, $evtTarget, searchURL, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI);
		CitationFile.assemble($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
	},

	GSEPage: function(data, $evtTarget, searchURL, format, series) {
		var $data = $(data),
			ID = '', // EMPTY
			title = ScreenScraper.getTitle($data, $evtTarget),
			modifiedTitle = series + ': ' + title,
			year = ScreenScraper.getYear($data, $evtTarget),
			PubMedID = $data.find('.pubmed_id').attr('id'),
			journal = '', // EMPTY
			abstract = '', // EMPTY
			DOI = ''; // EMPTY
		ScreenScraper.getAuthorMatrix($data, $evtTarget, searchURL, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI);
	},

	AbstractPage: function(data, $evtTarget, searchURL, format, PubMedID) {
		var $data = $(data),
			ID = '', // EMPTY
			modifiedTitle = ScreenScraper.getTitle($data, $evtTarget), // Title is only modified in the case of datasets & series
			year = ScreenScraper.getYear($data, $evtTarget),
			journal = ScreenScraper.getJournal($data),
			abstract = ScreenScraper.getAbstract($data),
			DOI = ScreenScraper.getDOI($data),
			authorMatrix = ScreenScraper.getAuthorMatrix($data, $evtTarget, searchURL, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI);
		CitationFile.assemble($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
	},

	PubMedAuthorMatrix: function(pubmedCitation, $evtTarget, pubmedSearchURL, format, ID, modifiedTitle, year, journal, abstract, DOI, searchURL) {
		var $pubmedCitation = $(pubmedCitation);
			authors = $pubmedCitation.find('.authors').text();
			authors = authors.slice(0,authors.length-1); // Get rid of extra space at end of string
			authors = authors.replace(/\s*,\s*/g, ','); // Get rid of spaces after commas
			authorMatrix = authors.split(","); // Divides string of authors into vector of authors
			for (i=0; i<authorMatrix.length; i++) { // Insert comma between last & first name
				authorMatrix[i] = authorMatrix[i].replace(' ',', ');
			}
		CitationFile.assemble($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
	}
};

////////// ALL THINGS RELATED TO PUTTING THE CITATION TOGETHER //////////
var CitationFile = {
	fileName: function(format, modifiedTitle) {
		var filename;
		if (format === 'ris') {
			filename = modifiedTitle + '.ris';
		}
		else if (format === 'bib') {
			filename = modifiedTitle + '.bib';
		}
		else if (format === 'enw') {
			filename = modifiedTitle + '.enw';
		}
		return filename;
	},

	citationBody: function($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI) {
		var citationbody;
		if (format === 'ris') {
			citationbody = CitationText.makeRIScitation($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
		}
		else if (format === 'bib') {
			citationbody = CitationText.makeBibTeXcitation($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
		}
		else if (format === 'enw') {
			citationbody = CitationText.makeEndNotecitation($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
		}
		return citationbody;
	},

	assemble: function($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI) {
		var filename = this.fileName(format, modifiedTitle),
			citationbody = this.citationBody($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
		this.download(filename, citationbody);
	},

	// Downloads text file, bypasses server
	download: function(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
};

var CitationText = {
	makeRIScitation: function($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI) {
		var citationbody;
		if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage()) || (GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
		// If is related to citation for datasets or series
			citationbody = 'TY  - DATA\n';
			citationbody = citationbody + 'DP  - National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO) Datasets\n';
		}
		else if (PubMedPage.isPubMed()) {
		// Else if is related to citation for PubMed articles
			citationbody = 'TY  - JOUR\n';
			citationbody = citationbody + 'JO  - ' + journal + '\n';
			citationbody = citationbody + 'AB  - ' + abstract + '\n';
			citationbody = citationbody + 'DO  - ' + DOI + '\n';
			citationbody = citationbody + 'UR  - http://dx.doi.org/' + DOI + '\n';
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
		if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage()) || (GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
		// If is related to citation for datasets or series
			citationbody = '@techreport{' + authorMatrix[0].split(', ')[0] + '_' + year + ',\n'; // What kind of "entry" type?
			citationbody = citationbody + 'note = {National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO) Datasets},\n';
		}
		else if (PubMedPage.isPubMed()) {
		// Else if is related to citation for PubMed articles
			citationbody = '@article{' + authorMatrix[0].split(', ')[0] + '_' + year + ',\n';
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
			if (i === authorMatrix.length-1) {
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
		if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage()) || (GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
		// If is related to citation for datasets or series
			citationbody = '%0 Dataset\n';
			citationbody = citationbody + '%W ' + 'National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO) Datasets\n';
		}
		else if (PubMedPage.isPubMed()) {
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

var Abstract = {
	highlight: function() {
		var configObj = {
			"maxIter": 100,
			"dampingFactor": 0.85,
			"delta": 0.5
		};

		var abstracttext = document.getElementsByTagName('abstracttext');
		if(abstracttext.length > 1) {
			abstracttext = abstracttext[0].parentNode.parentNode;
		}
		else {
			abstracttext = abstracttext[0];
		}

	    var inputToSummarize = $.trim(abstracttext.innerHTML);
	    if (inputToSummarize.length !== 0) {
			// Invoke the summarizer algo.
			var sentences = Summarizer.Utility.getSentences(inputToSummarize);
			var graph = Summarizer.Utility.makeGraph(sentences);
			var result = Summarizer.Utility.calculatePageRank(graph, configObj.maxIter,
			configObj.dampingFactor, configObj.delta);

			var arr = [];
			var idx = 0;
			_.each(result, function (v) {
			arr.push({
			  "sentence": v.sentence,
			  "PR": v.PR,
			  "idx": idx++
			});
			// console.log("sentence: " + v.sentence + ", PR: " + v.PR);
			});

			// Sort in descending order of PR.
			arr = arr.sort(function (a, b) {
			return b.PR - a.PR;
			});

			// Just returning some percentage of the original number of lines.
			var percentReduced = Math.floor(arr.length / 3);
			if (percentReduced === 0) {
			percentReduced = arr.length;
			}

			// Collect the some percentage of the number of lines and sort them according to their occurence in the original text.
			arr = arr.splice(0, percentReduced);
			arr = arr.sort(function (a, b) {
			return a.idx - b.idx;
			});

			var PRs = arr.map(function(i) { return i.PR; });
			var mean = this.average(PRs);
			var stdev = this.standardDeviation(PRs);

			var reducedsentences = arr.map(function(i) { return i.sentence; });
			self = this;
			abstracttext.innerHTML = abstracttext.innerHTML.split(/\. |\.|\?|!|\n/g).map(function(sentence) {
				var i = reducedsentences.indexOf(sentence);
				if(i !== -1) {
					var zScore = (arr[i].PR - mean) / stdev;
					return '<mark style="background-color: '+self.createColor(zScore)+'">'+sentence+'</mark>';
				}
				else {
					return sentence;
				}
			}).join('. ');
	    }
	},

	createColor: function(zScore) {
		unitScore_0to1 = this.zScore_0to1(zScore);
		unitScore_1to0 = this.zScore_1to0(zScore);
		// Hexadecimal red to yellow
		// return ('#'+Math.floor(0xf * (Math.min(0.5, -zScore / 4.0) + 0.5)).toString(16))+(Math.floor(0xf * (Math.min(0.5, -zScore / 4.0) + 0.5)).toString(16))+(Math.floor(0xf * (Math.min(0.5, zScore / 4.0) + 0.5)).toString(16));

		// RGBA red to yellow (reduced opacity)
		// return ('rgba(255,' + Math.floor(255*unitScore_1to0) + ',0,0.7)');

		// RGBA blue to red (reduced opacity)
		// return ('rgba(' + Math.floor(255*unitScore_1to0) + ',0,' + Math.floor(255*unitScore_0to1) + ',0.5)');

		// RGB red to white
		return ('rgb(255,' + Math.floor(255*unitScore_1to0) + ',' + Math.floor(255*unitScore_1to0) + ')');
	},

	average: function(data) {
		// https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
		var sum = data.reduce(function(sum, value){
		return sum + value;
		}, 0);

		var avg = sum / data.length;
		return avg;
	},

	standardDeviation: function(values) {
		// https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
		var avg = this.average(values);

		var squareDiffs = values.map(function(value){
		var diff = value - avg;
		var sqrDiff = diff * diff;
		return sqrDiff;
		});

		var avgSquareDiff = this.average(squareDiffs);

		var stdDev = Math.sqrt(avgSquareDiff);
		return stdDev;
	},

	zScore_0to1: function(zScore) {
		// Assume all zScores are +-2 of the mean, else zScores above or below +-2 will be bumped to +-2, respectively
		// Convert zScore range of [-2,2] to unit scale of [0,1]
		var zScoreDiv4 = zScore / 4;
		if (zScoreDiv4 > 0) {
			zScoreDiv4 = Math.min(0.5, zScoreDiv4);
		}
		else if (zScoreDiv4 < 0) {
			zScoreDiv4 = Math.max(-0.5, zScoreDiv4);
		}
		var unitScore_0to1 = zScoreDiv4 + 0.5;
		return unitScore_0to1;
	},

	zScore_1to0: function(zScore) {
		// Assume all zScores are +-2 of the mean, else zScores above or below +-2 will be bumped to +-2, respectively
		// Convert zScore range of [-2,2] to unit scale of [1,0]
		var zScoreDiv4 = -zScore / 4;
		if (zScoreDiv4 > 0) {
			zScoreDiv4 = Math.min(0.5, zScoreDiv4);
		}
		else if (zScoreDiv4 < 0) {
			zScoreDiv4 = Math.max(-0.5, zScoreDiv4);
		}
		var unitScore_1to0 = zScoreDiv4 + 0.5;
		return unitScore_1to0;
	}
};

main();
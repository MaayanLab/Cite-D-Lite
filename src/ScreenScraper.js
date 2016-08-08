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
		if (GEOType.isDataSet($evtTarget)) {
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
		if (GEOType.isSeries($evtTarget)) {
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

	getSample: function($evtTarget) {
		var sample;
		if (GEOType.isSample($evtTarget)) {
			sample = $evtTarget.parent().parent().find('.rprtid').eq(0).find('dd').text();
		}
		else if (GEOPage.isGSMPage()) {
			sample = $evtTarget.parent().parent().parent().parent().find('tr').eq(0).find('strong').attr('id');
		}
		else if (DataMedType.isGEO()) {
			if (DataMedPage.isDataMedSearchResultsPage()) {
				sample = $evtTarget.parent().parent().find('.result-field').eq(0).find('span').text().trim();
			}
			else if (DataMedPage.isDataMedItemPage()) {
				sample = $evtTarget.parent().parent().find('.panel-info').eq(0).find('tr').eq(1).find('td').eq(1).text();
			}
		}
		return sample;
	},

	////////// ALL THINGS RELATED TO GETTING INFO WITHIN AJAX CALL //////////
	getTitle: function($data, $evtTarget) {
		var title;
		if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage())) {
			title = $data.find('tbody').eq(1).find('tr').eq(1).find('td').eq(0).text();
		}
		else if ((GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage()) || (GEOType.isSample($evtTarget)) || (GEOPage.isGSMPage()) || DataMedType.isGEO()) {
			title = $data.find('tr').eq(19).find('td').eq(1).text();
		}
		else if (PubMedPage.isPubMed()) {
			title = $data.find('.rprt.abstract').find('h1').text().trim();
		}
		return title;
	},

	getYear: function($data, $evtTarget) {
		var year;
		if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage())) {
			year = $data.find('tbody').eq(1).find('tr').eq(7).find('td').eq(1).text().slice(0,4);
		}
		else if ((GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage()) || (GEOType.isSample($evtTarget)) || (GEOPage.isGSMPage()) || DataMedType.isGEO()) {
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
		authorMatrix = [];	
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
			PreAjax.getGSEPubMedAuthors($evtTarget, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI, searchURL);
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
		else if ((GEOType.isSample($evtTarget)) || (GEOPage.isGSMPage()) || DataMedType.isGEO()) {
			var contactName = $data.find('tr').eq(39).find('td').eq(1).text();
			var spaceIndex = contactName.indexOf(' ');
			authors = contactName.slice(spaceIndex+1) + ', ' + contactName.slice(0,spaceIndex); // Rearrange to "Last, First"
			authorMatrix[0] = authors;
			return authorMatrix;
		}
	}
};

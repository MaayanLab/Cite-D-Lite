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
		if (Page.isDatasetSearchResultsPage()) {
			ID = $evtTarget.parent().parent().find('.rprtid').eq(1).find('dd').text();
		}
		else if (Page.isGDSBrowserPage()) {
			ID = $evtTarget.parent().parent().find('.caption').find('th').text().slice(39,43);
		}
		return ID;
	},

	// Gets series (from search results or GSE page)
	getSeries: function($evtTarget) {
		var series;
		if (Page.isDatasetSearchResultsPage()) {
			series = $evtTarget.parent().parent().find('.rprtid').eq(0).find('dd').text();
		}
		else if (Page.isGSEPage()) {
			series = $evtTarget.parent().parent().parent().parent().find('tr').eq(0).find('strong').attr('id');
		}
		return series;
	},

	// Gets PubMedID of PubMed article (from search results or abstract page)
	getPubMedID: function($evtTarget) {
		var PubMedID;
		if (Page.isPubMedSearchResultsPage()) {
			PubMedID = $evtTarget.parent().parent().find('dd').text();
		}
		else if (Page.isPubMedAbstractPage()) {
			PubMedID = $evtTarget.parent().parent().parent().find('dd').eq(0).text();
		}
		return PubMedID;
	},

	////////// ALL THINGS RELATED TO GETTING INFO WITHIN AJAX CALL //////////
	getTitle: function($data, $evtTarget) {
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
	},

	getYear: function($data, $evtTarget) {
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
	}
};
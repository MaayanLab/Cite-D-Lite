////////// ALL THINGS RELATED TO AJAX CALLS //////////
var AjaxSuccess = {
	GDSBrowserPage: function(data, $evtTarget, searchURL, format, ID) {
		var $data = $(data),
			series = '', // EMPTY
			title = ScreenScraper.getTitle($data, $evtTarget),
			modifiedTitle = 'GDS' + ID + ': ' + title,
			year = ScreenScraper.getYear($data, $evtTarget),
			PubMedID = '', // EMPTY
			journal = '', // EMPTY
			abstract = '', // EMPTY
			DOI = '', // EMPTY
			authorMatrix = getAuthorMatrix($data, $evtTarget, searchURL, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI);
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
		getAuthorMatrix($data, $evtTarget, searchURL, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI);
	},

	AbstractPage: function(data, $evtTarget, searchURL, format, PubMedID) {
		var $data = $(data),
			ID = '', // EMPTY
			modifiedTitle = ScreenScraper.getTitle($data, $evtTarget), // Title is only modified in the case of datasets & series
			year = ScreenScraper.getYear($data, $evtTarget),
			journal = ScreenScraper.getJournal($data),
			abstract = ScreenScraper.getAbstract($data),
			DOI = ScreenScraper.getDOI($data),
			authorMatrix = getAuthorMatrix($data, $evtTarget, searchURL, format, ID, modifiedTitle, year, PubMedID, journal, abstract, DOI);
		CitationFile.assemble($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
	}
};
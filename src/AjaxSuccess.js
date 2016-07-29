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
			for (i=0;i<authorMatrix.length;i++) { // Insert comma between last & first name
				authorMatrix[i] = authorMatrix[i].replace(' ',', ');
			}
		CitationFile.assemble($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
	}
};

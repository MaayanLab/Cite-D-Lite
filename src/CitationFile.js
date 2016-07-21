var CitationFile = {
	fileName: function(format, modifiedTitle) {
		var filename;
		if (format == 'ris')
			filename = modifiedTitle + '.ris';
		else if (format == 'bib')
			filename = modifiedTitle + '.bib';
		else if (format == 'enw')
			filename = modifiedTitle + '.enw';
		return filename;
	},

	citationBody: function($evtTarget, searchURL, format, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI) {
		var citationbody;
		if (format == 'ris') {
			citationbody = CitationText.makeRIScitation($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
		}
		else if (format == 'bib') {
			citationbody = CitationText.makeBibTeXcitation($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
		}
		else if (format == 'enw') {
			citationbody = CitationText.makeEndNotecitation($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI);
		}
		return citationbody;
	}
};

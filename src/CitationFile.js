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

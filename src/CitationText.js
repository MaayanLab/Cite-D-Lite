var CitationText = {
	makeRIScitation: function($evtTarget, searchURL, ID, modifiedTitle, authorMatrix, year, journal, abstract, DOI) {
		var citationbody;
		if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage()) || (GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage()) || (GEOType.isSample($evtTarget)) || (GEOPage.isGSMPage()) || DataMedType.isGEO()) {
		// If is related to citation for datasets or series
			citationbody = 'TY  - DATA\n';
			citationbody = citationbody + 'DP  - National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO)\n';
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
		if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage()) || (GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage()) || (GEOType.isSample($evtTarget)) || (GEOPage.isGSMPage()) || DataMedType.isGEO()) {
		// If is related to citation for datasets or series
			citationbody = '@techreport{' + authorMatrix[0].split(', ')[0] + '_' + year + ',\n'; // What kind of "entry" type?
			citationbody = citationbody + 'note = {National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO)},\n';
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
		if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage()) || (GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage()) || (GEOType.isSample($evtTarget)) || (GEOPage.isGSMPage()) || DataMedType.isGEO()) {
		// If is related to citation for datasets or series
			citationbody = '%0 Dataset\n';
			citationbody = citationbody + '%W ' + 'National Center for Biotechnology Information, U.S. National Library of Medicine Gene Expression Omnibus (GEO)\n';
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

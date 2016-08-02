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

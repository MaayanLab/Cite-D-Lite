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
	},

	// Return true if result on search results page is a platform, false otherwise.
	isPlatform: function($object) { // $object is either $evtTarget or $elem
		if (GEOPage.isGEOSearchResultsPage()) {
			if (Boolean($object.attr('class').match('citationbutton'))) { // $object is $evtTarget
				return Boolean($object.parent().parent().find('.src').text().match('Platform'));
			}
			else { // $object is $elem
				return Boolean($object.parent().find('.src').text().match('Platform'));
			}
		}
	}
};

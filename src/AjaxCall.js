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

	GSEPubMedAuthorMatrix: function($evtTarget, pubmedSearchURL, format, ID, modifiedTitle, year, journal, abstract, DOI, searchURL) {
		$.ajax({
			url: pubmedSearchURL,
			type: 'GET',
			dataType: '',
			success: function(pubmedCitation) {
				AjaxSuccess.GSEPubMedAuthorMatrix(pubmedCitation, $evtTarget, pubmedSearchURL, format, ID, modifiedTitle, year, journal, abstract, DOI, searchURL);
			},
			error: function () {
				alert('Sorry, no citation available.');
			}
		});
	},

	GSMPage: function(format, sample, $evtTarget, searchURL) {
		$.ajax({
			url: searchURL,
			type: 'GET',
			dataType: '',
			success: function(data) {
				AjaxSuccess.GSMPage(data, $evtTarget, searchURL, format, sample);
			},
			error: function() {
				alert('Sorry, something went wrong.');
			}
		});
	}
};

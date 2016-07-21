var Interface = {
	load: function($parents) {
		$parents.each(function(i, elem) {
			var $elem = $(elem),
				iconURL = chrome.extension.getURL("icon_128.png"),
				citationlabel;
			if (Type.isDataSet($elem)) {
				citationlabel = 'Cite Dataset';
				addButtons($elem, iconURL, citationlabel);
			}
			else if (Page.isGDSBrowserPage()) {
				citationlabel = 'Cite Dataset';
				addButtons($elem, iconURL, citationlabel);
			}
			else if ((Type.isSeries($elem)) || (Page.isGSEPage())) {
				citationlabel = 'Cite Series';
				addButtons($elem, iconURL, citationlabel);
			}
			else if (Page.isPubMed()) {
				citationlabel = 'PubMed Citation';
				addButtons($elem, iconURL, citationlabel);
			}
		});
	},

	whenClicked: function() {
		$('.citationbutton').click(function(evt) {
			evt.preventDefault();
			var $evtTarget = $(evt.target),
				format = ScreenScraper.getCitationFormat($evtTarget);
			if ((Type.isDataSet($evtTarget)) || (Page.isGDSBrowserPage()) || (Type.isSeries($evtTarget)) || (Page.isGSEPage())) {
				// If is related to citation for datasets or series
				if ((Type.isDataSet($evtTarget)) || (Page.isGDSBrowserPage())) {
					var ID = ScreenScraper.getID($evtTarget);
					getIntoGDSBrowserPage(format, ID, $evtTarget);
				}
				else if ((Type.isSeries($evtTarget)) || (Page.isGSEPage())) {
					var series = ScreenScraper.getSeries($evtTarget);
					getIntoGSEPage(format, series, $evtTarget);
				}
			}
			else if (Page.isPubMed()) {
				// Else if is related to citation for PubMed articles
				var PubMedID = ScreenScraper.getPubMedID($evtTarget);
				getIntoAbstractPage(format, PubMedID, $evtTarget);
			}
		});
	}
};

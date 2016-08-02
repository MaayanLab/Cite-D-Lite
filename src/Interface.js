var Interface = {
	locateParents: function() {
		var $parents;
		if (GEOPage.isGDSBrowserPage()) {
			$parents = $('.gds_panel');
		}
		else if (GEOPage.isGSEPage()) {
			$parents = $('.pubmed_id').parent();
		}
		else if (GEOPage.isGEOSearchResultsPage()) {
			$parents = $('.rsltcont');
		}
		else if (PubMedPage.isPubMedAbstractPage()) {
			$parents = $('.resc.status');
		}
		else if (PubMedPage.isPubMedSearchResultsPage()) {
			$parents = $('.aux');
		}
		return $parents;
	},

	load: function($parents) {
		var self = this;
		$parents.each(function(i, elem) {
			var $elem = $(elem),
				iconURL = chrome.extension.getURL("icon_128.png"),
				citationlabel;
			if ((Type.isDataSet($elem)) || (GEOPage.isGDSBrowserPage())) {
				citationlabel = 'Cite Dataset';
			}
			else if ((Type.isSeries($elem)) || (GEOPage.isGSEPage())) {
				citationlabel = 'Cite Series';
			}
			else if (PubMedPage.isPubMed()) {
				citationlabel = 'PubMed Citation';
			}
			self.addButtons($elem, iconURL, citationlabel);
		});
	},

	whenClicked: function() {
		$('.citationbutton').click(function(evt) {
			evt.preventDefault();
			var $evtTarget = $(evt.target),
				format = ScreenScraper.getCitationFormat($evtTarget);
			if ((Type.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage()) || (Type.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
				// If is related to citation for datasets or series
				if ((Type.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage())) {
					var ID = ScreenScraper.getID($evtTarget);
					PreAjax.getIntoGDSBrowserPage(format, ID, $evtTarget);
				}
				else if ((Type.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
					var series = ScreenScraper.getSeries($evtTarget);
					PreAjax.getIntoGSEPage(format, series, $evtTarget);
				}
			}
			else if (PubMedPage.isPubMed()) {
				// Else if is related to citation for PubMed articles
				var PubMedID = ScreenScraper.getPubMedID($evtTarget);
				PreAjax.getIntoAbstractPage(format, PubMedID, $evtTarget);
			}
		});
	},

	addButtons: function($elem, iconURL, citationlabel) {
		if (GEOPage.isGDSBrowserPage()) {
			$elem.after('<div class="citationstuff"><img alt="Citation Icon" src="'+iconURL+'" width="15" height="15"><b class="citationlabel">'+citationlabel+'</b><button class="citationbutton" id="ris">RIS (.ris)</button><button class="citationbutton" id="bib">BibTeX (.bib)</button><button class="citationbutton" id="enw">EndNote (.enw)</button></div>');			
		}
		else {
			$elem.append('<div class="citationstuff"><img alt="Citation Icon" src="'+iconURL+'" width="15" height="15"><b class="citationlabel">'+citationlabel+'</b><button class="citationbutton" id="ris">RIS (.ris)</button><button class="citationbutton" id="bib">BibTeX (.bib)</button><button class="citationbutton" id="enw">EndNote (.enw)</button></div>');			
		}
	}
};

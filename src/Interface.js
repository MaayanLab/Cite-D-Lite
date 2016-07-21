var Interface = {
	locateParents: function() {
		var $parents;
		if (Page.isGDSBrowserPage()) {
			$parents = $('.gds_panel');
		}
		else if (Page.isGSEPage()) {
			$parents = $('.pubmed_id').parent();
		}
		else if (Page.isDatasetSearchResultsPage()) {
			$parents = $('.rsltcont');
		}
		else if (Page.isPubMedAbstractPage()) {
			$parents = $('.resc.status');
		}
		else if (Page.isPubMedSearchResultsPage()) {
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
			if ((Type.isDataSet($elem)) || (Page.isGDSBrowserPage())) {
				citationlabel = 'Cite Dataset';
			}
			else if ((Type.isSeries($elem)) || (Page.isGSEPage())) {
				citationlabel = 'Cite Series';
			}
			else if (Page.isPubMed()) {
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
	},

	addButtons: function($elem, iconURL, citationlabel) {
		if (Page.isGDSBrowserPage()) {
			$elem.after('<div class="citationstuff"><img alt="Citation Icon" src="'+iconURL+'" width="15" height="15"><b class="citationlabel">'+citationlabel+'</b><button class="citationbutton" id="ris">RIS (.ris)</button><button class="citationbutton" id="bib">BibTeX (.bib)</button><button class="citationbutton" id="enw">EndNote (.enw)</button></div>');			
		}
		else {
			$elem.append('<div class="citationstuff"><img alt="Citation Icon" src="'+iconURL+'" width="15" height="15"><b class="citationlabel">'+citationlabel+'</b><button class="citationbutton" id="ris">RIS (.ris)</button><button class="citationbutton" id="bib">BibTeX (.bib)</button><button class="citationbutton" id="enw">EndNote (.enw)</button></div>');			
		}
	}
};

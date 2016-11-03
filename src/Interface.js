var Interface = {
	locateParents: function() {
		var $parents;
		if (GEOPage.isGDSBrowserPage()) {
			$parents = $('.gds_panel');
		}
		else if (GEOPage.isGSEPage()) {
			$parents = $('.pubmed_id').parent();
		}
		else if (GEOPage.isGSMPage()) {
			$parents = $('td:contains("Data processing")').eq(5).parent().find('td').eq(1);
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
		else if (DataMedPage.isDataMedItemPage()) {
			$parents = $('.heading');
		}
		else if (DataMedPage.isDataMedSearchResultsPage()) {
			$parents = $(".label-repo a:contains('GEO')").parent().parent().parent();
		}
		return $parents;
	},

	load: function($parents) {
		var self = this;
		$parents.each(function(i, elem) {
			var $elem = $(elem),
				citationlabel;
			if ((GEOType.isDataSet($elem)) || (GEOPage.isGDSBrowserPage())) {
				citationlabel = ' Cite GEO Dataset';
			}
			else if ((GEOType.isSeries($elem)) || (GEOPage.isGSEPage())) {
				citationlabel = ' Cite GEO Series';
			}
			else if ((GEOType.isSample($elem)) || (GEOPage.isGSMPage()) || (DataMedType.isGEO())) {
				citationlabel = ' Cite GEO Sample';
			}
			else if (PubMedPage.isPubMed()) {
				citationlabel = ' PubMed Citation';
			}
			if (!GEOType.isPlatform($elem)) {
				self.addButtons($elem, citationlabel);
			}
		});
	},

	whenClicked: function() {
		$('.citationbutton').click(function(evt) {
			evt.preventDefault();
			var $evtTarget = $(evt.target),
				format = ScreenScraper.getCitationFormat($evtTarget);
			if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage()) || (GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
				// If is related to citation for datasets or series
				if ((GEOType.isDataSet($evtTarget)) || (GEOPage.isGDSBrowserPage())) {
					var ID = ScreenScraper.getID($evtTarget);
					PreAjax.getIntoGDSBrowserPage(format, ID, $evtTarget);
				}
				else if ((GEOType.isSeries($evtTarget)) || (GEOPage.isGSEPage())) {
					var series = ScreenScraper.getSeries($evtTarget);
					PreAjax.getIntoGSEPage(format, series, $evtTarget);
				}
			}
			else if (PubMedPage.isPubMed()) {
				// Else if is related to citation for PubMed articles
				var PubMedID = ScreenScraper.getPubMedID($evtTarget);
				PreAjax.getIntoAbstractPage(format, PubMedID, $evtTarget);
			}
			else if ((GEOType.isSample($evtTarget)) || (GEOPage.isGSMPage()) || (DataMedType.isGEO())) {
				var sample = ScreenScraper.getSample($evtTarget);
				PreAjax.getIntoGSMPage(format, sample, $evtTarget);
			}
		});
	},

	addButtons: function($elem, citationlabel) {
		var iconURL = chrome.extension.getURL("icon_720.png"),
			buttonHTMLdiv = '<div class="citationstuff"><img alt="Citation Icon" src="'+iconURL+'" width="15" height="15"><b class="citationlabel">'+citationlabel+'</b><button class="citationbutton" id="ris">RIS (.ris)</button><button class="citationbutton" id="bib">BibTeX (.bib)</button><button class="citationbutton" id="enw">EndNote (.enw)</button></div>';
		if (GEOPage.isGDSBrowserPage()) {
			$elem.after(buttonHTMLdiv);
		}
		else if (DataMedPage.isDataMed()) {
			if ((DataMedPage.isDataMedSearchResultsPage()) && (DataMedType.isGEO())) {
				$elem.append(buttonHTMLdiv);	
			}
			else if ((DataMedPage.isDataMedItemPage()) && (DataMedType.isGEO())) {
				$elem.after(buttonHTMLdiv);
			}
		}
		else {
			$elem.append(buttonHTMLdiv);			
		}
	}
};

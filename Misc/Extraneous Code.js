///////////////////////////////////////////////////////////////////
//IGNORE BELOW//
///////////////////////////////////////////////////////////////////
// function main() {
// 	var $parents;
// 	if (isSearchResultsPage()) {
// 		$parents = $('.links.nohighlight');
// 		alert('search results page');
// 	}
// 	else if (isFullTextPage()) {
// 		$parents = $('.links');
// 		alert('full text page');
// 	}
// 	else if (isGDSBrowserPage()) {
// 		$parents = $('#gds_details.caption');
// 		debugger;
// 		alert($parents);
// 	}
// 	// $rprt = $('.rprt');
// 	loadInterface($parents);
// }

// function loadInterface($parents) {
// 	$parents.each(function(i, elem) {
// 		var $elem = $(elem);
// 		$elem.append('<button class="citationbutton">DataSet Citation</button>'); // doesn't append on GDS browswer page
// 	});
// 	// $('.citationbutton').click(function(evt) {
// 		// evt.preventDefault();
// 		// var evtTarget = evt.target;
// 		// var ID = getID(evtTarget);
// 		// var series = getSeries(evtTarget);
// 		// var title = getTitle(evtTarget);
// 		// getIntoFullTextPage(ID, series);
// 	// });
// 	$('.citationbutton').click(function(evt) {
// 		evt.preventDefault();
// 		getIntoSearchResultsPage();
// 		getIntoGDSBrowswerPage();
// 	});
// }

// // Return true if user is on search results page, false otherwise.
// function isSearchResultsPage() {
// 	return Boolean(window.location.search.match(/term=/g));
// }

// // Return true if user is on PMC full text page, false otherwise.
// function isFullTextPage() {
// 	return Boolean(window.location.search.match(/LinkName=/g));
// }

// // Return true if user is on GDS browser page, false otherwise.
// function isGDSBrowserPage() {
// 	return Boolean(window.location.search.match(/acc=/g));
// }

// // // Downloads text file, bypasses server
// // function download(filename, text) {
// // 	var element = document.createElement('a');
// // 	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
// // 	element.setAttribute('download', filename);
// // 	element.style.display = 'none';
// // 	document.body.appendChild(element);
// // 	element.click();
// // 	document.body.removeChild(element);
// // }

// // Gets into search results page
// function getIntoFullTextPage(ID, series) {
// 	var baseURL = 'http://www.ncbi.nlm.nih.gov/pmc/?LinkName=gds_pmc&from_uid=';
// 	var searchURL = baseURL + ID;
// 	$.ajax({
// 		url: searchURL,
// 		type: 'GET',
// 		dataType: '',
// 		success: function(data) {
// 			var $data = $(data);
// 			// var title = getTitle($data);
// 			var authors = getAuthors($data);
// 			var year = getYear($data)
// 			generateCitationAndDownload(series, title, authors, year);
// 		},
// 		error: function() {
// 			alert('Sorry, something went wrong.');
// 		}
// 	});
// }

// // Gets into GDS browser page
// 	var baseURL = 'http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=GDS';
// // 	var searchURL = baseURL + ID;
// // 	$.ajax({
// // 		url: searchURL,
// // 		type: 'GET',
// // 		dataType: '',
// // 		success: function(data) {
// // 			var $data = $(data);
// // 			var title = getTitle($data);
// // 			var authors = getAuthors($data);
// // 			var year = getYear($data);
// // 			generateCitationAndDownload(series, title, authors, year);
// // 		},
// // 		error: function() {
// // 			alert('Sorry, something went wrong.');
// // 		}
// // 	});
// // }

// // function generateCitationAndDownload(series, title, authors, year) {
// // 	// var citationbody = generateCitation(series);
// // 	// alert(series); alert(title); alert(authors); alert(year);
// // 	download(series + ":" + title + ".txt", series + ": " + title + ". (" + year + "). " + authors); //What kind of format to download in?
// // }
// // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // // Gets ID number of dataset from HTML of search results page
// // function getID(evtTarget) {
// // 	var ID = $(evtTarget).parent().parent().find('.rprtid').eq(1).find('dd').text();
// // 	return ID
// // }

// // // Gets series code of dataset from HTML of search results page
// // function getSeries(evtTarget) {
// // 	var series = $(evtTarget).parent().parent().parent().find('.details').eq(2).find('.lng_ln').eq(1).text();
// // 	return series
// // }

// // Gets title of dataset from HTML of search results page
// // function getTitle(evtTarget) {
// // 	var title = $(evtTarget).parent().parent().parent().find('.title').text();
// // 	return title
// // }
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // Gets authors of publication from HTML of GDS browser page
// // function getAuthors($data) {
// // 	var authors = $data.find('.authors').text();
// // 	var length = $data.find('.authors').text().length;
// // 	authors = authors.slice(0,length-1)
// // 	return authors
// // }

// // // Gets year of publication from HTML of GDS browser page
// // function getYear($data) {
// // 	var year = $data.find('tbody').eq(1).find('tr').eq(7).find('td').eq(1).text().slice(0,4); // sometimes pulls weird info
// // 	return year
// // }

// // // Gets title of publication from HTML of GDS browser page
// // function getTitle($data) {
// // 	var title = $data.find('tbody').eq(1).find('tr').eq(1).find('td').eq(0).text(); // title from full text page is different than title on search result page
// // 	return title
// // }
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // // Gets authors of publication from HTML of full text page
// // function getAuthors($data) {
// // 	var authors = $data.find('.desc').text(); // names are listed first last...fix later
// // 	return authors
// // }

// // // Gets year of publication from HTML of full text page
// // function getYear($data) {
// // 	var year = $data.find('.details').find('span').eq(0).text().slice(0,4); // sometimes pulls weird info
// // 	return year
// // }

// // Gets title of publication from HTML of full text page
// // function getTitle($data) {
// // 	var title = $data.find('.title').text(); // title from full text page is different than title on search result page
// // 	return title
// // }
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// main();









// // // function on_citation_click(evt) {
// // // 	var elem = evt.target;
// // // 	var data = get_accession_data(elem):
// // // 	var filename = get_filename(data);
// // // 	var content = get_file_content(data);
// // // 	download_file(filename, content);

// // function get_accession_data(elem) {
// 	// var baseURL = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/{0}.fcgi?db=gds&retmax=1&retmode=json';
// 	// // var $ID = $('d1.rprtid:nth-child(2)>dd:nth-child(1)');
// 	// var ID = '5077';
// 	// var summaryURL = baseURL.replace('{0}', 'esummary') + '&id=' + ID;
// // 	var allInfo = $.get(summaryURL, function(data) {
// //     var metadata = {
// //         metadata.platform = 'GPL' + data.gpl;
// //         metadata.series = 'GSE' + data.gse;
// //         metadata.accession = data.accession;
// //         metadata.title = metadata.series + ': ' + data.title;
// //     }
// //     return metadata;
// // }

// // function getAuthor(elem) {
// // 	var baseURL = 'http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=';
// // 	// var $ID = $('d1.rprtid:nth-child(2)>dd:nth-child(1)');
// // 	var ID = '5077';
// // 	var datasetURL = baseURL + 'GDS' + ID;
// // 	var author = $.get(summaryURL, function(data) {
// // }
// // 	return author

// // function get_filename(data) {

// //    return getAuthor() + data.accession;
// // }

// // //     return {
// // //         init: init
// // //     };
// // // }



// // // function get_file_content(data) {
// // //    var result = "";
// // //    result += "%A " + data.author;
// // //    result += "%0 " + data.result;
// // //    result += "%T" + data.title;
// // //    ...
// // //    return result
// // // }

// // // function copyToClipboard(text) {
// // //     window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
// // // }
// // // // Use JQuer
// // // $('#test').click(function() {
// // //     copyToClipboard('bobo')
// // // });
  
// // // new Clipboard('.btn');

// // // console.log(evt);
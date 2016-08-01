// https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
function average(data){
	var sum = data.reduce(function(sum, value){
	return sum + value;
	}, 0);

	var avg = sum / data.length;
	return avg;
}

function standardDeviation(values){
	var avg = average(values);

	var squareDiffs = values.map(function(value){
	var diff = value - avg;
	var sqrDiff = diff * diff;
	return sqrDiff;
	});

	var avgSquareDiff = average(squareDiffs);

	var stdDev = Math.sqrt(avgSquareDiff);
	return stdDev;
}


function CreateColor(val) {
	return  '#f'+Math.floor(0xf * (Math.min(0.5, -val / 4.0) + 0.5)).toString(16)+'0';
}


var Abstract = {
	highlight: function() {
		var configObj = {
			"maxIter": 100,
			"dampingFactor": 0.85,
			"delta": 0.5
		};

		var abstracttext = document.getElementsByTagName('abstracttext');
		if(abstracttext.length > 1) {
			abstracttext = abstracttext[0].parentNode.parentNode;
		}
		else {
			abstracttext = abstracttext[0];
		}

	    var inputToSummarize = $.trim(abstracttext.innerHTML);
	    if (inputToSummarize.length !== 0) {
			// Invoke the summarizer algo.
			var sentences = Summarizer.Utility.getSentences(inputToSummarize);
			var graph = Summarizer.Utility.makeGraph(sentences);
			var result = Summarizer.Utility.calculatePageRank(graph, configObj.maxIter,
			configObj.dampingFactor, configObj.delta);

			var arr = [];
			var idx = 0;
			_.each(result, function (v) {
			arr.push({
			  "sentence": v.sentence,
			  "PR": v.PR,
			  "idx": idx++
			});
			// console.log("sentence: " + v.sentence + ", PR: " + v.PR);
			});

			// Sort in descending order of PR.
			arr = arr.sort(function (a, b) {
			return b.PR - a.PR;
			});

			// Just returning some percentage of the original number of lines.
			var percentReduced = Math.floor(arr.length / 3);
			if (percentReduced === 0) {
			percentReduced = arr.length;
			}

			// Collect the some percentage of the number of lines and sort them according to their occurence in the original text.
			arr = arr.splice(0, percentReduced);
			arr = arr.sort(function (a, b) {
			return a.idx - b.idx;
			});

			var PRs = arr.map(function(i) { return i.PR; });
			var mean = average(PRs);
			var stdev = standardDeviation(PRs);

			var reducedsentences = arr.map(function(i) { return i.sentence; });
			abstracttext.innerHTML = abstracttext.innerHTML.split(/\. |\.|\?|!|\n/g).map(function(sentence) {
				var i = reducedsentences.indexOf(sentence);
				if(i !== -1) {
					var val = (arr[i].PR - mean) / stdev;
					console.log(val);
					return '<mark style="background-color: '+CreateColor(val)+'">'+sentence+'</mark>';
				}
				else {
					return sentence;
				}
			}).join('. ');
	    }
	}
};

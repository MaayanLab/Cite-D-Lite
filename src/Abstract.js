var Abstract = {
	highlight: function() {
		var configObj = {
			"maxIter": 100,
			"dampingFactor": 0.85,
			"delta": 0.5
		};
	    var abstracttext = document.getElementsByTagName('abstracttext')[0];

	    var inputToSummarize = $.trim(abstracttext.textContent);
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

			var reducedsentences = arr.map(function(i) { return i.sentence; });
			abstracttext.innerHTML = abstracttext.innerHTML.split('. ').map(function(sentence) {
				if(reducedsentences.indexOf(sentence) !== -1) {
					return '<mark>'+sentence+'</mark>';
				}
				else {
					return sentence;
				}
			}).join('. ');
	    }
	}
};

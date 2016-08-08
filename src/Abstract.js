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
			var mean = this.average(PRs);
			var stdev = this.standardDeviation(PRs);

			var reducedsentences = arr.map(function(i) { return i.sentence; });
			self = this;
			abstracttext.innerHTML = abstracttext.innerHTML.split(/\. |\.|\?|!|\n/g).map(function(sentence) {
				var i = reducedsentences.indexOf(sentence);
				if(i !== -1) {
					var zScore = (arr[i].PR - mean) / stdev;
					return '<mark style="background-color: '+self.createColor(zScore)+'">'+sentence+'</mark>';
				}
				else {
					return sentence;
				}
			}).join('. ');
	    }
	},

	createColor: function(zScore) {
		// unitScore_0to1 = this.zScore_0to1(zScore);
		unitScore_1to0 = this.zScore_1to0(zScore);
		// Hexadecimal red to yellow
		// return ('#'+Math.floor(0xf * (Math.min(0.5, -zScore / 4.0) + 0.5)).toString(16))+(Math.floor(0xf * (Math.min(0.5, -zScore / 4.0) + 0.5)).toString(16))+(Math.floor(0xf * (Math.min(0.5, zScore / 4.0) + 0.5)).toString(16));

		// RGBA red to yellow (reduced opacity)
		// return ('rgba(255,' + Math.floor(255*unitScore_1to0) + ',0,0.7)');

		// RGBA blue to red (reduced opacity)
		// return ('rgba(' + Math.floor(255*unitScore_1to0) + ',0,' + Math.floor(255*unitScore_0to1) + ',0.5)');

		// RGB red to white
		if (isNaN(unitScore_1to0)) {
			return ('rgb(255,0,0)'); // red
		}
		else {
			return ('rgb(255,' + Math.floor(255*unitScore_1to0) + ',' + Math.floor(255*unitScore_1to0) + ')'); // somewhere between red & white
		}
	},

	average: function(data) {
		// https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
		var sum = data.reduce(function(sum, value){
		return sum + value;
		}, 0);

		var avg = sum / data.length;
		return avg;
	},

	standardDeviation: function(values) {
		// https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
		var avg = this.average(values);

		var squareDiffs = values.map(function(value){
		var diff = value - avg;
		var sqrDiff = diff * diff;
		return sqrDiff;
		});

		var avgSquareDiff = this.average(squareDiffs);

		var stdDev = Math.sqrt(avgSquareDiff);
		return stdDev;
	},

	zScore_0to1: function(zScore) {
		// Assume all zScores are +-2 of the mean, else zScores above or below +-2 will be bumped to +-2, respectively
		// Convert zScore range of [-2,2] to unit scale of [0,1]
		var zScoreDiv4 = zScore / 4;
		if (zScoreDiv4 > 0) {
			zScoreDiv4 = Math.min(0.5, zScoreDiv4);
		}
		else if (zScoreDiv4 < 0) {
			zScoreDiv4 = Math.max(-0.5, zScoreDiv4);
		}
		var unitScore_0to1 = zScoreDiv4 + 0.5;
		return unitScore_0to1;
	},

	zScore_1to0: function(zScore) {
		// Assume all zScores are +-2 of the mean, else zScores above or below +-2 will be bumped to +-2, respectively
		// Convert zScore range of [-2,2] to unit scale of [1,0]
		var zScoreDiv4 = -zScore / 4;
		if (zScoreDiv4 > 0) {
			zScoreDiv4 = Math.min(0.5, zScoreDiv4);
		}
		else if (zScoreDiv4 < 0) {
			zScoreDiv4 = Math.max(-0.5, zScoreDiv4);
		}
		var unitScore_1to0 = zScoreDiv4 + 0.5;
		return unitScore_1to0;
	}
};

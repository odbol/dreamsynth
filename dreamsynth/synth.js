var Synth = (function () {
	var synthIdx = 0,
		curIntervalIdx = 0,
		intervals = [ 0, 2, 3, 5, 7, 8, 11, 12 ];

	return {
		createNextSynth: function() {
			synthIdx = (synthIdx + 1) % 3;
			switch(synthIdx) {
				case 0:
					// Marimba
					return new Tone.PolySynth(4, Tone.Synth)
						.set(
						{
						    "oscillator": {
						        "partials": [
						            1,
						            0,
						            2,
						            0,
						            3
						        ]
						    },
						    "envelope": {
						        "attack": 0.001,
						        "decay": 1.2,
						        "sustain": 0,
						        "release": 1.2
						    }
						}
					).toMaster();
				case 2:
					// Kalimba
					return new Tone.PolySynth(4, Tone.FMSynth)
						.set(
						{
						    "harmonicity":8,
						    "modulationIndex": 2,
						    "oscillator" : {
						        "type": "sine"
						    },
						    "envelope": {
						        "attack": 0.001,
						        "decay": 2,
						        "sustain": 0.1,
						        "release": 2
						    },
						    "modulation" : {
						        "type" : "square"
						    },
						    "modulationEnvelope" : {
						        "attack": 0.002,
						        "decay": 0.2,
						        "sustain": 0,
						        "release": 0.2
						    }
						}
					).toMaster();
				case 1:
					// Distorted
					return new Tone.PolySynth(12, Tone.FMSynth)
						.set(
						{
							"oscillator" : {
								"type" : "pwm",
								"modulationFrequency" : 0.2
							},
							"envelope" : {
								"attack" : 0.02,
								"decay" : 0.2,
								"sustain" : 0.1,
								"release" : 0.6,
							}
						}
					).toMaster();
			};
		},
		getRandomNote: function(seed) {
			var idx = Math.round(seed * intervals.length) + curIntervalIdx++;
			if (idx >= intervals.length)
				idx = idx % intervals.length;
			else if (idx < 0)
				idx = 0;
			return intervals[ idx ] + 60 - 36;
		}
	};
})();

export function Synth() {
	var synthIdx = 0,
		curIntervalIdx = 0,
		intervals = [ 0, 2, 4, 5, 7, 9, 11, 12 ];

	return {
		createNextSynth: function() {
			var synth;
			synthIdx = (synthIdx + 1) % 3;
			switch(synthIdx) {
				case 0:
					// House pump
					synth = new Tone.PolySynth(1, Tone.FMSynth)
						.set({
							"volume": 0,
							"detune": 0,
							"portamento": .5,
							"harmonicity": 1.5999999999999994,
							"oscillator": {
								"partialCount": 10,
								"partials": [
									1,
									1,
									1,
									1,
									1,
									1,
									1,
									1,
									1,
									1
								],
								"phase": -11,
								"type": "sine10"
							},
							"envelope": {
								"attack": 0.0010000000000000009,
								"attackCurve": "linear",
								"decay": 0.2,
								"decayCurve": "exponential",
								"release": 0.5,
								"releaseCurve": "exponential",
								"sustain": 1
							},
							"modulation": {
								"partialCount": 9,
								"partials": [
									0.8105694651603699,
									0,
									-0.09006327390670776,
									0,
									0.03242277726531029,
									0,
									-0.016542233526706696,
									0,
									0
								],
								"phase": 11,
								"type": "custom"
							},
							"modulationEnvelope": {
								"attack": 0.2,
								"attackCurve": "linear",
								"decay": 0.01,
								"decayCurve": "exponential",
								"release": 0.5,
								"releaseCurve": "exponential",
								"sustain": 1
							},
							"modulationIndex": 12.22
						}
					).toMaster();
					synth.volume.value = -10;
					return synth;
				case 2:
					// Kalimba
					synth = new Tone.PolySynth(4, Tone.FMSynth)
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
					synth.volume.value = -2;
					return synth;
				case 1:
					// Distorted
					synth = new Tone.PolySynth(12, Tone.FMSynth)
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
					synth.volume.value = -15;
					return synth;
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
};

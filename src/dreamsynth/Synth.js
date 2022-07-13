export function Synth() {
	var synthIdx = 0,
		curIntervalIdx = 0,
		// See https://www.guitarscale.org/f-aeolian.html
		// Minor?
		// intervals = [ 0, 2, 4, 5, 7, 9, 11, 12 ];
		// Dorian:       2, 1, 2, 2, 2, 1, 2
		// intervals = [ 0, 2, 3, 5, 7, 9, 10, 12 ];
		// Aeolian:      2, 1, 2, 2, 2, 1, 2
		intervals = [ 0, 2, 3, 5, 7, 9, 10, 12 ];
	
	// const ROOT_NOTE = 60; // C
	// const ROOT_NOTE = 64; // E
	const ROOT_NOTE = 65; // F

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
							"detune": 100 * 12 * - 3, // drop this one 3 octaves
							"portamento": 0,
							//"harmonicity": 1.5999999999999994,
							"envelope": {
								"attack": 1.005,
								"attackCurve": "linear",
								"decay": 0.1,
								"decayCurve": "exponential",
								"release": 1,
								"releaseCurve": "exponential",
								"sustain": 0.3
							},
							"oscillator": {
								"partialCount": 3,
								"partials": [
									0.31640625,
									0.0007716049382716042,
									0.019775390625
								],
								"phase": 0,
								"type": "custom"
							}
						}
					).toMaster();
					synth.volume.value = -14;
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
					// Softie
					synth = new Tone.PolySynth(2, Tone.AMSynth)
						.set(
							{
								"volume": 0,
								"detune": 0,
								"portamento": 0,
								"harmonicity": 0.5,
								"oscillator": {
									"partialCount": 3,
									"partials": [
										0.6366197723675814,
										-0.3183098861837907,
										0.2122065907891938
									],
									"phase": 0,
									"type": "fatsawtooth3",
									"count": 3,
									"spread": 20
								},
								"envelope": {
									"attack": 0.1,
									"attackCurve": "linear",
									"decay": 0.3,
									"decayCurve": "exponential",
									"release": 1.3,
									"releaseCurve": "exponential",
									"sustain": 0.2
								},
								"modulation": {
									"partialCount": 4,
									"partials": [
										0.019775390625,
										0.001883801118827162,
										1,
										1
									],
									"phase": 0,
									"type": "custom"
								},
								"modulationEnvelope": {
									"attack": 3.5,
									"attackCurve": "linear",
									"decay": 0.01,
									"decayCurve": "exponential",
									"release": 7.5,
									"releaseCurve": "exponential",
									"sustain": 1
								}
							}
					).toMaster();
					synth.volume.value = -5;
					return synth;
			};
		},
		getRandomNote: function(seed) {
			var idx = Math.round(seed * intervals.length) + curIntervalIdx++;
			if (idx >= intervals.length)
				idx = idx % intervals.length;
			else if (idx < 0)
				idx = 0;
			return intervals[ idx ] + ROOT_NOTE - 36;
		}
	};
};

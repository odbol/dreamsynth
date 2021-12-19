var PALETTES = [

	[
		'#C0DC47',
		'#D5DF68',
		// '#E8EADC',
		'#315220',
		'#819F37'
	], // odbol - spider

	[
		//'#D5B877', 
		// '#432A29',
		 '#82231B',
		 '#E27546',
		 '#AA5335'
	], // red room
	[
		'#C869FA', 
		'#7F2EF6', 
		// '#060824', 
		'#2415AB', 
		// '#0E086B'
	], // odbol jellyfish
	// [
	// 	'#F5E320',
	// 	'#42A4ED',
	// 	// '#323251',
	// 	'#AAA5CA',
	// 	// '#997C65'
	// ], // van gogh - sower
	[
		'#83CDBE',
		// '#5A3529',
		'#B8DBCD',
		// '#212D2B',
		// '#836A54'
	], // odbol - machinations

	[	
		'#74CCE4',
	 	// '#343B34',
	 	// '#CEC0AD',
	 	'#2095CB',
	 	'#CD1F10'
 	], // ken
	// ['#6F889B', '#BFD5EC', '#35451E', '#7D4E13', '#B87E1A'], // boris
	[//'#051931', 
		'#2D4B76',
		'#859AD0',
		// '#BCB5D7',
		'#5272AA'
	], // iceland sunset

	[
		'#FBEEB1',
		'#ECBF74',
		'#EECB99',
		// '#D49D3D',
		'#E2B059'
	] // bowher
];
var paletteIdx = 0;
export const palette = {
	togglePalette: function () {
		paletteIdx = (paletteIdx + 1) % PALETTES.length;
	},
	getNextColor: function (alpha) {
		var curPalette = PALETTES[paletteIdx];
		return curPalette[Math.floor(fxrand() * curPalette.length)];
	}
};
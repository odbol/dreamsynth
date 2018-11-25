var Loops = function(urls, onLoaded, onProgress) {
	this.players = new Tone.Players(urls, onLoaded)
		.toMaster();
};

Loops.prototype.startAll = function() {
	this.players._forEach(function(player, name) {
		player.loop = true;

		player.sync().start(0);
	});

	Tone.Transport.start();
};
Loops.prototype.mute = function(sampleName, isMuted) {
	this.players.get(sampleName).mute = isMuted;
};




var loops = new Loops({
		'bell' : 'samples/bell.m4a',
		'chords' : 'samples/chords.m4a',
		'latin' : 'samples/latin.m4a',
		'pad' : 'samples/pad.m4a',
		'techno' : 'samples/techno.m4a'
	},
	function () {
		debugPrint('All samples loaded');
		loops.startAll();
	},
	function (sampleName) {
		debugPrint('Loaded sample ' + sampleName);
	});


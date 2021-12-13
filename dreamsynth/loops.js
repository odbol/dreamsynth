var Loops = function(loopFiles, onLoaded, onProgress) {
	this.loopFiles = loopFiles;
	var urls = {};
	for (var name in loopFiles) {
		urls[name] = loopFiles[name].url;
	}

	this.players = new Tone.Players(urls, onLoaded)
		.toMaster();
};

Loops.prototype.startAll = function() {
	var self = this;
	this.players._forEach(function(player, name) {
		var volume = self.loopFiles[name].volume;
		if (typeof(volume) != 'undefined') {
			player.volume.value = volume;
		}
		player.loop = true;

		player.sync().start(0);
	});

	Tone.Transport.start();
};
Loops.prototype.mute = function(sampleName, isMuted) {
	this.players.get(sampleName).mute = isMuted;
};
Loops.prototype.getByIndex = function(sampleIndex) {
	var i = 0;
	for(var name in this.players._players) {
		if (i++ == sampleIndex) {
			var player = this.players.get(name);
			return player;
		}
	}
	return false;
};
Loops.prototype.toggle = function(sampleIndex) {
	var player = this.getByIndex(sampleIndex);
	player.mute = !player.mute;
};

var MODEL_ROTATION = 10;



var onLoaderError = function(err) {
	console.error('Error loading model: ', err);
};

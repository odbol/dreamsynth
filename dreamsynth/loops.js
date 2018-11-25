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




var loopFiles = {
		'bell' : 'samples/bell.m4a',
		'chords' : 'samples/chords.m4a',
		'latin' : 'samples/latin.m4a',
		'pad' : 'samples/pad.m4a',
		'techno' : 'samples/techno.m4a'
	},
	loops = new Loops(loopFiles,
		function () {
			debugPrint('All samples loaded');

			for (var name in loopFiles) {
				loops.mute(name, name !== 'pad');
			}

			loops.startAll();
		},
		function (sampleName) {
			debugPrint('Loaded sample ' + sampleName);
		});


var onLoaderError = function(err) {
	console.error('Error loading model: ', err);
};

var Boat = function (radius) {
	this.radius = radius;
	this.orbit = 0;
};

Boat.prototype.load = function(path, objFile, mtlFile) {
	var self = this;
	return new Promise(function (resolve, reject) 
	    {
	        var mtlLoader = new THREE.MTLLoader();
	        // mtlLoader.crossOrigin = true;
	        mtlLoader.setPath(path);
	        mtlLoader.load(mtlFile, function (materials) 
	        {           
	            materials.preload();
	            var objLoader = new THREE.OBJLoader();
	                objLoader.setPath(path);

	                objLoader.setMaterials(materials);
	                objLoader.load(objFile, function (obj) 
	                {   
	                    self.obj = obj;
	                    resolve(self);
	                }, null, onLoaderError);
	        }, null, onLoaderError);
	    });
};

Boat.prototype.update = function() {
	this.orbit += 0.002;
	this.obj.position.y = this.y;
	this.obj.position.x = Math.sin(this.orbit) * this.radius;
	this.obj.position.z = Math.cos(this.orbit) * this.radius;
};


var Boats = function(scene, loops, modelFiles) {
	var self = this;
	self.models = [];
	modelFiles.forEach(function(boatFile, i) {
		var boat = new Boat(i * 120);
		boat.load(encodeURI(boatFile.assetPath + '/'), encodeURI(boatFile.objFile), encodeURI(boatFile.mtlFile))
			.then(function(boat) {
				if (boatFile.scale) {
					boat.obj.scale.x = boatFile.scale;
					boat.obj.scale.y = boatFile.scale;
					boat.obj.scale.z = boatFile.scale;
				}
				boat.y = boatFile.y || 0;

				boat.update();
				scene.add(boat.obj);
				self.models.push(boat);
			});
	});
};

Boats.prototype.update = function() {
	this.models.forEach(function (model) {
		model.update();
	});
};


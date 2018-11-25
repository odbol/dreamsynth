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

var MODEL_ROTATION = 10;


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

var Boat = function (radius, rotation) {
	this.radius = radius;
	this.rotation = (rotation || 0) * (Math.PI / 4);
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
	if (this.radius > 0) {
		// Stagger using radius as a proxy index
		this.obj.position.x = Math.sin(this.orbit + this.radius * this.radius) * this.radius;
		this.obj.position.z = Math.cos(this.orbit + this.radius * this.radius) * this.radius;

		this.obj.lookAt(0,0,0);
		this.obj.rotateY(this.rotation); 
		// this.obj.rotateY(MODEL_ROTATION * (Math.PI / 4)); 
	}
};


Boat.prototype.onClick = function() {

};

Boat.prototype.onMouseOver = function() {
	var model = this;
	if (model.obj.children[0].material.forEach) {
		model.obj.children[0].material.forEach(function(child) {
			child.emissive.setHex( 0x880000 );
			// glowMaterial(child);//
		});
	} else {
		model.obj.children[0].material.emissive.setHex( 0x880000 );
		// glowMaterial(model.obj.children[0].material);
	}
};

Boat.prototype.onMouseOut = function() {

};

var Boats = function(scene, loops, modelFiles) {
	var self = this;
	self.models = [];
	modelFiles.forEach(function(boatFile, i) {
		var boat = new Boat(i * 120, boatFile.rotation);
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


Boats.prototype.checkMouse = function(raycaster, isClick) {
	this.models.forEach(function (model) {
		if (raycaster.intersectObject(model.obj, true).length > 0) {
			if (isClick) {
				model.onClick();
			} else {
				model.onMouseOver();
			}
		} else {
			model.onMouseOut();
		}
	});
};

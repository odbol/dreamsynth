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
Loops.prototype.toggle = function(sampleIndex) {
	var i = 0;
	for(var name in this.players._players) {
		if (i++ == sampleIndex) {
			var player = this.players.get(name);
			player.mute = !player.mute;
		}
	}
};

var MODEL_ROTATION = 10;


var loopFiles = {
		'pad' : 'samples/pad.m4a',
		'bell' : 'samples/bell.m4a',
		'chords' : 'samples/chords.m4a',
		'latin' : 'samples/latin.m4a',
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

var Boat = function (radius, rotation, onClick) {
	this.radius = radius;
	this.rotation = (rotation || 0) * (Math.PI / 4);
	this.orbit = 0;
	this.onClickCallback = onClick;
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

function setEmissiveColor(model, color) {
	if (model.obj.children[0].material.forEach) {
		model.obj.children[0].material.forEach(function(child) {
			child.emissive.setHex( color );
			// glowMaterial(child);//
		});
	} else {
		model.obj.children[0].material.emissive.setHex( color );
		// glowMaterial(model.obj.children[0].material);
	}
}

Boat.prototype.onClick = function() {
	this.onClickCallback && this.onClickCallback();
};

Boat.prototype.onMouseOver = function() {
	setEmissiveColor(this, 0x880000);
};

Boat.prototype.onMouseOut = function() {
	setEmissiveColor(this, 0x000000);
};


/**
 * Rotates the boatates and controls the loops when you click on them.
 * @param {Scene3d} scene      
 * @param {Loops} loops      the loops that correspond with the modelFiles
 * @param {Array} modelFiles Array of model file descriptions.
 */
var Boats = function(scene, loops, modelFiles) {
	var self = this;
	self.models = [];
	modelFiles.forEach(function(boatFile, i) {
		var boat = new Boat(i * 120, boatFile.rotation, function() {
			loops.toggle(i);
		});
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
			model.onMouseOver();
			if (isClick) {
				model.onClick();
			}
		} else {
			model.onMouseOut();
		}
	});
};

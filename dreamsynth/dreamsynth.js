
 // var getProbabilityOfLetter = function(letter) {
	//  if (letter > 97) //lowercase: make uppercase
	//  letter -= 32;
	//  return fxrand() + Math.max(Math.min((letter - 32.0) / (97.0 - 32.0), 1.0), 0);
 // }
 


var Tweets = (function() { 
	var tweets = [
		"\"You can lead a horse to bathwater, but you can't throw the baby out the window!\" #crossoquialism",
		"I love being on BART and seeing two deaf people converse. Is that weird? Man, I wish I knew ASL.",
		"AAAAABBBBB BBBaaaaaaaBBAAAAAA",
		"AAAAAA AA bb AAAA AAAbbbAAA AA A A AA AAAA AAcccAAA",
		"I like how \"screwed it\" is the opposite of \"nailed it.\" Oh, English language, how you make me giggle in the middle of the night.",
		"\"My pants have conflagrated but that does not make me a dissembler.\" Play this #androp_bell music video game! So cool! http://www.androp.jp/bell/?3rRhHmJT",
		"Thing about avant-garde concerts is they sneak up on you: no idea a saxophone could make those sounds! Like a didgeridoo full of bees!",
		"In the words of Dr. Dre, DDS: \"I floss teeth everyday.\" #dentalrap"
	];

	var curTweet = 0;
	var Tweets = function(tweetOffset) {
		curTweet = tweetOffset % tweets.length;
	}

	Tweets.numTweets = tweets.length;

	Tweets.prototype.getCurProbability = function(offset) {
		return getProbabilityOfLetter(this.getCurLetter(offset));
	}

	


	Tweets.prototype.getCurLetter = function(offset) {
		var idx;
		if (offset > 0)
			idx = (tweetIdx + offset) % tweets[curTweet].length;
		else 
			idx = tweetIdx;
		return tweets[curTweet][idx];
	}

	Tweets.prototype.incrementLetter = function() {
		tweetIdx = (tweetIdx + 1) % tweets[curTweet].length;
	}

	Tweets.prototype.nextTweet = function() {
		curTweet = (curTweet + 1) % tweets.length;
		tweetIdx = 0;
	}

	return Tweets;
})();






var ofRandom = function (max) {
	return fxrand() * max;
}

var ofDegToRad = function (degrees) {
	return degrees * 3.14 / 180;
}



var TWEET_TREE_Y = 50;
var SLATE_HEIGHT = 2;

var MIN_BOX_SIZE = 10.0;
var MAX_BOX_SIZE = 89.0;

var FRACTAL_BOX_MARGIN = 2;

var OFFSET_SIZE = 0;//5.0f;
var BRANCH_LENGTH = 1.0;

var screenBounds = {
	width: 500,
	height: 500
};



var TreeLeaf = function() {

};


var leaves = [];
var TweetTree = function () {

	this.dotSize = MAX_BOX_SIZE;
	this.angleOffsetA = ofDegToRad(1.5);
	this.angleOffsetB = ofDegToRad(50);

	this.group = new THREE.Group();
};

TweetTree.prototype.setup = function(tweetIdx, synth) {
	this.depth = tweetIdx;
	this.tweets = new Tweets(tweetIdx);

	this.synth = synth;
};

TweetTree.prototype.seed1 = function(dotSize, angle, x, y, branchLevel, prob, offset){

	if (!(prob >= 0)) 
		prob = 0.52;

	if (!(offset >= 0)) offset = 0;

	//cout << "seed " << x << ", " << y << endl;
	if(dotSize > MIN_BOX_SIZE && 
		(branchLevel < 0 || 
		 ((branchLevel >= 0 && branchLevel < 3) && (x > -100 && x < screenBounds.width && y < 100 & y > -screenBounds.height)))){//WTF doesn't y work???? //screenBounds.inside(x, -y)){
		
		this.tweets.incrementLetter();
		
		var r = fxrand();
		
		var xOff = 0;//ofRandom(-OFFSET_SIZE, OFFSET_SIZE);
		var yOff = 0;//ofRandom(-OFFSET_SIZE, OFFSET_SIZE);
		var w = dotSize + xOff;
		var h = dotSize + yOff;
		
		//ofSetColor(palette.getNextColor(156));
		
		//ofRect(x - xOff, y - yOff, w, h);
		this.fractalBox(x - xOff, y - yOff, w, h, 0);
		//makeBox(x - xOff, y - yOff, w, h);
		
		var newDotSize = dotSize * 0.99;
		
		if (branchLevel == -1 && newDotSize <= MAX_BOX_SIZE) {
			//save the leaves so we can attach things to them later
			var l = new TreeLeaf();
			l.x = x;
			l.y = y;
			leaves.push(l);
			// cout << "added leaf " << l.x << ", " << l.y << endl;
			
		}
		else {
			//if(r > prob){
			if(this.tweets.getCurLetter() != ' ' || r > prob) {
				//ofCircle(x, y, dotSize);
				var newx = x + Math.cos(angle) * dotSize;
				var newy = y + Math.sin(angle) * dotSize;
				this.seed1(newDotSize, angle - this.angleOffsetA, newx, newy, branchLevel, prob, offset + 1);
			}
			else {
				var newx = x + Math.cos(angle);
				var newy = y + Math.sin(angle);
				
				var newProb = prob - 0.05;//0.05;
				//if (newProb == prob)
				//	newProb = 0.02;
				
				this.seed1(newDotSize, angle + this.angleOffsetA, newx, newy, branchLevel, newProb, offset + 1);
				this.seed1(dotSize * 0.6 * BRANCH_LENGTH, angle + this.angleOffsetB, newx, newy, branchLevel + 1, prob, offset + 1);
				this.seed1(dotSize * 0.5 * BRANCH_LENGTH, angle - this.angleOffsetB, newx, newy, branchLevel + 1, newProb, offset + 1);
			}
		}
	}
}

TweetTree.prototype.fractalBox = function(x, y, w, h, offset, probabilityOfSplit, c) {	
	if (w < MIN_BOX_SIZE || h < MIN_BOX_SIZE)
		return;
	
	if (!c) { //start of new fractal
		c = palette.getNextColor(166);
	}

	if (!(probabilityOfSplit >= 0)) 
		probabilityOfSplit = 0.4;
	
	//var prob = 0.4;
	
	var r = ofRandom(this.tweets.getCurProbability());
	if(r > probabilityOfSplit){
		this.makeBox(x + FRACTAL_BOX_MARGIN, y + FRACTAL_BOX_MARGIN, w - FRACTAL_BOX_MARGIN*2, h - FRACTAL_BOX_MARGIN *2, offset, c);
	}
	else {
		var numSplit = (ofRandom(3) + 1.0);
		for (i = 0; i < numSplit; i++) {
			var newW = w / numSplit;
			var newX = x + (newW * i);
			
			var ySplit = (ofRandom(3) + 1.0);
			var newH = h / ySplit;
			for (j = 0; j < ySplit; j++) {
				var newY = y + (newH * j);
				
				this.fractalBox(newX, newY, newW, newH, offset++, probabilityOfSplit * 0.06, c);
			}
		}
	}
}

var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );

TweetTree.prototype.makeBox = function(x, y, w, h, offset, c) {	
	var self = this;
	// var material = new THREE.MeshLambertMaterial( { color: c } );
	var material = new THREE.MeshPhysicalMaterial( {
					map: null,
					color: c,
					metalness: 1.0,
					roughness: 0.6,
					opacity: 0.75,
					side: THREE.FrontSide,
					transparent: true,
					envMapIntensity: 5,
					premultipliedAlpha: true
					// TODO: Add custom blend mode that modulates background color by this materials color.
				} );
	// material.transparent = true;
	// material.opacity = 0.75;

	var object = new THREE.Mesh( geometry, material );

	// YES, the z and y are swapped: to make it horizontal to the ocean.
	object.position.x = x;
	object.position.z = y;
	object.position.y = TWEET_TREE_Y + (50 * this.depth) + (offset * SLATE_HEIGHT);

	object.scale.x = w;
	object.scale.z = h;
	object.scale.y = SLATE_HEIGHT;//fxrand() + 0.5;

	
	//notes!
	//var interval = (( rect.color.g + rect.color.b ) / (255.0 * 2.0))  ); //interval is based on color
	var interval = getProbabilityOfLetter(this.tweets.getCurLetter(offset));
	// rect.note = synth.getRandomNote( interval  ); 
	var note = Synth.getRandomNote(interval);
	var octave = Math.round(((1.0 - (w * h) / (this.dotSize * this.dotSize)) * 3.0)) * 12; //change octave based on size
	note += octave;
	var freq = Tone.Frequency(note, "midi");

	var tween,
		shake = function () {
			if (tween) {
				tween.stop();
				object.position.x = x;
			}
			tween = new TWEEN.Tween(object.position)
				.to({ x: object.position.x - 6 }, 130, TWEEN.Easing.Elastic.InOut)
				.repeat(2)
				.yoyo()
				.start();
			
		};

	object.noteOn = function() {
		debugPrint("noteOn " + freq, note);
		shake();
		self.synth.triggerAttackRelease(freq, "1n");
	};
	object.noteOff = function() {
		debugPrint("noteoff ");
		self.synth.triggerRelease();
	};

	debugPrint("makeBox ", x, y, w, h, offset, c, octave);

	self.group.add(object); // add to the THREE.js group
	self.slates.push(object);
}


TweetTree.prototype.killAll = function() {

	this.slates = [];
	this.leaves = [];

// 	//for (i=0; i < boxes.size(); i++) {  
// 	vector<GlowBox*>_iterator it;
// 	for ( it=boxes.begin() ; it < boxes.end(); it++ ) {
// 		//ofPovar tmppos = it.getPosition();//boxes[i].getPosition();  
// 		(*it).destroy();
// 		delete (*it);
		
// 	} 
// 	boxes.clear();
	
// 	for (vector<TreeLeaf>_iterator it = leaves.begin() ; it < leaves.end(); it++ ) { 
// 		if (it.child == NULL)
// 			break;
// 		delete it.child;
// 	} 
// 	leaves.clear();
}


TweetTree.prototype.rebuild = function(branchLevel) {
	palette.togglePalette();
	
	this.tweets.nextTweet();
	
	// synth.toggleScale(this.tweets.this.tweets[this.tweets.curTweet].length);
	// synth.keyNote = (this.tweets.this.tweets[this.tweets.curTweet].length % 50) + 30;
	
	// //scramble instrument
	// synth.reset();
	// synth.vals.setVCO1Type(this.tweets.getCurProbability());
	// synth.vals.setVCO2Type(this.tweets.getCurProbability(2));
	
	
	//isDrawNew = true;
	this.killAll();
	
	
	//build a new tree
	// ofSeedRandom(4574678655 * this.tweets.getCurLetter());
	
	this.seed1(this.dotSize, ofDegToRad(270), 0, 0, branchLevel);//ofGetWidth()/2, ofGetHeight(), -3);
	 
	//isDrawNew = false;
	//OFFSET_SIZE += 1.f;
	curBoxIdx = 0;
	

	if (branchLevel < 0) {
		var maxLeaves = Math.min(leaves.length, this.tweets.numTweets - 1);
		for (var i = 0; i < maxLeaves; i++) {
			this.leaves[i].child = new TweetTree();
			this.leaves[i].child.setup(i + 1, this.synth);
			
			this.leaves[i].child.rebuild(1);
		} 
	}
}








var leaves;

var killAll = function () {
	leaves = [];
}

var curBoxIdx = 0;
var Hill_rebuild = function(branchLevel) {
	//isDrawNew = true;
	killAll();
	
	
	
	//isDrawNew = false;
	//OFFSET_SIZE += 1.f;
	curBoxIdx = 0;
	
	var depth = 20000.0;
	
	var x = 0, y = 0;
	
	var maxLeaves = 3;//Tweets.numTweets;
	for ( var i = 0; i < maxLeaves; i++) {
		var synth = Synth.createNextSynth();

		//if(tweets.getCurLetter() != ' ' || r > prob) {
			//ofCircle(x, y, dotSize);
		//	var newx = x + Math.cos(angle) * dotSize;
		//	var newy = y + Math.sin(angle) * dotSize;
		//	seed1(newDotSize, angle - angleOffsetA, newx, newy, branchLevel, prob);
		//}
		
		y -= (depth / maxLeaves);
		//x = ofRandom(-1600, 1600);
		x = Math.sin((i / maxLeaves) * 3.14 * 2.0) * 1000.0;
		
		var z = Math.sin((i / maxLeaves) * 3.14) * 100.0;
		
		
		//save the leaves so we can attach things to them later
		var l = new TreeLeaf();
		l.x = x;
		l.y = y;

		
		l.child = new TweetTree();
		l.child.setup(i, synth);
		
		l.child.rebuild(1);

		l.child.group.rotateY(i * 90);
		
		leaves.push(l);
	} 

	return leaves;
}


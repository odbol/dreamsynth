/* to calulate:
 
 var letters = [
 {letter: 'e', freq: 0.12702 		},
 {letter: 't', freq: 0.09056 	},
 {letter: 'a', freq: 0.08167 		},
 {letter: 'o', freq: 0.07507 		},
 {letter: 'i', freq: 0.06966 	},
 {letter: 'n', freq: 0.06749 	},
 {letter: 's', freq: 0.06327 		},
 {letter: 'h', freq: 0.06094 	},
 {letter: 'r', freq: 0.05987 		},
 {letter: 'd', freq: 0.04253 		},
 {letter: 'l', freq: 0.04025 	},
 {letter: 'c', freq: 0.02782 	},
 {letter: 'u', freq: 0.02758 	},
 {letter: 'm', freq: 0.02406 },
 {letter: 'w', freq: 0.02360},
 {letter: 'f', freq: 0.02228 },
 {letter: 'g', freq: 0.02015 },
 {letter: 'y', freq: 0.01974},
 {letter: 'p', freq: 0.01929},
 {letter: 'b', freq: 0.01492 },
 {letter: 'v', freq: 0.00978},
 {letter: 'k', freq: 0.00772 },
 {letter: 'j', freq: 0.00153 },
 {letter: 'x', freq: 0.00150},
 {letter: 'q', freq: 0.00095},
 {letter: 'z', freq: 0.00074}
 ]
 
 var redist = [];
 while (letters.length > 0) {
	 redist.push(letters.pop());
	if (letters.length > 0)
	 redist.push(letters.shift());
	if (letters.length > 0)
	 redist.push(letters.pop())
 }
 
 for (i in redist) {
	console.log("'" + redist[i].letter + "',");
 }
 
 //arrange array so it's accessible by letter
 for (var i in redist) {
	redist[i].prob = i;
 }
 
 redist.sort(function(a,b) {
	if (a.letter < b.letter)
		return -1;
	if (a.letter > b.letter)
		return 1;
	
	return 0;
 });
 

 for (i in redist) {
	console.log("" + redist[i].prob + ", //" + redist[i].letter);
 } 
 
 */
var letterDist = [
	7, //a
	9, //b
	21, //c
	24, //d
	1, //e
	15, //f
	14, //g
	22, //h
	13, //i
	5, //j
	6, //k
	23, //l
	18, //m
	16, //n
	10, //o
	11, //p
	2, //q
	25, //r
	19, //s
	4, //t
	20, //u
	8, //v
	17, //w
	3, //x
	12, //y
	0 //z
];


var getProbabilityOfLetter = function(letter) {
	letter = letter.charCodeAt(0);
	if (letter > 97) //lowercase: make uppercase
		letter -= 32;
	
	var letterIdx = letter - 65; //get to 0 index for array
	if (letterIdx >= 0 && letterIdx < 26) {
		return letterDist[letterIdx] / 25.0;
	}
	
	return Math.max(Math.min((letterIdx) / (26.0), 1.), 0);
}
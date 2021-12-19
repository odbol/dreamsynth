import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import {BLOOM_SCENE, Bloom} from './dreamsynth/Bloom.js';

import {Hill_rebuild} from "./dreamsynth/dreamsynth.js";
import {Mountains} from "./dreamsynth/Mountains.js";
// import {Grid} from "./dreamsynth/Grid.js";
import {Loops} from "./dreamsynth/loops.js";
// import {Floor} from "./dreamsynth/Floor.js";
// import "./dreamsynth/Ocean.js";
import {incrementLoadingItems, decrementLoadingItems, addOnStartedListener } from "./dreamsynth/Ui.js";


var params = {
    // MIN_BOX_SIZE : MIN_BOX_SIZE,
    // MAX_BOX_SIZE : MAX_BOX_SIZE,

    // FRACTAL_BOX_MARGIN : FRACTAL_BOX_MARGIN,

    // OFFSET_SIZE : OFFSET_SIZE,
    // BRANCH_LENGTH : BRANCH_LENGTH,

    // TWEET_TREE_Y: TWEET_TREE_Y,

    // MODEL_ROTATION: MODEL_ROTATION,

    //showHelpers: false,
    cameraX: -885, 
    cameraY: 635,
    cameraZ: 298,

    
    mountainsX: 0,
    mountainsY: -300,
    mountainsZ: -220,
    mountainsRotateZ: 0,
    mountainsRotateY: 0,
    mountainsRotateX: 0
};


var ocean;

var bloom;

var mountains;

var container, stats, controls;
var camera, scene, raycaster, renderer;

var mouse = new THREE.Vector2(-500, -500), INTERSECTED;
var radius = 100, theta = 0;

var trees = [];

init();
animate();

function rebuild() {
    for ( var j = 0; j < trees.length; j++) {
        var tree = trees[j].child;
        scene.remove(tree.group);
    }
    trees = Hill_rebuild(0);
    for ( var j = 0; j < trees.length; j++) {
        var tree = trees[j].child;
        scene.add( tree.group );
    }
}

function init() {

    container = document.getElementById( 'container' );


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( params.cameraX, params.cameraY, params.cameraZ );
        // 
    scene = new THREE.Scene();

    bloom = Bloom(scene, camera, renderer);

    // ocean = Ocean(renderer, scene, camera);
    // ocean = Floor(renderer, scene, camera);
    // var grid = new Grid(scene);
    mountains = new Mountains();
    mountains.position.z = params.mountainsZ;
    mountains.position.y = params.mountainsY;
    mountains.position.x = params.mountainsX;
    // mountains.layers.enable( BLOOM_SCENE );
    scene.add( mountains );


    raycaster = new THREE.Raycaster();


    if (DEBUG) {
        stats = new Stats();
        container.appendChild( stats.dom );

        // var ambientLight = new THREE.AmbientLight('#fff');
        // scene.add(ambientLight);
    }

    controls = new OrbitControls( camera, renderer.domElement );	
    // controls.autoRotate = true;
    // 				controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    // controls.dampingFactor = 0.25;
    // controls.screenSpacePanning = false;
    // controls.minDistance = 100;
    // controls.maxDistance = 500;
    // controls.maxPolarAngle = Math.PI / 2;

    // controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 10, 0 );
    controls.minDistance = 40.0;
    controls.maxDistance = 2000.0;
    camera.lookAt( controls.target );

    scene.background = new THREE.Color( 0x000000 );


    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );

    var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );

    initBoats();

    rebuild();

    initKeyboardControl();

    addOnStartedListener(function() {
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'touchstart', onDocumentMouseMove, false );
        document.addEventListener( 'touchmove', onDocumentMouseMove, false );
        document.addEventListener( 'touchend', onDocumentTouchEnd, false );
        document.addEventListener( 'click', onDocumentMouseClick, false );
    });

    //

    window.addEventListener( 'resize', onWindowResize, false );

    if (DEBUG) {
        initGui();
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {
    // debugPrint("onDocumentMouseMove ", event);
        
    var clientX, clientY;
    if (event.touches) {
        // event.preventDefault();
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        event.preventDefault();

        clientX = event.clientX;
        clientY = event.clientY;
    }
    

    mouse.x = ( clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( clientY / window.innerHeight ) * 2 + 1;

}

var clickedMouse;
function onDocumentMouseClick(event) {
    clickedMouse = mouse;
}

function onDocumentTouchEnd( event ) {
    clickedMouse = mouse;

    mouse.x = -200;
    mouse.y = -200;
}

//

function animate() {

    requestAnimationFrame( animate );

    ocean && ocean.update();

    TWEEN.update();

    render();
    stats && stats.update();

}

function onMouseOverSlate(INTERSECTED) {
    glowMaterial(INTERSECTED.material);

    INTERSECTED.noteOn();

    debugPrint("box: ", INTERSECTED.position);
}

function onMouseOutSlate(INTERSECTED) {
    if ( INTERSECTED ) {
        unglowMaterial(INTERSECTED.material);

        INTERSECTED.noteOff();
    }
}

function render() {

    theta += 0.1;

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    // camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
    // camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
    // camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
    // camera.lookAt( scene.position );

    camera.updateMatrixWorld();

    // find intersections

    raycaster.setFromCamera( mouse, camera );

    var intersects;
    for ( var j = 0; j < trees.length; j++) {
        var tree = trees[j].child;
        intersects = raycaster.intersectObjects( tree.slates );
        if ( intersects.length > 0 ) {
            break;
        }
    }

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            onMouseOutSlate( INTERSECTED );

            INTERSECTED = intersects[ 0 ].object;
            
            onMouseOverSlate( INTERSECTED );
        }

    } else {

        onMouseOutSlate( INTERSECTED );

        INTERSECTED = null;

    }

    if (clickedMouse) {
        raycaster.setFromCamera(clickedMouse, camera);
    }
    clickedMouse = false;

    // renderer.render( scene, camera );
    bloom.render();

}


function initBoats() {
    incrementLoadingItems();

    var loopFiles = {
            'pad' : {
                url: 'samples/pad.m4a'
            },
            'bell' : {
                url: 'samples/bell.m4a'
            },
            'chords' : {
                url: 'samples/chords.m4a'
            },
            'latin' : {
                url: 'samples/latin.m4a',
                volume: -16
            },
            'techno' : {
                url: 'samples/techno.m4a',
                volume: -10
            }
        },
        loops = new Loops(loopFiles,
            function () {
                debugPrint('All samples loaded');

                loops.startAll();

                // must mute AFTER starting because that's when volumes are adjusted.
                // TODO(fxhash): init loops as feature!
                for (var name in loopFiles) {
                    loops.mute(name, name !== 'pad');
                }
                decrementLoadingItems();
            },
            function (sampleName) {
                debugPrint('Loaded sample ' + sampleName);
            });
}

function initKeyboardControl() {
    var SLATES_KEYCODE_START = 65; // 'a'
    var SLATES_KEYCODE_END = 90; // 'z'

    var makeSlateKeyboardCallback = function(tree, i) {
        return function () {
            var obj = tree.slates[i];
            onMouseOverSlate(obj);
            setTimeout(function () { onMouseOutSlate(obj);}, 400);
        };
    };
    var keysPerTree = Math.floor((SLATES_KEYCODE_END - SLATES_KEYCODE_START) / trees.length);

    // TODO: this is not terribly efficient since it has to make a new callback function for every key.
    for ( var j = 0; j < trees.length; j++) {
        var tree = trees[j].child;
        for (var i = 0; i < tree.slates.length && i < keysPerTree; i++ ) {
            var keycode = SLATES_KEYCODE_START + j * keysPerTree + i;
            //debugPrint('makeSlateKeyboardCallback ' + tree.slates[i] + " " + i + " " + keycode);
            a11y.addKeyboardShortcut(keycode, makeSlateKeyboardCallback(tree, i));
        }
    }
}

function initGui() {
    // Sometimes I love javascript. this fuckery would get any other programming language fired.
    var gui = new dat.GUI();
    
    Object.keys(params).forEach(function(key, el) {
        var curValue = window[key];
        if (typeof(curValue) != 'undefined') {
            // it's a global var, alter it
            if (curValue == 0) curValue = 1;

            gui.add( params, key, curValue - curValue * 4, curValue + curValue * 4 )
                .step( curValue / 16 ).name( key )
                .onChange( function ( value ) {
                
                window[key] = value;
                rebuild();
                render();
            } );

        } else {
            curValue = params[key];
            gui.add( params, key, curValue - Math.abs(curValue) * 4, curValue + Math.abs(curValue) * 4 )
                .step( 1 ).name( key )
                .onChange( function ( value ) {
                
                if (key.indexOf('camera') == 0) {

                    camera.position.set( params.cameraX, params.cameraY, params.cameraZ );
                    camera.lookAt( scene.position );
                    
                    render();
                } 
                // else if (key.indexOf('mountains') == 0) {

                //     mountains.position.set( params.mountainsX, params.mountainsY, params.mountainsZ );
                //     camera.lookAt( scene.position );
                    
                //     render();
                // }
            } );
        }
    });
    // gui.add( params, 'showHelpers' ).name( 'show helpers' ).onChange( function ( value ) {
        
    // 	render();
    // } );
    
    gui.add( params, 'mountainsX', -1000, 1000 ).onChange( function ( value ) {

        mountains.position.x = Number(value);
        render();

    } );
    gui.add( params, 'mountainsY', -1000, 1000 ).onChange( function ( value ) {

        mountains.position.y = Number(value);
        render();

    } );
    gui.add( params, 'mountainsZ', -1000, 1000 ).onChange( function ( value ) {

        mountains.position.z = Number(value);
        render();

    } );

    gui.add( params, 'mountainsRotateZ', -1/2*Math.PI, 1/2*Math.PI ).onChange( function ( value ) {

        mountains.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), Number(value));
        render();

    } );
    gui.add( params, 'mountainsRotateY', -1/2*Math.PI, 1/2*Math.PI ).onChange( function ( value ) {

        mountains.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), Number(value));
        render();

    } );
    gui.add( params, 'mountainsRotateX', -1/2*Math.PI, 1/2*Math.PI ).onChange( function ( value ) {

        mountains.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), Number(value));
        render();

    } );

}

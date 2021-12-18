import { RenderPass } from '../js/postprocessing/RenderPass.js';
import { ShaderPass } from '../js/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '../js/postprocessing/UnrealBloomPass.js';
	
export const ENTIRE_SCENE = 0;
export const BLOOM_SCENE = 1;

var bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );


var params = {
    exposure: 1.1,
    bloomStrength: 2.6,
    bloomThreshold: 0,
    bloomRadius: 0,
    scene: "Scene with Glow",
    cameraZ: 340,
    cameraY: 50,
    rangeStart: -43,
    rangeEnd: 200,
    speed: SPEED,


    distance: 400,
    inclination: 0.32,
    azimuth: 0.25,

    carZ: 170,
    carY: -12,
    carX: 0,

    mountainsX: 0,
    mountainsY: -15,
    mountainsZ: -220,
    mountainsRotateZ: 0,
    mountainsRotateY: 0,
    mountainsRotateX: 0,

    edgeThreshold: 0.99	
};

var darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );


var renderScene = new RenderPass( scene, camera );

var bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

var bloomComposer = new EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

var finalPass = new ShaderPass(
    new THREE.ShaderMaterial( {
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        defines: {}
    } ), "baseTexture"
);
finalPass.needsSwap = true;

var finalComposer = new EffectComposer( renderer );
finalComposer.addPass( renderScene );
finalComposer.addPass( finalPass );








function render() {

    switch ( params.scene ) {

        case 'Scene only':
            renderer.render( scene, camera );
            break;
        case 'Glow only':
            renderBloom( false );
            break;
        case 'Scene with Glow':
        default:
            // render scene with bloom
            renderBloom( true );

            // render the entire scene, then render bloom scene on top
            finalComposer.render();
            break;

    }

}

function renderBloom( mask ) {

    if ( mask === true ) {

        scene.traverse( darkenNonBloomed );
        bloomComposer.render();
        scene.traverse( restoreMaterial );

    } else {

        camera.layers.set( BLOOM_SCENE );
        bloomComposer.render();
        camera.layers.set( ENTIRE_SCENE );

    }

}

function darkenNonBloomed( obj ) {

    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;

    }

}

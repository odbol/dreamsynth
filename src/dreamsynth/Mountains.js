import * as THREE from 'three';

import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

const 	
        GRID_LENGTH = 20000;

var mountains;
export function Mountains() {
    var worldWidth = 64, worldDepth = 64,
        worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

    var data = generateHeight( worldWidth, worldDepth );
    var geometry = new THREE.PlaneBufferGeometry( GRID_LENGTH, GRID_LENGTH, worldWidth - 1, worldDepth / 4 - 1 );
    geometry.rotateX( -Math.PI / 2 );
    geometry.rotateY( -Math.PI );

    var vertices = geometry.attributes.position.array;

    var edge = worldWidth * 3;
    var numRows = vertices.length / worldWidth - 1;
    for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 /* skip to every y */ ) {

        // Determine row so we gently slope up from one edge (row 0).
        var row = Math.floor(j / edge);
        var slope = row / numRows;

        vertices[ j + 1 ] = ((data[ i ] * 3 + 1) / 2 * slope);

    }
// geometry = new THREE.IcosahedronBufferGeometry( 100, 4 )

    // TODO: figure out why wireframe material shader doesn't work on Planes.
    // mountains = new THREE.Mesh( geometry, createWireframeMaterial(geometry) );

    // workaround:
    mountains = new THREE.Group();
    var blackMountains = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x0 } ) );
    var wireMountains = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { wireframe:true, color: 0x0070ff } ) );
    wireMountains.position.z += 0.1;
    mountains.add(blackMountains);
    mountains.add(wireMountains);
   
    return mountains;
}

function generateHeight( width, height ) {

    var size = width * height, data = new Uint8Array( size ),
        perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 50 + 50;

    // debug("generateHeight z:" + z);
    for ( var j = 0; j < 4; j ++ ) {

        for ( var i = 0; i < size; i ++ ) {

            var x = i % width, y = ~ ~ ( i / width );
            data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 3.75 );

        }

        quality *= 5;

    }

    return data;

}



function createWireframeMaterial(geometry) {
    var uniforms = { 
        'widthFactor': { value: 1 },
        'edgeThreshold': { value: 0.99 } 
    };

    var material = new THREE.ShaderMaterial( {

        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShaderWireframe' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShaderWireframe' ).textContent,
        side: THREE.DoubleSide

    } );

    material.extensions.derivatives = true;

    geometry.removeAttribute( 'normal' );
    geometry.removeAttribute( 'uv' );

    setupWireframeAttributes( geometry );

    return material;
}

function setupWireframeAttributes( geometry ) {

    var vectors = [
        new THREE.Vector3( 1, 0, 0 ),
        new THREE.Vector3( 0, 1, 0 ),
        new THREE.Vector3( 0, 0, 1 )
    ];

    var position = geometry.attributes.position;
    var centers = new Float32Array( position.count * 3 );

    for ( var i = 0, l = position.count; i < l; i ++ ) {

        vectors[ i % 3 ].toArray( centers, i * 3 );

    }

    geometry.addAttribute( 'center', new THREE.BufferAttribute( centers, 3 ) );

}



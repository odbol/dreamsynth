import {PlaneBufferGeometry,
    IcosahedronBufferGeometry,
    Mesh,
    Group,
    MeshBasicMaterial,
    ShaderMaterial,
    DoubleSide,
    Vector3,
    BufferAttribute} from 'three';

import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

const 	
        GRID_LENGTH = 8000;

var mountains;
export function Mountains() {
    var worldWidth = 256, worldDepth = 512,
        worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

    var data = generateHeight( worldWidth, worldDepth );
    var geometry = new PlaneBufferGeometry( GRID_LENGTH, GRID_LENGTH, worldWidth - 1, worldDepth / 4 - 1 );
    geometry.rotateX( -Math.PI / 2 );
    geometry.rotateY( -Math.PI );

    var vertices = geometry.attributes.position.array;

    var edge = worldWidth * 3;
    var numRows = vertices.length / worldWidth - 1;
    for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 /* skip to every y */ ) {

        // Determine row so we gently slope up from one edge (row 0).
        var row = Math.floor(j / edge);
        var slope = 1;//row / numRows;

        vertices[ j + 1 ] = ((data[ i ] * 3 + 1) / 2 * slope);

    }
// geometry = new IcosahedronBufferGeometry( 100, 4 )

    // TODO: figure out why wireframe material shader doesn't work on Planes.
    // mountains = new Mesh( geometry, createWireframeMaterial(geometry) );

    // workaround:
    mountains = new Group();
    var blackMountains = new Mesh( geometry, new MeshBasicMaterial( { color: 0x0 } ) );
    var wireMountains = new Mesh( geometry, new MeshBasicMaterial( { wireframe:true, color: 0x0070ff } ) );
    wireMountains.position.z += 0.1;
    mountains.add(blackMountains);
    mountains.add(wireMountains);
   
    return mountains;
}

function generateHeight( width, height ) {

    var size = width * height, data = new Uint8Array( size ),
        perlin = new ImprovedNoise(), quality = 1, z = fxrand() * 45 + 5;

    debugPrint("generateHeight z:" + z);
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

    var material = new ShaderMaterial( {

        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShaderWireframe' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShaderWireframe' ).textContent,
        side: DoubleSide

    } );

    material.extensions.derivatives = true;

    geometry.removeAttribute( 'normal' );
    geometry.removeAttribute( 'uv' );

    setupWireframeAttributes( geometry );

    return material;
}

function setupWireframeAttributes( geometry ) {

    var vectors = [
        new Vector3( 1, 0, 0 ),
        new Vector3( 0, 1, 0 ),
        new Vector3( 0, 0, 1 )
    ];

    var position = geometry.attributes.position;
    var centers = new Float32Array( position.count * 3 );

    for ( var i = 0, l = position.count; i < l; i ++ ) {

        vectors[ i % 3 ].toArray( centers, i * 3 );

    }

    geometry.addAttribute( 'center', new BufferAttribute( centers, 3 ) );

}



const 	GRID_SIZE = 40,
        GRID_LENGTH = 800,
        GRID_OFFSET = -100;

// draw a grid
gridHelper = new THREE.GridHelper( GRID_LENGTH, GRID_SIZE, 0x808080, 0x808080 );
gridHelper.position.y = - 15;
gridHelper.position.x = 0;
scene.add( gridHelper );
gridHelper.layers.enable( BLOOM_SCENE )

// draw a ground below the grid
var groundPlane = new THREE.PlaneGeometry(GRID_LENGTH * GRID_SIZE + GRID_OFFSET * 2, GRID_LENGTH * GRID_SIZE + GRID_OFFSET * 2);
var ground = new THREE.Mesh(groundPlane, new THREE.MeshBasicMaterial( { color: 0x000201 } ));
ground.position.y = -16;
ground.position.z = -GRID_OFFSET;
ground.rotateX(-3.1415 / 2);
scene.add( ground );

var Floor = function (renderer, scene, camera) {
        
    var light;
    var controls, water, sphere;

    var updateSun;
    var parameters = {
        distance: 100,
        inclination: 0.3,
        azimuth: 0.235
    };


    var init = function() {

        //

        // camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
        // camera.position.set( 30, 30, 100 );

        //
        var sunColor = new THREE.Color('hsl(' + (fxrand() * 360) + ', 100%, 70%)');

        light = new THREE.DirectionalLight( sunColor, 0.8 );
        scene.add( light );

        // Water

        var waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );

        var material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0.1, metalness: 0 } );

        water = new THREE.Mesh( waterGeometry, material );
        water.rotation.x = - Math.PI / 2;

        scene.add( water );

        // Skybox

        var sky = new THREE.Sky();
        sky.scale.setScalar( 10000 );
        scene.add( sky );

        var uniforms = sky.material.uniforms;

        uniforms.turbidity.value = 10;
        uniforms.rayleigh.value = 2;
        uniforms.luminance.value = 1;
        uniforms.mieCoefficient.value = 0.005;
        uniforms.mieDirectionalG.value = 0.8;

        var cubeCamera = new THREE.CubeCamera( 1, 20000, 256 );
        cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;

        updateSun = function() {

            var theta = Math.PI * ( parameters.inclination - 0.5 );
            var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );

            light.position.x = parameters.distance * Math.cos( phi );
            light.position.y = parameters.distance * Math.sin( phi ) * Math.sin( theta );
            light.position.z = parameters.distance * Math.sin( phi ) * Math.cos( theta );

            sky.material.uniforms.sunPosition.value = light.position.copy( light.position );

            cubeCamera.update( renderer, scene );

        }

        updateSun();


        //

        // GUI

        if (DEBUG) {
            var gui = new dat.GUI();

            var folder = gui.addFolder( 'Sky' );
            folder.add( parameters, 'inclination', 0, 0.5, 0.0001 ).onChange( updateSun );
            folder.add( parameters, 'azimuth', 0, 1, 0.0001 ).onChange( updateSun );
            folder.open();

        }
    }


    var render = function() {

        var time = performance.now() * 0.001;

        // sphere.position.y = Math.sin( time ) * 20 + 5;
        // sphere.rotation.x = time * 0.5;
        // sphere.rotation.z = time * 0.51;

        if (isIntroClosed) {
            parameters.inclination -= 0.000036;
            if (parameters.inclination < -0.5) {
                parameters.inclination = 0.51;
            }
            updateSun();
        }
    }

    init();


    return {
        update: render
    };
};
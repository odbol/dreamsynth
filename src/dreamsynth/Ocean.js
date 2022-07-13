import {PerspectiveCamera,
    Color,
    DirectionalLight,
    PlaneBufferGeometry,
    Water,
    TextureLoader,
    RepeatWrapping,
    Sky,
    CubeCamera,
    LinearMipMapLinearFilter} from 'three';
var Ocean = function (renderer, scene, camera) {
        
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

        // camera = new PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
        // camera.position.set( 30, 30, 100 );

        //
        var sunColor = new Color('hsl(' + (fxrand() * 360) + ', 100%, 70%)');

        light = new DirectionalLight( sunColor, 0.8 );
        scene.add( light );

        // Water

        var waterGeometry = new PlaneBufferGeometry( 10000, 10000 );

        water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {

                    texture.wrapS = texture.wrapT = RepeatWrapping;

                } ),
                alpha: 1.0,
                sunDirection: light.position.clone().normalize(),
                sunColor: sunColor,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );

        water.rotation.x = - Math.PI / 2;

        scene.add( water );
        water.material.uniforms.size.value = 0.1;

        // Skybox

        var sky = new Sky();
        sky.scale.setScalar( 10000 );
        scene.add( sky );

        var uniforms = sky.material.uniforms;

        uniforms.turbidity.value = 10;
        uniforms.rayleigh.value = 2;
        uniforms.luminance.value = 1;
        uniforms.mieCoefficient.value = 0.005;
        uniforms.mieDirectionalG.value = 0.8;

        var cubeCamera = new CubeCamera( 1, 20000, 256 );
        cubeCamera.renderTarget.texture.minFilter = LinearMipMapLinearFilter;

        updateSun = function() {

            var theta = Math.PI * ( parameters.inclination - 0.5 );
            var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );

            light.position.x = parameters.distance * Math.cos( phi );
            light.position.y = parameters.distance * Math.sin( phi ) * Math.sin( theta );
            light.position.z = parameters.distance * Math.sin( phi ) * Math.cos( theta );

            sky.material.uniforms.sunPosition.value = light.position.copy( light.position );
            water.material.uniforms.sunDirection.value.copy( light.position ).normalize();

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

            var uniforms = water.material.uniforms;

            var folder = gui.addFolder( 'Water' );
            folder.add( uniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
            folder.add( uniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
            folder.add( uniforms.alpha, 'value', 0.9, 1, .001 ).name( 'alpha' );
            folder.open();

        }
    }


    var render = function() {

        var time = performance.now() * 0.001;

        // sphere.position.y = Math.sin( time ) * 20 + 5;
        // sphere.rotation.x = time * 0.5;
        // sphere.rotation.z = time * 0.51;

        water.material.uniforms.time.value += 1.0 / 60.0;

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


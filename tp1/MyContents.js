import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { Table } from './objects/Table.js';
import { Plate } from './objects/Plate.js';
import { Cake } from './objects/Cake.js';
import { Candle } from './objects/Candle.js';
import { Painting } from './objects/Painting.js';
import { Spotlight } from './objects/Spotlight.js';
import { Window } from './objects/Window.js';
import { Beetle } from './objects/Beetle.js';
import { Newspaper } from './objects/Newspaper.js';
import { Chair } from './objects/Chair.js';
import { Spring } from './objects/Spring.js';
import { Flower } from './objects/Flower.js';
import { Jar } from './objects/Jar.js';
import { Phonograph } from './objects/Phonograph.js';
import { Knife } from './objects/Knife.js';
import { Furniture } from './objects/Furniture.js';
import { Carpet } from './objects/Carpet.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app - the application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        this.table = new Table(app, 8, 0.5, 4, 0.2, 0.15, 3, 32)
        this.plate = new Plate(app, 1, 1, 0.05, 32)
        this.cake = new Cake(app, 0.8, 0.5, 32, Math.PI/4, 5 * Math.PI / 3)
        this.candle = new Candle(app, 0.03, 0.03, 0.25, 32)
        this.painting_one = new Painting(app, 0, 8, -10, 'textures/snake.png')
        this.painting_two = new Painting(app, -8, 8, 0, 'textures/kratos.png')
        this.spotlight = new Spotlight(app);
        this.car = new Beetle(app, 8, 8, 4) // 446
        this.window = new Window(app, 0, 6, 10)
        this.newspaper = new Newspaper(app, 2.5, 3.34, 0); // 3.35
        this.chair = new Chair(app, 0, 1.1, -4, 3, 0.3, 2, 0.1, 0.1, 2, 32);
        this.flower = new Flower(app);
        this.spring = new Spring(app, -3, 3.55, -1, 0.2, 1, 5);
        this.jar = new Jar(app, -3.5, 3.1, 1.5);
        this.phono = new Phonograph(app, 4.8, 3.91, 6.8); // y = 4
        this.knife = new Knife(app);
        this.furniture = new Furniture(app,3,1.5,3);
        this.carpet = new Carpet(app)
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry( this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.position.y = this.boxDisplacement.y;
        this.boxMesh.rotation.x = -Math.PI / 9;
    }

    /**
     * builds a wall
     * @param {*} x - x coordinate of the wall
     * @param {*} y - y coordinate of the wall
     * @param {*} z - z coordinate of the wall
     * @param {*} r - rotation angle of the wall
     */
    buildWall(x, y, z, r) {
        const wallTexture = new THREE.TextureLoader().load('textures/wall.jpg');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        const wallMaterial = new THREE.MeshPhongMaterial({ color: '#b4b4b4', 
            specular: '#000000', emissive: "#000000", shininess: 10, side: THREE.BackSide, map: wallTexture })

        const wallUVRate = 1; // 12 / 12
        const wallTextureUVRate = 350 / 350; 
        const wallTextureRepeatU = 1;
        const wallTextureRepeatV = wallTextureRepeatU * wallUVRate * wallTextureUVRate * 1.5;
        wallTexture.repeat.set( wallTextureRepeatU, wallTextureRepeatV );
        wallTexture.offset = new THREE.Vector2(0,0.25);
        
        let wall = null;

        if (x == 0) {
            wall = new THREE.PlaneGeometry( 16, 16 );
        }
        else {
            wall = new THREE.PlaneGeometry( 20, 16 );
        }

        // const wall = new THREE.PlaneGeometry( 16, 16 );
        const wallMesh = new THREE.Mesh( wall, wallMaterial );
        wallMesh.position.z = z;
        wallMesh.position.y = y;
        wallMesh.position.x = x;
        wallMesh.rotation.y = r;
        this.app.scene.add( wallMesh );
    }

    /**
     * builds a wall with a window in it
     * @param {*} x - x coordinate of the wall
     * @param {*} y - y coordinate of the wall
     * @param {*} z - z coordinate of the wall
     * @param {*} r - rotation angle of the wall
     */
    buildWindow(x, y, z, r){
        const wallTexture = new THREE.TextureLoader().load('textures/wall.jpg');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        const wallMaterial = new THREE.MeshPhongMaterial({ color: '#b4b4b4', 
            specular: '#000000', emissive: "#000000", shininess: 10, side: THREE.BackSide, map: wallTexture })

        const wallUVRate = 1; // 12 / 12
        const wallTextureUVRate = 350 / 350; 
        const wallTextureRepeatU = 0.0625;
        const wallTextureRepeatV = wallTextureRepeatU * wallUVRate * wallTextureUVRate * 1.5;
        wallTexture.repeat.set( wallTextureRepeatU, wallTextureRepeatV );
        wallTexture.offset = new THREE.Vector2(0.5,0);

        const structure = new THREE.Shape();
        structure.moveTo(-8, -8);
        structure.lineTo(8, -8);
        structure.lineTo(8, 8);
        structure.lineTo(-8, 8);
        structure.lineTo(-8, -8);

        const hole = new THREE.Path();
        hole.moveTo(-2, -2);
        hole.lineTo(2, -2);
        hole.lineTo(2, 4);
        hole.lineTo(-2, 4);
        hole.lineTo(-2, -2);

        structure.holes.push(hole)

        const wall = new THREE.ShapeGeometry(structure);

        const wallMesh = new THREE.Mesh( wall, wallMaterial );
        wallMesh.position.z = z;
        wallMesh.position.y = y;
        wallMesh.position.x = x;
        wallMesh.rotation.y = r;
        this.app.scene.add( wallMesh );

    }

    /**
     * builds the panorama view outside of the window
     * @param {*} x - x coordinate of the panorama
     * @param {*} y - y coordinate of the panorama
     * @param {*} z - z coordinate of the panorama
     */
    buildView(x, y, z){
        const texture = new THREE.TextureLoader().load('textures/panorama.avif');
        
        const material = new THREE.MeshPhongMaterial({ side: THREE.BackSide, map: texture })

        const sphere = new THREE.SphereGeometry( 7, 32, 16, 0, Math.PI ); 
        const sphereMesh = new THREE.Mesh( sphere, material );
        sphereMesh.position.z = z;
        sphereMesh.position.y = y;
        sphereMesh.position.x = x;

        this.app.scene.add( sphereMesh );
    }

    /**
     * builds the scene's floor
     */
    buildFloor(){
        const planeTexture = new THREE.TextureLoader().load('textures/floor.jpg');
        planeTexture.wrapS = THREE.RepeatWrapping;
        planeTexture.wrapT = THREE.RepeatWrapping;
        const UVRate = 1;
        const TextureUVRate = 598 / 612; 
        const TextureRepeatU = 2;
        const TextureRepeatV = TextureRepeatU * UVRate * TextureUVRate
        planeTexture.repeat.set( TextureRepeatU, TextureRepeatV );

        const planeMaterial = new THREE.MeshPhongMaterial({ color: '#b4b4b4', 
            specular: '#000000', emissive: "#000000", shininess: 10, map: planeTexture })

        const plane = new THREE.PlaneGeometry( 16, 20 );
        const planeMesh = new THREE.Mesh( plane, planeMaterial );
        planeMesh.rotation.x = -Math.PI / 2;
        planeMesh.position.y = -0;
        planeMesh.receiveShadow = true;
        this.app.scene.add( planeMesh );
    }

    // basic
    /*buildFlame() {
        let topFlameMaterial = new THREE.MeshPhongMaterial({ color: "#fc8a17", 
            specular: "#000000", emissive: "#000000", shininess: 90 })
        let topFlame = new THREE.ConeGeometry( 0.03, 0.3, 32 );
        this.topFlameMesh = new THREE.Mesh( topFlame, topFlameMaterial );
        this.topFlameMesh.position.y = 2.95;
        this.topFlameMesh.position.z = -0.25;
        this.app.scene.add( this.topFlameMesh );
    }*/

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            //this.app.scene.add(this.axis)
        }

        const mapSize = 4096
        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 100, 0 );
        pointLight.position.set( 0, 20, 0 );
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = mapSize;
        pointLight.shadow.mapSize.height = mapSize;
        pointLight.shadow.camera.near = 0.5;
        pointLight.shadow.camera.far = 30;
        pointLight.shadow.bias = - 0.0006;
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.1;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

;

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        // this.buildBox()
        this.buildWindow(0, 8, 10, 0)
        this.buildWall(0, 8, -10, Math.PI)
        this.buildWall(8, 8, 0, Math.PI / 2)
        this.buildWall(-8, 8, 0, -Math.PI / 2)
        this.buildView(0, 8, 10)
        this.buildFloor()

        this.table.build()
        this.plate.build()
        this.cake.build()
        this.candle.build()
        this.painting_one.build()
        this.painting_two.build()
        this.spotlight.build(this.cake.group);
        this.car.build()
        this.newspaper.build()
        this.chair.build()
        this.spring.build()
        this.flower.build()
        this.jar.build()
        this.window.build()
        this.knife.build(-7.35,8.62,-0.85, 0xa4a4a4)
        this.phono.build()
        this.furniture.build(5,1,7);
        this.carpet.build();
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        //this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        //this.boxMesh.position.x = this.boxDisplacement.x
        //this.boxMesh.position.y = this.boxDisplacement.y
        //this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };
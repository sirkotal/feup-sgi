import * as THREE from 'three';
import { Flame } from './Flame.js'

/**
 * This class represents the candle in the cake
 */
export class Candle {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} radiusTop - the radius of the top face of the cylinder 
     * @param {*} radiusBottom - the radius of the bottom face of the cylinder
     * @param {*} height - the height of the candle
     * @param {*} radialSegment - the radial segments count of the cylinder
     * @param {*} angleStart - the start angle for first segment
     * @param {*} angleLength - the central angle of the circular sector
     */
    constructor(app, radiusTop, radiusBottom, height, radialSegment, angleStart, angleLength){
        this.app = app;
        this.radiusTop = radiusTop;
        this.radiusBottom = radiusBottom;
        this.height = height;
        this.radialSegment = radialSegment;
        this.flame = new Flame(app, 0.03, 0.1, 32)
    }

    /**
     * builds the candle with the appropriate characteristics
     */
    build() {
        this.flame.build();

        this.candleTexture = new THREE.TextureLoader().load('textures/wax.jpg');
        this.candleTexture.wrapS = THREE.RepeatWrapping;
        this.candleTexture.wrapT = THREE.RepeatWrapping;
        
        const candleMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90, map: this.candleTexture })
        const candle = new THREE.CylinderGeometry(this.radiusBottom, this.radiusTop, this.height, this.radialSegment);
        const candleMesh = new THREE.Mesh( candle, candleMaterial );
        candleMesh.position.y = 3.87;
        candleMesh.position.z = -0.25;
        candleMesh.receiveShadow = true;
        candleMesh.castShadow = true;
        
        this.app.scene.add( candleMesh );
    }
}
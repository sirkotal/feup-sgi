const controlPoints = [
    [new THREE.Vector4(-2, 0, -2, 1), new THREE.Vector4(0, 0, -2, 1), new THREE.Vector4(2, 0, -2, 1), new THREE.Vector4(4, 0, -2, 1)],
    [new THREE.Vector4(-2, 0, 0, 1), new THREE.Vector4(0, 0, 0, 1), new THREE.Vector4(2, 0, 0, 1), new THREE.Vector4(4, 0, 0, 1)],
    [new THREE.Vector4(-2, 0, 2, 1), new THREE.Vector4(0, 0, 2, 1), new THREE.Vector4(2, 0, 2, 1), new THREE.Vector4(4, 0, 2, 1)],
    [new THREE.Vector4(-2, 0, 4, 1), new THREE.Vector4(0, 0, 4, 1), new THREE.Vector4(2, 0, 4, 1), new THREE.Vector4(4, 0, 4, 1)],
];

import * as THREE from 'three';
import { createNurbsSurfaces, MyNurbsBuilder } from '../utils/Utils.js';

/**
 * This class represents the carpet
 */
export class Carpet {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} x - the position in the X axis of the Carpet
     * @param {*} y - the position in the Y axis of the Carpet
     * @param {*} z - the position in the Z axis of the Carpet
     */
    constructor(app, x, y, z) {
        this.app = app;
    }

    /**
     * builds the carpet with the appropriate characteristics
     */
    build() {
        const carpetTexture = new THREE.TextureLoader().load('textures/carpet.png');
        carpetTexture.wrapS = carpetTexture.wrapT = THREE.RepeatWrapping;

        const controlPoints = [
            [
                [-5, 0, -4, 1], 
                [-2.5, 0, -3.7, 1], 
                [2.5, 0, -4, 1], 
                [5.5, 0, -4, 1]
            ],
            [
                [-5.3, 0, -2, 1],
                [ -2.5, 0, -2, 1],
                [ 2.5, 0.2, -2, 1],
                [ 4.5, 0, -2, 1]
            ],
            [
                [-5, 0, 2, 1],
                [ -2.5, 0, 2, 1],
                [ 2.5, 0, 2, 1],
                [ 5.5, 0, 2, 1]
            ],
            [
                [-5, 0, 4, 1],
                [ -2.5, 0, 3.8, 1],
                [ 2.5, 0, 4.5, 1],
                [ 5, 0, 4, 1]
            ],
        ];
        const material = new THREE.MeshLambertMaterial( { map: carpetTexture } );
        
        const builder = new MyNurbsBuilder(this.app);
        createNurbsSurfaces(this.app, builder, controlPoints, 3, 3, material, 0, 0.05, 0, 1);
    }
}
import * as THREE from 'three';
import { createNurbsSurfaces, MyNurbsBuilder } from '../utils/Utils.js';

/**
 * This class represents the newspaper
 */
export class Newspaper {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} x - the position in the X axis of the newspaper
     * @param {*} y - the position in the Y axis of the newspaper
     * @param {*} z - the position in the Z axis of the newspaper
     */
    constructor(app, x, y, z) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * builds the newspaper with the appropriate characteristics
     */
    build() {
        this.newsTexture = new THREE.TextureLoader().load('textures/newspaper.png');
        this.newsTexture.wrapS = this.newsTexture.wrapT = THREE.RepeatWrapping;
        this.newsTexture.anisotropy = 16;
        this.newsTexture.colorSpace = THREE.SRGBColorSpace;

        this.orderU = 3
        this.orderV = 2
        // build nurb 
        this.controlPoints = 
        [// U = 0
            [// V = ​​0..2
                [ -1.5, -1.5, 0.0, 1 ],    
                [ -1.5, 0.0, -0.3, 1 ],    
                [ -1.5, 1.5, 0.0, 1 ]     
            ],
        // U = 1
            [// V = ​​0..2
                [ -0.5, -1.5, 0.0, 1 ],    
                [ -0.5, 0.0, 0.5, 1 ],   
                [ -0.5, 1.5, 0.0, 1 ]     
            ],
        // U = 2
            [// V = ​​0..2
                [ 0.5, -1.5, 0.0, 1 ], 
                [ 0.5, 0.0, -0.3, 1 ],    
                [ 0.5, 1.5, 0.0, 1 ]     
            ],
        // U = 3
            [// V = ​​0..2
                [ 1.5, -1.5, 0.0, 1 ],   
                [ 1.5, 0.0, 0.5, 1 ],   
                [ 1.5, 1.5, 0.0, 1 ]      
            ]
        ];
        this.material = new THREE.MeshLambertMaterial( { map: this.newsTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.90 } );
        this.rotationX = -Math.PI / 2;
        this.rotationY = 0;
        this.rotationZ = Math.PI;
        
        this.builder = new MyNurbsBuilder(this.app);
        createNurbsSurfaces(this.app, this.builder, this.controlPoints, this.orderU, this.orderV, this.material, this.x, this.y, this.z, 0.75, this.rotationX, this.rotationY, this.rotationZ);
    }
}
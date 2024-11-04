import * as THREE from 'three';
import { createNurbsSurfaces, MyNurbsBuilder } from '../utils/Utils.js';

/**
 * This class represents the flower jar
 */
export class Jar {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} x - the position in the X axis of the jar
     * @param {*} y - the position in the Y axis of the jar
     * @param {*} z - the position in the Z axis of the jar
     */
    constructor(app, x, y, z) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * builds the jar with the appropriate characteristics
     */
    build() {
        this.newsTexture = new THREE.TextureLoader().load('textures/jar.png');
        this.newsTexture.wrapS = this.newsTexture.wrapT = THREE.RepeatWrapping;
        this.newsTexture.anisotropy = 16;
        this.newsTexture.colorSpace = THREE.SRGBColorSpace;

        this.orderU = 2
        this.orderV = 3
        // build nurb 
        this.controlPoints = 
        [// U = 0
            [// V = ​​0..3
                [ -3, 0,  0, 1], 
                [ -5, 4,  0, 1],
                [ -1, 7, 0, 1],
                [ -3, 14, 0, 1]
            ],
        // U = 1
              [// V = ​​0..3
                [ 0, 0,  6, 1], 
                [ 0, 4, 10, 1], 
                [ 0, 7, 2, 1],
                [ 0, 14, 5, 1]
            ],
        // U = 2
            [// V = ​​0..3
                [ 3, 0,  0, 1],
                [ 5, 4,  0, 1], 
                [ 1, 7, 0, 1],
                [ 3, 14, 0, 1]
            ]
        ];
        this.reverseControlPoints = 
        [// U = 0
            [// V = ​​0..3
                [ -3, 0,  0, 1], 
                [ -5, 4,  0, 1],
                [ -1, 7, 0, 1],
                [ -3, 14, 0, 1]
            ],
        // U = 1
              [// V = ​​0..3
                [ 0, 0,  -6, 1], 
                [ 0, 4, -10, 1], 
                [ 0, 7, -2, 1],
                [ 0, 14, -5, 1]
            ],
        // U = 2
            [// V = ​​0..3
                [ 3, 0,  0, 1],
                [ 5, 4,  0, 1], 
                [ 1, 7, 0, 1],
                [ 3, 14, 0, 1]
            ]
        ];
        this.material = new THREE.MeshLambertMaterial( { map: this.newsTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.90 } );
        
        this.builder = new MyNurbsBuilder(this.app);
        createNurbsSurfaces(this.app, this.builder, this.controlPoints, this.orderU, this.orderV, this.material, this.x, this.y, this.z, 0.1);
        //createNurbsSurfaces(this.app, this.builder, this.reverseControlPoints, this.orderU, this.orderV, this.material, -this.x, -this.y, -this.z);
        createNurbsSurfaces(this.app, this.builder, this.reverseControlPoints, this.orderU, this.orderV, this.material, this.x, this.y, this.z, 0.1);
    
        const dirtTexture = new THREE.TextureLoader().load('./textures/dirt.jpg');
        const dirtMaterial = new THREE.MeshPhongMaterial({ color: 0x3d1d07, map: dirtTexture });
        const controlPoints = 
        [// U = 0
            [// V = ​​0..1
                [ -2.3, 10, 0, 1],
                [ -2.3, 10, 0, 1],
            ],
        // U = 1
              [// V = ​​0..1
                [ 0, 10, 4.3, 1],
                [ 0, 10, -4.3, 1],
            ],
        // U = 2
            [// V = ​​0..1
                [ 2.3, 10, 0, 1],
                [ 2.3, 10, 0, 1],
            ]
        ]
        createNurbsSurfaces(this.app, this.builder, controlPoints, 2, 1, dirtMaterial, this.x, this.y, this.z, 0.1);
    }
}

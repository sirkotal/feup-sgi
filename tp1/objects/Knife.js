import * as THREE from 'three';
import { createNurbsSurfaces, MyNurbsBuilder } from '../utils/Utils.js';

/**
 * This class represents a Knife
 */
export class Knife {

    /**
     * constructs the object
     * @param {*} app - the application object
     */
    constructor(app){
        this.app = app;
        this.group = new THREE.Group()
    }

    /**
     * builds the knife with the appropriate characteristics
     */
    build(x, y, z, color) {
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: "#452702", 
            specular: "#000000", emissive: "#000000", shininess: 90})
        const headTexture = new THREE.TextureLoader().load('./textures/blood.jpg');
        headTexture.wrapS = THREE.RepeatWrapping;
        headTexture.wrapT = THREE.RepeatWrapping;
        headTexture.repeat.set(1,1)
        headTexture.rotation = Math.PI
        const headMaterial = new THREE.MeshPhongMaterial({ color: color, 
            specular: "#000000", emissive: "#000000", shininess: 90, side: THREE.DoubleSide, map: headTexture})

        const body = new THREE.SphereGeometry(0.25);
        const bodyMesh = new THREE.Mesh(body, bodyMaterial);
        bodyMesh.rotation.x = Math.PI/2
        bodyMesh.scale.x = 1.25;
        bodyMesh.scale.y = 1/10;
        bodyMesh.scale.z = 1/3.5;
        this.group.add( bodyMesh );

        const controlPoints = 
        [// U = 0
            [// V = ​​0..3
                [ 0, 0, 0, 1], 
                [ 0, 1.5, 0, 1], 
            ],
        // U = 1
            [// V = ​​0..3
                [ 4, 0, 0, 1], 
                [ 4, 1.5, 0, 1], 
            ],
        // U = 2
            [// V = ​​0..3
                [ 4.5, 0.2, 0, 1],
                [ 5.5, 1.5, 0, 1],
            ],
        // U = 3
            [// V = ​​0..3
                [ 6, 1.2, 0, 1],
                [ 6, 1.2, 0, 1],
            ]
        ];

        const builder = new MyNurbsBuilder(this.app);
        createNurbsSurfaces(this.app, builder, controlPoints, 3, 1, headMaterial, x, y, z, 0.1, 0, Math.PI);

        this.group.position.x = -7.17;
        this.group.position.y = 8.71;
        this.group.position.z = -0.85;

        this.app.scene.add( this.group );
    }
}
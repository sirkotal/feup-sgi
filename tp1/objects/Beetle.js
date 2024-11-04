import * as THREE from 'three';
import { drawHull, initCubicBezierCurve, initQuadraticBezierCurve } from '../utils/Utils.js';
import { Pen } from './Pen.js';

/**
 * This class represents the VW Beetle built using Bézier curves
 */
export class Beetle {
    /**
     * constructs the object
     * @param {*} app - the application object 
     * @param {*} x - the position in the X axis of the Beetle
     * @param {*} y - the position in the Y axis of the Beetle
     * @param {*} z - the position in the Z axis of the Beetle
     */
    constructor(app, x, y, z) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * builds the VW Beetle with the appropriate characteristics
     */
    build() {
        let points = [
            // wheels
            [
                new THREE.Vector3(-0.1,-1,-3),
                new THREE.Vector3(-0.1,1,-3),
                new THREE.Vector3(-0.1,1,0),
                new THREE.Vector3(-0.1,-1,0)
            ],
            // back pillar
            [
                new THREE.Vector3(-0.1,3,-4),
                new THREE.Vector3(-0.1,3,0),
                new THREE.Vector3(-0.1,-1,0)
            ],
            // front pillar
            [
                new THREE.Vector3(-0.1,1,-6),
                new THREE.Vector3(-0.1,3,-6),
                new THREE.Vector3(-0.1,3,-4)
            ],
            // bumper
            [
                new THREE.Vector3(-0.1,-1,-8),
                new THREE.Vector3(-0.1,1,-8),
                new THREE.Vector3(-0.1,1,-6)
            ],
            [
                new THREE.Vector3(-0.1,0.2,-5.5),
                new THREE.Vector3(-0.1,0.2,-2.5),
            ],
            [
                new THREE.Vector3(-0.1,0,-5.3),
                new THREE.Vector3(-0.1,0,-2.7),
            ]
        ];

        let position = new THREE.Vector3(this.x, this.y, this.z);
        let position_front_wheel = new THREE.Vector3(this.x, this.y, this.z - 5);

        initCubicBezierCurve(this.app, points[0], 0xF5F5DC, position);
        initCubicBezierCurve(this.app, points[0], 0xF5F5DC, position_front_wheel);
        initQuadraticBezierCurve(this.app, points[1], 0xF5F5DC, position);
        initQuadraticBezierCurve(this.app, points[2], 0xF5F5DC, position);
        initQuadraticBezierCurve(this.app, points[3], 0xF5F5DC, position);
        const lineRed = drawHull(position, points[4], 0xcf0101);
        const lineBlue = drawHull(position, points[5], 0x000278);
        this.app.scene.add(lineRed)
        this.app.scene.add(lineBlue)

        const frameTexture = new THREE.TextureLoader().load('./textures/board.jpg');
        const frameMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90, map: frameTexture })
        const frame = new THREE.BoxGeometry( 10, 6, 0.1 );
        const frameMesh = new THREE.Mesh( frame, frameMaterial );
        frameMesh.position.x = this.x;
        frameMesh.position.y = this.y+0.5;
        frameMesh.rotation.y = Math.PI / 2;
        this.app.scene.add( frameMesh );

        const supportTexture = new THREE.TextureLoader().load('./textures/rust.jpg');
        supportTexture.wrapS = THREE.RepeatWrapping;
        supportTexture.wrapT = THREE.RepeatWrapping;
        const supportMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90, map: supportTexture })
        const support = new THREE.BoxGeometry( 10, 0.1, 0.5 );
        const supportMesh = new THREE.Mesh( support, supportMaterial );
        supportMesh.receiveShadow = true;
        supportMesh.castShadow = true;
        supportMesh.position.x = this.x-0.25;
        supportMesh.position.y = this.y-2;
        supportMesh.rotation.y = Math.PI / 2;
        this.app.scene.add( supportMesh );

        const redPen = new Pen(this.app)
        redPen.build(this.x-0.25, this.y-1.85, this.z, 0xF5F5DC);
        const bluePen = new Pen(this.app)
        bluePen.build(this.x-0.25, this.y-1.85, this.z-2, 0x000278);
        const beigePen = new Pen(this.app)
        beigePen.build(this.x-0.25, this.y-1.85, this.z-3, 0xcf0101);
        
    }
}
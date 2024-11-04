import * as THREE from 'three';
import { MyNurbsBuilder } from '../utils/Utils.js'

/**
 * This class represents the flower
 */
export class Flower {
    /**
     * constructs the object
     * @param {*} app - the application object
     */
    constructor(app){
        this.app = app;
        this.group = new THREE.Group();
    }

    /**
     * builds the flower with the appropriate characteristics
     */
    build() {
        const height = 1;
        let points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.random()*0.2-0.1, height * 0.2, Math.random()*0.2-0.1),
            new THREE.Vector3(Math.random()*0.2-0.1, height * 0.4, Math.random()*0.2-0.1),
            new THREE.Vector3(Math.random()*0.2-0.1, height * 0.6, Math.random()*0.2-0.1),
            new THREE.Vector3(Math.random()*0.2-0.1, height * 0.8, Math.random()*0.2-0.1),
            new THREE.Vector3(0, height, 0),
        ];
        let curve = new THREE.CatmullRomCurve3( points )

        const stemMaterial = new THREE.MeshPhongMaterial({ color: "#324d36", 
            specular: "#000000", emissive: "#000000"})
        const stem = new THREE.TubeGeometry(curve, 50, 0.03, 8, false);
        const stemMesh = this.stem = new THREE.Mesh(stem,stemMaterial);
        stemMesh.receiveShadow = true;
        stemMesh.castShadow = true;

        const headGroup = new THREE.Group();

        const receptacleTexture = new THREE.TextureLoader().load('textures/receptacle.jpg');
        const receptacleMaterial = new THREE.MeshPhongMaterial({ color: "#aaaaaa", 
            specular: "#000000", emissive: "#000000", map: receptacleTexture}) 
        const receptacle = new THREE.SphereGeometry(0.15, 32, 16, 0, Math.PI);
        const receptacleMesh = new THREE.Mesh(receptacle, receptacleMaterial);
        receptacleMesh.position.y = 0.05;
        receptacleMesh.rotation.x = -Math.PI/2;
        receptacleMesh.scale.z = 0.5
        receptacleMesh.receiveShadow = true;
        receptacleMesh.castShadow = true;

        headGroup.add (receptacleMesh)

        const supportMaterial = new THREE.MeshPhongMaterial({ color: "#324d36", 
            specular: "#000000", emissive: "#000000"}) 
        const support = new THREE.SphereGeometry(0.15, 32, 16, 0, Math.PI);
        const supportMesh = new THREE.Mesh(support, supportMaterial);
        supportMesh.position.y = 0.05;
        supportMesh.rotation.x = Math.PI/2;
        supportMesh.scale.z = 0.5
        supportMesh.receiveShadow = true;
        supportMesh.castShadow = true;

        headGroup.add (supportMesh)

        const builder = new MyNurbsBuilder(this.app)
        const controlPoints = 
            [
                [
                    [ 0.0, 0, 0.0, 1 ],
                    [ 0.0, 0, 0.0, 1 ]
                ],
                [
                    [ 0.2,  0.2, -0.2, 1 ],
                    [ 0.2,  0.2, 0.2, 1 ]
                ],
                [
                    [ 0.4, 0, 0, 1 ],
                    [ 0.4, 0, 0, 1 ]
                ]
            ]
            
        const numberPetals = 10;
        let angle = 0
        const angleIncrement = 2*Math.PI / numberPetals
        const petalTexture = new THREE.TextureLoader().load('textures/petal.jpg');
        const petalMaterial = new THREE.MeshPhongMaterial({ color: "#52374f", 
            specular: "#000000", emissive: "#000000", side: THREE.DoubleSide, map: petalTexture})
        const petal = builder.build(controlPoints, 2, 1, 50, 50)
        for (let i = 0; i < numberPetals; i++) {
            const petalMesh = new THREE.Mesh(petal, petalMaterial)
            petalMesh.rotation.y = angle + Math.random()*0.5;
            petalMesh.position.y = -0.025;
            if (i%2 == 0){
                petalMesh.rotation.z = -Math.PI/30;
            }
            angle += angleIncrement;
            petalMesh.receiveShadow = true;
            petalMesh.castShadow = true;
            headGroup.add(petalMesh)
        }
        headGroup.position.y = height;
        headGroup.rotation.z = Math.random()*Math.PI/6;

        for (let i = 0; i < 5; i++) {
            const petalMesh = new THREE.Mesh(petal, petalMaterial)
            petalMesh.position.x =  Math.random()*0.5;
            petalMesh.position.y = -0.75;
            petalMesh.position.z = -1 + Math.random()*0.5;
            petalMesh.rotation.y = Math.random()*Math.PI/3-Math.PI/6;
            petalMesh.rotation.x = Math.random() < 0.5 ? -Math.PI/6 : Math.PI/6;
            petalMesh.receiveShadow = true;
            petalMesh.castShadow = true;
            this.group.add(petalMesh)
        }

        this.group.add(stemMesh)
        this.group.add(headGroup)

        this.group.position.x = -3.5;
        this.group.position.y = 4;
        this.group.position.z = 1.5;

        this.app.scene.add(this.group)
    }
}
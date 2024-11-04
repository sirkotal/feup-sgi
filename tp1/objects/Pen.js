import * as THREE from 'three';

/**
 * This class represents a pen
 */
export class Pen {
    /**
     * constructs the object
     * @param {*} app - the application object
     */
    constructor(app){
        this.app = app;
        this.group = new THREE.Group()
    }

    /**
     * builds the pen with the appropriate characteristics
     * @param {*} x - the position in the X axis of the pen
     * @param {*} y - the position in the Y axis of the pen
     * @param {*} z - the position in the Z axis of the pen
     * @param {*} color - the color of the pen
     */
    build(x, y, z, color) {
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90})

        const headMaterial = new THREE.MeshPhongMaterial({ color: color, 
            specular: "#000000", emissive: "#000000", shininess: 90})

        const body = new THREE.CylinderGeometry(0.1, 0.075, 0.5);
        const bodyMesh = new THREE.Mesh(body, [bodyMaterial, headMaterial]);
        bodyMesh.receiveShadow = true;
        bodyMesh.castShadow = true;
        bodyMesh.rotation.x = Math.PI/2
        this.group.add( bodyMesh );

        const head = new THREE.CylinderGeometry(0.075, 0.05, 0.2);
        const headMesh = new THREE.Mesh(head, headMaterial);
        headMesh.receiveShadow = true;
        headMesh.castShadow = true;
        headMesh.position.z = -0.3;
        headMesh.rotation.x = Math.PI/2
        this.group.add( headMesh );

        this.group.rotation.x = -Math.PI/50;
        this.group.position.x = x;
        this.group.position.y = y;
        this.group.position.z = z;

        this.app.scene.add( this.group );
    }
}
import * as THREE from 'three';

/**
 * This class represents a painting with a picture
 */
export class Painting {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} x - the position in the X axis of the painting
     * @param {*} y - the position in the Y axis of the painting
     * @param {*} z - the position in the Z axis of the painting
     * @param {*} tex - the picture in the painting
     */
    constructor(app, x, y, z, tex){
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
        this.tex = tex;
    }

    /**
     * builds the painting with the appropriate characteristics
     */
    build() {
        this.painting = new THREE.TextureLoader().load(this.tex);
        this.painting.wrapS = THREE.RepeatWrapping;
        this.painting.wrapT = THREE.RepeatWrapping;
        
        const frameMaterial = new THREE.MeshPhongMaterial({ color: "#232b2b", 
            specular: "#000000", emissive: "#000000", shininess: 90 })
        const paintingMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
        specular: "#000000", emissive: "#000000", shininess: 90, map: this.painting })

        const frame = new THREE.BoxGeometry( 5.5, 6.5, 0.1 );
        const canvas = new THREE.PlaneGeometry( 5, 6 );

        const frameMesh = new THREE.Mesh( frame, frameMaterial );
        frameMesh.position.x = this.x;
        frameMesh.position.y = this.y;
        frameMesh.position.z = this.z;
        if (this.tex == 'textures/kratos.png') {
            frameMesh.position.x = this.x + 0.05;
            frameMesh.rotation.y = Math.PI / 2;
        }
        this.app.scene.add( frameMesh );

        const canvasMesh = new THREE.Mesh( canvas, paintingMaterial );
        canvasMesh.position.x = this.x;
        canvasMesh.position.y = this.y;
        canvasMesh.position.z = this.z + 0.1;
        if (this.tex == 'textures/kratos.png') {
            canvasMesh.position.z = this.z;
            canvasMesh.position.x = this.x + 0.15;
            canvasMesh.rotation.y = Math.PI / 2;
        }
        this.app.scene.add( canvasMesh );
    }
}
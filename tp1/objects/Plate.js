import * as THREE from 'three';

/**
 * This class represents a plate
 */
export class Plate {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} radiusTop - the radius of the top face of the cylinder 
     * @param {*} radiusBottom - the radius of the bottom face of the cylinder 
     * @param {*} height - the height of the plate
     * @param {*} radialSegment - the radial segments count of the cylinder
     */
    constructor(app, radiusTop, radiusBottom, height, radialSegment){
        this.app = app;
        this.radiusTop = radiusTop;
        this.radiusBottom = radiusBottom;
        this.height = height;
        this.radialSegment = radialSegment;
    }

    /**
     * builds the plate with the appropriate characteristics
     */
    build() {
        this.plateTexture = new THREE.TextureLoader().load('textures/plate.png');
        this.plateTexture.wrapS = THREE.RepeatWrapping;
        this.plateTexture.wrapT = THREE.RepeatWrapping;

        this.ceramicTexture = new THREE.TextureLoader().load('textures/ceramic.jpg');
        this.ceramicTexture.wrapS = THREE.RepeatWrapping;
        this.ceramicTexture.wrapT = THREE.RepeatWrapping;

        const plateTopMaterial = new THREE.MeshPhongMaterial({ color: "#d3d3d3", 
            specular: "#000000", emissive: "#000000", shininess: 90, map: this.plateTexture })
        plateTopMaterial.bumpMap = this.plateTexture;
        plateTopMaterial.bumpScale = 0.05;

        const plateMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90, map: this.ceramicTexture })
        
        const plate = new THREE.CylinderGeometry(this.radiusTop, this.radiusBottom, this.height, this.radialSegment);
        const plateMesh = new THREE.Mesh(plate, [
            plateMaterial, 
            plateTopMaterial, 
            plateMaterial 
        ]);
        // const plateMesh = new THREE.Mesh( plate, plateMaterial );
        
        plateMesh.position.y = 3.25;
        plateMesh.receiveShadow = true;
        plateMesh.castShadow = true;
        this.app.scene.add( plateMesh );
    }
}
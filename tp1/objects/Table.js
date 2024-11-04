import * as THREE from 'three';

/**
 * This class represents a table
 */
export class Table {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} topWidth - the width of the table top
     * @param {*} topHeight - the height of the table top
     * @param {*} topDepth - the depth of the table top
     * @param {*} legRadiusTop - the radius of the top face of each leg's cylinder 
     * @param {*} legRadiusBottom - the radius of the bottom face of each leg's cylinder 
     * @param {*} legHeight - the height of each leg's cylinder 
     * @param {*} legRadialSegment - the radial segment count of each leg's cylinder 
     */
    constructor(app, topWidth, topHeight, topDepth, legRadiusTop, legRadiusBottom, legHeight, legRadialSegment){
        this.app = app;
        this.topWidth = topWidth;
        this.topHeight = topHeight;
        this.topDepth = topDepth;

        this.legRadiusTop = legRadiusTop;
        this.legRadiusBottom = legRadiusBottom;
        this.legHeight = legHeight;
        this.legRadialSegment = legRadialSegment;
    }

    /**
     * builds the table with the appropriate characteristics
     */
    build() {

        this.topTexture = new THREE.TextureLoader().load('textures/table.jpg');
        
        const topMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
        specular: "#000000", emissive: "#000000", shininess: 90, map: this.topTexture })

        this.legTexture = new THREE.TextureLoader().load('textures/metal.jpg');
        
        const legMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
        specular: "#999999", emissive: "#000000", shininess: 160, map: this.legTexture })

        const top = new THREE.BoxGeometry( this.topWidth, this.topHeight, this.topDepth );
        const topMesh = new THREE.Mesh( top, topMaterial );
        topMesh.position.y = this.legHeight;
        topMesh.receiveShadow = true;
        topMesh.castShadow = true;
        this.app.scene.add( topMesh );

        for (let i = 1; i < 5; i++) {
            const leg = new THREE.CylinderGeometry(this.legRadiusTop, this.legRadiusBottom, this.legHeight, this.legRadialSegment);
            
            const legMesh = new THREE.Mesh(leg, legMaterial);

            switch (i) {
                case 1:
                    legMesh.position.x = this.topWidth / 2 - this.legRadiusTop;
                    legMesh.position.z = this.topDepth / 2 - this.legRadiusTop;
                    legMesh.position.y = this.legHeight/2
                    break;
                case 2:
                    legMesh.position.x = -this.topWidth / 2 + this.legRadiusTop;
                    legMesh.position.z = this.topDepth / 2 - this.legRadiusTop;
                    legMesh.position.y = this.legHeight/2
                    break;
                case 3:
                    legMesh.position.x = this.topWidth / 2 - this.legRadiusTop;
                    legMesh.position.z = -this.topDepth / 2 + this.legRadiusTop;
                    legMesh.position.y = this.legHeight/2
                    break;
                case 4:
                    legMesh.position.x = -this.topWidth / 2 + this.legRadiusTop;
                    legMesh.position.z = -this.topDepth / 2 + this.legRadiusTop;
                    legMesh.position.y = this.legHeight/2
                    break;
              }
            legMesh.receiveShadow = true;
            legMesh.castShadow = true;
            this.app.scene.add( legMesh );
        }
    }
}
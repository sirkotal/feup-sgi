import * as THREE from 'three';

/**
 * This class represents a broken chair
 */
export class Chair {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} x - the position in the X axis of the chair
     * @param {*} y - the position in the Y axis of the chair
     * @param {*} z - the position in the Z axis of the chair
     * @param {*} seatWidth - the width of the seat
     * @param {*} seatHeight - the height of the seat
     * @param {*} seatDepth - the depth of the seat
     * @param {*} legRadiusTop - the radius of the top face of each leg's cylinder 
     * @param {*} legRadiusBottom - the radius of the bottom face of each leg's cylinder 
     * @param {*} legHeight - the height of each leg's cylinder 
     * @param {*} legRadialSegment - the radial segment count of each leg's cylinder 
     */
    constructor(app, x, y, z, seatWidth, seatHeight, seatDepth, legRadiusTop, legRadiusBottom, legHeight, legRadialSegment) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;

        this.seatWidth = seatWidth;
        this.seatHeight = seatHeight;
        this.seatDepth = seatDepth;

        this.legRadiusTop = legRadiusTop;
        this.legRadiusBottom = legRadiusBottom;
        this.legHeight = legHeight;
        this.legRadialSegment = legRadialSegment;

        this.group = new THREE.Group();
    }

    /**
     * builds the chair with the appropriate characteristics
     */
    build() {
        this.chairTexture = new THREE.TextureLoader().load('textures/dark_wood.avif');
        
        const chairMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
        specular: "#000000", emissive: "#000000", shininess: 90, map: this.chairTexture })

        const seat = new THREE.BoxGeometry( this.seatWidth, this.seatHeight, this.seatDepth );
        const seatMesh = new THREE.Mesh( seat, chairMaterial );
        seatMesh.receiveShadow = true;
        seatMesh.castShadow = true;
        this.group.add( seatMesh );
        const leg = new THREE.CylinderGeometry(this.legRadiusTop, this.legRadiusBottom, this.legHeight, this.legRadialSegment);
        const brokenleg = new THREE.CylinderGeometry(this.legRadiusTop, this.legRadiusBottom, this.legHeight/2, this.legRadialSegment);

        for (let i = 1; i < 5; i++) {
            
            let legMesh;

            switch (i) {
                case 1:
                    legMesh = new THREE.Mesh(leg, chairMaterial);
                    legMesh.position.x = this.seatWidth / 2 - this.legRadiusTop;
                    legMesh.position.z = this.seatDepth / 2 - this.legRadiusTop;
                    legMesh.position.y = -this.legHeight/2
                    break;
                case 2:
                    legMesh = new THREE.Mesh(leg, chairMaterial);
                    legMesh.position.x = -this.seatWidth / 2 + this.legRadiusTop;
                    legMesh.position.z = this.seatDepth / 2 - this.legRadiusTop;
                    legMesh.position.y = -this.legHeight/2
                    break;
                case 3:
                    legMesh = new THREE.Mesh(leg, chairMaterial);

                    legMesh.position.x = this.seatWidth / 2 - this.legRadiusTop;
                    legMesh.position.z = -this.seatDepth / 2 + this.legRadiusTop;
                    legMesh.position.y = -this.legHeight/2
                    break;
                case 4:
                    legMesh = new THREE.Mesh(brokenleg, chairMaterial);

                    legMesh.position.x = -this.seatWidth / 2 + this.legRadiusTop;
                    legMesh.position.z = -this.seatDepth / 2 + this.legRadiusTop;
                    legMesh.position.y = -this.legHeight/4

                    const looselegMesh = new THREE.Mesh(brokenleg, chairMaterial);

                    looselegMesh.position.x = -3
                    looselegMesh.position.z = -3
                    looselegMesh.position.y = this.legRadiusTop
                    looselegMesh.rotation.z = Math.PI/2
                    looselegMesh.rotation.x = Math.PI/3
                    looselegMesh.rotation.order = 'ZXY';
                    this.app.scene.add(looselegMesh)

                    break;
              }
            legMesh.receiveShadow = true;
            legMesh.castShadow = true;
            this.group.add( legMesh );
        }

        const back = new THREE.BoxGeometry( this.seatWidth, (this.seatHeight / 2), (this.seatDepth + this.seatHeight) );
        const backMesh = new THREE.Mesh( back, chairMaterial );
        backMesh.rotation.x = Math.PI/2;
        backMesh.position.y = 1;
        backMesh.position.z = -1;
        backMesh.receiveShadow = true;
        backMesh.castShadow = true;
        this.group.add( backMesh );

        this.group.position.x = this.x;
        this.group.position.y = this.y;
        this.group.position.z = this.z;
        this.group.rotation.x = -Math.PI/2

        this.app.scene.add( this.group );
    }
}
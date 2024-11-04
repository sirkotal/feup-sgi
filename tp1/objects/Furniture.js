import * as THREE from 'three';

/**
 * This class represents a piece of furniture
 */
export class Furniture {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} width - the width of the furniture
     * @param {*} height - the height of the furniture
     * @param {*} depth - the depth of the furniture
     */
    constructor(app, width, height, depth){
        this.app = app;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.group = new THREE.Group();
    }

    /**
     * builds the furniture with the appropriate characteristics
     */
    build(x,y,z) {
        const furnitureTexture = new THREE.TextureLoader().load('textures/wood.jpg');
        const transparentMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 }); 
        const furnitureMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, map: furnitureTexture }); // Brown color
        const furniture = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const furnitureMeshOne = new THREE.Mesh(furniture, [furnitureMaterial,furnitureMaterial,furnitureMaterial,furnitureMaterial,furnitureMaterial,transparentMaterial]);
        furnitureMeshOne.receiveShadow = true;
        furnitureMeshOne.castShadow = true;
        const furnitureMeshTwo = new THREE.Mesh(furniture, [furnitureMaterial,furnitureMaterial,furnitureMaterial,furnitureMaterial,furnitureMaterial,transparentMaterial]);
        furnitureMeshTwo.position.y = this.height;
        furnitureMeshTwo.receiveShadow = true;
        furnitureMeshTwo.castShadow = true;
        const furnitureMeshThree = new THREE.Mesh(furniture, [furnitureMaterial,furnitureMaterial,furnitureMaterial,furnitureMaterial,furnitureMaterial,transparentMaterial]);
        furnitureMeshThree.position.y = this.height * 2;
        furnitureMeshThree.receiveShadow = true;
        furnitureMeshThree.castShadow = true;

        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

        this.group.add(furnitureMeshOne);
        this.group.add(furnitureMeshTwo);
        this.group.add(furnitureMeshThree);

        for (let i = 1; i < 5; i++) {
            const leg = new THREE.CylinderGeometry(0.25, 0.25, 0.3);
            const legMesh = new THREE.Mesh(leg, legMaterial);

            switch (i) {
                case 1:
                    legMesh.position.x = this.width / 2 - 0.5;
                    legMesh.position.z = this.depth / 2 - 0.5;
                    legMesh.position.y = -0.91
                    break;
                case 2:
                    legMesh.position.x = -this.width / 2 + 0.5;
                    legMesh.position.z = this.depth / 2 - 0.5;
                    legMesh.position.y = -0.91
                    break;
                case 3:
                    legMesh.position.x = this.width / 2 - 0.5;
                    legMesh.position.z = -this.depth / 2 + 0.5;
                    legMesh.position.y = -0.91
                    break;
                case 4:
                    legMesh.position.x = -this.width / 2 + 0.5;
                    legMesh.position.z = -this.depth / 2 + 0.5;
                    legMesh.position.y = -0.91
                    break;
              }
            legMesh.receiveShadow = true;
            legMesh.castShadow = true;
            this.group.add( legMesh );

            this.group.position.x = x;
            this.group.position.y = y;
            this.group.position.z = z;
            this.group.rotation.y = Math.PI/4;

            this.app.scene.add(this.group)
        }

    }

    createLegs() {

        const legGeometry = new THREE.BoxGeometry(0.2, this.legHeight, 0.2); // Dimensions for legs
        const legs = [];

        // Define leg positions
        const legPositions = [
            { x: -this.boxWidth / 2 + 0.1, y: -this.boxHeight / 2 - this.legHeight / 2, z: -this.boxDepth / 2 + 0.1 }, // Front-left leg
            { x: this.boxWidth / 2 - 0.1, y: -this.boxHeight / 2 - this.legHeight / 2, z: -this.boxDepth / 2 + 0.1 },  // Front-right leg
            { x: -this.boxWidth / 2 + 0.1, y: -this.boxHeight / 2 - this.legHeight / 2, z: this.boxDepth / 2 - 0.1 },  // Back-left leg
            { x: this.boxWidth / 2 - 0.1, y: -this.boxHeight / 2 - this.legHeight / 2, z: this.boxDepth / 2 - 0.1 }   // Back-right leg
        ];

        // Create each leg
        legPositions.forEach(pos => {
            const legMesh = new THREE.Mesh(legGeometry, legMaterial);
            legMesh.position.set(pos.x, pos.y, pos.z);
            this.scene.add(legMesh);
            legs.push(legMesh);
        });

        this.legs = legs; // Store the legs in the instance for potential future reference
    }
}
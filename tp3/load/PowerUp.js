import * as THREE from 'three';

/**
 * This class creates a power-up object
 */
class MyPowerUp extends THREE.Object3D {
    constructor(x, y, z) {
        super();
        
        this.x = x;
        this.y = y;
        this.z = z;
        this.hitbox = new THREE.Box3();
    }

    initObject() {
        const geometry = new THREE.BoxGeometry( 5, 5, 5 ); // 10
        const texture = new THREE.TextureLoader().load('./game/textures/power.png');
        const material = new THREE.MeshPhongMaterial({ color: "#cccccc", 
            specular: "#000000", emissive: "#000000", map: texture});
        const cube = new THREE.Mesh( geometry, material ); 
        cube.receiveShadow = true;
        cube.castShadow = true;
        cube.position.x = this.x;
        cube.position.y = this.y;
        cube.position.z = this.z;
        this.updateHitbox(cube);
        return cube;
    }

    updateHitbox(mesh) {
        this.hitbox.setFromObject(mesh);
    }
}

export { MyPowerUp };
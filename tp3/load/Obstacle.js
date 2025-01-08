import * as THREE from 'three';

/**
 * This class creates an obstacle object
 */
class MyObstacle extends THREE.Object3D {
    constructor(x, y, z) {
        super();
        
        this.x = x;
        this.y = y;
        this.z = z;
        this.hitbox = new THREE.Box3();
    }

    initObject() {
        const geometry = new THREE.SphereGeometry( 4, 18, 8 );
        const texture = new THREE.TextureLoader().load('./game/textures/mine_metal.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const material = new THREE.MeshPhongMaterial({ color: "#cccccc", 
            specular: "#cccccc", emissive: "#000000", map: texture});

        const mine = new THREE.Mesh( geometry, material ); 
        mine.receiveShadow = true;
        mine.castShadow = true;
        mine.position.x = this.x;
        mine.position.y = this.y;
        mine.position.z = this.z;
        this.updateHitbox(mine);
        return mine;
    }

    updateHitbox(mesh) {
        this.hitbox.setFromObject(mesh);
    }
}

export { MyObstacle };
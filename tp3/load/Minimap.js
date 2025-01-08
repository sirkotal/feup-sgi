import * as THREE from 'three';

export class Minimap {
    constructor(position,material) {
        this.position = position
        this.material = material
        this.group = new THREE.Group();
        this.build()
    }

    build(){
        const geometry = new THREE.PlaneGeometry(4, 3, 256, 256); // Use higher subdivisions for detail
        const mesh = new THREE.Mesh(geometry, this.material);
        this.material.side = THREE.DoubleSide
        console.log(this.material)
        mesh.rotateY(Math.PI)
        this.group.add(mesh);
    }

    updatePosition(camera) {
        const distance = 0.1;
        const direction = new THREE.Vector3(0, 0, -100).applyQuaternion(camera.quaternion);
        const newPosition = new THREE.Vector3();
        newPosition.copy(camera.position).addScaledVector(direction, distance);
        newPosition.add(new THREE.Vector3(this.position.x, this.position.y, 0).applyQuaternion(camera.quaternion));
        this.group.position.copy(newPosition);
        this.group.quaternion.copy(camera.quaternion);

    }  
}

import * as THREE from 'three';
import { HelixCurve } from '../utils/Utils.js';

/**
 * This class represents a coil spring
 */
export class Spring {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} x - the position in the X axis of the spring
     * @param {*} y - the position in the Y axis of the spring
     * @param {*} z - the position in the Z axis of the spring
     * @param {*} radius - the radius of the spring
     * @param {*} height - the height of the spring
     * @param {*} coil_num - the number of coils in the spring
     */
    constructor(app, x, y, z, radius, height, coil_num) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.height = height;
        this.coils = coil_num;
    }

    /**
     * builds the spring with the appropriate characteristics
     */
    build() {        
        const metallicMaterial = new THREE.MeshPhongMaterial({ color: "#c0c0c0", 
        specular: "#c0c0c0", emissive: "#000000", shininess: 200/*, side: THREE.DoubleSide*/ })

        const helix = new HelixCurve(this.radius, this.height, this.coils);

        const spring = new THREE.TubeGeometry(helix, 128, 0.1, 128, false); // tubular segments, tube radius, radial segments, closed
        const springMesh = new THREE.Mesh( spring, metallicMaterial );
        springMesh.castShadow = true;
        springMesh.receiveShadow = true;

        const cover = new THREE.SphereGeometry( 0.1, 32, 16 ); 
        const coverMeshStart = new THREE.Mesh( cover, metallicMaterial );
        const coverMeshEnd = new THREE.Mesh( cover, metallicMaterial );  
        coverMeshStart.receiveShadow = true;
        coverMeshStart.castShadow = true;
        coverMeshEnd.receiveShadow = true;
        coverMeshEnd.castShadow = true;

        coverMeshStart.position.copy(helix.getPoint(0));
        coverMeshEnd.position.copy(helix.getPoint(1));

        this.parts = new THREE.Group();

        this.parts.add(springMesh);
        this.parts.add(coverMeshStart);
        this.parts.add(coverMeshEnd);
        
        this.parts.position.x = this.x;
        this.parts.position.y = this.y;
        this.parts.position.z = this.z;
        this.parts.rotation.x = Math.PI/2;
        this.parts.rotation.z = -Math.PI/2;

        this.app.scene.add( this.parts );
    }
}
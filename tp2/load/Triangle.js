import * as THREE from 'three';

// https://stackoverflow.com/questions/19350792/calculate-normal-of-a-single-triangle-in-3d-space
// https://stackoverflow.com/questions/39398503/draw-a-basic-triangle-with-three-js
// https://threejs.org/docs/#api/en/core/BufferGeometry
// https://threejs.org/docs/index.html#api/en/core/BufferAttribute
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_instancing_interleaved.html#L96
// https://en.wikipedia.org/wiki/Law_of_cosines

/**
 * This class creates a triangle utilizing THREE.BufferGeometry
 */
class Triangle extends THREE.BufferGeometry {
    /**
     * Constructs the object
     * @param {*} a - the first point of the triangle
     * @param {*} b - the second point of the triangle
     * @param {*} c - the third point of the triangle
     */
    constructor(a, b, c) {
        super();
        
        this.a = a;
        this.b = b;
        this.c = c;

        this.initBuffers();
    }

    /**
     * Initializes the buffers for creating a triangular mesh
     * @returns - a triangular mesh
     */
    initBuffers() {
        this.vertices = new Float32Array([
            this.a.x, this.a.y, this.a.z,
            this.b.x, this.b.y, this.b.z,
            this.c.x, this.c.y, this.c.z
        ]);

        this.indices = [
            0, 1, 2        
        ];

        const aCoords = new THREE.Vector3(this.a.x, this.a.y, this.a.z);
        const bCoords = new THREE.Vector3(this.b.x, this.b.y, this.b.z);
        const cCoords = new THREE.Vector3(this.c.x, this.c.y, this.c.z);

        const delta = aCoords.distanceTo(bCoords); // distance from A to B
        const echo = bCoords.distanceTo(cCoords); // distance from B to C
        const foxtrot = aCoords.distanceTo(cCoords); // distance from A to C
 
        const cosTheta = (delta * delta + echo * echo - foxtrot * foxtrot) / (2 * delta * echo);
        const sinTheta = Math.sqrt(1 - cosTheta**2);

        this.texCoords = new Float32Array([
            0, 0,  
            1, 0,      
            cosTheta, sinTheta
        ]);

        this.setIndex( this.indices );
        this.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
        this.computeVertexNormals();
        //this.normalizeNormals();
        this.setAttribute('uv', new THREE.BufferAttribute(this.texCoords, 2));

        return this;
    }
}

export { Triangle };
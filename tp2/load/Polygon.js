import * as THREE from 'three';
import { Triangle } from './Triangle.js';

// For information about the polygon creation algorithm, refer to utils/excalidraw_polygon_theory.png

/**
 * This class creates  a custom polygon utilizing THREE.BufferGeometry
 */
class Polygon extends THREE.BufferGeometry {
    /**
     * Constructs the object
     * @param {*} radius - the radius of the polygon
     * @param {*} stacks - the number of stacks in the polygon
     * @param {*} slices - the number of slices in the polygon
     * @param {*} color_c - the color at the polygon's center
     * @param {*} color_p - the color at the polygon's periphery
     */
    constructor(radius, stacks, slices, color_c, color_p) {
        super();
        
        this.radius = radius;
        this.stacks = stacks;
        this.slices = slices;
        this.color_c = color_c;
        this.color_p = color_p;

        this.centerVertices = [];
        this.indices = [];
        this.colors = [];
        this.texCoords = [];
        this.initBuffers();
    }

    /**
     * Initializes the buffers for creating a polygonal mesh
     * @returns - a polygonal mesh
     */
    initBuffers() {
        const centerAngle = (2* Math.PI) / this.slices;
        let offset = 0;

        for (let j = 1; j <= this.stacks; j++) {
            for (let i = 0 ; i < this.slices; i++) {
                //console.log(j)
                //console.log(this.radius / j)
                const angleFirst = i * centerAngle;
                const angleSecond = (i + 1) * centerAngle;

                this.centerVertices.push(0, 0, 0);
                const interpolatedColorZero = new THREE.Color().lerpColors(this.color_c, this.color_p, 0);
                const c1 = [interpolatedColorZero.r, interpolatedColorZero.g, interpolatedColorZero.b, interpolatedColorZero.a];
                this.colors.push(...c1);

                this.centerVertices.push(
                    (j * this.radius / this.stacks) * Math.cos(angleFirst),
                    (j * this.radius / this.stacks) * Math.sin(angleFirst),
                    0
                );

                const interpolatedColorOne = new THREE.Color().lerpColors(this.color_c, this.color_p, (j / this.stacks));
                const c2 = [interpolatedColorOne.r, interpolatedColorOne.g, interpolatedColorOne.b, interpolatedColorOne.a];
                this.colors.push(...c2);

                this.centerVertices.push(
                    (j * this.radius / this.stacks) * Math.cos(angleSecond),
                    (j * this.radius / this.stacks) * Math.sin(angleSecond),
                    0
                );

                const interpolatedColorTwo = new THREE.Color().lerpColors(this.color_c, this.color_p, (j / this.stacks));
                const c3 = [interpolatedColorTwo.r, interpolatedColorTwo.g, interpolatedColorTwo.b, interpolatedColorTwo.a];
                this.colors.push(...c3);

                const index = 3 * i + offset;
                this.indices.push(index, index + 1, index + 2);

                if (j < this.stacks && (index + 1) % 3 == 1) {
                    if (index + 1 == offset + 1) {
                        console.log(offset + 1)
                        this.indices.push(index + 1, index + (this.slices * 3) + 1, index + (((this.slices * 3) - 1) * 2));
                        this.indices.push(index + 4, index + (this.slices * 3) + 2, index + (this.slices * 3) + 1);
                    }
                    else {
                        this.indices.push(index + 1, index + (this.slices * 3) + 1, index + (this.slices * 3) - 2);
                    }
                }
            }
            offset += (this.slices - 1) * 3 + 3;
            //console.log(offset)
        }

        for (let i = 0; i < this.centerVertices.length; i += 3) {
            const x = this.centerVertices[i];
            const y = this.centerVertices[i + 1];
            const z = this.centerVertices[i + 2];
            
            const pointAngle = Math.atan2(z, x);  
            const u = (pointAngle + Math.PI) / (2 * Math.PI); 
            const v = (y + 1) / 2; 

            this.texCoords.push(u, v);
        }

        this.setIndex( this.indices );
        this.setAttribute('position', new THREE.Float32BufferAttribute(this.centerVertices, 3));
        this.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 4));
        this.computeVertexNormals();
        //this.setAttribute('uv', new THREE.Float32BufferAttribute(this.texCoords, 2));

        return this;
        
    }
}

export { Polygon };
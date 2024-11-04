import * as THREE from 'three';

/**
 * This class represents the flame of the cake's candle
 */
export class Flame {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} radius - the radius of the (bottom of the) flame
     * @param {*} height - the height of the conical part of flame
     * @param {*} radialSegment - the radial segments count of both the cone and the sphere
     */
    constructor(app, radius, height, radialSegment, angleStart, angleLength){
        this.app = app;
        this.radius = radius
        this.height = height;
        this.radialSegment = radialSegment;
        this.angleStart = angleStart;
        this.angleLength = angleLength;
    }

    /**
     * builds the flame with the appropriate characteristics
     */
    build() {
        const topFlameTexture = new THREE.TextureLoader().load('textures/flame.jpg');
        const topFlameMaterial = new THREE.MeshPhongMaterial({ color: "#fa9f43", 
            specular: "#000000", emissive: "#fa9f43", emissiveIntensity: 0.25,shininess: 90, map: topFlameTexture })
        const topFlame = new THREE.ConeGeometry( this.radius, this.height, this.radialSegment );
        const topFlameMesh = new THREE.Mesh( topFlame, topFlameMaterial );
        topFlameMesh.position.y = 4.09;
        topFlameMesh.position.z = -0.25;
        this.app.scene.add( topFlameMesh );

        const bottomFlameMaterial = new THREE.MeshPhongMaterial({ color: "#fa9f43", 
            specular: "#000000", emissive: "#fa9f43", emissiveIntensity: 0.25,shininess: 90, map: topFlameTexture })
        const bottomFlame = new THREE.SphereGeometry( this.radius, this.radialSegment, this.radialSegment, 0, Math.PI * 2, Math.PI, Math.PI / 2 );
        const bottomFlameMesh = new THREE.Mesh( bottomFlame, bottomFlameMaterial );
        bottomFlameMesh.position.y = 4.04;
        bottomFlameMesh.position.z = -0.25;
        this.app.scene.add( bottomFlameMesh );

        const pointLight = new THREE.PointLight( "#fa9f43", 0.1 );
        pointLight.position.set(0, 4.02, -0.25);
        this.app.scene.add( pointLight )    
    }
}
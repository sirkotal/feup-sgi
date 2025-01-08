import * as THREE from 'three';
import { MyNurbsBuilder, createNurbsSurfaces } from '../utils/Utils.js';

class MyTerrain extends THREE.Object3D {
    constructor(points, degree_u, degree_v, parts_u, parts_v) {
        super();
        
        this.points = points;
        this.degree_u = degree_u;
        this.degree_v = degree_v;
        this.parts_u = parts_u;
        this.parts_v = parts_v;
    }

    generateTerrain(app) {
        let minX = Infinity, minY = Infinity
        let maxX = -Infinity, maxY = -Infinity
            
        this.points.forEach(point => {
            if (point.x < minX) minX = point.x;
            if (point.y < minY) minY = point.y;
            
            if (point.x > maxX) maxX = point.x;
            if (point.y > maxY) maxY = point.y;
        });
            
        const width = maxX - minX;
        const height = maxY - minY;

        const texture = new THREE.TextureLoader().load('./game/textures/terrain.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const terrainMaterial = new THREE.MeshPhongMaterial({ color: "#cccccc", 
                    specular: "#000000", emissive: "#000000", map: texture});
                                
        let builder = new MyNurbsBuilder( app );
        const nurbsMesh = createNurbsSurfaces(builder, this.points, this.degree_u, 
            this.degree_v, this.parts_u, this.parts_v, terrainMaterial );
        nurbsMesh.receiveShadow = true;
        nurbsMesh.castShadow = true;

        nurbsMesh.position.y = 9.5;
        nurbsMesh.scale.set(250, 1, 250);
        nurbsMesh.position.x = -300;
        nurbsMesh.position.z = 400;

        return nurbsMesh;
    }
}

export { MyTerrain };
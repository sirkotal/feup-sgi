import * as THREE from 'three';

/**
 * This class represents a spotlight
 */
export class Spotlight {
    /**
     * constructs the object
     * @param {*} app - the application object
     */
    constructor(app){
        this.app = app;
        this.group = new THREE.Group();

        this.spotLight = new THREE.SpotLight( "#e8eba2", 10, 0, Math.PI/2-0.1, 0.5, 2.5 );
        this.spotLight.position.set(-1.75, 3.8, 1.35);
    }

    /**
     * builds the spotlight with the appropriate characteristics
     * @param {*} target - the spotlight target's position
     */
    build(target) {
        const rustyTexture = new THREE.TextureLoader().load('./textures/rust.jpg');
        rustyTexture.wrapS = THREE.RepeatWrapping;
        rustyTexture.wrapT = THREE.RepeatWrapping;

        const base = new THREE.CylinderGeometry(0.5,0.5,0.25)
        const baseMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90, map: rustyTexture})
        const baseMesh = new THREE.Mesh(base, baseMaterial)
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        baseMesh.position.y = -1;
        
        const support = new THREE.BoxGeometry(0.5,1,0.1)
        const supportMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90, map: rustyTexture})
        const supportMesh = new THREE.Mesh(support, supportMaterial)
        supportMesh.position.y = -0.5
        supportMesh.position.z = 0.4
        supportMesh.rotation.x = Math.PI/8
        supportMesh.castShadow = true;
        supportMesh.receiveShadow = true;

        const support2Mesh = new THREE.Mesh(support, supportMaterial)
        support2Mesh.position.y = -0.5
        support2Mesh.position.z = -0.4
        support2Mesh.rotation.x = -Math.PI/8
        support2Mesh.castShadow = true;
        support2Mesh.receiveShadow = true;

        const superiorPart = new THREE.Group();

        const back = new THREE.CylinderGeometry(0.5,0.5,1)
        const backMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90, map: rustyTexture})
        const backMesh = new THREE.Mesh(back, backMaterial)
        backMesh.rotation.z = -Math.PI/2
        backMesh.castShadow = true;
        backMesh.receiveShadow = true;
        superiorPart.add(backMesh)

        const rustyHeadTexture = new THREE.TextureLoader().load('./textures/rust.jpg');
        rustyHeadTexture.wrapS = THREE.RepeatWrapping;
        rustyHeadTexture.wrapT = THREE.RepeatWrapping;
        rustyHeadTexture.rotation = Math.PI/2
        const head = new THREE.SphereGeometry(0.75, 32, 16, 0, Math.PI ); 
        const headMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90, side: THREE.DoubleSide, map: rustyHeadTexture})
        const headMesh = new THREE.Mesh( head, headMaterial );
        headMesh.position.x = 1.2;
        headMesh.rotation.y = -Math.PI/2
        headMesh.castShadow = true;
        headMesh.receiveShadow = true;
        superiorPart.add(headMesh)

        const light = new THREE.SphereGeometry(0.25)
        const lightMaterial = new THREE.MeshPhongMaterial({ color: "#e8eba2", 
            specular: "#000000", emissive: "#e8eba2", emissiveIntensity: 2, shininess: 90, transparent: true, opacity:0.8})
        const lightMesh = new THREE.Mesh( light, lightMaterial );
        lightMesh.position.x = 0.75;
        lightMesh.scale.z = 1.25;
        lightMesh.receiveShadow = true;
        superiorPart.add(lightMesh)
        
        const glass = new THREE.SphereGeometry(0.75, 32, 16, 0, Math.PI ); 
        const glassTexture = new THREE.TextureLoader().load('./textures/glass.jpg');
        glassTexture.wrapS = THREE.RepeatWrapping;
        glassTexture.wrapT = THREE.RepeatWrapping;
        glassTexture.repeat.set( 2, 2 );
        const glassMaterial = new THREE.MeshPhongMaterial({ color: "#e8eba2", 
            specular: "#000000", emissive: "#e8eba2", shininess: 90, transparent: true, opacity: 0.8, map: glassTexture})
        const glassMesh = new THREE.Mesh( glass, glassMaterial );
        glassMesh.position.x = 1.2;
        glassMesh.scale.z = 0.25
        glassMesh.rotation.y = Math.PI/2
        superiorPart.add(glassMesh)
        
        superiorPart.rotation.z = -Math.PI/20

        this.group.add( baseMesh );
        this.group.add( supportMesh );
        this.group.add( support2Mesh );
        this.group.add( superiorPart );

        this.group.position.x = -2;
        this.group.position.y = 3.9;
        this.group.position.z = 1.5;
        this.group.scale.set(0.6, 0.6, 0.6);
        this.group.rotation.y = Math.PI/5;
        this.app.scene.add( this.group );
        
        const mapSize = 4096
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = mapSize;
        this.spotLight.shadow.mapSize.height = mapSize;
        this.spotLight.shadow.camera.near = 0.01;
        this.spotLight.shadow.camera.far = 10;
        this.spotLight.target = target;

        this.app.scene.add( this.spotLight )
    }
}
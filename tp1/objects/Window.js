import * as THREE from 'three';

/**
 * This class represents a window
 */
export class Window {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} x - the position in the X axis of the window
     * @param {*} y - the position in the Y axis of the window
     * @param {*} z - the position in the Z axis of the window
     */
    constructor(app, x, y, z){
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
        this.group = new THREE.Group();
    }

    /**
     * builds the window with the appropriate characteristics
     */
    build() {
        const woodTexture = new THREE.TextureLoader().load('textures/fringe.avif');
        woodTexture.wrapS = THREE.RepeatWrapping;
        woodTexture.wrapT = THREE.RepeatWrapping;

        const woodMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90, map: woodTexture })

        const wood_frame_vert = new THREE.BoxGeometry( 0.5, 6, 0.5 );
        const wood_frame_hor = new THREE.BoxGeometry( 4.5, 0.5, 0.5 );

        const woodMeshOne = new THREE.Mesh( wood_frame_vert, woodMaterial );
        woodMeshOne.position.x = -2;
        woodMeshOne.position.y = 1;

        this.group.add( woodMeshOne );

        const woodMeshTwo = new THREE.Mesh( wood_frame_vert, woodMaterial );
        woodMeshTwo.position.x = 2;
        woodMeshTwo.position.y = 1;

        this.group.add( woodMeshTwo );

        const woodMeshThree = new THREE.Mesh( wood_frame_hor, woodMaterial );
        woodMeshThree.position.y = 4.25;

        this.group.add( woodMeshThree );

        const woodMeshFour = new THREE.Mesh( wood_frame_hor, woodMaterial );
        woodMeshFour.position.y = -2.25;

        this.group.add( woodMeshFour );

        const wood_cross_vert = new THREE.BoxGeometry( 0.1, 6, 0.1 );
        const wood_cross_hor = new THREE.BoxGeometry( 4.5, 0.1, 0.1 );

        const crossMeshV = new THREE.Mesh( wood_cross_vert, woodMaterial );
        crossMeshV.position.y = 1;

        this.group.add( crossMeshV );

        const crossMeshH = new THREE.Mesh( wood_cross_hor, woodMaterial );
        crossMeshH.position.y = 1;

        this.group.add( crossMeshH );

        const glassTexture = new THREE.TextureLoader().load('textures/broken_glass.jpg');
        glassTexture.wrapS = THREE.RepeatWrapping;
        glassTexture.wrapT = THREE.RepeatWrapping;
        glassTexture.rotation = -Math.PI/2
        const glassUVRate = 1; // 12 / 12
        const glassTextureUVRate = 360 / 540; 
        const glassTextureRepeatU = 1;
        const glassTextureRepeatV = glassTextureRepeatU * glassUVRate * glassTextureUVRate * 1.5;
        glassTexture.repeat.set( glassTextureRepeatU, glassTextureRepeatV );

        const glassMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90, transparent: true, opacity: 0.5 ,map: glassTexture })
        const glass = new THREE.BoxGeometry( 3.5, 6, 0.1 );
        const glassMesh = new THREE.Mesh( glass, glassMaterial );
        glassMesh.position.y = 1;
        glassMesh.position.z = 0.01;

        this.group.add( glassMesh );
        
        this.group.position.x = this.x;
        this.group.position.y = this.y+2;
        this.group.position.z = this.z;

        this.app.scene.add(this.group)
    }
}
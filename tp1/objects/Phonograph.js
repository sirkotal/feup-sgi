import * as THREE from 'three';

/**
 * This class represents a phonograph
 */
export class Phonograph {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} x - the position in the X axis of the phonograph
     * @param {*} y - the position in the Y axis of the phonograph
     * @param {*} z - the position in the Z axis of the phonograph
     */
    constructor(app, x, y, z) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
        this.off = true;

        this.offMaterial = new THREE.MeshPhongMaterial({ color: "#d00000", 
        specular: "#000000", emissive: "#000000", shininess: 90, side: THREE.DoubleSide })
        this.onMaterial = new THREE.MeshPhongMaterial({ color: "#008000", 
        specular: "#000000", emissive: "#000000", shininess: 90, side: THREE.DoubleSide })

        const press = new THREE.CircleGeometry( 0.05, 96 );
        this.pressMesh = new THREE.Mesh( press, this.offMaterial );
        this.pressMesh.position.y = 0.06;
        this.pressMesh.position.x = 1;
        this.pressMesh.position.z = -0.8;
        this.pressMesh.rotation.x = Math.PI/2;
        this.pressMesh.receiveShadow = true;
        this.pressMesh.castShadow = true;
    }

    /**
     * builds the phonograph with the appropriate characteristics
     */
    build() {        
        const rustyTexture = new THREE.TextureLoader().load('./textures/rust.jpg');
        rustyTexture.wrapS = THREE.RepeatWrapping;
        rustyTexture.wrapT = THREE.RepeatWrapping;

        const vinylTexture = new THREE.TextureLoader().load('./textures/vinyl.png');
        vinylTexture.wrapS = THREE.RepeatWrapping;
        vinylTexture.wrapT = THREE.RepeatWrapping;

        const topTexture = new THREE.TextureLoader().load('./textures/phono_top.png');
        topTexture.wrapS = THREE.RepeatWrapping;
        topTexture.wrapT = THREE.RepeatWrapping;

        const phonoMaterialTop = new THREE.MeshPhongMaterial({ color: "#8c896f", 
        specular: "#000000", emissive: "#000000", shininess: 90, map: topTexture })
        const phonoMaterialBottom = new THREE.MeshPhongMaterial({ color: "#252525", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        const discMaterial = new THREE.MeshPhongMaterial({ color: "#000000", 
        specular: "#000000", emissive: "#000000", shininess: 200, map: vinylTexture, side: THREE.DoubleSide })
        const innerDiscMaterial = new THREE.MeshPhongMaterial({ color: "#ffff00",
        specular: "#000000", emissive: "#000000", shininess: 90, side: THREE.DoubleSide })

        const metallicMaterial = new THREE.MeshPhongMaterial({ color: "#c0c0c0", 
        specular: "#c0c0c0", emissive: "#000000", shininess: 110, map: rustyTexture })
        
        const buttonMaterial = new THREE.MeshPhongMaterial({ color: "#757474", 
        specular: "#757474", emissive: "#000000", shininess: 90, map: rustyTexture, side: THREE.DoubleSide })

        const phonoTop = new THREE.BoxGeometry( 2.5, 0.1, 2 );
        const phonoTopMesh = new THREE.Mesh( phonoTop, phonoMaterialTop );
        phonoTopMesh.receiveShadow = true;
        phonoTopMesh.castShadow = true;

        const phonoBottom = new THREE.BoxGeometry( 2.5, 0.1, 2 );
        const phonoBottomMesh = new THREE.Mesh( phonoBottom, phonoMaterialBottom );
        phonoBottomMesh.position.y = -0.1;
        phonoBottomMesh.receiveShadow = true;
        phonoBottomMesh.castShadow = true;
        
        const disc = new THREE.CircleGeometry( 0.7, 96 ); 
        const discMesh = new THREE.Mesh( disc, discMaterial );
        discMesh.rotation.x = Math.PI/2;
        discMesh.position.y = 0.06;
        discMesh.position.x = 0.2;
        discMesh.receiveShadow = true;
        discMesh.castShadow = true;

        const innerDisc = new THREE.CircleGeometry( 0.3, 64 ); 
        const innerDiscMesh = new THREE.Mesh( innerDisc, innerDiscMaterial );
        innerDiscMesh.rotation.x = Math.PI/2;
        innerDiscMesh.position.y = 0.062;
        innerDiscMesh.position.x = 0.2;

        const innerSmallDisc = new THREE.CircleGeometry( 0.1, 64 ); 
        const innerSmallDiscMesh = new THREE.Mesh( innerSmallDisc, discMaterial );
        innerSmallDiscMesh.rotation.x = Math.PI/2;
        innerSmallDiscMesh.position.y = 0.064;
        innerSmallDiscMesh.position.x = 0.2;

        const armPoints = [
            new THREE.Vector3(0, 0, 0),     
            new THREE.Vector3(0.65, 0.7, 0),  
            new THREE.Vector3(1.25, 0.7, -1),  
            new THREE.Vector3(1.85, 0.5, -2),
            new THREE.Vector3(2.5, 0.3, -2.5)
        ];
        
        const armCurve = new THREE.CatmullRomCurve3(armPoints);
        const tubeGeometry = new THREE.TubeGeometry(armCurve, 128, 0.1, 128, false);
        
        const armMesh = new THREE.Mesh(tubeGeometry, metallicMaterial);
        armMesh.position.x = -1.2;
        armMesh.position.z = 0.7;
        armMesh.scale.set(0.5, 0.5, 0.5);
        armMesh.receiveShadow = true;
        armMesh.castShadow = true;

        const cover = new THREE.SphereGeometry( 0.1, 32, 16 ); 
        const coverMesh = new THREE.Mesh( cover, metallicMaterial ); 
        coverMesh.position.x = 0.05;
        coverMesh.position.z = -0.55;
        coverMesh.position.y = 0.15;
        coverMesh.scale.set(0.5, 0.5, 0.5);
        coverMesh.receiveShadow = true;
        coverMesh.castShadow = true;

        const needle = new THREE.ConeGeometry( 0.01, 0.12, 32 );
        const needleMesh = new THREE.Mesh( needle, metallicMaterial ); 
        needleMesh.position.x = 0.05;
        needleMesh.position.z = -0.55;
        needleMesh.position.y = 0.08;
        needleMesh.rotation.x = Math.PI;
        needleMesh.scale.set(0.5, 0.5, 0.5);
        needleMesh.receiveShadow = true;
        needleMesh.castShadow = true;

        const button = new THREE.RingGeometry( 0.05, 0.1, 30 );
        const buttonMesh = new THREE.Mesh( button, buttonMaterial );
        buttonMesh.position.y = 0.06;
        buttonMesh.position.x = 1;
        buttonMesh.position.z = -0.8;
        buttonMesh.rotation.x = Math.PI/2;
        buttonMesh.receiveShadow = true;
        buttonMesh.castShadow = true;

        this.parts = new THREE.Group();

        this.parts.add(phonoTopMesh);
        this.parts.add(phonoBottomMesh);
        this.parts.add(discMesh);
        this.parts.add(innerDiscMesh);
        this.parts.add(innerSmallDiscMesh);
        this.parts.add(armMesh);
        this.parts.add(coverMesh);
        this.parts.add(needleMesh);
        this.parts.add(buttonMesh);
        this.parts.add(this.pressMesh);


        this.parts.position.x = this.x;
        this.parts.position.y = this.y-0.5;
        this.parts.position.z = this.z;
        this.parts.rotation.y = Math.PI/4;

        this.app.scene.add( this.parts );
    }

    /**
     * turns the phonograph on or off
     */
    setButtonColor() {
        console.log("called")
        this.pressMesh.material = this.off ? this.onMaterial : this.offMaterial;
        this.off = this.off ? false : true;
    }
}
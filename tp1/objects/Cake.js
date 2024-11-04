import * as THREE from 'three';

/**
 * This class represents the cake
 */
export class Cake {
    /**
     * constructs the object
     * @param {*} app - the application object
     * @param {*} radius - the radius of the cake
     * @param {*} height - the height of the cake
     * @param {*} radialSegment - the radial segments count of the cylinder that makes up the cake
     * @param {*} angleStart - the start angle for first segment
     * @param {*} angleLength - the central angle of the circular sector
     */
    constructor(app, radius, height, radialSegment, angleStart, angleLength){
        this.app = app;
        this.radius = radius
        this.height = height;
        this.radialSegment = radialSegment;
        this.angleStart = angleStart;
        this.angleLength = angleLength;
        this.group = new THREE.Group()
        this.crumbs = [];
    }

    /**
     * builds the cake with the appropriate characteristics
     */
    build() {
        const cakeTopTexture = new THREE.TextureLoader().load('./textures/cakeTop.jpg');
        cakeTopTexture.wrapS = THREE.RepeatWrapping;
        cakeTopTexture.wrapT = THREE.RepeatWrapping;
        
        let UVRate = 1;
        let TextureUVRate = 540 / 360; 
        let TextureRepeatU = 2;
        let TextureRepeatV = TextureRepeatU * UVRate * TextureUVRate
        cakeTopTexture.repeat.set( TextureRepeatU, TextureRepeatV );

        const cakeOutsideTexture = new THREE.TextureLoader().load('./textures/cakeOutside.jpg');
        cakeOutsideTexture.wrapS = THREE.RepeatWrapping;
        cakeOutsideTexture.wrapT = THREE.RepeatWrapping;
        //check this part
        UVRate = 1;
        TextureUVRate = 275 / 183; 
        TextureRepeatU = 5;
        TextureRepeatV = TextureRepeatU * UVRate * TextureUVRate
        cakeOutsideTexture.repeat.set( TextureRepeatU, TextureRepeatV );

        const cakeInsideTexture = new THREE.TextureLoader().load('./textures/cakeInside.jpg');
        cakeInsideTexture.wrapS = THREE.RepeatWrapping;
        cakeInsideTexture.wrapT = THREE.RepeatWrapping;
       
        UVRate = 1;
        TextureUVRate = 612 / 612; 
        TextureRepeatU = 1;
        TextureRepeatV = TextureRepeatU * UVRate * TextureUVRate
        cakeInsideTexture.repeat.set( TextureRepeatU, TextureRepeatV );

        const cakeTopMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90, map: cakeTopTexture  })

        const cakeOutsideMaterial = new THREE.MeshPhongMaterial({ color: "#fff000", 
            specular: "#ff0000", emissive: "#000000", shininess: 90, map: cakeOutsideTexture  })
        
        const cakeInsideMaterial = new THREE.MeshPhongMaterial({ color: "#fff000", 
            specular: "#ff0000", emissive: "#000000", shininess: 90, map: cakeInsideTexture  })

        const cakeCylinder = new THREE.CylinderGeometry( this.radius, this.radius, this.height, this.radialSegment,
             1, false, this.angleStart, this.angleLength );
        const cakeCylinderMesh = new THREE.Mesh( cakeCylinder, [cakeOutsideMaterial, cakeTopMaterial] );
        cakeCylinderMesh.castShadow = true;
        cakeCylinderMesh.receiveShadow = true;

        const cakePlaneRight = new THREE.PlaneGeometry( this.radius, this.height );
        const cakePlaneRightMesh = new THREE.Mesh( cakePlaneRight, cakeInsideMaterial );
        cakePlaneRightMesh.position.x = this.radius/2 * Math.cos(-Math.PI/2+this.angleStart);
        cakePlaneRightMesh.position.z = this.radius/2 * -Math.sin(-Math.PI/2+this.angleStart);
        cakePlaneRightMesh.rotation.y = -Math.PI/2+this.angleStart;
        cakePlaneRightMesh.castShadow = true;
        cakePlaneRightMesh.receiveShadow = true;

        let cakePlaneLeft = new THREE.PlaneGeometry( this.radius, this.height );
        const cakePlaneLeftMesh = new THREE.Mesh( cakePlaneLeft, cakeInsideMaterial );
        cakePlaneLeftMesh.position.x = -this.radius/2 * Math.cos(Math.PI/2+this.angleStart+this.angleLength);
        cakePlaneLeftMesh.position.z = this.radius/2 * Math.sin(Math.PI/2+this.angleStart+this.angleLength);
        cakePlaneLeftMesh.rotation.y = Math.PI/2+this.angleStart+this.angleLength;
        cakePlaneLeftMesh.castShadow = true;
        cakePlaneLeftMesh.receiveShadow = true;
        
        // 20 for now, but could be less (or more)
        for (let i = 0; i < 20; i++) {
            let crumb = new THREE.DodecahedronGeometry((Math.random() * (0.02 - 0.005) + 0.005));
            const crumbMesh = new THREE.Mesh( crumb, cakeInsideMaterial );
            crumbMesh.position.x = (Math.random() * (0.6 - (-0.6)) + (-0.6));
            crumbMesh.position.y = -this.height/2;
            crumbMesh.position.z = (Math.random() * (0.7 - 0.2) + 0.2);
            crumbMesh.rotation.x = (Math.random() * (2*Math.PI - 0));
            crumbMesh.rotation.y = (Math.random() * (2*Math.PI - 0));
            crumbMesh.rotation.z = (Math.random() * (2*Math.PI - 0));
            crumbMesh.castShadow = true;
            crumbMesh.receiveShadow = true;
            this.crumbs.push(crumbMesh);
        }

        this.group.add( cakeCylinderMesh );
        this.group.add( cakePlaneRightMesh );
        this.group.add( cakePlaneLeftMesh );
        this.crumbs.forEach(crumb => {
            this.group.add(crumb);
        });
        this.group.position.y = 3.52;

        this.app.scene.add( this.group );
    }
}
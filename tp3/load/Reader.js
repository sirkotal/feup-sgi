import * as THREE from 'three';
import { MyTrack } from './Track.js';
import { loadMipmap, MyNurbsBuilder, createNurbsSurfaces } from '../utils/Utils.js';
import { MyRoute } from './Route.js';
import { MyPowerUp } from './PowerUp.js';
import { MyObstacle } from './Obstacle.js';
import { Balloon } from './Balloon.js';
import { MyTerrain } from './Terrain.js';
import { MyPark } from './Park.js';

class MyReader {
    constructor(app, contents) {
        this.appInstance = app;
        this.contents = contents;
    }

    /**
     * Loads the cameras into the scene and sets the active camera
     * @param {*} cameras - the object containing the cameras
     */
    loadCameras(cameras) {  
        if (cameras) {
            
            Object.keys(cameras).forEach(key => {
                if (key !== "initial") {
                    const camera = cameras[key];
        
                    if (camera.type !== "orthogonal" && camera.type !== "perspective") {
                        throw new Error("inconsistency: unsupported camera type " + camera.type + "!");
                    }
        
                    if (camera.type == "orthogonal") {
                        const orthogonal = new THREE.OrthographicCamera( camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far )
                        orthogonal.position.set(camera.location.x, camera.location.y, camera.location.z)
                        orthogonal.target = new THREE.Vector3(camera.target.x, camera.target.y, camera.target.z)
                        this.appInstance.cameras[key] = orthogonal
                    }
        
                    if (camera.type == "perspective") {
                        const perspective = new THREE.PerspectiveCamera( camera.angle, window.innerWidth / window.innerHeight, camera.near, camera.far )
                        perspective.position.set(camera.location.x, camera.location.y, camera.location.z)
                        perspective.target = new THREE.Vector3(camera.target.x, camera.target.y, camera.target.z)
                        this.appInstance.cameras[key] = perspective
                    }
                }
            });
            this.appInstance.setActiveCamera(cameras.initial);
        }
    }

    /**
     * Loads the global settings for the scene -> background, ambient light and skybox
     * @param {*} globals - the object containing the globals' characteristics
     */
    loadGlobals(globals) {  
        if (globals.background) {
            const backgroundColor = new THREE.Color(globals.background.r, globals.background.g, globals.background.b);
            this.appInstance.scene.background = backgroundColor;
        }
    
        if (globals.ambient) {
            const lightColor = new THREE.Color(globals.ambient.r, globals.ambient.g, globals.ambient.b);
            const ambientLight = new THREE.AmbientLight(lightColor, globals.ambient.intensity);
            this.appInstance.scene.add(ambientLight);
            this.appInstance.ambientLight = ambientLight;
        }
    
        if (globals.skybox) {
            const skybox = new THREE.BoxGeometry(globals.skybox.size.x, globals.skybox.size.y, globals.skybox.size.z);
            skybox.frustrumCulled = false;
            const emissiveColor = new THREE.Color(globals.skybox.emissive.r, globals.skybox.emissive.g, globals.skybox.emissive.b);
    
            const skyboxTextures = [globals.skybox.front, globals.skybox.back, globals.skybox.up, globals.skybox.down,
                                    globals.skybox.left, globals.skybox.right];
            let skyboxMaterialList = [];
    
            for (let tex of skyboxTextures) {
                skyboxMaterialList.push(new THREE.MeshStandardMaterial({ emissive: emissiveColor, emissiveIntensity: globals.skybox.intensity, 
                    side: THREE.DoubleSide, map: new THREE.TextureLoader().load(tex) }));
            }
            const skyboxMesh = new THREE.Mesh(skybox, skyboxMaterialList);
            skyboxMesh.position.x = globals.skybox.center.x
            skyboxMesh.position.y = globals.skybox.center.y
            skyboxMesh.position.z = globals.skybox.center.z
            skyboxMesh.receiveShadow = true;
            this.appInstance.scene.add(skyboxMesh);
        }
    }

    /**
     * Loads the fog into the scene
     * @param {*} fog - the object containing the fog's characteristics
     */
    loadFog(fog) {  
        if (fog.color) {
            const fogColor = new THREE.Color(fog.color.r, fog.color.g, fog.color.b);
            const sceneFog = new THREE.Fog(fogColor, fog.near, fog.far);
            this.appInstance.scene.fog = sceneFog;
            this.appInstance.fog = sceneFog;
        }
    }

    /**
     * Loads the Material into the scene
     * @param {*} materials - the object containing the materials
     * @param {*} textures - the object containing the textures
     */
    loadMaterials(materials, textures) {
        const materialsList = new Map();
        if (materials){
            Object.keys(materials).forEach(key => {
                const material = materials[key]
                let texture = null;
                let bumpTexture = null;
                let specularTexture = null;
                if(textures[material.textureref]){
                    if (textures[material.textureref].isVideo){
                        const video = document.createElement('video');
                        video.id = "videos"; 
                        video.src = textures[material.textureref].filepath;
                        video.autoplay = true;
                        video.loop = true; 
                        video.muted = true;
                        video.style.display = 'none';
        
                        //document.body.appendChild(video);
                        texture = new THREE.VideoTexture(video);
                        texture.colorSpace = THREE.SRGBColorSpace;
                    }
                    else {
                        texture = new THREE.TextureLoader().load('./'+textures[material.textureref].filepath);
                    }
                    //texture.generateMipmaps = true;
                    //texture.minFilter = THREE.LinearMipMapLinearFilter;
                    for (let i = 0; i <= 7; i++){
                        if (textures[material.textureref][`mipmap${i}`]){
                            texture.generateMipmaps = false;
                            loadMipmap(texture, i, textures[material.textureref][`mipmap${i}`]) 
                        }
                    }
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    let texlength_s = 1;
                    if (material.texlength_s)
                        texlength_s = material.texlength_s;
                    let texlength_t = 1;
                    if (material.texlength_t)
                        texlength_t = material.texlength_t;
                    texture.repeat.set(texlength_s,texlength_t)
                }
                if (textures[material.bumpref]){
                    bumpTexture = new THREE.TextureLoader().load('./'+textures[material.bumpref].filepath);
                    texture.generateMipmaps = true;
                    bumpTexture.wrapS = THREE.RepeatWrapping;
                    bumpTexture.wrapT = THREE.RepeatWrapping;
                    let texlength_s = 1;
                    if (material.texlength_s)
                        texlength_s = material.texlength_s;
                    let texlength_t = 1;
                    if (material.texlength_t)
                        texlength_t = material.texlength_t;
                    bumpTexture.repeat.set(texlength_s,texlength_t)
                }
                if (textures[material.specularref]){
                    specularTexture = new THREE.TextureLoader().load('./'+textures[material.specularref].filepath);
                    //texture.generateMipmaps = true;
                    specularTexture.wrapS = THREE.RepeatWrapping;
                    specularTexture.wrapT = THREE.RepeatWrapping;
                    let texlength_s = 1;
                    if (material.texlength_s)
                        texlength_s = material.texlength_s;
                    let texlength_t = 1;
                    if (material.texlength_t)
                        texlength_t = material.texlength_t;
                    specularTexture.repeat.set(texlength_s,texlength_t)
                }
                materialsList.set(key, new THREE.MeshPhongMaterial({ color:  new THREE.Color(material.color.r, material.color.g, material.color.b), 
                    specular: new THREE.Color(material.specular.r, material.specular.g, material.specular.b), 
                    emissive: new THREE.Color(material.emissive.r, material.emissive.g, material.emissive.b),
                    shininess: material.shininess, transparent: material.transparent, opacity: material.opacity,
                    wireframe: material.wireframe ? material.wireframe : false,
                    flatShading: material.shading ? material.shading : false,
                    map: texture,
                    side: material.twoSided ? material.twoSided : false,
                    bumpMap: bumpTexture,
                    bumpScale: material.bumpScale ? material.bumpScale : 1.0,
                    specularMap: specularTexture,
                    side: THREE.DoubleSide
                }))
            })
        }
        return materialsList
    }

    /**
     * Loads the Object into the scene
     * @param {*} graph - the graph part of the YASF
     */
    loadObjects(graph) {  
        if (graph) {
            const root = graph[graph.rootid];
            root.tag = graph.rootid;
            const scene = this.loadObjectsDFS(graph, root, new THREE.MeshStandardMaterial());
            console.log(scene);
            this.appInstance.scene.add(scene);

            /*let minX = Infinity, minY = Infinity
                    let maxX = -Infinity, maxY = -Infinity
                        
                    this.points.forEach(point => {
                        if (point.x < minX) minX = point.x;
                        if (point.y < minY) minY = point.y;
                        
                        if (point.x > maxX) maxX = point.x;
                        if (point.y > maxY) maxY = point.y;
                    });
                        
                    const width = maxX - minX;
                    const height = maxY - minY;*/
            
                    const texture = new THREE.TextureLoader().load('./game/textures/terrain.jpg');
                    //texture.repeat.set(width/texture.repeat.x, height/texture.repeat.y)
                    const terrainMaterial = new THREE.MeshPhongMaterial({ color: "#cccccc", 
                                specular: "#000000", emissive: "#000000", map: texture});
                                            
                    let builder = new MyNurbsBuilder( this.appInstance );
                    const nurbsMesh = createNurbsSurfaces(builder, [
                        { "x": -1000, "y": 0, "z": 250 },
                        { "x": -500, "y": 0, "z": 250 },
                        { "x": 0, "y": 0, "z": 250 },
                        { "x": 500, "y": 0, "z": 250 },

                        { "x": -1000, "y": 0, "z": 250 },
                        { "x": -500, "y": 0, "z": 250 },
                        { "x": 0, "y": 0, "z": 250 },
                        { "x": 500, "y": 0, "z": 250 },

                        { "x": -1000, "y": 0, "z": 250 },
                        { "x": -500, "y": 0, "z": 250 },
                        { "x": 0, "y": 0, "z": 250 },
                        { "x": 500, "y": 0, "z": 250 },

                        { "x": -1000, "y": 0, "z": 250 },
                        { "x": -500, "y": 0, "z": 250 },
                        { "x": 0, "y": 0, "z": 250 },
                        { "x": 500, "y": 0, "z": 250 }
                    ], 3, 
                        3, 20, 20, terrainMaterial );
                    nurbsMesh.receiveShadow = true;
                    nurbsMesh.castShadow = true;
            
                    nurbsMesh.position.y = 30;

                    this.appInstance.scene.add(nurbsMesh);

            /*const test = new THREE.Vector3(-20, 40, -10);
            const outOfBounds = track.checkRacerBounds(test);
            if (outOfBounds) {
                console.log("McQueen is out!");
            }
            else {
                console.log("KACHOW!");
            }*/
        }
    }

    /**
     * Helper to parse the graph
     * @param {*} graph - the graph part of the YASF
     * @param {*} node - the current node
     * @param {*} material - the current material
     */
    loadObjectsDFS(graph, node, material) {  
        const group = new THREE.Group();
        group.name = node?.tag;
        let key;
        for (key in node?.children) {
            if (key === "nodesList") {
                for (let child of node.children.nodesList) {
                    let materialNode = material
                    if (graph[child].materialref) {
                        materialNode = this.appInstance.materialsList.get(graph[child].materialref.materialId)
                    }
                    graph[child].tag = child
                    let anotherNode = this.loadObjectsDFS(graph, graph[child], materialNode);
                    group.add(anotherNode);
                }
            }
            else if (key === "lodsList") {
                for (let child of node.children.lodsList) {
                    const lods = new THREE.LOD();
    
                    for (let lodNode of graph[child].lodNodes) {
                        let materialLod = material
                        if (graph[child].materialref){
                            materialLod = this.appInstance.materialsList.get(graph[child].materialref.materialId)
                        }
                        let anotherNode = this.loadObjectsDFS(graph, graph[lodNode.nodeId], materialLod);
                        lods.addLevel(anotherNode, lodNode.mindist);
                    }
                    if (graph[child].transforms){
                        for (const transformation of graph[child].transforms){
                            if (transformation.type == "translate"){
                                lods.position.x = transformation.amount.x
                                lods.position.y = transformation.amount.y
                                lods.position.z = transformation.amount.z
                            }
                            else if (transformation.type == "scale"){
                                lods.scale.set(transformation.amount.x, transformation.amount.y, transformation.amount.z);
                            }
                            else if (transformation.type == "rotate"){
                                lods.rotation.x = transformation.amount.x * Math.PI / 180
                                lods.rotation.y = transformation.amount.y * Math.PI / 180
                                lods.rotation.z = transformation.amount.z * Math.PI / 180
                            }
                        }
                    }
                    group.add(lods);
                }
            }
            else {
                switch (node.children[key].type) {
                    case 'pointlight':
                        if (!node.children[key].enabled) {
                            node.children[key].enabled = true;
                        }
                        if (!node.children[key].intensity) {
                            node.children[key].intensity = 1;
                        }
                        if (!node.children[key].distance) {
                            node.children[key].distance = 1000;
                        }
                        if (!node.children[key].decay) {
                            node.children[key].decay = 2;
                        }
                        if (!node.children[key].castshadow) {
                            node.children[key].castshadow = false;
                        }
                        if (!node.children[key].shadowfar) {
                            node.children[key].shadowfar = 500.0;
                        }
                        if (!node.children[key].shadowmapsize) {
                            node.children[key].shadowmapsize = 512;
                        }
    
                        const pointLightColor = new THREE.Color( node.children[key].color.r, node.children[key].color.g, node.children[key].color.b );
                        const pointLight = new THREE.PointLight( pointLightColor, node.children[key].intensity, node.children[key].distance,
                                            node.children[key].decay );
                        pointLight.castShadow = node.children[key].castshadow;
                        pointLight.shadow.mapSize.width = node.children[key].shadowmapsize; 
                        pointLight.shadow.mapSize.height = node.children[key].shadowmapsize;
                        pointLight.shadow.camera.far = node.children[key].shadowfar;
                        pointLight.position.set( node.children[key].position.x, node.children[key].position.y, node.children[key].position.z );
    
                        if (!node.children[key].enabled) {
                            break;
                        }
    
                        group.add(pointLight);
                        break;
                    case 'spotlight':
                        if (!node.children[key].enabled) {
                            node.children[key].enabled = true;
                        }
                        if (!node.children[key].intensity) {
                            node.children[key].intensity = 0;
                        }
                        if (!node.children[key].distance) {
                            node.children[key].distance = 1000;
                        }
                        if (!node.children[key].decay) {
                            node.children[key].decay = 2;
                        }
                        if (!node.children[key].penumbra) {
                            node.children[key].penumbra = 1;
                        }
                        if (!node.children[key].castshadow) {
                            node.children[key].castshadow = false;
                        }
                        if (!node.children[key].shadowfar) {
                            node.children[key].shadowfar = 500.0;
                        }
                        if (!node.children[key].shadowmapsize) {
                            node.children[key].shadowmapsize = 512;
                        }
                        const spotLightColor = new THREE.Color( node.children[key].color.r, node.children[key].color.g, node.children[key].color.b );
                        const spotLight = new THREE.SpotLight( spotLightColor, node.children[key].intensity, node.children[key].distance,
                                            THREE.MathUtils.degToRad(node.children[key].angle), node.children[key].penumbra, 
                                            node.children[key].decay );
                        spotLight.castShadow = node.children[key].castshadow;
                        spotLight.shadow.mapSize.width = node.children[key].shadowmapsize; 
                        spotLight.shadow.mapSize.height = node.children[key].shadowmapsize;
                        spotLight.shadow.camera.far = node.children[key].shadowfar;
                        spotLight.position.set( node.children[key].position.x, node.children[key].position.y, node.children[key].position.z );
                        const spotLightTarget = new THREE.Object3D();
                        spotLightTarget.position.set( node.children[key].target.x, node.children[key].target.y, node.children[key].target.z );
                        //this.appInstance.scene.add( spotLightTarget );  // correct?
                        //spotLight.target = spotLightTarget;
                        spotLight.shadow.bias = -0.00005;
                        if (!node.children[key].enabled) {
                            break;
                        }
                        const spotSphereSize = 0.1;
                        const spotLightHelper = new THREE.SpotLightHelper( spotLight, spotSphereSize );
                        group.add(spotLight);
                        this.contents.playerLight = spotLight
                        break;
                    case 'directionallight':
                        if (!node.children[key].enabled) {
                            node.children[key].enabled = true;
                        }
                        if (!node.children[key].intensity) {
                            node.children[key].intensity = 0;
                        }
                        if (!node.children[key].castshadow) {
                            node.children[key].castshadow = false;
                        }
                        if (!node.children[key].shadowleft) {
                            node.children[key].shadowleft = -5;
                        }
                        if (!node.children[key].shadowright) {
                            node.children[key].shadowright = 5;
                        }
                        if (!node.children[key].shadowbottom) {
                            node.children[key].shadowbottom = -5;
                        }
                        if (!node.children[key].shadowtop) {
                            node.children[key].shadowtop = 5;
                        }
                        if (!node.children[key].shadowfar) {
                            node.children[key].shadowfar = 500.0;
                        }
                        if (!node.children[key].shadowmapsize) {
                            node.children[key].shadowmapsize = 512;
                        }
    
                        const directionalLightColor = new THREE.Color( node.children[key].color.r, node.children[key].color.g, node.children[key].color.b );
                        const directionalLight = new THREE.DirectionalLight( directionalLightColor, node.children[key].intensity );
                        directionalLight.castShadow = node.children[key].castshadow;
                        directionalLight.shadow.mapSize.width = node.children[key].shadowmapsize; 
                        directionalLight.shadow.mapSize.height = node.children[key].shadowmapsize;
                        directionalLight.shadow.camera.left = node.children[key].shadowleft;
                        directionalLight.shadow.camera.right = node.children[key].shadowright;
                        directionalLight.shadow.camera.bottom = node.children[key].shadowbottom;
                        directionalLight.shadow.camera.top = node.children[key].shadowtop;
                        directionalLight.shadow.camera.far = node.children[key].shadowfar;
                        directionalLight.position.set( node.children[key].position.x, node.children[key].position.y, node.children[key].position.z );
                        const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 0.2 );
                        if (!node.children[key].enabled) {
                            break;
                        }
                        console.log("DIRECT")
                        console.log(node.children[key])
                        group.add(directionalLight);  
                        group.add(directionalLightHelper);
                        break;
                    case 'terrain':
                        const terrain = new MyTerrain( node.children[key].controlpoints, node.children[key].degree_u, 
                            node.children[key].degree_v, node.children[key].parts_u, node.children[key].parts_v );
                        const terrainMesh = terrain.generateTerrain(this.appInstance);
                        //console.log(terrainMesh);
                        group.add(terrainMesh);
                        break;
                    case 'box':{
                        if (!node.children[key].parts_x) {
                            node.children[key].parts_x = 1;
                        }
                        if (!node.children[key].parts_y) {
                            node.children[key].parts_y = 1;
                        }
                        if (!node.children[key].parts_z) {
                            node.children[key].parts_z = 1;
                        }
    
                        const boxWidth = Math.abs(node.children[key].xyz2.x - node.children[key].xyz1.x);
                        const boxHeight = Math.abs(node.children[key].xyz2.y - node.children[key].xyz1.y);
                        const boxDepth = Math.abs(node.children[key].xyz2.z - node.children[key].xyz1.z);
                        let materialClone = material.clone()
                        if (materialClone.map){
                            materialClone.map = material.map.clone()
                            const texture = materialClone.map
                            texture.repeat.set(boxWidth/texture.repeat.x, boxHeight/texture.repeat.y)
                        }
                        if (materialClone.bumpMap){
                            materialClone.bumpMap = material.bumpMap.clone()
                            const texture = materialClone.bumpMap
                            texture.repeat.set(boxWidth/texture.repeat.x, boxHeight/texture.repeat.y)
                        }
                        if (materialClone.specularMap){
                            materialClone.specularMap = material.specularMap.clone()
                            const texture = materialClone.specularMap
                            texture.repeat.set(boxWidth/texture.repeat.x, boxHeight/texture.repeat.y)
                        }
                        
                        const box = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth, node.children[key].parts_x, node.children[key].parts_y, node.children[key].parts_z );
                        const boxMesh = new THREE.Mesh( box, materialClone );
                        boxMesh.receiveShadow = true;
                        boxMesh.castShadow = true;
                        group.add(boxMesh);
                        break;
                    }
                    case 'sphere':{
                        let thetastart = 0
                        if (node.children[key].thetastart) {
                            thetastart = node.children[key].thetastart * Math.PI / 180;
                        }
                        let thetalength = Math.PI
                        if (node.children[key].thetalength) {
                            thetalength = node.children[key].thetalength * Math.PI / 180;
                        }
                        let phistart = 0
                        if (node.children[key].phistart) {
                            phistart = node.children[key].phistart * Math.PI / 180;
                        }
                        let philength = 2*Math.PI;
                        if (node.children[key].philength) {
                            philength = node.children[key].philength * Math.PI / 180;
                        }
                        let materialClone = material.clone()
                        if (materialClone.map){
                            materialClone.map = material.map.clone()
                            const texture = materialClone.map
                            texture.repeat.set((2*Math.PI*node.children[key].radius)/texture.repeat.x, (2*Math.PI*node.children[key].radius)/texture.repeat.y)
                        }
                        if (materialClone.bumpMap){
                            materialClone.bumpMap = material.bumpMap.clone()
                            const texture = materialClone.bumpMap
                            texture.repeat.set((2*Math.PI*node.children[key].radius)/texture.repeat.x, (2*Math.PI*node.children[key].radius)/texture.repeat.y)
                        }
                        if (materialClone.specularMap){
                            materialClone.specularMap = material.specularMap.clone()
                            const texture = materialClone.specularMap
                            texture.repeat.set((2*Math.PI*node.children[key].radius)/texture.repeat.x, (2*Math.PI*node.children[key].radius)/texture.repeat.y)
                        }
                        
                        const sphere = new THREE.SphereGeometry( node.children[key].radius, node.children[key].slices, 
                                    node.children[key].stacks, phistart, philength, 
                                    thetastart, thetalength );
                        const sphereMesh = new THREE.Mesh( sphere, materialClone );
                        sphereMesh.receiveShadow = true;
                        sphereMesh.castShadow = true;
                        group.add(sphereMesh);
                        break;
                    }
                    case 'lathe':{
                        const width = 160
                        const height = 80
                        let materialClone = material.clone()
                        if (materialClone.map){
                            materialClone.map = material.map.clone()
                            const texture = materialClone.map
                            texture.repeat.set(width/texture.repeat.x, height/texture.repeat.y)
                        }
                        if (materialClone.bumpMap){
                            materialClone.bumpMap = material.bumpMap.clone()
                            const texture = materialClone.bumpMap
                            texture.repeat.set(width/texture.repeat.x, height/texture.repeat.y)
                        }
                        if (materialClone.specularMap){
                            materialClone.specularMap = material.specularMap.clone()
                            const texture = materialClone.specularMap
                            texture.repeat.set(width/texture.repeat.x, height/texture.repeat.y)
                        }
                        const points = [];
                        for ( let i = 0; i < 10; i ++ ) {
                            points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
                        }
                        const lathe = new THREE.LatheGeometry( points, node.children[key].segments );
                        const latheMesh = new THREE.Mesh( lathe, materialClone );
                        latheMesh.receiveShadow = true;
                        latheMesh.castShadow = true;
                        group.add(latheMesh);
                        break;
                    }
                    case 'track':
                        const track = new MyTrack( node.children[key].points, node.children[key].width, node.children[key].segments, 
                                                    node.children[key].closed );
                        track.frustrumCulled = false;
                        //console.log("amogus");
                        const trackModel = track.buildTrack();
                        console.log(trackModel);
                        group.add(trackModel);
                        this.contents.track = track;

                        const poleTexture = new THREE.TextureLoader().load('./game/textures/rust.jpg');
                        const flagTexture = new THREE.TextureLoader().load('./game/textures/checkered.png');
                        flagTexture.wrapS = THREE.RepeatWrapping;
                        flagTexture.wrapT = THREE.RepeatWrapping;
                        flagTexture.repeat.set(1, 1);
                        
                        const poleMaterial = new THREE.MeshPhongMaterial({ color: "#cccccc", 
                            specular: "#000000", emissive: "#000000", map: poleTexture});
                        const flagMaterial = new THREE.MeshPhongMaterial({ color: "#cccccc", 
                            specular: "#000000", emissive: "#000000", map: flagTexture, side: THREE.DoubleSide});
                        
                        const pole = new THREE.CylinderGeometry(1, 1, 40);
                        const leftPole = new THREE.Mesh(pole, poleMaterial);
                        const rightPole = new THREE.Mesh(pole, poleMaterial);
                        leftPole.position.set(-35, 30, 60);
                        rightPole.position.set(-65, 30, 20);
                        
                        const flag = new THREE.PlaneGeometry(50, 6);
                        const flagMesh = new THREE.Mesh(flag, flagMaterial);

                        const fX = (leftPole.position.x + rightPole.position.x) / 2;
                        const fY = leftPole.position.y + 17;
                        const fZ = (leftPole.position.z + rightPole.position.z) / 2;
                        const diffX = rightPole.position.x - leftPole.position.x;
                        const diffZ = rightPole.position.z - leftPole.position.z;
                        const alpha = Math.atan2(diffZ, diffX);
                        flagMesh.position.set(fX, fY, fZ);
                        flagMesh.rotation.y = -alpha;

                        group.add(leftPole);
                        group.add(rightPole);
                        group.add(flagMesh);
                        break;
                    case 'route':
                        const route = new MyRoute( node.children[key].points );
                        const routeModel = route.setRoute();
                        this.contents.route = route.getRoute();
                        group.add(routeModel);
                        break;
                    case 'power':
                        const power = new MyPowerUp( node.children[key].x, node.children[key].y, node.children[key].z );
                        const powerModel = power.initObject();
                        group.add(powerModel);
                        //const helper = new THREE.Box3Helper(power.hitbox, 0x00ff00);
                        //group.add(helper);
                        //this.appInstance.powerUpList.push(powerModel);
                        this.appInstance.powerUpList.set(power, powerModel);
                        this.appInstance.powerUpPositions.set(powerModel, powerModel.position);
                        this.appInstance.powerUpGroups.set(power, group);
                        break;
                    case 'obstacle':
                        const mine = new MyObstacle( node.children[key].x, node.children[key].y, node.children[key].z );
                        const mineModel = mine.initObject();
                        group.add(mineModel);
                        //const obsHelper = new THREE.Box3Helper(mine.hitbox, 0xff0000);
                        //group.add(obsHelper);
                        this.appInstance.obstacleList.set(mine, mineModel);
                        this.appInstance.obstaclePositions.set(mineModel, mineModel.position);
                        this.appInstance.obstacleGroups.set(mine, group);
                        break;
                    case 'park':
                        const park = new MyPark();
                        const parkMesh = park.buildPark();
                        group.add(parkMesh);

                        const botPark = new MyPark();
                        const botParkMesh = botPark.buildPark();
                        botParkMesh.position.x = -100;
                        group.add(botParkMesh);
                        break;
                    case 'balloon':
                        let materialNode = material
                        if (node.materialref) {
                            materialNode = this.appInstance.materialsList.get(node.materialref.materialId)
                        }
                        const structure = this.loadObjectsDFS(graph, graph[node.children[key].structure], materialNode);
                        group.add(structure);
                        this.contents.balloons.push(new Balloon(group, 0, 0, "balloon"+(this.contents.balloons.length+1)))
                    default:
                        break;
                }    
            }   
        }
        if (node.transforms){
            for (const transformation of node.transforms){
                if (transformation.type == "translate"){
                    group.position.x = transformation.amount.x
                    group.position.y = transformation.amount.y
                    group.position.z = transformation.amount.z
                }
                else if (transformation.type == "scale"){
                    group.scale.set(transformation.amount.x, transformation.amount.y, transformation.amount.z);
                }
                else if (transformation.type == "rotate"){
                    group.rotation.x = transformation.amount.x * Math.PI / 180
                    group.rotation.y = transformation.amount.y * Math.PI / 180
                    group.rotation.z = transformation.amount.z * Math.PI / 180
                }
            }
        }
        return group;
    }
}

export { MyReader };
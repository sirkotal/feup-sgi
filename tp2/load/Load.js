import * as THREE from 'three';
import { Triangle } from './Triangle.js';
import { Polygon } from './Polygon.js';
import { MyNurbsBuilder, createNurbsSurfaces, loadMipmap } from '../utils/Utils.js';

/**
 * Loads the cameras into the scene and sets the active camera
 * @param {*} app - the application object
 * @param {*} cameras - the object containing the cameras
 */
export function loadCameras(app, cameras) {  
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
                    orthogonal.lookAt(new THREE.Vector3(camera.target.x, camera.target.y, camera.target.z))
                    app.cameras[key] = orthogonal
                }
    
                if (camera.type == "perspective") {
                    const perspective = new THREE.PerspectiveCamera( camera.angle, window.innerWidth / window.innerHeight, camera.near, camera.far )
                    perspective.position.set(camera.location.x, camera.location.y, camera.location.z)
                    perspective.lookAt(new THREE.Vector3(camera.target.x, camera.target.y, camera.target.z))
                    app.cameras[key] = perspective
                }
            }
        });
        app.setActiveCamera(cameras.initial);
    }
}

/**
 * Loads the global settings for the scene -> background, ambient light and skybox
 * @param {*} app - the application object
 * @param {*} globals - the object containing the globals' characteristics
 */
export function loadGlobals(app, globals) {  
    if (globals.background) {
        const backgroundColor = new THREE.Color(globals.background.r, globals.background.g, globals.background.b);
        app.scene.background = backgroundColor;
    }

    if (globals.ambient) {
        const lightColor = new THREE.Color(globals.ambient.r, globals.ambient.g, globals.ambient.b);
        const ambientLight = new THREE.AmbientLight(lightColor, globals.ambient.intensity);
        app.scene.add(ambientLight);
        app.ambientLight = ambientLight;
    }

    if (globals.skybox) {
        const skybox = new THREE.BoxGeometry(globals.skybox.size.x, globals.skybox.size.y, globals.skybox.size.z);
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
        app.scene.add(skyboxMesh);
    }
}

/**
 * Loads the fog into the scene
 * @param {*} app - the application object
 * @param {*} fog - the object containing the fog's characteristics
 */
export function loadFog(app, fog) {  
    if (fog.color) {
        const fogColor = new THREE.Color(fog.color.r, fog.color.g, fog.color.b);
        const sceneFog = new THREE.Fog(fogColor, fog.near, fog.far);
        app.scene.fog = sceneFog;
        app.fog = sceneFog;
    }
}

/**
 * Loads the Material into the scene
 * @param {*} app - the application object
 * @param {*} materials - the object containing the materials
 * @param {*} textures - the object containing the textures
 */
export function loadMaterials(app, materials, textures){
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
                else{
                    texture = new THREE.TextureLoader().load('./'+textures[material.textureref].filepath);
                }
                //texture.generateMipmaps = true;
                //texture.minFilter = THREE.LinearMipMapLinearFilter;
                for (let i = 0; i <= 7; i++){
                    if (textures[material.textureref][`mipmap${i}`]){
                        texture.generateMipmaps = false;
                        loadMipmap(texture, i, textures[material.textureref][`mipmap${i}`]) 
                        console.log(textures[material.textureref][`mipmap${i}`])
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
 * @param {*} app - the application object
 * @param {*} graph - the graph part of the YASF
 */
export function loadObjects(app, graph) {  

    if (graph) {
        const root = graph[graph.rootid];
        root.tag = graph.rootid;
        const scene = loadObjectsDFS(app, graph, root, new THREE.MeshStandardMaterial());
        console.log(scene);
        app.scene.add(scene);
    }
}

/**
 * Helper to parse the graph
 * @param {*} app - the application object
 * @param {*} graph - the graph part of the YASF
 * @param {*} node - the current node
 * @param {*} material - the current material
 */
function loadObjectsDFS(app, graph, node, material) {  
    const group = new THREE.Group();
    group.name = node?.tag;
    
    let key;
    for (key in node?.children) {
        if (key === "nodesList") {
            for (let child of node.children.nodesList) {
                let materialNode = material
                if (graph[child].materialref) {
                    materialNode = app.materialsList.get(graph[child].materialref.materialId)
                }
                graph[child].tag = child
                let anotherNode = loadObjectsDFS(app, graph, graph[child], materialNode);
                group.add(anotherNode);
            }
        }
        else if (key === "lodsList") {
            for (let child of node.children.lodsList) {
                const lods = new THREE.LOD();

                for (let lodNode of graph[child].lodNodes) {
                    let materialLod = material
                    if (graph[lodNode.nodeId].materialref){
                        materialLod = app.materialsList.get(graph[lodNode.nodeId].materialref.materialId)
                    }
                    let anotherNode = loadObjectsDFS(app, graph, graph[lodNode.nodeId], materialLod);
                    lods.addLevel(anotherNode, lodNode.mindist);
                    group.add(anotherNode);
                }
                const lodDistance = app.activeCamera.position.distanceTo(lods.position);
                app.scene.add(lods);
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
                    console.log(node.children[key])
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
                    app.scene.add( spotLightTarget );  // correct?
                    spotLight.target = spotLightTarget;
                    spotLight.shadow.bias = -0.00005;
                    if (!node.children[key].enabled) {
                        break;
                    }
                    const spotSphereSize = 0.1;
                    //const spotLightHelper = new THREE.SpotLightHelper( spotLight, spotSphereSize );
                    //group.add(spotLightHelper);
                    console.log("HERE")
                    console.log(spotLight)
                    group.add(spotLight);
                    break;
                case 'directionallight':
                    if (node.children[key].enabled) {
                        node.children[key].enabled = true;
                    }
                    if (node.children[key].intensity) {
                        node.children[key].intensity = 1;
                    }
                    if (node.children[key].castshadow) {
                        node.children[key].castshadow = false;
                    }
                    if (node.children[key].shadowleft) {
                        node.children[key].shadowleft = -5;
                    }
                    if (node.children[key].shadowright) {
                        node.children[key].shadowright = 5;
                    }
                    if (node.children[key].shadowbottom) {
                        node.children[key].shadowbottom = -5;
                    }
                    if (node.children[key].shadowtop) {
                        node.children[key].shadowtop = 5;
                    }
                    if (node.children[key].shadowfar) {
                        node.children[key].shadowfar = 500.0;
                    }
                    if (node.children[key].shadowmapsize) {
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

                    if (!node.children[key].enabled) {
                        break;
                    }

                    group.add(directionalLight);
                    const directionalSphereSize = 0.1;
                    //const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, directionalSphereSize );
                    //group.add(directionalLightHelper);
    
                    break;
                case 'rectangle':{
                    if (!node.children[key].parts_x) {
                        node.children[key].parts_x = 1;
                    }
                    if (!node.children[key].parts_y) {
                        node.children[key].parts_y = 1;
                    }

                    const recWidth = Math.abs(node.children[key].xy2.x - node.children[key].xy1.x);
                    const recHeight = Math.abs(node.children[key].xy2.y - node.children[key].xy1.y);
                    const rectangle = new THREE.PlaneGeometry( recWidth, recHeight, node.children[key].parts_x, node.children[key].parts_y );

                    let materialClone = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).clone() : material.clone()
                    if (materialClone.map){
                        materialClone.map = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).map.clone() : material.map.clone()
                        const texture = materialClone.map
                        texture.repeat.set(recWidth/texture.repeat.x, recHeight/texture.repeat.y)
                    }
                    if (materialClone.bumpMap){
                        materialClone.bumpMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).bumpMap.clone() : material.bumpMap.clone()
                        const texture = materialClone.bumpMap
                        texture.repeat.set(recWidth/texture.repeat.x, recHeight/texture.repeat.y)
                    }
                    if (materialClone.specularMap){
                        materialClone.specularMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).specularMap.clone() : material.specularMap.clone()
                        const texture = materialClone.specularMap
                        texture.repeat.set(recWidth/texture.repeat.x, recHeight/texture.repeat.y)
                    }
                    
                    const recMesh = new THREE.Mesh( rectangle, materialClone );
                    recMesh.receiveShadow = true;
                    recMesh.castShadow = true;
                    //recMesh.position.x = (node.children[key].xy2.x + node.children[key].xy1.x)/2
                    //recMesh.position.y = (node.children[key].xy2.y + node.children[key].xy1.y)/2
                    group.add(recMesh);
                    app.objectList.push(recMesh);
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

                    let materialClone = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).clone() : material.clone()
                    if (materialClone.map){
                        materialClone.map = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).map.clone() : material.map.clone()
                        const texture = materialClone.map
                        texture.repeat.set((2*Math.PI*node.children[key].radius)/texture.repeat.x, (2*Math.PI*node.children[key].radius)/texture.repeat.y)
                    }
                    if (materialClone.bumpMap){
                        materialClone.bumpMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).bumpMap.clone() : material.bumpMap.clone()
                        const texture = materialClone.bumpMap
                        texture.repeat.set((2*Math.PI*node.children[key].radius)/texture.repeat.x, (2*Math.PI*node.children[key].radius)/texture.repeat.y)
                    }
                    if (materialClone.specularMap){
                        materialClone.specularMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).specularMap.clone() : material.specularMap.clone()
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
                    app.objectList.push(sphereMesh);
                    break;
                }
                case 'cylinder':
                {
                    if (!node.children[key].capsclose) {
                        node.children[key].capsclose = false;
                    }
                    let thetastart = 0
                    if (node.children[key].thetastart) {
                        thetastart = node.children[key].thetastart * Math.PI / 180;
                    }
                    let thetalength = 2*Math.PI
                    if (node.children[key].thetalength) {
                        thetalength = node.children[key].thetalength * Math.PI / 180;
                    }

                    let materialClone = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).clone() : material.clone()
                    if (materialClone.map){
                        materialClone.map = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).map.clone() : material.map.clone()
                        const texture = materialClone.map
                        texture.repeat.set((2* Math.PI * ((node.children[key].top + node.children[key].base) / 2))/texture.repeat.x, node.children[key].height/texture.repeat.y)
                    }
                    if (materialClone.bumpMap){
                        materialClone.bumpMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).bumpMap.clone() : material.bumpMap.clone()
                        const texture = materialClone.bumpMap
                        texture.repeat.set((2* Math.PI * ((node.children[key].top + node.children[key].base) / 2))/texture.repeat.x, node.children[key].height/texture.repeat.y)
                    }
                    if (materialClone.specularMap){
                        materialClone.specularMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).specularMap.clone() : material.specularMap.clone()
                        const texture = materialClone.specularMap
                        texture.repeat.set((2* Math.PI * ((node.children[key].top + node.children[key].base) / 2))/texture.repeat.x, node.children[key].height/texture.repeat.y)
                    }
                    
                    const cylinder = new THREE.CylinderGeometry( node.children[key].top, node.children[key].base, node.children[key].height, 
                                    node.children[key].slices, node.children[key].stacks, !node.children[key].capsclose, 
                                    thetastart, thetalength );
                    const cylinderMesh = new THREE.Mesh( cylinder, materialClone );
                    cylinderMesh.receiveShadow = true;
                    cylinderMesh.castShadow = true;
                    group.add(cylinderMesh);
                    app.objectList.push(cylinderMesh);
                    break;
                }
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
                    
                    let materialClone = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).clone() : material.clone()
                    if (materialClone.map){
                        materialClone.map = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).map.clone() : material.map.clone()
                        const texture = materialClone.map
                        texture.repeat.set(boxWidth/texture.repeat.x, boxHeight/texture.repeat.y)
                    }
                    if (materialClone.bumpMap){
                        materialClone.bumpMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).bumpMap.clone() : material.bumpMap.clone()
                        const texture = materialClone.bumpMap
                        texture.repeat.set(boxWidth/texture.repeat.x, boxHeight/texture.repeat.y)
                    }
                    if (materialClone.specularMap){
                        materialClone.specularMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).specularMap.clone() : material.specularMap.clone()
                        const texture = materialClone.specularMap
                        texture.repeat.set(boxWidth/texture.repeat.x, boxHeight/texture.repeat.y)
                    }
                    
                    const box = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth, node.children[key].parts_x, node.children[key].parts_y, node.children[key].parts_z );
                    const boxMesh = new THREE.Mesh( box, materialClone );
                    boxMesh.receiveShadow = true;
                    boxMesh.castShadow = true;
                    //boxMesh.position.x = (node.children[key].xyz2.x - node.children[key].xyz1.x)/2
                    //boxMesh.position.y = (node.children[key].xyz2.y - node.children[key].xyz1.y)/2
                    //boxMesh.position.z = (node.children[key].xyz2.z - node.children[key].xyz1.z)/2
                    group.add(boxMesh);
                    app.objectList.push(boxMesh);
                    break;
                }
                case 'nurbs':
                    let minX = Infinity, minY = Infinity
                    let maxX = -Infinity, maxY = -Infinity

                    node.children[key].controlpoints.forEach(point => {
                        if (point.x < minX) minX = point.x;
                        if (point.y < minY) minY = point.y;

                        if (point.x > maxX) maxX = point.x;
                        if (point.y > maxY) maxY = point.y;
                    });

                    const width = maxX - minX;
                    const height = maxY - minY;

                    let materialClone = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).clone() : material.clone()
                    if (materialClone.map){
                        materialClone.map = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).map.clone() : material.map.clone()
                        const texture = materialClone.map
                        texture.repeat.set(width/texture.repeat.x, height/texture.repeat.y)
                    }
                    if (materialClone.bumpMap){
                        materialClone.bumpMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).bumpMap.clone() : material.bumpMap.clone()
                        const texture = materialClone.bumpMap
                        texture.repeat.set(width/texture.repeat.x, height/texture.repeat.y)
                    }
                    if (materialClone.specularMap){
                        materialClone.specularMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).specularMap.clone() : material.specularMap.clone()
                        const texture = materialClone.specularMap
                        texture.repeat.set(width/texture.repeat.x, height/texture.repeat.y)
                    }
                    
                    let builder = new MyNurbsBuilder( app );
                    const nurbsMesh = createNurbsSurfaces(builder, node.children[key].controlpoints, node.children[key].degree_u, 
                        node.children[key].degree_v, node.children[key].parts_u, node.children[key].parts_v, materialClone );
                    nurbsMesh.receiveShadow = true;
                    nurbsMesh.castShadow = true;
                    //console.log(nurbsMesh);
                    group.add(nurbsMesh);
                    app.objectList.push(nurbsMesh);
                    break;
                case 'triangle':{
                    const p1 = new THREE.Vector3(node.children[key].xyz1);
                    const p2 = new THREE.Vector3(node.children[key].xyz2);
                    const p3 = new THREE.Vector3(node.children[key].xyz3);
                    const width = p1.distanceTo(p2);
                    const a = p1.distanceTo(p2);
                    const b = p2.distanceTo(p3);
                    const c = p3.distanceTo(p1);
                    const s = 0.5 * (a + b + c);
                    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
                    const height = 2*area / width;

                    let materialClone = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).clone() : material.clone()
                    if (materialClone.map){
                        materialClone.map = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).map.clone() : material.map.clone()
                        const texture = materialClone.map
                        texture.repeat.set(width/texture.repeat.x, height/texture.repeat.y)
                    }
                    if (materialClone.bumpMap){
                        materialClone.bumpMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).bumpMap.clone() : material.bumpMap.clone()
                        const texture = materialClone.bumpMap
                        texture.repeat.set(width/texture.repeat.x, height/texture.repeat.y)
                    }
                    if (materialClone.specularMap){
                        materialClone.specularMap = node.children[key].materialref ? app.materialsList.get(node.children[key].materialref.materialId).specularMap.clone() : material.specularMap.clone()
                        const texture = materialClone.specularMap
                        texture.repeat.set(width/texture.repeat.x, height/texture.repeat.y)
                    }

                    const triangle = new Triangle(node.children[key].xyz1, node.children[key].xyz2, node.children[key].xyz3);
                    const triangleMesh = new THREE.Mesh( triangle, materialClone );
                    triangleMesh.receiveShadow = true;
                    triangleMesh.castShadow = true;
                    group.add(triangleMesh);
                    app.objectList.push(triangleMesh);
                    break;
                }
                case 'polygon':
                    let materialPolygon = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
                    /*if (node.children[key].materialref){
                        materialPolygon = app.materialsList.get(node.children[key].materialref.materialId)
                    }*/

                    const polygon = new Polygon( node.children[key].radius, node.children[key].stacks, node.children[key].slices, 
                                    node.children[key].color_c, node.children[key].color_p );
                    const polygonMesh = new THREE.Mesh( polygon, materialPolygon );
                    polygonMesh.receiveShadow = true;
                    polygonMesh.castShadow = true;
                    group.add(polygonMesh);
                    app.objectList.push(polygonMesh);
                    break;
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
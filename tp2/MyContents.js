import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MySceneData } from './parser/MySceneData.js';
import { loadCameras, loadGlobals, loadFog, loadObjects, loadMaterials } from './load/Load.js';
/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app - the application object
    */
    constructor(app) {
        this.app = app
        this.axis = null
        this.textures = {}
        this.materials = {}
        this.cameras = {}

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/dust/dust.json");
        //this.sceneData = new MySceneData();
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data - the entire scene object
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    /**
     * Prints the contents of the YASF file
     * @param {*} data - the contents of the file
     * @param {*} indent - file indentation
     */
    printYASF(data, indent = '') {
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t');
            } else {
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }

    /**
     * Called after the scene is loaded, but before it is rendered
     * @param {*} data - the entire scene object
     */
    onAfterSceneLoadedAndBeforeRender(data) {
        //this.printYASF(data)
        const globals = data.yasf.globals || {};
        const fog = data.yasf.globals.fog || {};
        const textures = data.yasf.textures;
        const materials = data.yasf.materials;
        let YASFcameras = data.yasf.cameras;
        this.app.loaded = false;
        loadCameras(this.app, YASFcameras);
        loadGlobals(this.app, globals);
        loadFog(this.app, fog);
        this.app.materialsList = loadMaterials(this.app, materials, textures)
        const graph = data.yasf.graph;
        console.log(this.app.materialsList)
        loadObjects(this.app, graph);
    }

    update() {
    }
}

export { MyContents };

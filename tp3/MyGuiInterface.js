import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app - the application object 
     */
    
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents - the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        const cameraFolder = this.datgui.addFolder('Camera');
        //console.log(this.app.cameras);
        const cameraKeys = Object.keys(this.app.cameras);

        cameraFolder.add(this.app, 'activeCameraName', cameraKeys).name("Active Camera").onChange((newCameraName) => {this.app.setActiveCamera(newCameraName);});
        cameraFolder.add(this.app.activeCamera.position, 'x', -10, 10).name("X").onChange((value) => this.updateCameraPosition('x', value));
        cameraFolder.add(this.app.activeCamera.position, 'y', -10, 10).name("Y").onChange((value) => this.updateCameraPosition('y', value));
        cameraFolder.add(this.app.activeCamera.position, 'z', -10, 10).name("Z").onChange((value) => this.updateCameraPosition('z', value));
        cameraFolder.open();

        const fogFolder = this.datgui.addFolder('Fog');
        fogFolder.addColor(this.app.fog, 'color').name("Color").onChange((newColor) => {
            this.app.fog.color.set(newColor);
        });
        fogFolder.add(this.app.fog, 'near', 1, 1000).name("Near").onChange(() => {
            this.app.fog.near = this.app.fog.near;
        });
        fogFolder.add(this.app.fog, 'far', 100, 10000).name("Far").onChange(() => {
            this.app.fog.far = this.app.fog.far;
        });
        fogFolder.open();

        const ambientFolder = this.datgui.addFolder('Ambient Light');
        ambientFolder.addColor(this.app.ambientLight, 'color').name("Color").onChange((newColor) => {
            this.app.ambientLight.color.set(newColor);
        });
        ambientFolder.add(this.app.ambientLight, 'intensity', 0, 20).name("Intensity").onChange(() => {
            this.app.ambientLight.intensity = this.app.ambientLight.intensity;
        });
        ambientFolder.open();

        const wireframeOptions = {
            toggle: false
        };
        const viewsFolder = this.datgui.addFolder('View Options');
        viewsFolder.add(this.contents.axis, 'toggled').name('Enable/Disable Axis').onChange(() => {
            if (this.contents.axis.toggled) {
                this.app.scene.add(this.contents.axis);
            }
            else {
                this.app.scene.remove(this.contents.axis);
            }
        });
        /*viewsFolder.add(wireframeOptions, 'toggle').name('Enable/Disable Wireframes').onChange((value) => {
            this.updateWireframeOption(value)
        });*/
        viewsFolder.open();
    }

    /**
     * Toggles the option to display the scene in wireframe mode
     * @param {*} flag - determines whether to display wireframes or not
     */
    /*updateWireframeOption(flag) {
        for (let object of this.app.objectList) {
            object.material.wireframe = flag;
        }
    }*/

    /**
     * Updates the scene active camera's position
     * @param {*} axis - the axis in which to update the position
     * @param {*} value - the value of the new position along the axis
     */
    updateCameraPosition(axis, value) {
        if (axis === 'x') {
            this.app.activeCamera.position.x = value
        } else if (axis === 'y') {
            this.app.activeCamera.position.y = value
        } else if (axis === 'z') {
            this.app.activeCamera.position.z = value
        }
    }
}

export { MyGuiInterface };

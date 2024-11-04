import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
 * This class customizes the GUI interface for the app.
 */
class MyGuiInterface {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app;
        this.datgui = new GUI();
        this.contents = null;
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * Initialize the GUI interface
     */
    init() {
        // Adds a folder to the GUI for the camera settings
        const cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', [
            'Perspective 1', 'Perspective 2', 'Top', 'Left', 'Right', 'Front', 'Back'
        ]).name("Active Camera")
        cameraFolder.add(this.app.activeCamera.position, 'x', -10, 10).name("X").onChange((value) => this.updateCameraPosition('x', value));
        cameraFolder.add(this.app.activeCamera.position, 'y', -10, 10).name("Y").onChange((value) => this.updateCameraPosition('y', value));
        cameraFolder.add(this.app.activeCamera.position, 'z', -10, 10).name("Z").onChange((value) => this.updateCameraPosition('z', value));
        cameraFolder.open();

        // Add a folder for audio controls
        const audioFolder = this.datgui.addFolder('Audio');
        audioFolder.add(this.app, 'toggleAudio').name('Play/Pause Audio');
        audioFolder.open();

        // Add a folder for spotlight controls
        const lightFolder = this.datgui.addFolder('Spotlight');
        lightFolder.add(this.contents.spotlight.spotLight, 'intensity', 0, 20).name("Intensity").onChange(() => {
            this.contents.spotlight.spotLight.intensity = this.contents.spotlight.spotLight.intensity;
        });
        lightFolder.add(this.contents.spotlight.spotLight, 'penumbra', 0, 1).name("Penumbra").onChange(() => {
            this.contents.spotlight.spotLight.penumbra = this.contents.spotlight.spotLight.penumbra;
        });
        lightFolder.add(this.contents.spotlight.spotLight, 'decay', 0, 5).name("Decay").onChange(() => {
            this.contents.spotlight.spotLight.decay = this.contents.spotlight.spotLight.decay;
        });
        lightFolder.open();
    }

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

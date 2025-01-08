import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MySceneData } from './parser/MySceneData.js';
import { MyReader } from './load/Reader.js';
import { TextDisplay } from './utils/TextDisplay.js';
import { MyFirework } from './MyFirework.js';
import { Balloon } from './load/Balloon.js';
import { Outdoor } from './load/Outdoor.js';
import { MyShader } from './MyShader.js';
import { Minimap } from './load/Minimap.js';

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
        this.balloons = []
        this.balloonsBot = []
        this.balloon = null
        this.balloonBot = null
        this.route = null
        this.playerLight = null
        this.time = new THREE.Clock()
        this.balloonHitbox = new THREE.Box3()
        this.botHitbox = new THREE.Box3()
        this.fireworks = []
        this.name = ""
        this.laps = 1
        this.screen = null

        //this.sceneData = new MySceneData();
        const numRows = 8;
        const numCharsPerRow = 15;
        const sheetWidth = 300;
        const sheetHeight = 160;
        const cellWidth = sheetWidth / numCharsPerRow;
        const cellHeight = sheetHeight / numRows;
        const charSequence = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ç";
        this.obstacleShader = new MyShader(this, "shaders/pulse.vert", "shaders/pulse.frag", {time: {type: 'f', value: 0.0 },
            tex: {type: 'sampler2D', value: new THREE.TextureLoader().load('./game/textures/mine_metal.jpg')}});
        this.powerShader = new MyShader(this, "shaders/pulse.vert", "shaders/pulse.frag", {time: {type: 'f', value: 0.0 },
            tex: {type: 'sampler2D', value: new THREE.TextureLoader().load('./game/textures/power.png')}});
        this.outdoorShader = new MyShader(this, "shaders/outdoor.vert", "shaders/outdoor.frag", {
                rgbTexture: { type: 't', value: this.app.renderTarget.texture },
                lGrayTexture: { type: 't', value: this.app.renderTarget.depthTexture },
                depthScale: { type: 'f', value: 0.1 },
            });
        this.obstacleShader.buildShader();
        this.powerShader.buildShader();
        
        this.letterMap = new Map()
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCharsPerRow; col++) {
                const charIndex = row * numCharsPerRow + col;
                if (charIndex < charSequence.length) {
                    const letter = charSequence[charIndex];
                    const startU = col * cellWidth / sheetWidth;
                    const endU = (col + 1) * cellWidth / sheetWidth;
    
                    const endV = 1 - (row * cellHeight / sheetHeight);
                    const startV = 1 - ((row + 1) * cellHeight / sheetHeight);
    
                    this.letterMap[letter] = { startU, startV, endU, endV };
                }
            }
        }
        
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 200

        this.pointer = new THREE.Vector2()
        this.intersectedObj = null
        this.pickingColor = "0x00ff00"

        document.addEventListener(
            "pointermove",
            this.onPointerMove.bind(this)
        );
        document.addEventListener(
            "click",
            this.onPointerMove.bind(this)
        );

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("game/game.json");

        this.states = {
            start: {"name":"startMenu","cameraName":"startMenuCamera","pickableObj":new Map()},
            pickingBalloon: {"name":"pickingBalloon","cameraName":"pickingBalloonCamera","pickableObj":new Map()},
            pickingBotBalloon: {"name":"pickingBotBalloon","cameraName":"pickingBotBalloonCamera","pickableObj":new Map()},
            play: {"name":"play","cameraName":"playCamera","pickableObj":new Map()},
            end: {"name":"endMenu","cameraName":"endMenuCamera","pickableObj":new Map()}
        };
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            //this.app.scene.add(this.axis)
        }
        this.initialMenu = new Outdoor(this.letterMap, [{text: ["Name: "], size: 2, position: new THREE.Vector2(0,0)}, {text: ["Selected Balloon: null"], size: 2, position: new THREE.Vector2(0,-2)}, {text: ["Selected Bot: null"], size: 2, position: new THREE.Vector2(0,-4)},{text: ["Francisco Sousa, Joao Coutinho & Miguel Garrido | FEUP 2024"], size: 1, position: new THREE.Vector2(0,-8)}], [{text:["select","balloon"], position:new THREE.Vector2(10,-12)}, {text:["select","bot"], position:new THREE.Vector2(30,-12)}, {text:["start","game"], position:new THREE.Vector2(50,-12)}],new THREE.Vector2(-30,0))
        this.initialMenu.buttons.forEach(button => {
            this.states.start.pickableObj.set(button, this.getMeshesFromGroup(button.group));
        })
        this.app.scene.add(this.initialMenu.group)
        this.finalMenu = new Outdoor(this.letterMap, [{text: ["Winner: "], size: 2, position: new THREE.Vector2(0,0)}, {text: ["User Time: "], size: 2, position: new THREE.Vector2(0,-2)}, {text: ["Bot Time: "], size: 2, position: new THREE.Vector2(0,-4)}, {text: ["Fastest Lap: "], size: 2, position: new THREE.Vector2(0,-6)},{text: ["Thank you for playing!"], size: 1, position: new THREE.Vector2(0,-9)}], [{text:["play","again"], position:new THREE.Vector2(10,-13)}, {text:["main","menu"], position:new THREE.Vector2(50,-13)}],new THREE.Vector2(-30,-100))
        this.finalMenu.buttons.forEach(button => {
            this.states.end.pickableObj.set(button, this.getMeshesFromGroup(button.group));
        })
        this.app.scene.add(this.finalMenu.group)
        this.gameState = this.states.start
        this.balloons.forEach(balloon => {
            this.states.pickingBalloon.pickableObj.set(balloon, this.getMeshesFromGroup(balloon.group));
            balloon.positionDefault = balloon.group.position.clone()
            this.balloonsBot.push(new Balloon(balloon.group.clone(), 0, 0, "bot"+balloon.name))
            const balloonBot = this.balloonsBot.at(-1)
            balloonBot.group.position.x -= 80
            balloonBot.positionDefault = balloonBot.group.position.clone()
            this.app.scene.add(balloonBot.group)
            this.states.pickingBotBalloon.pickableObj.set(balloonBot, this.getMeshesFromGroup(balloonBot.group));
        })

        document.addEventListener("keydown", this.onKeyboardPress);
    }

    onKeyboardPress = (event) => {
        if (event.key === "Enter") {
            document.removeEventListener("keydown", onKeyPress);
        } else if (event.key === "Backspace") {
            this.name = this.name.slice(0, -1);
        } else if (event.key.length === 1) {
            this.name += event.key;
        }
    };

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
        const globals = data.yasf.globals || {};
        const fog = data.yasf.globals.fog || {};
        const textures = data.yasf.textures;
        const materials = data.yasf.materials;
        let YASFcameras = data.yasf.cameras;
        this.app.loaded = false;
        const graph = data.yasf.graph;

        this.reader = new MyReader(this.app, this);

        this.reader.loadCameras(YASFcameras);
        this.reader.loadGlobals(globals);
        this.reader.loadFog(fog);
        this.app.materialsList = this.reader.loadMaterials(materials, textures)
        console.log(this.app.materialsList)
        this.reader.loadObjects(graph);
    }

    getMeshesFromGroup(group) {
        const meshes = [];
        group.traverse((child) => {
            if (child.isMesh) {
                meshes.push(child);
            }
        });
        return meshes;
    }

    pickingHelper(intersects, event) {
        this.gameState.pickableObj.forEach((value, key) => {
            key.onPointingAway()
        })
        if (intersects.length > 0) {
            const obj = intersects[0].object
            this.gameState.pickableObj.forEach((value, key) => {
                if (value.some(mesh => mesh === obj)) {
                    if (event.type == "pointermove"){
                        key.onPointing()
                    }
                    else if (event.type == "click"){
                        switch(this.gameState.name){
                            case("startMenu"):{
                                switch(key.text.join("")){
                                    case("selectballoon"):{
                                        this.gameState = this.states.pickingBalloon
                                        this.app.setActiveCamera(this.gameState.cameraName)
                                        break
                                    }
                                    case("selectbot"):{
                                        this.gameState = this.states.pickingBotBalloon
                                        this.app.setActiveCamera(this.gameState.cameraName)
                                        break
                                    }
                                    case("startgame"):{
                                        if (this.name && this.balloon && this.balloonBot){
                                            document.removeEventListener("keydown", this.onKeyboardPress);
                                            this.gameState = this.states.play
                                            this.app.setActiveCamera("minimapCamera")
                                            this.app.setActiveCamera(this.gameState.cameraName)
                                            this.startGame()
                                        }
                                        break
                                    }
                                }
                                break
                            }
                            case("endMenu"):{
                                console.log(key.text.join(""))
                                switch(key.text.join("")){
                                    case("playagain"):{
                                        this.gameState = this.states.play
                                        this.app.setActiveCamera(this.gameState.cameraName)
                                        this.startGame()
                                        break
                                    }
                                    case("mainmenu"):{
                                        this.gameState = this.states.start
                                        this.balloon.group.position.set(...this.balloon.positionDefault)
                                        this.balloonBot.group.position.set(...this.balloonBot.positionDefault)
                                        this.balloon = null
                                        this.balloonBot = null
                                        this.name = ""
                                        this.app.setActiveCamera(this.gameState.cameraName)
                                        break
                                    }
                                }
                                break
                            }
                            case("pickingBalloon"):{
                                if (this.balloon){
                                    this.balloon.group.position.set(...this.balloon.positionDefault)
                                }
                                console.log(key)
                                this.balloon = key
                                this.balloon.group.position.set(0,12.5,30)
                                this.gameState = this.states.start
                                this.app.setActiveCamera(this.gameState.cameraName)
                                break
                            }
                            case("pickingBotBalloon"):{
                                if (this.balloonBot)
                                    this.balloonBot.group.position.set(...this.balloonBot.positionDefault)
                                this.balloonBot = key
                                this.balloonBot.group.position.set(0,12.5,30)
                                this.gameState = this.states.start
                                this.app.setActiveCamera(this.gameState.cameraName)
                                break
                            }
                        }
                    }
                }
            });
        } else {
        }
    }

    onPointerMove(event) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(this.app.scene.children);
        this.pickingHelper(intersects, event)
    }
    

    startGame(){
        this.lastUpdateTime = Date.now();
        this.timerValue = 0
        this.timer = new TextDisplay(this.letterMap, ["TIME: 00:00"], 0.75, new THREE.Vector2(3,5))
        this.lap = new TextDisplay(this.letterMap, ["LAP: 1/"+this.laps], 0.75, new THREE.Vector2(3,4.25))
        this.vouchers = new TextDisplay(this.letterMap, ["Vouchers: 0"], 0.75, new THREE.Vector2(3,3.5))
        this.place = new TextDisplay(this.letterMap, ["1st"], 1, new THREE.Vector2(-12,-5))
        this.direction = new TextDisplay(this.letterMap, ["East"], 1, new THREE.Vector2(6,-5))
        this.app.scene.add(this.timer.textGroup)
        this.app.scene.add(this.lap.textGroup)
        this.app.scene.add(this.vouchers.textGroup)
        this.app.scene.add(this.place.textGroup)
        this.app.scene.add(this.direction.textGroup)
        this.balloon.group.position.set(-10,12.5,5)
        this.balloon.light = this.playerLight
        this.balloon.light.intensity = 1000
        this.balloon.light.target = this.balloon.group
        this.balloon.group.add(this.balloon.light)
        this.voucherCount = 0
        this.punished = false
        this.invulnerable = false

        if (!this.screen){
            this.screen = new Minimap(new THREE.Vector2(-9, 3), this.outdoorShader.material)
            this.app.scene.add(this.screen.group)
        }
        
        this.checkpoints = []
        this.route.points.forEach(point => {
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: this.checkpoints.length < 1 ?    0xFFA500 : 0x0000ff });
            const checkpoint = new THREE.Mesh(geometry, material);
            checkpoint.scale.set(3, 0.01, 3)
            checkpoint.position.set(point.x,12,point.z)
            this.checkpoints.push(checkpoint)
            if (this.checkpoints.length <= 2)
                this.app.scene.add(checkpoint)
        })
        
        this.balloon.checkpoint = 0
        this.balloon.status = "start"
        this.balloon.lapTimes = []
        this.balloon.lap = 1
        this.balloon.targetLevel = 0
        this.balloon.level = 0
        this.balloonBot.checkpoint = 0
        this.balloonBot.status = "start"
        this.balloonBot.lapTimes = []
        this.balloonBot.lap = 1
        this.balloonBot.targetLevel = 0
        this.balloonBot.level = 0

        document.addEventListener('keydown', this.onKeyPress);
    }

    onKeyPress = (event) => {
        console.log(event.key)
        if (event.key === 'w' || event.key === 'W') {
            if (this.balloon.targetLevel < 4){
                this.balloon.targetLevel += 1
            }
        }
        else if (event.key === 's' || event.key === 'S') {
            if (this.balloon.targetLevel > 0){
                this.balloon.targetLevel -= 1
            }
        }
        else if (event.key === 'Escape') {
            this.gameState = this.states.start
            this.balloon.group.position.set(...this.balloon.positionDefault)
            this.balloonBot.group.position.set(...this.balloonBot.positionDefault)
            this.balloon = null
            this.balloonBot = null
            this.name = ""
            this.app.setActiveCamera(this.gameState.cameraName)
        }
    }

    update() {
        switch (this.gameState.name){
            case "startMenu":{
                if (this.balloon && this.initialMenu.text[1].text[0] != "Selected Balloon: " + this.balloon.name){
                    this.initialMenu.text[1].updateText("Selected Balloon: " + this.balloon.name)
                }
                if (this.balloonBot && this.initialMenu.text[2].text[0] != "Selected Bot: " + this.balloonBot.name){
                    this.initialMenu.text[2].updateText("Selected Bot: " + this.balloonBot.name)
                }
                if ("Name: " + this.name != this.initialMenu.text[0].text[0])
                    this.initialMenu.text[0].updateText("Name: " + this.name)
                break
            }
            case "endMenu": {
                if(Math.random()  < 0.05 ) {
                    this.fireworks.push(new MyFirework(this.app, this))
                    console.log("firework added")
                }
        
                for( let i = 0; i < this.fireworks.length; i++ ) {
                    if (this.fireworks[i].done) {
                        this.fireworks.splice(i,1) 
                        console.log("firework removed")
                        continue 
                    }
                    this.fireworks[i].update()
                }
                break
            }
            case "play":{
                const currentTime = Date.now();
                const delta = (currentTime - this.lastUpdateTime) / 1000;
                this.lastUpdateTime = currentTime;
                this.timerValue += delta;
                const minutes = Math.floor(this.timerValue / 60).toString().padStart(2, '0');
                const seconds = Math.floor(this.timerValue % 60).toString().padStart(2, '0');
                const timeString = `TIME: ${minutes}:${seconds}`;
                if (this.timer.text[0] !== timeString) {
                    this.timer.updateText(timeString);
                }

                const time = (this.timerValue % 60) / 60;
                if (this.balloonBot.status != "finish"){
                    const point = this.route.getPointAt(time);
                    this.balloonBot.group.position.set(...point);
                }

                this.balloonHitbox.setFromObject(this.balloon.group);
                const balloonHitboxHelper = new THREE.Box3Helper(this.balloonHitbox, 0x0000ff);
                //this.app.scene.add(balloonHitboxHelper);

                this.botHitbox.setFromObject(this.balloonBot.group);
                const botHitboxHelper = new THREE.Box3Helper(this.botHitbox, 0x0000ff);
                //this.app.scene.add(botHitboxHelper);

                const increment = 0.05
                if (this.balloon.status != "finish" && !this.punished){
                    if (this.balloon.level < this.balloon.targetLevel) {
                        this.balloon.level = Math.min(this.balloon.level + increment, this.balloon.targetLevel);
                        this.balloon.group.position.y = Math.min(this.balloon.group.position.y + increment, 16.5);
                    }
                    else if (this.balloon.level > this.balloon.targetLevel) {
                        this.balloon.level = Math.max(this.balloon.level - increment, this.balloon.targetLevel);
                        this.balloon.group.position.y = Math.max(this.balloon.group.position.y - increment, 12.5);
                    }
                    switch(this.balloon.targetLevel) {
                        case(1):
                            this.balloon.group.position.x += 0.5
                            this.app.cameras['playCamera'].position.x += 0.5
                            if (this.direction.text != "SOUTH")
                                this.direction.updateText("SOUTH");
                            break
                        case(2):
                            this.balloon.group.position.x -= 0.5
                            this.app.cameras['playCamera'].position.x -= 0.5
                            if (this.direction.text != "NORTH")
                                this.direction.updateText("NORTH");
                            break
                        case(3):
                            this.balloon.group.position.z += 0.5
                            this.app.cameras['playCamera'].position.z += 0.5
                            if (this.direction.text != "WEST")
                                this.direction.updateText("WEST");
                            break
                        case(4):
                            this.balloon.group.position.z -= 0.5
                            this.app.cameras['playCamera'].position.z -= 0.5
                            if (this.direction.text != "EAST")
                                this.direction.updateText("EAST");
                            break
                    }
                }
    
                if (this.balloon.group.position.distanceTo(this.route.points[(this.balloon.checkpoint + 1) % this.route.points.length]) <= this.balloon.group.position.distanceTo(this.route.points[this.balloon.checkpoint])){
                    this.balloon.checkpoint = (this.balloon.checkpoint + 1) % this.route.points.length;
                    this.checkpoints[(this.balloon.checkpoint) % this.checkpoints.length].material.color.set(0xFFA500);
                    this.app.scene.add(this.checkpoints[(this.balloon.checkpoint+1) % this.checkpoints.length])
                    console.log((this.balloon.checkpoint - 1 + this.checkpoints.length) % this.checkpoints.length)
                    this.checkpoints[(this.balloon.checkpoint - 1 + this.checkpoints.length) % this.checkpoints.length].material.color.set(0x0000ff);
                    this.app.scene.remove(this.checkpoints[(this.balloon.checkpoint - 1 + this.checkpoints.length) % this.checkpoints.length])
                    if (this.balloon.checkpoint == 2)
                        this.balloon.status = "running"
                }
                if (this.balloon.status == "running" && this.balloon.checkpoint == 1){
                    this.balloon.lap += 1
                    this.lap.updateText(`LAP: ${this.balloon.lap}/${this.lap}`)
                    if (this.balloon.lap > this.laps)
                        this.balloon.status = "finish"
                    if (this.balloon.lapTimes.length == 0){
                        this.balloon.lapTimes.push(this.timerValue)
                    }
                    else{
                        this.balloon.lapTimes.push(this.timerValue-this.balloon.lapTimes.at(-1))
                    }
                    console.log(this.balloon.lapTimes)
                }

                if (this.balloonBot.group.position.distanceTo(this.route.points[(this.balloonBot.checkpoint + 1) % this.route.points.length]) <= this.balloonBot.group.position.distanceTo(this.route.points[this.balloonBot.checkpoint])){
                    this.balloonBot.checkpoint = (this.balloonBot.checkpoint + 1) % this.route.points.length;
                    if (this.balloonBot.checkpoint == 2)
                        this.balloonBot.status = "running"
                }

                if (this.balloonBot.status == "running" && this.balloonBot.checkpoint == 1){
                    console.log(this.balloonBot.group.position.distanceTo(this.route.points[this.balloonBot.checkpoint]))
                    this.balloonBot.lap += 1
                    if (this.balloonBot.lap > this.laps)
                        this.balloonBot.status = "finish"
                    if (this.balloonBot.lapTimes.length == 0){
                        this.balloonBot.lapTimes.push(this.timerValue)
                    }
                    else{
                        this.balloonBot.lapTimes.push(this.timerValue-this.balloonBot.lapTimes.at(-1))
                    }
                }

                if (this.balloon.lap > this.balloonBot.lap){
                    if (this.place.text != "1st")
                        this.place.updateText("1st")
                }
                else if(this.balloon.lap < this.balloonBot.lap){
                    if (this.place.text != "2nd")
                        this.place.updateText("2nd")
                }
                else {
                    if (this.balloonBot.checkpoint > this.balloon.checkpoint){
                        if (this.place.text != "2nd")
                            this.place.updateText("2nd")
                    }
                    else if (this.balloonBot.checkpoint > this.balloon.checkpoint){
                        if (this.place.text != "1st")
                            this.place.updateText("1st")
                    }
                    else{
                        if (this.balloon.group.position.distanceTo(this.route.points[(this.balloon.checkpoint + 1) % this.route.points.length]) > this.balloonBot.group.position.distanceTo(this.route.points[(this.balloonBot.checkpoint + 1) % this.route.points.length]))
                            if (this.place.text != "2nd")
                                this.place.updateText("2nd")
                        else
                            if (this.place.text != "1st")
                                this.place.updateText("1st")
                    }
                }

                if (this.balloon.status == "finish" && this.balloonBot.status == "finish"){
                    this.balloon.group.position.set(-50, -115, 0)
                    this.balloonBot.group.position.set(50, -115, 0)
                    if (this.place.text == "1st"){
                        console.log(this.finalMenu.text[0])
                        this.finalMenu.text[0].updateText("Winner:" + this.name)
                    }
                    else
                        this.finalMenu.text[0].updateText("Winner: BOT")
                    let userTime = 0
                    let fastestLap = Infinity
                    let fastestLapOwner = this.balloon.name
                    this.balloon.lapTimes.forEach(time => {
                        userTime += time
                        if (fastestLap > time)
                            fastestLap = time
                    })
                    let minutes = Math.floor(userTime / 60).toString().padStart(2, '0');
                    let seconds = Math.floor(userTime % 60).toString().padStart(2, '0');
                    let timeString = `TIME: ${minutes}:${seconds}`;
                    this.finalMenu.text[1].updateText("user time: " + timeString)
                    let botTime = 0
                    this.balloonBot.lapTimes.forEach(time => {
                        botTime += time
                        if (fastestLap > time){
                            fastestLap = time
                            fastestLapOwner = "BOT"
                        }
                    })
                    minutes = Math.floor(botTime / 60).toString().padStart(2, '0');
                    seconds = Math.floor(botTime % 60).toString().padStart(2, '0');
                    timeString = `TIME: ${minutes}:${seconds}`;
                    this.finalMenu.text[2].updateText("bot time: " + timeString)

                    minutes = Math.floor(fastestLap / 60).toString().padStart(2, '0');
                    seconds = Math.floor(fastestLap % 60).toString().padStart(2, '0');
                    timeString = `TIME: ${minutes}:${seconds}`;
                    this.finalMenu.text[3].updateText("Fastest Lap: " + timeString + " - " + fastestLapOwner)
                    this.gameState = this.states.end
                    this.app.setActiveCamera(this.gameState.cameraName)

                    this.app.scene.remove(this.timer.textGroup)
                    this.app.scene.remove(this.lap.textGroup)
                    this.app.scene.remove(this.vouchers.textGroup)
                    this.app.scene.remove(this.place.textGroup)
                    this.app.scene.remove(this.direction.textGroup)
                    this.checkpoints[(this.balloon.checkpoint) % this.checkpoints.length].material.color.set(0x0000ff)
                    this.app.scene.remove(this.checkpoints[(this.balloon.checkpoint+1) % this.checkpoints.length])
                    this.app.scene.remove(this.checkpoints[(this.balloon.checkpoint) % this.checkpoints.length])
                
                    document.removeEventListener('keydown', this.onKeyPress);
                }

                this.timer.updateTextPosition(this.app.activeCamera)
                this.lap.updateTextPosition(this.app.activeCamera)
                this.vouchers.updateTextPosition(this.app.activeCamera)
                this.place.updateTextPosition(this.app.activeCamera)
                this.direction.updateTextPosition(this.app.activeCamera)
                this.screen.updatePosition(this.app.activeCamera)
                if (this.app.activeCameraName == "perspective" || this.app.activeCameraName == "playCamera")
                    this.app.controls.target = this.balloon.group.position

                this.obstacleShader.uniformValues.time.value += 0.02;
                this.powerShader.uniformValues.time.value += 0.02;

                if (this.app.powerUpList) {
                    //console.log(this.powerUpList);
                    this.app.powerUpList.forEach((powerUpMesh, powerUp) => {
                        powerUpMesh.rotation.y += 0.025;
                        powerUpMesh.material = this.powerShader.material;
                        powerUp.updateHitbox(powerUpMesh);

                        if (powerUp.hitbox.intersectsBox(this.balloonHitbox)) {
                            this.app.powerUpGroups.get(powerUp).remove(powerUpMesh);
                            //this.scene.remove(powerUpMesh);
                            powerUpMesh.geometry.dispose();
                            powerUpMesh.material.dispose();
                            powerUp.hitbox = null;
                            this.app.powerUpList.delete(powerUp);
                            console.log(this.app.powerUpList);
                            //console.log("goodbye");
                            this.voucherCount += 1;
                            this.vouchers.updateText("Vouchers: "+this.voucherCount)
                            console.log(this.voucherCount);
                        }
                    });
                }

                if (this.app.obstacleList) {
                    this.app.obstacleList.forEach((obstacleMesh, obstacle) => {
                        const elapsedTime = this.time.getElapsedTime();
        
                        obstacleMesh.position.y = this.app.obstaclePositions.get(obstacleMesh).y + 0.01 * Math.sin(elapsedTime);
                        obstacleMesh.material = this.obstacleShader.material;
                        obstacle.updateHitbox(obstacleMesh);
        
                        if (obstacle.hitbox.intersectsBox(this.balloonHitbox) && !this.invulnerable) {       
                            console.log("NABO")
                            this.balloon.level = 0
                            this.balloon.targetLevel = 0
                            if (this.voucherCount > 0) {
                                this.balloon.group.position.set(...this.route.points[this.balloon.checkpoint]);
                                this.app.cameras['playCamera'].position.set(this.route.points[this.balloon.checkpoint].x + 50, this.route.points[this.balloon.checkpoint].y + 17.5, this.route.points[this.balloon.checkpoint].z);
                                this.voucherCount -= 1;
                                this.vouchers.updateText("Vouchers: "+this.voucherCount)
                                this.enableGracePeriod(2);
                            }
                            else {
                                this.balloon.group.position.set(...this.route.points[this.balloon.checkpoint]);
                                this.app.cameras['playCamera'].position.set(this.route.points[this.balloon.checkpoint].x + 50, this.route.points[this.balloon.checkpoint].y + 17.5, this.route.points[this.balloon.checkpoint].z);
                                this.blockMovement(2);
                                this.enableGracePeriod(4);
                            }
                        }
                    });
                }
                if (this.botHitbox.intersectsBox(this.balloonHitbox)) {  
                    console.log("ACIDENTE")
                    this.balloon.level = 0
                    this.balloon.targetLevel = 0     
                    if (this.voucherCount > 0) {
                        this.balloon.group.position.set(...this.route.points[this.balloon.checkpoint]);
                        this.app.cameras['playCamera'].position.set(this.route.points[this.balloon.checkpoint].x + 50, this.route.points[this.balloon.checkpoint].y + 17.5, this.route.points[this.balloon.checkpoint].z);
                        this.voucherCount -= 1;
                        this.vouchers.updateText("Vouchers: "+this.voucherCount)
                        this.enableGracePeriod(2);
                    }
                    else {
                        this.balloon.group.position.set(...this.route.points[this.balloon.checkpoint]);
                        this.app.cameras['playCamera'].position.set(this.route.points[this.balloon.checkpoint].x + 50, this.route.points[this.balloon.checkpoint].y + 17.5, this.route.points[this.balloon.checkpoint].z);
                        this.blockMovement(2);
                        this.enableGracePeriod(4);
                    }
                }

                if (!this.checkTrackBounds()) {
                    this.balloon.level = 0
                    this.balloon.targetLevel = 0
                    if (this.voucherCount > 0) {
                        this.balloon.group.position.set(...this.route.points[this.balloon.checkpoint]);
                        this.app.cameras['playCamera'].position.set(this.route.points[this.balloon.checkpoint].x + 50, this.route.points[this.balloon.checkpoint].y + 17.5, this.route.points[this.balloon.checkpoint].z);
                        this.voucherCount -= 1;
                        this.vouchers.updateText("Vouchers: "+this.voucherCount)
                        this.enableGracePeriod(2);
                    }
                    else{
                        console.log("nuked");
                        this.balloon.group.position.set(...this.route.points[this.balloon.checkpoint]);
                        this.app.cameras['playCamera'].position.set(this.route.points[this.balloon.checkpoint].x + 50, this.route.points[this.balloon.checkpoint].y + 17.5, this.route.points[this.balloon.checkpoint].z);
                        this.blockMovement(2);
                        this.enableGracePeriod(4);
                    }
                }
                break
            }
        }
    }

    blockMovement(t) {
        this.punished = true;
        this.balloon.level = 0
        this.balloon.targetLevel = 0
        setTimeout(() => { this.punished = false; }, t * 1000);
    }

    enableGracePeriod(t) {
        this.invulnerable = true;
        setTimeout(() => { this.invulnerable = false; }, t * 1000);
    }

    checkTrackBounds() {
        for (const limit of this.track.trackLimits) {
            if (limit.intersectsBox(this.balloonHitbox)) {
                return true;
            }
        }
        return false;
    }
}

export { MyContents };

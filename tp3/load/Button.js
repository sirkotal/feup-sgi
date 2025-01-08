import * as THREE from 'three';
import { TextDisplay } from '../utils/TextDisplay.js';

export class Button {

    constructor(text, position, letterMap){
        this.text = text
        this.position = position
        this.letterMap = letterMap
        this.pointed = false
        this.group = new THREE.Group()
        this.build()
    }

    build(){
        const button = new THREE.BoxGeometry(8,4,1)
        const buttonMaterial = new THREE.MeshStandardMaterial({color: 0xffffff})
        const buttonMesh = new THREE.Mesh(button, buttonMaterial)
        buttonMesh.position.set(...this.position)
        const buttonText = new TextDisplay(this.letterMap, this.text, 1, buttonMesh.position).textGroup
        buttonText.position.x -= 4
        buttonText.position.z += 1
        this.group.add(buttonMesh)
        this.group.add(buttonText)
    }

    onPointing(){
        if (!this.pointed){
            this.group.children[0].material.color.set(0xFFA500);
            this.pointed = true
        }
    }

    onPointingAway(){
        if (this.pointed){
            this.group.children[0].material.color.set(0xFFFFFF);
            this.pointed = false
        }
    }
}
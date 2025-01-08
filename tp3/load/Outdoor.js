import * as THREE from 'three';
import { TextDisplay } from '../utils/TextDisplay.js';
import { Button } from './Button.js';


export class Outdoor {

    constructor(letterMap, textList, buttonsList, position){
        this.letterMap = letterMap
        this.textList = textList
        this.text = []
        this.buttonsList = buttonsList
        this.buttons = []
        this.position = position
        this.group = new THREE.Group()
        this.build()
    }

    build(){
        const board = new THREE.BoxGeometry(65,20,2)
        const boardMaterial = new THREE.MeshStandardMaterial({color: 0x000000})
        const boardMesh = new THREE.Mesh(board, boardMaterial)
        boardMesh.position.x = 30
        boardMesh.position.y = -8
        boardMesh.position.z = -1.3
        this.group.add(boardMesh)
        this.textList.forEach(phrase => {
            const text = new TextDisplay(this.letterMap, phrase.text, phrase.size, phrase.position)
            this.text.push(text)
            this.group.add(text.textGroup)
        });
        this.buttonsList.forEach(element => {
            const button = new Button(element.text, element.position, this.letterMap)
            this.buttons.push(button)
            console.log(button)
            this.group.add(button.group)
        });
        this.group.position.set(... this.position)
    }


}
import * as THREE from 'three';


export class Balloon {

    constructor(group, level, targetLevel, name){
        this.level = level
        this.targetLevel = targetLevel
        this.group = group
        this.pointed = false
        this.checkpoint = null
        this.positionDefault = null
        this.name = name
        this.lap = 1
        this.lapTimes = []
        this.status = "start"
    }

    onPointing(){
        if (!this.pointed){
            this.group.position.y += 2;
            this.pointed = true
        }
    }

    onPointingAway(){
        if (this.pointed){
            this.group.position.y -= 2;
            this.pointed = false
        }
    }
}
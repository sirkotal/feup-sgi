import * as THREE from 'three';

export class TextDisplay {
    constructor(lettersMap, text, textSize, position) {
        this.lettersMap = lettersMap;
        this.text = text;
        this.textSize = textSize;
        this.position = position
        this.textGroup = new THREE.Group();
		this.build()
    }

    build(){
		const position = new THREE.Vector2(0,1)
		this.text.forEach(phrase => {
            const group = new THREE.Group();
            position.x = 0
            position.y -= 1*this.textSize
			for (let i = 0; i < phrase.length; i++) {
				const letter = phrase.charAt(i);
				position.x += this.textSize;
				const object = this.lettersMap[letter];
				const texture = new THREE.TextureLoader().load('./game/textures/chars.png');
				texture.offset.set(object.startU, object.startV);
				texture.repeat.set(object.endU - object.startU, object.endV - object.startV);
				const material = new THREE.SpriteMaterial({ map: texture });
				const sprite = new THREE.Sprite(material);
				sprite.position.set(position.x, position.y, 0);
				sprite.scale.set(this.textSize, this.textSize)
				group.add(sprite);
			}
            this.textGroup.add(group)
        });
        this.textGroup.position.set(... this.position)
	}

    updateText(newText) {
        this.textGroup.clear();
        this.text = [newText];
        this.build();
    }

    updateTextPosition(camera) {
        const distance = 0.1;
        const direction = new THREE.Vector3(0, 0, -100).applyQuaternion(camera.quaternion);
        const newPosition = new THREE.Vector3();
        newPosition.copy(camera.position).addScaledVector(direction, distance);
        newPosition.add(new THREE.Vector3(this.position.x, this.position.y, 0).applyQuaternion(camera.quaternion));
        this.textGroup.position.copy(newPosition);
        this.textGroup.quaternion.copy(camera.quaternion);

    }  
}

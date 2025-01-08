import * as THREE from 'three';

class MyTrack extends THREE.Object3D {
    constructor(points, width, segments, closedCurve) {
        super();
        
        this.points = points;
        this.width = width;
        this.segments = segments;
        this.closedCurve = closedCurve;
    }

    buildTrack() {
        const formattedPoints = this.points.flatMap(point => [point.x, point.y, point.z]);

        this.textureRepeat = 1;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = true;

        this.controlPoints = [];
        
        const texture = new THREE.TextureLoader().load('./game/textures/track.avif');
        const trackMaterial = new THREE.MeshPhongMaterial({ color: "#cccccc", 
            specular: "#000000", emissive: "#000000", map: texture});

        for (let i = 0; i < formattedPoints.length; i += 3) {
            this.controlPoints.push(new THREE.Vector3(formattedPoints[i], formattedPoints[i+1], formattedPoints[i+2]));
        }

        this.path = new THREE.CatmullRomCurve3(this.controlPoints);

        console.log(this.path);
        
        let geometry = new THREE.TubeGeometry(
            this.path,
            this.segments,
            this.width,
            3,
            this.closedCurve
        );

        this.mesh = new THREE.Mesh(geometry, trackMaterial);
        this.mesh.receiveShadow = true
        this.wireframeMaterial = new THREE.MeshBasicMaterial({
              color: 0x0000ff,
              opacity: 0.3,
              wireframe: true,
              transparent: true,
        });
        this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);
        let points = this.path.getPoints(this.segments);
        let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        this.line = new THREE.Line(bGeometry, this.material);
        
        let track = new THREE.Group();
        
        this.mesh.visible = this.showMesh;
        this.wireframe.visible = this.showWireframe;
        this.line.visible = this.showLine;

        this.#setTrackLimits();

        track.add(this.mesh);
        track.add(this.wireframe);
        track.add(this.line);

        this.trackLimits.forEach(limit => {
            const helper = new THREE.Box3Helper(limit, 0x00ff00);
            //track.add(helper);
        });

        console.log(track);

        //track.rotateZ(Math.PI);
        track.scale.set(1, 0.05, 1);
        track.position.y = 10;
        //track.position.x = -680;
        //track.position.z = -380;
        
        return track;
    }

    #setTrackLimits() {
        const trackSideWidth = Math.sqrt(Math.pow(this.width, 2) / 2) - 6;
        this.trackLimits = [];

        for (let i = 0; i <= 1; i += 1 / this.segments) {
            const point = this.path.getPointAt(i);

            const limit = new THREE.Box3(
                new THREE.Vector3(point.x - trackSideWidth, 0, point.z - trackSideWidth), // y is hardcoded for now
                new THREE.Vector3(point.x + trackSideWidth, 2000, point.z + trackSideWidth)
            );

            this.trackLimits.push(limit);
        }
    }
}

export { MyTrack };
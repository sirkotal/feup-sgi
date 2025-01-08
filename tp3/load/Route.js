import * as THREE from 'three';

class MyRoute extends THREE.Object3D {
    constructor(points) {
        super();
        this.points = points;
        this.spline = null;
    }

    setRoute() {
        this.keyPoints = [];
        this.keyframes = [];

        const formattedPoints = this.points.flatMap(point => [point.x, point.y, point.z]);

        for (let i = 0; i < formattedPoints.length; i += 3) {
            this.keyPoints.push(new THREE.Vector3(formattedPoints[i], formattedPoints[i+1], formattedPoints[i+2]));
        }
        for (let i = 0; i < this.keyPoints.length; i += 1) {
            this.keyframes.push({ time: 2 * i, value: this.keyPoints[i] })
        }
        //console.log(this.keyframes);
        this.spline = new THREE.CatmullRomCurve3(this.keyframes.map(kf => kf.value));
        console.log(this.spline);

        let route = new THREE.Group();
        
        for (let i = 0; i < this.keyPoints.length; i++) {
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.scale.set(0.5, 0.5, 0.5)
            sphere.position.set(... this.keyPoints[i])

            route.add(sphere)
        }

        const tubeGeometry = new THREE.TubeGeometry(this.spline, 100, 0.05, 10, false);
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
        route.add(tubeMesh)
        //route.position.y = 30;
        //route.position.x = -680;
        //route.position.z = -380;
        //console.log(tubeMesh);
        return route;
    }

    getRoute() {
        return this.spline;
    }

}

export { MyRoute };
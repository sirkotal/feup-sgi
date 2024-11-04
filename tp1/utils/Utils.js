import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

/**
 * draws the hull for a specific curve
 * @param {*} position - the position of the hull
 * @param {*} points - the points representing the geometry of the hull
 * @param {*} color - the color of the hull
 * @returns {THREE.Line} - the hull of the curve
 */
export function drawHull(position, points, color = 0xffffff) {
    let hullMaterial =
            new THREE.MeshBasicMaterial( {color: color} );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    let line = new THREE.Line( geometry, hullMaterial );

    line.position.set(position.x,position.y,position.z)

    return line;
}

/**
 * initializes a cubic Bézier curve
 * @param {*} app - the application object
 * @param {*} points - the points representing the geometry of the curve
 * @param {*} carColor - the color of the curve
 * @param {*} position - the position of the curve
 */
export function initCubicBezierCurve(app, points, carColor, position) {
    let hull = drawHull(position, points);
    // app.scene.add( hull );

    let curve =
        new THREE.CubicBezierCurve3( points[0], points[1], points[2], points[3] )
    
    let sampledPoints = curve.getPoints( 32 );

    let curveGeometry =
        new THREE.BufferGeometry().setFromPoints( sampledPoints )

    let lineMaterial = new THREE.LineBasicMaterial( { color: carColor } )

    let lineObj = new THREE.Line( curveGeometry, lineMaterial )

    lineObj.position.set(position.x,position.y,position.z)

    app.scene.add( lineObj );
}

/**
 * initializes a quadratic Bézier curve
 * @param {*} app - the application object
 * @param {*} points - the points representing the geometry of the curve
 * @param {*} carColor - the color of the curve
 * @param {*} position - the position of the curve
 */
export function initQuadraticBezierCurve(app, points, carColor, position) {
    let hull = drawHull(position, points);
    //app.scene.add( hull );

    let curve =
        new THREE.QuadraticBezierCurve3( points[0], points[1], points[2] )
    
    let sampledPoints = curve.getPoints( 32 );

    let curveGeometry =
        new THREE.BufferGeometry().setFromPoints( sampledPoints )

    let lineMaterial = new THREE.LineBasicMaterial( { color: carColor } )

    let lineObj = new THREE.Line( curveGeometry, lineMaterial )

    lineObj.position.set(position.x,position.y,position.z)

    app.scene.add( lineObj );  
}

/**
 * initializes a Catmull-Rom curve
 * @param {*} app - the application object
 * @param {*} points - the points representing the geometry of the curve
 * @param {*} position - the position of the curve
 */
export function initCatmullRomCurve(app, points, position) {
    let hull = drawHull(position, points);
    app.scene.add( hull );

    let curve =
        new THREE.CatmullRomCurve3( points )
    
    let sampledPoints = curve.getPoints( 40 );

    let curveGeometry =
        new THREE.BufferGeometry().setFromPoints( sampledPoints )

    let lineMaterial = new THREE.LineBasicMaterial( { color: 0xffff00 } )

    let lineObj = new THREE.Line( curveGeometry, lineMaterial )

    lineObj.position.set(position.x,position.y,position.z)

    app.scene.add( lineObj );      
}

/**
 * This class acts as a builder for a NURBS surface
 */
export class MyNurbsBuilder  {
    constructor(app) {
        this.app = app
    }

    build(controlPoints, degree1, degree2, samples1, samples2, material) {
        const knots1 = []
        const knots2 = []

        for (var i = 0; i <= degree1; i++) {
            knots1.push(0)
        }

        for (var i = 0; i <= degree1; i++) {
            knots1.push(1)
        }


        for (var i = 0; i <= degree2; i++) {
            knots2.push(0)
        }

        for (var i = 0; i <= degree2; i++) {
            knots2.push(1)
        }


        let stackedPoints = []

        for (var i = 0; i < controlPoints.length; i++) {
            let row = controlPoints[i]

            let newRow = []

            for (var j = 0; j < row.length; j++) {
                let item = row[j]

                newRow.push(new THREE.Vector4(item[0], item[1], item[2], item[3]));
            }
            stackedPoints[i] = newRow;
        }

        const nurbsSurface = new NURBSSurface( degree1, degree2, knots1, knots2, stackedPoints );

        const geometry = new ParametricGeometry( getSurfacePoint, samples1, samples2 );
        return geometry;

        function getSurfacePoint( u, v, target ) {
            return nurbsSurface.getPoint( u, v, target );
        }
    }
}

/**
 * creats a NURBS surface
 * @param {*} app - the application object
 * @param {*} builder - the NURBS builder
 * @param {*} controlPoints - the control points for the NURBS surface
 * @param {*} orderU - the order of the surface relative to U
 * @param {*} orderV - the order of the surface relative to V
 * @param {*} material - the material of the NURBS surface
 * @param {*} x - the position in the X axis of the NURBS surface
 * @param {*} y - the position in the Y axis of the NURBS surface
 * @param {*} z - the position in the Z axis of the NURBS surface
 * @param {*} scale - the scale of the NURBS surface in the scene
 * @param {*} rotationX - the rotation of the NURBS surface relatively to the X axis
 * @param {*} rotationY - the rotation of the NURBS surface relatively to the Y axis
 * @param {*} rotationZ - the rotation of the NURBS surface relatively to the Z axis
 */
export function createNurbsSurfaces(app, builder, controlPoints, orderU, orderV, material, x, y, z, scale, rotationX=0, rotationY=0, rotationZ=0) {  
    // declare local variables
    let surfaceData;
    let mesh;
    // let builder = new MyNurbsBuilder();

    let samplesU = 20     
    let samplesV = 20 
   
    // build nurb
    surfaceData = builder.build(controlPoints, orderU, orderV, samplesU, samplesV, material)  

    mesh = new THREE.Mesh( surfaceData, material );

    mesh.scale.set(scale, scale, scale)
    mesh.position.set(x, y, z)
    mesh.rotation.x = rotationX;
    mesh.rotation.y = rotationY;
    mesh.rotation.z = rotationZ;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    app.scene.add( mesh )
    // this.meshes.push (mesh)
}

/**
 * This class extends the THREE.Curve class and creates a custom HelixCurve class, depicting a helix (based on certain mathematical equations)
 */
export class HelixCurve extends THREE.Curve {
    constructor(radius, height, coil_num) {
        super();
        this.radius = radius; 
        this.height = height;  
        this.coils = coil_num;    
    }
    
    // sources for this equation: https://mathworld.wolfram.com/Helix.html, https://math.stackexchange.com/questions/461547/whats-the-equation-of-helix-surface, https://en.wikipedia.org/wiki/Helix
    
    /**
     * retrieves a point for a specific position on the curve
     * @param {THREE.Vector3} t - position on the curve according to the arc length, which must be in the range [0, 1]
     * @returns - a vector for the given position
     */
    getPoint(t) {
        const angle = t * Math.PI * 2 * this.coils;

        const x = this.radius * Math.cos(angle);
        const y = this.height * t;            
        const z = this.radius * Math.sin(angle);
        
        return new THREE.Vector3(x, y, z);
    }
}
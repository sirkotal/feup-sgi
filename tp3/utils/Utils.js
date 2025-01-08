import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

/**
 * This class acts as a builder for a NURBS surface
 */
export class MyNurbsBuilder  {
    constructor(app) {
        this.app = app
    }

    build(controlPoints, degree1, degree2, samples1, samples2) {
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
 * @param {*} builder - the NURBS builder
 * @param {*} controlPoints - the control points for the NURBS surface
 * @param {*} orderU - the order of the surface relative to U
 * @param {*} orderV - the order of the surface relative to V
 * @param {*} samplesU - the sample number of the surface relative to U
 * @param {*} samplesV - the sample number of the surface relative to V
 * @param {*} material - the material utilized by the NURBS
 */
export function createNurbsSurfaces(builder, controlPoints, orderU, orderV, samplesU, samplesV, material) {  
    // declare local variables
    let surfaceData;
    let mesh;
    // let builder = new MyNurbsBuilder();

    const newControlPoints = [];
    for (let i = 0; i < controlPoints.length; i += orderV + 1) {
        newControlPoints.push(controlPoints.slice(i, i + orderV + 1));
    }

    let pointsUpdated = newControlPoints.map(row =>
        row.map(({ x, y, z }) => [x, y, z, 1])
    );
   
    // build nurb
    surfaceData = builder.build(pointsUpdated, orderU, orderV, samplesU, samplesV);  

    mesh = new THREE.Mesh( surfaceData, material );

    mesh.receiveShadow = true;
    mesh.castShadow = true;

    return mesh;
}

/**
 * load an image and create a mipmap to be added to a texture at the defined level.
 * In between, add the image some text and control squares. These items become part of the picture
 * 
 * @param {*} parentTexture the texture to which the mipmap is added
 * @param {*} level the level of the mipmap
 * @param {*} path the path for the mipmap image
*/
export function loadMipmap(parentTexture, level, path)
{
    // load texture. On loaded call the function to create the mipmap for the specified level 
    new THREE.TextureLoader().load(path, 
        function(mipmapTexture)  // onLoad callback
        {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            ctx.scale(1, 1);
            
            // const fontSize = 48
            const img = mipmapTexture.image         
            canvas.width = img.width;
            canvas.height = img.height

            // first draw the image
            ctx.drawImage(img, 0, 0 )
                            
            // set the mipmap image in the parent texture in the appropriate level
            parentTexture.mipmaps[level] = canvas
        },
        undefined, // onProgress callback currently not supported
        function(err) {
            console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
        }
    )
}
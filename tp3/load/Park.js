import * as THREE from 'three'

class MyPark extends THREE.Object3D {
  constructor(points) {
    super()

    this.points = points
  }

  buildPark() {
    const park = new THREE.Group()

    const groundTexture = new THREE.TextureLoader().load(
      './game/textures/tarmac.jpg'
    )
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: '#444444',
      specular: '#000000',
      emissive: '#000000',
      side: THREE.DoubleSide,
      map: groundTexture,
    })

    const ground = new THREE.PlaneGeometry(50, 50)
    const groundMesh = new THREE.Mesh(ground, groundMaterial)
    groundMesh.rotation.x = -Math.PI / 2
    park.add(groundMesh)

    // Trees
    for (let i = -20; i <= 20; i += 10) {
      const tree = this.createTree()
      tree.position.set(-i, 1, -40 + Math.random() * 10)
      park.add(tree)
    }

    // Lake with close rock barrier
    const lakeGeometry = new THREE.CircleGeometry(8, 32)
    const waterTexture = new THREE.TextureLoader().load(
      './game/textures/water.jpg'
    )
    const lakeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e90ff, // A more lake-like blue
      map: waterTexture, // Optional: you can still use the texture to give it a realistic surface
      metalness: 0.5, // Reflective properties for a wet look
      roughness: 0.2, // Slight smoothness
      transparent: false, // Disable transparency entirely
      opacity: 1.0, // Fully opaque
      side: THREE.DoubleSide,
    })

    const lake = new THREE.Mesh(lakeGeometry, lakeMaterial)
    lake.rotation.x = -Math.PI / 2
    lake.position.set(0, 0.1, -50)
    park.add(lake)

    // Add dense rocks around the lake as a barrier
    for (let i = 0; i < 40; i++) {
      // Increased to 40 rocks for a denser barrier
      const rock = this.createRock()
      const angle = (i / 40) * Math.PI * 2 // Distribute rocks in a circular pattern
      const radius = 8.5 // Keep rocks close to the lake's edge
      rock.position.set(
        radius * Math.cos(angle),
        0.02,
        1 + radius * Math.sin(angle) - 50
      )
      rock.rotation.y = Math.random() * Math.PI // Random rotation for realism
      park.add(rock)
    }

    // Benches
    for (let i = 0; i < 3; i++) {
      const bench = this.createBench()
      bench.position.set(i * 6 - 6, 0.5, -15)
      park.add(bench)
    }

    const wallTexture = new THREE.TextureLoader().load(
      './game/textures/parkwall.jpg'
    )
    const wallMaterial = new THREE.MeshPhongMaterial({
      color: '#888888',
      specular: '#444444',
      emissive: '#000000',
      side: THREE.DoubleSide,
      map: wallTexture,
    })

    const leftWall = new THREE.BoxGeometry(1, 5, 50)
    const leftWallMesh = new THREE.Mesh(leftWall, wallMaterial)
    leftWallMesh.position.set(-25, 2.5, 0)
    park.add(leftWallMesh)

    const rightWall = new THREE.BoxGeometry(1, 5, 50)
    const rightWallMesh = new THREE.Mesh(rightWall, wallMaterial)
    rightWallMesh.position.set(25, 2.5, 0)
    park.add(rightWallMesh)

    const backWall = new THREE.BoxGeometry(50, 5, 1)
    const backWallMesh = new THREE.Mesh(backWall, wallMaterial)
    backWallMesh.position.set(0, 2.5, -25)
    park.add(backWallMesh)

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })

    for (let i = -2; i <= 2; i++) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * 10, 0.01, -20),
        new THREE.Vector3(i * 10, 0.01, 20),
      ])
      const line = new THREE.Line(lineGeometry, lineMaterial)
      park.add(line)
    }
    // Add multiple lamp posts around the park
    for (let x = -20; x <= 20; x += 10) {
      const lampPost = this.createLampPost()
      lampPost.position.set(x, 0, -10)
      park.add(lampPost)
    }

    // Add more flowers
    for (let i = -10; i <= 10; i++) {
      const flower = this.createFlower()
      flower.position.set(i*2, 0, -37 + Math.random() * 4)
      park.add(flower)
    }

    // Add a large trash can
    const trashCan = this.createTrashCan()
    trashCan.position.set(10, 0, 10)
    park.add(trashCan)

    park.position.y = 10
    park.position.x = -20
    park.position.z = -80

    return park
  }

  createTrashCan() {
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: '#555555',
      shininess: 20,
    })
    const lidMaterial = new THREE.MeshPhongMaterial({ color: '#333333' })

    // Trash can body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32),
      bodyMaterial
    )

    // Lid
    const lid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.1, 32),
      lidMaterial
    )
    lid.position.y = 0.8

    const trashCan = new THREE.Group()
    trashCan.add(body)
    trashCan.add(lid)

    // Adding handles to the trash can
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.02, 16, 16),
      lidMaterial
    )
    handle.rotation.x = Math.PI / 2
    handle.position.set(0.3, 0.85, 0)
    trashCan.add(handle)

    trashCan.scale.set(1.5, 1.5, 1.5) // Make the trash can bigger
    return trashCan
  }

  createFlower() {
    const petalTexture = new THREE.TextureLoader().load(
      './game/textures/flowerPetal.jpg'
    )
    const stemTexture = new THREE.TextureLoader().load(
      './game/textures/stemTexture.jpg'
    )

    const stemMaterial = new THREE.MeshPhongMaterial({ map: stemTexture })
    const flowerMaterial = new THREE.MeshPhongMaterial({ map: petalTexture })

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 1, 8),
      stemMaterial
    )
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 8, 8),
      flowerMaterial
    )

    flower.position.y = 0.5
    const flowerGroup = new THREE.Group()
    flowerGroup.add(stem)
    flowerGroup.add(flower)

    return flowerGroup
  }

  createPicnicTable() {
    const woodMaterial = new THREE.MeshPhongMaterial({ color: '#8B4513' })

    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.2, 2),
      woodMaterial
    )
    tableTop.position.y = 1.0

    const bench1 = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.1, 0.5),
      woodMaterial
    )
    bench1.position.set(0, 0.5, -1.2)

    const bench2 = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.1, 0.5),
      woodMaterial
    )
    bench2.position.set(0, 0.5, 1.2)

    const legs = []
    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.8, 0.1),
        woodMaterial
      )
      leg.position.set(i % 2 ? 1.9 : -1.9, 0.2, i < 2 ? 0.8 : -0.8)
      legs.push(leg)
    }

    const picnicTable = new THREE.Group()
    picnicTable.add(tableTop, bench1, bench2, ...legs)
    return picnicTable
  }

  createLampPost() {
    const poleTexture = new THREE.TextureLoader().load(
      './game/textures/metalPole.jpg'
    )
    const lampTexture = new THREE.TextureLoader().load(
      './game/textures/lampLight.jpg'
    )

    const poleMaterial = new THREE.MeshPhongMaterial({ map: poleTexture })
    const lampMaterial = new THREE.MeshStandardMaterial({
      map: lampTexture,
      emissive: '#FFFF99',
      emissiveIntensity: 1.0,
      metalness: 0.4,
      roughness: 0.2,
    })

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 4, 16),
      poleMaterial
    )
    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      lampMaterial
    )

    lamp.position.y = 2.5
    const lampPost = new THREE.Group()
    lampPost.add(pole)
    lampPost.add(lamp)

    return lampPost
  }

  createTree() {
    const barkTexture = new THREE.TextureLoader().load(
      './game/textures/bark.jpg'
    )
    const leavesTexture = new THREE.TextureLoader().load(
      './game/textures/leaves.png'
    )

    const trunkMaterial = new THREE.MeshPhongMaterial({ map: barkTexture })
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.4, 3, 16),
      trunkMaterial
    )

    const leavesMaterial = new THREE.MeshPhongMaterial({
      map: leavesTexture,
      transparent: true, // If leaves have alpha
      side: THREE.DoubleSide,
    })
    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 16, 16),
      leavesMaterial
    )

    leaves.position.y = 2.5
    const tree = new THREE.Group()
    tree.add(trunk)
    tree.add(leaves)
    return tree
  }

  createBench() {
    const bench = new THREE.Group()
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.2, 1),
      new THREE.MeshPhongMaterial({ color: '#8B4513' })
    )

    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.8, 0.1),
        new THREE.MeshPhongMaterial({ color: '#654321' })
      )
      leg.position.set(i % 2 ? 1.3 : -1.3, -0.4, i < 2 ? 0.4 : -0.4)
      bench.add(leg)
    }
    bench.add(seat)
    return bench
  }

  createRock() {
    const rockTexture = new THREE.TextureLoader().load(
      './game/textures/rock.jpg'
    )
    const rockMaterial = new THREE.MeshStandardMaterial({ map: rockTexture })

    const rockGeometry = new THREE.DodecahedronGeometry(
      1 + Math.random() * 0.5,
      0
    )
    const rock = new THREE.Mesh(rockGeometry, rockMaterial)
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
    return rock
  }
}

export { MyPark }

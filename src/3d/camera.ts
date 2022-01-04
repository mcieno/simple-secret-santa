import * as THREE from "three"


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    20
)

camera.position.set( 0, -.5, 2 )
camera.lookAt(0, -.5, 0)


export default camera

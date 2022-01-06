import * as THREE from "three"


const scene = new THREE.Scene()

scene.background = new THREE.Color( 0xab2328 )
scene.add(new THREE.AmbientLight(0xffffff, 1))


export default scene

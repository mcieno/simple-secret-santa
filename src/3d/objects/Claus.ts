import * as THREE from "three"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"


const gltf = await new GLTFLoader()
    .setPath("/models/")
    .loadAsync("claus.glb")


export default class Claus {
    private camera: THREE.Camera
    private scene: THREE.Scene

    private mouse: THREE.Vector2
    private target: THREE.Vector3

    constructor(camera: THREE.Camera, scene: THREE.Scene) {
        this.camera = camera
        this.scene = scene

        this.mouse = new THREE.Vector2()
        this.target = new THREE.Vector3(0, 0, this.camera.position.z - 500)
    }

    object(): THREE.Object3D {
        gltf.scene.scale.set(3, 3, 3)
        return gltf.scene
    }

    register() {
        this.object().position.set(0, 0, 0)
        window.addEventListener("mousemove", e => Claus._mouseEventListener(this, e))
        document.addEventListener("click", e => Claus._mouseEventListener(this, e))

        this.scene.add(this.object())
    }

    tick(elapsedTimeInSeconds: number) {
        this.target.x -= ( this.mouse.x + this.target.x ) * .02
        this.target.y += ( this.mouse.y - this.target.y ) * .02

        this.object().lookAt(this.target)
    }

    private static _mouseEventListener(claus: Claus, event: MouseEvent) {
        claus.mouse.set(
            event.clientX - window.innerWidth / 2,
            event.clientY - window.innerHeight / 2
        )
    }
}

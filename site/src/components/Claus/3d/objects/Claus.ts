import * as THREE from "three";
import {
  type GLTF,
  GLTFLoader,
} from "three/examples/jsm/loaders/GLTFLoader.js";

const gltf: GLTF = await new GLTFLoader()
  .setPath(`${import.meta.env.BASE_URL}models/`)
  .loadAsync("claus.glb");

export default class Claus {
  private scene: THREE.Scene;

  private mouse: THREE.Vector2;
  private target: THREE.Vector3;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.mouse = new THREE.Vector2();
    this.target = new THREE.Vector3(0, 0, 2);
  }

  object(): THREE.Object3D {
    gltf.scene.scale.set(-3, 3, 3);
    return gltf.scene;
  }

  register() {
    this.object().position.set(0, 0.8, 0);
    window.addEventListener("mousemove", (e) =>
      Claus._mouseEventListener(this, e),
    );
    document.addEventListener("click", (e) =>
      Claus._mouseEventListener(this, e),
    );

    this.scene.add(this.object());
  }

  tick(elapsedTimeInSeconds: number) {
    this.target.x -= (this.mouse.x + this.target.x) * 0.02;
    this.target.y += (this.mouse.y - this.target.y) * 0.02;

    this.object().lookAt(this.target);
  }

  private static _mouseEventListener(claus: Claus, event: MouseEvent) {
    claus.mouse.set(
      6 * (-event.clientX / window.innerWidth + 0.5),
      3 * (-event.clientY / window.innerHeight + 0.5),
    );
  }
}

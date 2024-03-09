import * as THREE from "three";

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  20,
);

camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);

export default camera;

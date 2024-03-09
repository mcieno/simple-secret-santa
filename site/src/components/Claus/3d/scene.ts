import * as THREE from "three";

export default function getScene(
  bg: THREE.ColorRepresentation,
  light: THREE.Light,
): THREE.Scene {
  const scene = new THREE.Scene();

  scene.background = new THREE.Color(bg);
  scene.add(light);

  return scene;
}

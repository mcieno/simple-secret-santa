import * as THREE from "three";

export default function getRenderer(
  canvas: HTMLCanvasElement,
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  return renderer;
}

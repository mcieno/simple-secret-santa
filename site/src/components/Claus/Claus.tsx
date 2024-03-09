import { onMount } from "solid-js";

import "./Claus.css";

import * as THREE from "three";
import camera from "./3d/camera";
import time from "./3d/time";
import ClausObject from "./3d/objects/Claus";

interface Props {
  lightColor?: THREE.ColorRepresentation;
  lightPosition?: THREE.Vector3Like;
}

let RefCanvas: HTMLCanvasElement;

export default function ClausCanvas(props: Props) {
  onMount(() => {
    // Scene
    const scene = new THREE.Scene();

    const light = new THREE.PointLight(props.lightColor ?? 0xffffff, 20);
    light.position.set(
      props.lightPosition?.x ?? 0,
      props.lightPosition?.y ?? -1.3,
      props.lightPosition?.z ?? 7,
    );
    scene.add(light);
    scene.add(new THREE.AmbientLight(light.color, 1));

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: RefCanvas,
      alpha: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Create objects
    const claus = new ClausObject(scene);

    // Add objects to scene
    claus.register();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    });

    window.addEventListener("tick", ((
      e: CustomEvent<{
        elapsedTime: number;
        delta: number;
      }>,
    ): void => {
      renderer.render(scene, camera);

      // Update objects
      claus.tick(e.detail.delta);
    }) as EventListener);

    // Start animation
    time.start();
  });

  return (
    <div class="ClausCanvas">
      <canvas ref={RefCanvas}></canvas>
    </div>
  );
}

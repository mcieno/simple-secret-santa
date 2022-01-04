import * as THREE from "three"


const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#santa') as HTMLCanvasElement,
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;


export default renderer

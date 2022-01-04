import camera from "./camera"
import renderer from "./renderer"
import scene from "./scene"
import time from "./time"

import Claus from "./objects/Claus"


// Create objects
const claus = new Claus(camera, scene)

// Add objects to scene
claus.register()

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

window.addEventListener(
    "tick",
    (
        (
            e: CustomEvent<{
                elapsedTime: number;
                delta: number;
            }>
        ): void => {
            renderer.render(scene, camera)

            // Update objects
            claus.tick(e.detail.delta)
        }
    ) as EventListener
)

// Remove loading screen
const loadingScreen = document.getElementById("loading-screen") as HTMLElement
loadingScreen.addEventListener("transitionend", () => loadingScreen.remove())
loadingScreen.classList.add("fade-out")

// Start animation
time.start()

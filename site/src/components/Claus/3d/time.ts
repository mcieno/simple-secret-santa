import * as THREE from "three";

class Time {
  private clock: THREE.Clock;
  private ticker: number | undefined;

  constructor() {
    this.clock = new THREE.Clock();
    this.ticker = undefined;
  }

  start(): Time {
    this.ticker = window.requestAnimationFrame(() => {
      this.start();
    });

    window.dispatchEvent(
      new CustomEvent("tick", {
        detail: {
          elapsedTime: this.clock.getElapsedTime(),
          delta: this.clock.getDelta(),
        },
      }),
    );

    return this;
  }

  stop(): Time {
    if (typeof this.ticker !== "undefined") {
      window.cancelAnimationFrame(this.ticker);
      this.ticker = undefined;
    }

    return this;
  }
}

export default new Time();

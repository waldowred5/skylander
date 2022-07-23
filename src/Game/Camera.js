import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Game from './Game';

export default class Camera {
  constructor() {
    this.game = new Game();
    this.sizes = this.game.sizes;
    this.scene = this.game.scene;
    this.canvas = this.game.canvas;
    this.debug = this.game.debug;
    this.mouseButtons = {
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE,
    };

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.cameraFolder;
      this.debugFolder.close();
    }

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      55,
      this.sizes.width / this.sizes.height,
      0.1,
      900,
    );

    this.instance.position.set(6, 12, 7.4);
    this.scene.add(this.instance);

    if (this.debug.active) {
      this.debugFolder
        .add(this.instance.position, 'x')
        .name('cameraX')
        .min(-9)
        .max(9)
        .step(0.001);

      this.debugFolder
        .add(this.instance.position, 'y')
        .name('cameraY')
        .min(-9)
        .max(20)
        .step(0.001);

      this.debugFolder
        .add(this.instance.position, 'z')
        .name('cameraZ')
        .min(-9)
        .max(9)
        .step(0.001);
    }
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.mouseButtons = this.mouseButtons;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}

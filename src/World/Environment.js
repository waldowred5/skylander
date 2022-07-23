import * as THREE from 'three';
import Game from '../Game/Game';

export default class Environment {
  constructor() {
    this.game = new Game();
    this.scene = this.game.scene;
    this.resources = this.game.resources;
    this.debug = this.game.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Environment');
    }

    this.setSunLight();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 1);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(1, 5, 2);
    this.scene.add(this.sunLight);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.sunLight, 'intensity')
        .name('sunLightIntensity')
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'x')
        .name('sunLightX')
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'y')
        .name('sunLightY')
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'z')
        .name('sunLightZ')
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }
}

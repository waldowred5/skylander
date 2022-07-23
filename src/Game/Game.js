import * as THREE from 'three';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Camera from './Camera';
import Renderer from './Renderer';
import World from '../World/World';
import Resources from './Utils/Resources';
import Debugger from './Utils/Debugger';
import sources from './Sources.js';
import Mouse from './Utils/Mouse';

let instance = null;

export default class Game {
  constructor(canvas) {
    if (instance) {
      return instance;
    }

    instance = this;

    // Global Access
    window.game = this; // will override other previously instantiated games

    // Options
    this.canvas = canvas;

    // Setup
    this.debug = new Debugger();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.mouse = new Mouse();
    this.raycaster = new THREE.Raycaster();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // Sizes resize event
    this.sizes.on('resize', () => {
      this.resize();
    });

    // Time tick event
    this.time.on('tick', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update(); // Run this last
  }

  destroy() {
    this.sizes.off('resize');
    this.time.off('tick');

    // Traverse whole scene
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        // eslint-disable-next-line guard-for-in
        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}

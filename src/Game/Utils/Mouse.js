import * as THREE from 'three';
import EventEmitter from './EventEmitter';
import Game from '../Game';

export default class Mouse extends EventEmitter {
  constructor() {
    super();

    this.game = new Game();
    this.vector = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
      this.vector.x = event.clientX / this.game.sizes.width * 2 - 1;
      this.vector.y = -(event.clientY / this.game.sizes.height) * 2 + 1;

      this.trigger('mousemove');
    });

    window.addEventListener('click', () => {
      this.trigger('click');
    });
  }
}

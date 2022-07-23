import Game from '../Game/Game';
import Environment from './Environment';
import HexGrid from '../sceneObjects/hexGrid/HexGrid';

export default class World {
  constructor() {
    this.game = new Game();
    this.scene = this.game.scene;
    this.resources = this.game.resources;
    this.hexGrid = new HexGrid(12, 12);
    this.environment = new Environment(); // Load this last

    this.setGrid();
  }

  // Actions
  update() {}

  // Setters
  setGrid() {
    this.scene.add(this.hexGrid.instance);
  }
}

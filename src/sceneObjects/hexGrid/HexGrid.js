import * as THREE from 'three';
import CellHitBox from './CellHitBox';
import CellOutline from './CellOutline';
import CellSelect from './CellSelect';
import HexBase from './index';
import { OBJECT_TYPE } from '../../Game/Utils/constants';
import Game from '../../Game/Game';
import Island from '../island';

// TO:DO Clean up this class! -> Split up into smaller classes
export default class HexGrid extends HexBase {
  constructor(height, width) {
    super();

    this.game = new Game();
    this.raycaster = this.game.raycaster;
    this.resources = this.game.resources;
    this.height = height;
    this.width = width;
    this.instance = new THREE.Group();
    this.activeCell = null;
    this.hoveredCell = null;
    this.mapPosition = {
      x: 0,
      z: 0,
    };
    this.currentCoordinates = {
      x: 2,
      y: -5,
      z: 3,
    };

    // Debug
    if (this.game.debug.active) {
      this.debugFolder = this.game.debug.objectsFolder.addFolder('HexGrid');
      this.debugFolder.close();

      this.debugObject = {
        enableUpdateDistancesOnHover: false,
      };

      this.debugFolder.add(this.debugObject, 'enableUpdateDistancesOnHover')
        .name('Update Distances on Hover');
    }

    // Events
    this.game.mouse.on('mousemove', () => {
      if (this.activeCell) {
        this.setCellSelectOnHover();
      }
    });

    this.game.mouse.on('click', () => {
      this.moveMap();
    });

    // Init
    this.setGrid();
    this.setInitialMapPosition();
    this.getAllDistancesTo(this.activeCell);
  }

  // Getters
  getAllDistancesTo(currentCell) {
    const cellCoords = currentCell.userData.coordinates;

    this.instance.children.map((cell) => {
      cell.userData.distance =
        this.getDistanceTo(cellCoords, cell.userData.coordinates);
    });
  }

  getAxialCoordinates(x, z) {
    return {
      x: x - Math.floor(z / 2),
      z,
    };
  }

  getDistanceTo(thisCellCoords, otherCellCoords) {
    const { x: thisX, y: thisY, z: thisZ } = thisCellCoords;
    const { x: otherX, y: otherY, z: otherZ } = otherCellCoords;

    return ((thisX < otherX ? otherX - thisX : thisX - otherX) +
      (thisY < otherY ? otherY - thisY : thisY - otherY) +
      (thisZ < otherZ ? otherZ - thisZ : thisZ - otherZ)) / 2;
  }

  getHitBoxIntersects() {
    const hitBoxes = [...this.instance.children.map((child) => {
      return child.children.find((grandchild) => {
        if (grandchild.type !== OBJECT_TYPE.CELL_HIT_BOX) {
          return;
        }

        return grandchild;
      });
    })];

    this.raycaster.setFromCamera(
      this.game.mouse.vector,
      this.game.camera.instance,
    );

    return this.raycaster.intersectObjects(hitBoxes);
  }

  isActiveCell(currentCell) {
    const { x: childX, y: childY, z: childZ } =
      currentCell.userData.coordinates;
    const { x: thisX, y: thisY, z: thisZ } =
      this.currentCoordinates;

    return (childX === thisX && childY === thisY && childZ === thisZ);
  }

  // Setters
  setCellSelectOnHover() {
    if (!this.instance.children.length) {
      console.log('No children found. Exiting cell selection...');

      return;
    }

    const intersects = this.getHitBoxIntersects();

    intersects.map((intersect) => {
      const currentCell = intersect.object.parent;

      if (!this.hoveredCell) {
        console.log('No cell ID found. Adding one now...');

        this.hoveredCell = currentCell;
      }

      if (this.hoveredCell.uuid === currentCell.uuid) {
        return;
      }

      this.clearPreviousCellHighlights(
        this.hoveredCell.uuid,
        [OBJECT_TYPE.CELL_SELECT],
      );

      this.addCurrentCellHighlights(
        currentCell.uuid,
        [OBJECT_TYPE.CELL_SELECT],
      );

      this.hoveredCell = currentCell;
    });
  }

  setGrid() {
    for (let index = 0; index < this.height * this.width; index++) {
      const row = Math.floor(index / this.height);
      const column = Math.floor(index % this.width);

      this.cellHitBox = new CellHitBox();
      this.cellOutline = new CellOutline();
      this.cellSelect = new CellSelect();

      // Add islands
      this.island = new Island();
      this.island.instance.position.y = -0.275;

      const islandSpawnChance = 0.25;
      const addIsland = Math.random() < islandSpawnChance;

      const currentCell = new THREE.Group();

      addIsland && currentCell.add(this.island.instance);

      currentCell.add(
        this.cellHitBox.instance,
        this.cellOutline.instance,
        this.cellSelect.instance,
      );

      const positionOffsetX =
        column * this.radius * this.hexTrigFactor;
      const positionOffsetZ =
        row * this.radius * this.hexTrigFactor * this.hexTrigFactor / 2;

      currentCell.position.x = positionOffsetX +
        (this.radius * this.hexTrigFactor / 2) * (row % 2);

      currentCell.position.z = -positionOffsetZ;

      const axialCoordinates = this.getAxialCoordinates(column, row);

      currentCell.userData.distance = 0;
      currentCell.userData.coordinates = {
        x: axialCoordinates.x,
        y: -axialCoordinates.x - axialCoordinates.z,
        z: axialCoordinates.z,
      };

      // TO:DO FIX THIS GARBAGE!!!!!
      this.resources.loadFont({
        material: this.isActiveCell(currentCell) ?
          this.materials.cellBright :
          this.materials.cellDull,
        parent: currentCell,
        text: `${axialCoordinates.x}, ` +
          `${-axialCoordinates.x - axialCoordinates.z}, ` +
          `${axialCoordinates.z}`,
      });

      this.instance.add(currentCell);
      this.instance.type = OBJECT_TYPE.HEX_GRID;
    }

    this.instance.position.set(
      -this.mapPosition.x,
      0,
      -this.mapPosition.z,
    );

    this.activeCell = this.instance.children.find((child) => {
      return this.isActiveCell(child);
    });
  }

  setInitialMapPosition() {
    // const activeCell = this.instance.children.find((child) => {
    //   return this.isActiveCell(child);
    // });

    this.setMapPosition(this.activeCell);
    this.addCurrentCellHighlights(
      this.activeCell.uuid,
      [
        OBJECT_TYPE.CELL_OUTLINE,
        OBJECT_TYPE.TEXT,
      ],
    );
  }

  setMapPosition(object) {
    const currentMapPosition = this.instance.getWorldPosition(
      new THREE.Vector3(),
    );
    const updateMapPosition = object.getWorldPosition(
      new THREE.Vector3(),
    );

    this.mapPosition.x = updateMapPosition.x;
    this.mapPosition.z = updateMapPosition.z;

    this.instance.position.set(
      currentMapPosition.x - this.mapPosition.x,
      0,
      currentMapPosition.z - this.mapPosition.z,
    );
  }

  // Actions
  addCurrentCellHighlights(currentCellId, itemsToHighlight) {
    const currentCell = this.instance.children.find((child) => {
      return child.uuid === currentCellId;
    });

    currentCell.children.map((child) => {
      itemsToHighlight.forEach((item) => {
        if (child.type !== item) {
          return;
        }

        if (child.type === OBJECT_TYPE.CELL_SELECT) {
          child.visible = true;
        }

        if (
          child.type === OBJECT_TYPE.CELL_OUTLINE ||
          child.type === OBJECT_TYPE.TEXT
        ) {
          child.material = this.materials.cellBright;
        }
      });
    });
  }

  clearPreviousCellHighlights(previousCellId, highlightedItems) {
    const previousCell = this.instance.children.find((child) => {
      return child.uuid === previousCellId;
    });

    previousCell.children.map((child) => {
      highlightedItems.forEach((item) => {
        if (child.type !== item) {
          return;
        }

        if (child.type === OBJECT_TYPE.CELL_SELECT) {
          child.visible = false;
        }

        if (
          child.type === OBJECT_TYPE.CELL_OUTLINE ||
          child.type === OBJECT_TYPE.TEXT
        ) {
          child.material = this.materials.cellDull;
        }
      });
    });
  }

  moveMap() {
    const intersects = this.getHitBoxIntersects();


    this.clearPreviousCellHighlights(
      this.activeCell.uuid,
      [
        OBJECT_TYPE.CELL_OUTLINE,
        OBJECT_TYPE.TEXT,
      ],
    );

    intersects.map((intersect) => {
      this.addCurrentCellHighlights(
        intersect.object.parent.uuid,
        [
          OBJECT_TYPE.CELL_OUTLINE,
          OBJECT_TYPE.TEXT,
        ],
      );

      this.setMapPosition(intersect.object);

      this.activeCell = intersect.object.parent;
    });
  }
}

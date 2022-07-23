import * as THREE from 'three';
import { OBJECT_TYPE } from '../../Game/Utils/constants';
import HexBase from './index';

export default class CellHitBox extends HexBase {
  constructor() {
    super();

    this.geometry = new THREE.CylinderGeometry(
      this.radius,
      this.radius,
      0,
      this.segments,
    );
    this.material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    });
    this.instance = new THREE.Mesh(
      this.geometry,
      this.material,
    );

    this.instance.type = OBJECT_TYPE.CELL_HIT_BOX;
  }
}

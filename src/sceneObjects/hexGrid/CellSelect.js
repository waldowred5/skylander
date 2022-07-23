import * as THREE from 'three';
import { OBJECT_TYPE } from '../../Game/Utils/constants';
import HexBase from './index';

export default class CellSelect extends HexBase {
  constructor() {
    super();

    this.geometry = new THREE.RingGeometry(
      this.radius - 1,
      this.radius - 0.5,
      this.segments,
    );
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x049ef4),
      transparent: true,
      opacity: this.materialOpacities.high,
      side: THREE.DoubleSide,
    });
    this.instance = new THREE.Mesh(
      this.geometry,
      this.material,
    );

    this.instance.type = OBJECT_TYPE.CELL_SELECT;
    this.instance.visible = false;
    this.setRotation(this.instance);
  }
}

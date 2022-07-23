import * as THREE from 'three';
import { OBJECT_TYPE } from '../../Game/Utils/constants';
import HexBase from './index';

export default class CellOutline extends HexBase {
  constructor() {
    super();

    this.geometry = new THREE.RingGeometry(
      this.radius - 0.1,
      this.radius,
      this.segments,
    );
    this.material = new THREE.MeshStandardMaterial({
      emissive: new THREE.Color(0x049ef4),
      transparent: true,
      opacity: this.materialOpacities.medium,
      side: THREE.DoubleSide,
    });
    this.instance = new THREE.Mesh(
      this.geometry,
      this.material,
    );

    this.instance.type = OBJECT_TYPE.CELL_OUTLINE;
    this.setRotation(this.instance);
  }
}

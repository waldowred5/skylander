import * as THREE from 'three';
import { OBJECT_TYPE } from '../../Game/Utils/constants';

export default class SnapPoint {
  constructor() {
    this.geometry = new THREE.SphereGeometry(0.5, 32, 32);
    this.material = new THREE.MeshStandardMaterial({
      emissive: new THREE.Color('cyan'),
      transparent: true,
      opacity: 0.2,
    });
    this.instance = new THREE.Mesh(
      this.geometry,
      this.material,
    );

    this.instance.type = OBJECT_TYPE.SNAP_POINT;
  }
}

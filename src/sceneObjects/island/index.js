import * as THREE from 'three';
import { OBJECT_TYPE } from '../../Game/Utils/constants';
import HexBase from '../hexGrid/index';
import SnapPoint from './SnapPoint';

export default class Island extends HexBase {
  constructor() {
    super();

    this.geometry = new THREE.CylinderGeometry(
      this.radius,
      this.radius,
      0.5,
      this.segments,
    );
    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x168200),
    });
    this.instance = new THREE.Mesh(
      this.geometry,
      this.material,
    );

    this.instance.type = OBJECT_TYPE.ISLAND;

    this.setSnapPoints();
  }

  setSnapPoints() {
    const snapPoints = 6;
    const points = Array.from(Array(snapPoints));

    points.map((indicator, index) => {
      const angle = index * Math.PI / snapPoints * 2;
      const snapPoint = new SnapPoint();

      snapPoint.instance.position.set(
        Math.sin(angle) * this.radius,
        0,
        Math.cos(angle) * -this.radius,
      );

      snapPoint.visible = true;
      // snapPoint.visible = false;

      this.instance.add(snapPoint.instance);
    });
  }
}

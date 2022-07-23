import * as THREE from 'three';

export default class HexBase {
  constructor() {
    this.hexTrigFactor = Math.sqrt(3);
    this.radius = 3;
    this.segments = 6;
    this.materialOpacities = {
      high: 0.6,
      medium: 0.2,
      zero: 0,
    };

    this.materials = {
      cellBright: new THREE.MeshStandardMaterial({
        emissive: new THREE.Color(0x049ef4),
        transparent: true,
        opacity: this.materialOpacities.high,
        side: THREE.DoubleSide,
      }),
      cellDull: new THREE.MeshStandardMaterial({
        emissive: new THREE.Color(0x049ef4),
        transparent: true,
        opacity: this.materialOpacities.medium,
        side: THREE.DoubleSide,
      }),
    };
  }

  setRotation(objectToRotate) {
    objectToRotate.rotation.x = Math.PI * -0.5;
    objectToRotate.rotation.z = Math.PI * -0.5;
    objectToRotate.position.y = 0.01;
  }
}

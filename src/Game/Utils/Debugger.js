import * as dat from 'lil-gui';

let instance = null;

export default class Debugger {
  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;

    this.active = window.location.hash === '#debug';

    if (this.active) {
      this.ui = new dat.GUI();
      this.sceneFolder = this.ui.addFolder('Scene');
      this.sceneFolder.close();
      this.cameraFolder = this.ui.addFolder('Camera');
      this.cameraFolder.close();
      this.lightsFolder = this.ui.addFolder('Lights');
      this.lightsFolder.close();
      this.objectsFolder = this.ui.addFolder('Objects');
      this.objectsFolder.close();
    }
  }
}

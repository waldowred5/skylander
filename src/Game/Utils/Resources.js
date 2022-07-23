import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import EventEmitter from './EventEmitter';
import sources from '../Sources';
import { OBJECT_TYPE } from './constants';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.fontLoader = new FontLoader();
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading() {
    // Load each source
    sources.map((source) => {
      if (source.type === 'gltfModel') {
        this.loaders.gltfLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
        );
      } else if (source.type === 'texture') {
        this.loaders.textureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
        );
      } else if (source.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
        );
      }
    });
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger('ready');
    }
  }

  // TO:DO Create loadFont as new class + optimize
  loadFont({ material, parent, text }) {
    this.loaders.fontLoader.load(
      'fonts/helvetiker_regular.typeface.json',
      (font) => {
        const geometry = new TextGeometry(`${text}`, {
          // 2D Text
          font,
          size: 0.5,
          height: 0.0001,
          curveSegments: 12,

          // 3D Text
          // bevelEnabled: true,
          // bevelThickness: 0.1,
          // bevelSize: 0.11,
          // bevelOffset: 0,
          // bevelSegments: 5,
        });

        geometry.center();
        const textMesh = new THREE.Mesh(geometry, material);

        // TO:DO Offload to component trying to load text
        textMesh.rotation.x = Math.PI * -0.5;
        textMesh.receiveShadow = true;
        textMesh.position.y = -0.01;
        textMesh.userData.text = text;
        textMesh.type = OBJECT_TYPE.TEXT;

        parent.add(textMesh);
      },
    );
  }
}

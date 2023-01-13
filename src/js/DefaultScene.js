import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { loadImages } from './helpers';
import gsap from 'gsap';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

import flowers from '../images/src-flowers.jpg';
import pinguins from '../images/src-pinguins.jpg';

// const images = [flowers, pinguins];
const images = [pinguins, flowers];

class DefaultScene {
  constructor() {

    this.planeSegments = 20;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 10000);
    this.camera.position.set(0, 0, 4);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    const obj = [];
    images.forEach(img => {
      obj.push({ file: img });
    });

    const canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d', {
      willReadFrequently: true
    });
    // document.body.appendChild(canvas);

    loadImages(images, loadedImages => {

      obj.forEach((image, index) => {

        const img = loadedImages[index];
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const buffer = data.data;

        const rgb = [];
        let c = new THREE.Color();

        for (let i = 0; i < buffer.length; i = i + 4) {
          c.setRGB(buffer[i], buffer[i + 1], buffer[i + 2]);
          rgb.push({ c: c.clone(), id: i / 4 });
        }

        rgb.sort((a, b) => {
          return a.c.b - b.c.b;
          // return Math.random() - Math.random();
        });

        const result = new Float32Array(img.width * img.height * 2);
        let j = 0;
        rgb.forEach(e => {
          result[j] = e.id % img.width;
          result[j + 1] = Math.floor(e.id / img.height);
          j = j + 2;
        });

        obj[index].image = img;
        obj[index].buffer = result;
        obj[index].texture = new THREE.Texture(img);
        obj[index].texture.needsUpdate = true;
        obj[index].texture.flipY = false;
      });

      const w = loadedImages[0].width;
      const h = loadedImages[0].height;

      const positions = new Float32Array(w * h * 3);
      let index = 0;
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          positions[index * 3] = j;
          positions[index * 3 + 1] = i;
          positions[index * 3 + 2] = 0;
          index++;
        }
      }

      this.geometry = new THREE.BufferGeometry();

      this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      this.geometry.setAttribute('source', new THREE.BufferAttribute(obj[0].buffer, 2));
      this.geometry.setAttribute('target', new THREE.BufferAttribute(obj[1].buffer, 2));

      this.material = new THREE.RawShaderMaterial({
        uniforms: {
          sourceTex: { type: 't', value: obj[0].texture },
          targetTex: { type: 't', value: obj[1].texture },
          blend: { type: 'f', value: 0 },
          size: { type: 'f', value: 2.0 }, //window.devicePixelRatio },
          dimensions: { type: 'v2', value: new THREE.Vector2(w, h) }
        },
        vertexShader,
        fragmentShader
      });

      const points = new THREE.Points(this.geometry, this.material);

      this.scene.add(points);

    });


    this.settings();

    this.events();
    this.start();

  }

  events() {
    document.body.addEventListener('click', () => {

      const tl = gsap.timeline();
      const duration = 4;

      if (document.body.classList.contains('loading')) {
        return;
      }

      document.body.classList.add('loading');

      if (document.body.classList.contains('done')) {
        // launch reverse 
        tl
          .to(this.material.uniforms.blend, {
            duration,
            value: 0.0,
            onComplete: () => {
              document.body.classList.remove('loading');
              document.body.classList.remove('done');
            }
          });
      } else {
        // launch forward 
        tl
          .to(this.material.uniforms.blend, {
            duration,
            value: 1.0,
            onComplete: () => {
              document.body.classList.remove('loading');
              document.body.classList.add('done');
            }
          });
      }



    });
  }

  // play() {
  // }

  // reverse() {
  // }

  settings() {
    this.scene.background = new THREE.Color('black');
    this.resize();

    this.settings = {
      progress: 0
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'progress', 0, 1, 0.01);

  }

  start() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    this.controls.update();
    this.render();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.controls.update();

    // this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    // this.renderer.resetState();
    window.requestAnimationFrame(this.render.bind(this));
  }

}


export default DefaultScene;
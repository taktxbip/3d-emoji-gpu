import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import gsap from 'gsap';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

import devil from '../images/devil.png';
import love from '../images/love.png';

class DefaultScene {
  constructor() {

    this.planeSegments = 300;
    this.time = 0;

    this.scene = new THREE.Scene();

    console.log(this.scene);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 10000);
    this.camera.position.set(0, 0, 4);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.plane = new THREE.PlaneGeometry(2, 2, this.planeSegments, this.planeSegments);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        original: { type: 't', value: new THREE.TextureLoader().load(devil) },
        target: { type: 't', value: new THREE.TextureLoader().load(love) },
        time: { type: 'f', value: 0.0 },
        blend: { type: 'f', value: 0.0 }
      },
      wireframe: true,
      side: THREE.DoubleSide,
      transparent: true,
      vertexShader,
      fragmentShader
    });

    // this.material = new THREE.MeshBasicMaterial({
    //   color: 0xffffff,
    //   side: THREE.DoubleSide
    // });

    this.mesh = new THREE.Mesh(this.plane, this.material);

    this.scene.add(this.mesh);

    this.settings();

    this.events();
    this.start();

  }

  events() {
    document.body.addEventListener('click', () => {

      const tl = gsap.timeline();
      const duration = 1;

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

    const w = window.innerWidth;
    const h = window.innerHeight;

    this.scene.destination = { x: 0, y: 0 };

    document.body.addEventListener('mousemove', e => {
      let x = (e.clientX - w / 2) / (w / 2);
      let y = (e.clientY - h / 2) / (h / 2);

      this.scene.destination.x = x * 0.5;
      this.scene.destination.y = y * 0.5;
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

    this.material.uniforms.time.value = this.time;
    this.time++;

    this.scene.rotation.x += (this.scene.destination.x - this.scene.rotation.x) * 0.05;
    this.scene.rotation.y += (this.scene.destination.y - this.scene.rotation.y) * 0.05;

    // this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    // this.renderer.resetState();
    window.requestAnimationFrame(this.render.bind(this));
  }

}


export default DefaultScene;
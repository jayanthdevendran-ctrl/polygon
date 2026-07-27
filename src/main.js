import * as THREE from 'three';
import {GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Reflector } from 'three/examples/jsm/Addons.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const spotlight = new THREE.SpotLight (0xffffff, 100, 10, 2.5, 1);
spotlight.penumbra = 1
spotlight.position.set(0, 6, 3);
spotlight.target.position.set(0, 0.5, -5);
scene.add(spotlight.target);
scene.add(spotlight);

const models = [{file : '/models/bmwe46.glb', scale : 2},
  {file:'/models/clkgtr.glb', scale: 2},
  {file:''}]
const cars = []
const modelname = []

let currentcar = 0;
let car;

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const leftImage = textureLoader.load('left.png');
const rightImage = textureLoader.load('right.png');

const leftButton = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
        map: leftImage,
        transparent: true
    })
);

const mirror = new Reflector(
    new THREE.CircleGeometry(10),
    {
        color: 0x303030,
        textureWidth: window.InnerWidth,
        textureHeight: window.InnerHeight
    }
)
mirror.position.y = 0;
mirror.rotateX(-Math.PI / 2);
scene.add(mirror);


leftButton.name = "Left";
leftButton.position.set(-7, 5, 0);

scene.add(leftButton);

const rightButton = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
        map: rightImage,
        transparent: true
    })
);

rightButton.name = "Right";
rightButton.position.set(7, 5, 0);

scene.add(rightButton);

models.forEach((file, index) => {
  loader.load(file.file, function(gltf)
  {
    const car = gltf.scene;
    car.scale.setScalar(file.scale);
    car.position.set(index * 11, 0.5, -3);
    scene.add(car);
    cars.push(car)
  });
});

function next() {
  cars.forEach(car =>
    {
      car.position.x = car.position.x - 11;
    }
  );
  currentcar = (currentcar + 1) % cars.length;
}

function previous() {
    cars.forEach(car =>
    {
      car.position.x = car.position.x + 11;
    }
  );
  currentcar = (currentcar - 1 + cars.length) % cars.length;
}

const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth)* 2 -1;
  mouse.y = -(event.clientY / window.innerHeight)* 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([
    leftButton, rightButton]);
    if (intersects.length === 0) return;
    const clicked = intersects[0].object;
    if (clicked.name === "Left")
    {
      previous();
    }
    if (clicked.name === "Right")
    {
      next();
    }

}
);

camera.position.y = 5;
camera.position.z = 10;

function animate() {
  requestAnimationFrame(animate);
  if (cars.length>0)
  {
    cars[currentcar].rotation.y += 0.008;  
  }
  renderer.render( scene, camera );

}
animate();

function add_star() {
  const star_geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const star_material = new THREE.MeshBasicMaterial({ color: 0xffffff  });
  const star = new THREE.Mesh(star_geometry, star_material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(add_star);
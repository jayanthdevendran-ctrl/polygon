import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 2, 6);
camera.lookAt(0, 1, 0);
const loader = new GLTFLoader();


window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//lightsgohere
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add (ambient);
const directed = new THREE.DirectionalLight(0xffffff, 1);
directed.position.set(5, 5, 5);
scene.add (directed);
//addreflectorlater
const floorGeometry = new THREE.PlaneGeometry(200,200);

const floor = new Reflector(floorGeometry,{
    clipBias:0.003,
    textureWidth:window.innerWidth * window.devicePixelRatio,
    textureHeight:window.innerHeight * window.devicePixelRatio,
    color:0x777777
});

floor.rotation.x = -Math.PI/2;
floor.position.y = -2.2;

scene.add(floor);
const models = [
    {
        file: "/models/bmwe46.glb",
        scale: 1,
        name: "BMW M3 E46",
        descriptions: "One of the most iconic M cars ever, a need for speed icon that was the last naturally aspirated M3.",
        specs: {
            engine: "Inline-6",
            power: "343 bhp",
            topspeed: "280km/h",
            zerotohundred: "5.2s",
            drivetrain: "RWD",
            weight: "1495 kg"
        }
    },
    {
        file: "/models/clkgtr.glb",
        scale: 1,
        name: "Mercedes CLK GTR",
        descriptions: "A homologation special from the FIA GT championship, this car took off more than its designers meant for it to",
        specs: {
            engine: "6.9L V12",
            power: "622 bhp",
            topspeed: "346km/h",
            zerotohundred: "3.8s",
            drivetrain: "RWD",
            weight: "1000 kg"
        }

    },
    {
        file: "/models/mclarenlh.glb",
        scale: 100,
        name: "McLaren MP4-23",
        descriptions: "Lewis Hamilton's 2008 championship winning car, known for brazil 2008's dramatic race.",
        specs: {
            engine: "2.4L V8",
            power: "755 bhp",
            topspeed: "354 km/h",
            zerotohundred: "2.3s",
            drivetrain: "RWD",
            weight: "605 kg"
        }

    }
]

const carName = document.getElementById("carname");
const carDesc = document.getElementById("cardesc");

function updateInfo() {
    const car = models[currentcar];
    carName.textContent = car.name;
    carDesc.textContent = car.descriptions;
    document.getElementById("engine").textContent = car.specs.engine;
    document.getElementById("power").textContent = car.specs.power;
    document.getElementById("topspeed").textContent = car.specs.topspeed;
    document.getElementById("zerotohundred").textContent = car.specs.zerotohundred;
    document.getElementById("drivetrain").textContent = car.specs.drivetrain;
    document.getElementById("weight").textContent = car.specs.weight;

}
const carmodels = []
models.forEach((car, i) => {
    loader.load(
        car.file,
        (gltf) => 
        {
            const model = gltf.scene;
            model.scale.setScalar(car.scale);
            model.position.x = (i*7)
            model.position.y = -2;
            model.position.z = 1;
            scene.add(model);
            carmodels[i] = model;
            if(i == 0)
            {
                updateInfo();
            }
            
        }
    )
});

let moving = false;
let speed = 0.1;
let moved = 0;
let targetcar = 0;
let currentcar = 0;
let right = false;
let left = false;

camera.position.y = 0;

document.getElementById("next").onclick = () => {
    if(moving) return;

    currentcar++;
if(currentcar >= models.length){
    currentcar = 0;
    camera.position.x = 0;
    targetcar = 0;
    moving = false;
}
else{
    targetcar = currentcar * 7;
    moving = true;
}
    updateInfo();
};

document.getElementById("previous").onclick = () => {
    if(moving) return;

    currentcar--;
if(currentcar < 0){
    currentcar = models.length - 1;
    camera.position.x = currentcar * 7;
    targetcar = camera.position.x;
    moving = false;
}
else{
    targetcar = currentcar * 7;
    moving = true;
}
    updateInfo();
};



function animate() {
requestAnimationFrame(animate);
  if(camera.position.x < targetcar){
    camera.position.x += speed;

    if(camera.position.x >= targetcar){
        camera.position.x = targetcar;
        moving = false;
    }
}
else if(camera.position.x > targetcar){
    camera.position.x -= speed;

    if(camera.position.x <= targetcar){
        camera.position.x = targetcar;
        moving = false;
    }
}
carmodels.forEach((car) => {
    if(car){
        car.rotation.y += 0.005;
    }
});
renderer.render( scene, camera );

}
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

animate();
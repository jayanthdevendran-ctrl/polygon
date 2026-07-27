import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const models = [
    {
        file: "/modes/bmwe46.glb",
        scale: 2,
        name: "BMW M3 E46",
        descriptions: "One of the most iconic M cars ever, a need for speed icon.",
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

    }
]

let currentcar = 0;
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
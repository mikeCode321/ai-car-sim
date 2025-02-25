const carCanvas = document.getElementById("myCanvas");
carCanvas.width = 200;

const carCtx = carCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 200;
const cars = generateCars(N);
let mutationRate = 0.1;
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    mutationRate = parseFloat(localStorage.getItem("mutationRate"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, mutationRate);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(0), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2),
];

const input = document.getElementById("mutationRate");
input.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    localStorage.setItem("mutationRate", event.currentTarget.value);
  }
});

animate();
//-------------------------------------------
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find(
    (c) => c.y == Math.min(...cars.map((c) => c.y)) // find the car with the y value matching the min value in the new arr
  );

  carCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "blue");
  }

  carCtx.globalAlpha = 0.2;

  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "black");
  }
  carCtx.globalAlpha = 1;

  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();
  // console.log("setting ", localStorage.getItem("mutationRate"));
  requestAnimationFrame(animate);
}

function toggleInstructions() {
  const instructionsBox = document.getElementById('instruction-box');
  const instructions = document.getElementById('instructions');
  const button = document.getElementById('toggleInstructions');
  
  if (instructionsBox.style.display === 'none' || instructionsBox.style.display === '') {
    instructionsBox.style.display = 'block'; 
    instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    button.innerText = 'Hide Instructions';
  } else {
    instructionsBox.style.display = 'none';  
    instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.0)'; 
    button.innerText = 'Show Instructions'; 
  }
}

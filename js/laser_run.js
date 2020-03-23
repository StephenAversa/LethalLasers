import Laser from './Laser.js'
import SceneOne from './SceneOne.js'

var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


/******* Add the create scene function ******/
/******* End of the create scene function ******/

var scene = new SceneOne( {engine, canvas} ); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});


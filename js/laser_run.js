import Laser from './Laser.js'
import SceneOne from './SceneOne.js'

var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


/******* Add the create scene function ******/
/******* End of the create scene function ******/

function restartScene( scene ){
  engine.stopRenderLoop()
  scene.dispose();
  var newScene = new SceneOne( {engine, canvas, restartScene} ); //Call the createScene function

   engine.runRenderLoop( () => {
       newScene.render();
   });
}

var scene = new SceneOne( {engine, canvas, restartScene} ); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});



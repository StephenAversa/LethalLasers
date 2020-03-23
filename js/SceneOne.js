import BaseScene from './BaseScene.js'
import Laser from './Laser.js'

export default class extends BaseScene {
  constructor ({ engine, canvas }) {
    super( {engine, canvas} );
    console.log("Setting up scene 1");

    this.youLose = false;
    
    //Ground
    const ground = BABYLON.Mesh.CreatePlane("ground", 300, this);
    ground.material = new BABYLON.StandardMaterial("groundMat", this);
    ground.material.diffuseTexture = new BABYLON.Texture("textures/grass.jpg", this);
    ground.material.backFaceCulling = false;
    ground.position = new BABYLON.Vector3(5, -10, -15);
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

    //Bounding box Geometry
    const border0 = BABYLON.Mesh.CreateBox("border0", 1, this);
    border0.scaling = new BABYLON.Vector3(1, 100, 200);
    border0.position.x = -100.0;
    border0.checkCollisions = true;
    //border0.isVisible = false;

    const border1 = BABYLON.Mesh.CreateBox("border1", 1, this);
    border1.scaling = new BABYLON.Vector3(1, 100, 200);
    border1.position.x = 100.0;
    border1.checkCollisions = true;
    //border1.isVisible = false;

    const border2 = BABYLON.Mesh.CreateBox("border2", 1, this);
    border2.scaling = new BABYLON.Vector3(200, 100, 1);
    border2.position.z = 100.0;
    border2.checkCollisions = true;
    //border2.isVisible = false;

    const border3 = BABYLON.Mesh.CreateBox("border3", 1, this);
    border3.scaling = new BABYLON.Vector3(200, 100, 1);
    border3.position.z = -100.0;
    border3.checkCollisions = true;
    //border3.isVisible = false;

    //Simple crate
    const box = new BABYLON.Mesh.CreateBox("crate", 2, this);
    box.material = new BABYLON.StandardMaterial("Mat", this);
    box.material.diffuseTexture = new BABYLON.Texture("textures/crate.jpg", this);
    box.material.diffuseTexture.hasAlpha = true;
    box.position = new BABYLON.Vector3(5, -9, -10);

    const laserlen = 50;
    let color = new BABYLON.Color3(0.50, 0.50, 1.00);
    let name = "purpleLaser";
    let scene = this;
    let myLaser = new Laser( {scene, name, laserlen, color} );

    color = new BABYLON.Color3(1.00, 0.10, 0.10);
    name = "redLaser";
    let blueLaser = new Laser( {scene, name, laserlen, color} );
    
    //finally, say which mesh will be collisionable
    ground.checkCollisions = true;
    box.checkCollisions = true;

    this.registerBeforeRender( () => {
        myLaser.update();
        blueLaser.update();
        
        if( (myLaser.intersectsPlayer() || blueLaser.intersectsPlayer()) && !this.youLose ){
          this.youLose = true;
          this.camera.detachControl( this.canvas );

          var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
          var text1 = new BABYLON.GUI.TextBlock();
          text1.text = "The Lasers Got you!";
          text1.color = "white";
          text1.fontSize = 24;
          advancedTexture.addControl(text1);    
        }
    });
  }
}

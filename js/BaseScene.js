export default class extends BABYLON.Scene {
  constructor ({ engine, canvas, restartScene }) {
    super( engine );
    this.restartCallback = restartScene;
    this.canvas = canvas;

    this.youLose = false;

    console.log("Setting up Base Scene 1");
    /******* ENVIRONMENT AND PLAYER ******/
    // Lights
    const light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, -5, 2), this);

    // Free Camera
    this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, -8, -20), this);
    this.camera.attachControl(this.canvas, true);
    //Camera movement speed
    this.camera.speed = .5;

    //Define the player
    this.camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    //Apply collisions and gravity to the active this.camera
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;
    this.camera._needMoveForGravity = true;

    //Set gravity for the this
    this.gravity = new BABYLON.Vector3(0, -0.4, 0);

    //enable physics
    //var physicsPlugin = new BABYLON.CannonJSPlugin();
    //this.enablePhysics();

    // Camera look with mouse.
    this.isLocked = false;

    document.addEventListener("pointerlockchange", this.pointerlockchange, false);
    document.addEventListener("mspointerlockchange", this.pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", this.pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", this.pointerlockchange, false);
    /******* END ENVIRONMENT AND PLAYER ******/

    /******* KEYBOARD HANDLER ******/
    this.camera.controlsEnabled = true;

    // I don't really understand what the second parameter does.
    let keyboardObserver = this.onKeyboardObservable.add( this.keyboardHandler, 1, false, this );

    this.collisionsEnabled = true;

    //Controls  WASD
    this.camera.keysUp.push(87);
    this.camera.keysDown.push(83);
    this.camera.keysRight.push(68);
    this.camera.keysLeft.push(65);
  }

  onPointerDown( evt ){
    if( this.youLose ){
      this.restartCallback( this );
    }

    if (!this.isLocked) {
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.msRequestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock;
        if (this.canvas.requestPointerLock) {
            this.canvas.requestPointerLock();
        }
    }

    if (evt === 0) {
        castRay()
    };
  }

  // Event listener when the this.camera lock is updated
  pointerlockchange() {
    let controlEnabled = document.mozPointerLockElement || 
        document.webkitPointerLockElement || document.msPointerLockElement || 
        document.pointerLockElement || null;

    // If the user is already locked
    if (!controlEnabled) {
        this.isLocked = false;
    } else {
        this.isLocked = true;
    }
  }

  keyboardHandler( e ) {
     if (this.camera.controlsEnabled) {
        // Spacebar to jump
        console.log(`Key Press ${e.event.keyCode}`);
        
        // Press 'r' to restart the scene
        if (e.event.keyCode == 82) {
          this.restartCallback( this );
        }

        if (e.event.keyCode == 32) {
            console.log(e.type);
            if (e.type === 1) {
                const origin = this.camera.position;
                const direction = BABYLON.Vector3.Down();
                const length = 30;
                const ray = new BABYLON.Ray(origin, direction, length);
                const hit = this.pickWithRay(ray);
                console.log(hit.distance);

                //Casting ray checking to see if jump is ok.
                if (hit.distance < 3) {
                    this.camera.animations = [];
                    let jumpAnimation = new BABYLON.Animation("jumpAnimation", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

                    // Animation keys
                    let keys = [];
                    keys.push({ frame: 0, value: this.camera.position.y });
                    keys.push({ frame: 20, value: this.camera.position.y + 8 });
                    jumpAnimation.setKeys(keys);

                    this.camera.animations.push(jumpAnimation);
                    this.beginAnimation(this.camera, 0, 20, false);
                }
            }
        }
     }
  }

}

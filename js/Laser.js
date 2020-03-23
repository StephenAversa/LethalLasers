export default class {
  constructor({scene, name, laserlen, color}){

    console.log(`Creating ${name} Laser`);
    //let shaderPath = {vertex: "custom",fragment: "custom"};
    let materialOpts = {
            needAlphaBlending: true,
            attributes: ["position", "normal", "uv"],
            uniforms: ["time", "worldViewProjection"]
        };

    let laserVertexShader = 'precision highp float;  attribute vec3 position; attribute vec3 normal; attribute vec2 uv;  uniform mat4 worldViewProjection; uniform float time;  varying vec3 vPosition; varying vec3 vNormal; varying vec2 vUV;  void main(void) {     vec3 v = position;     gl_Position = worldViewProjection * vec4(v, 1.0);     vPosition = position;     vNormal = normal;     vUV = uv; }';

    let laserFragmentShader = `
        #extension GL_OES_standard_derivatives : enable
        precision highp float;   
                    
        // Varying
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUV;

        // Refs
        uniform vec3 color;
        uniform vec3 cameraPosition;
        
        void main(void) {          
            float x = vUV.x;
            float y = vUV.y;
            vec2 uv=-1.+2.*vUV;
            float a=  1.-smoothstep(-.9,0.9,abs(uv.x));//*(1.-vUV.y))*1.);
            float b=1.-pow(0.1,vUV.y);
            vec3 col = vec3(${color.r},${color.g},${color.b});
            gl_FragColor = vec4(col,a);
        }`;

    let shaderPath = {vertexSource: laserVertexShader,fragmentSource: laserFragmentShader};
    
    this.laserMaterial = new BABYLON.ShaderMaterial(`${name}Shader`, scene, shaderPath, materialOpts );
    let laserMat =new BABYLON.StandardMaterial(`${name}_Mat`, scene);
    //laserMat.emissiveColor = new BABYLON.Color4(color.r, color.g, color.b, 0.5);
    laserMat.emissiveColor = color;
    laserMat.alpha = .3;
    laserMat.MATERIAL_ALPHABLEND = 1;

    console.log(`Create Plane ${name}Plane1`);
    this.plane1 = BABYLON.MeshBuilder.CreatePlane(`${name}Plane1`, { width: 4, height: laserlen }, scene);
    this.plane2 = BABYLON.MeshBuilder.CreatePlane(`${name}Plane2`, { width: 4, height: laserlen }, scene);

    this.laserMaterial.setColor3('color', color );
    this.laserMaterial.alphaMode = BABYLON.Engine.ALPHA_ADD;
    this.laserMaterial.backFaceCulling = false;
    this.plane1.material = this.laserMaterial;
    this.plane2.material = this.laserMaterial;

    laserMat.alphaMode = BABYLON.Engine.ALPHA_ADD;
    laserMat.backFaceCulling = false;
    //this.plane1.material = laserMat;
    //this.plane2.material = laserMat;

    this.scene = scene;

    // Init movement params
    this.zigStart = new Date();
    this.zigDuration = 0;
    this.movementStrategy = Math.round( Math.random() ); //coin toss
    console.log(`Movement strategy: ${this.movementStrategy}`);
  }

  update(){
    this.plane1.rotation.y -=  5;
    this.plane2.rotation.y +=  5;

    if( this.movementStrategy === 0 ){
      this.seekAndDestroyNextMove();
    } else {
      this.zigZagNextMove();
    }

    this.intersectsPlayer();
  }

  seekAndDestroyNextMove(){
    //console.log("stuff");
    let changeX = 0;
    let changeZ = 0;

    if( this.plane1.position.x > this.scene.camera.position.x ){
      changeX = -.02;
    } else {
      changeX = .02;
    }

    if( this.plane1.position.z > this.scene.camera.position.z ){
      changeZ = -.02;
    } else {
      changeZ = .02;
    }

    this.setPosition( changeX, changeZ );
      
  }

  zigZagNextMove(){

    let timeDelta = (new Date() - this.zigStart);
    if( timeDelta > this.zigDuration ){
      this.zigStart = new Date();
      this.zigDuration = (Math.round( (Math.random()*3)+2) ) * 1000; // 2-5 seconds in millis

      this.nextChangeX = ( Math.random()-.5 ) *.1;
      this.nextChangeZ = ( Math.random()-.5 ) *.1;

      console.log(`nextChangeX: ${this.nextChangeX}, nextChangeZ: ${this.nextChangeZ}, for ${this.zigDuration} millis.`);
    }

    this.setPosition( this.nextChangeX, this.nextChangeZ );

  }


  setPosition( changeX, changeZ ){
    this.plane1.position.x += changeX;
    this.plane1.position.z += changeZ;

    this.plane2.position.x += changeX;
    this.plane2.position.z += changeZ;
  }

  intersectsPlayer(){
    return this.plane1.intersectsPoint( this.scene.camera.position ) ? true : false;
  }
}


var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var backgroundImg;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2;
var score=0;
var gameOver, restart;

function preload(){
  trex_running =   loadAnimation("A22.png","B22.png","C22.png");
  trex_collided = loadAnimation("I11.png");
  groundImage = loadImage("h.png");
  backgroundImg = loadImage("GROUND7.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("tree-removebg-preview.png");
  obstacle2 = loadImage("rock-removebg-preview.png");
  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("f.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ground = createSprite(windowWidth,height-600,width,400);
  ground.addImage("ground",groundImage);
  ground.x = width/2;
  ground.velocityX = -(6 + 3*score/100);
  ground.scale = 3;
  
  trex = createSprite(0,height-30,200,200);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("rectangle",0,0,190,250);
  
  gameOver = createSprite(width/3,height-257);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/3,height-210);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.3;
  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,height-30,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  
  background(backgroundImg);
  camera.x = trex.x;
  camera.y = trex.y;
  //camera.position.x = trex.x+500;
  //camera.position.y = trex.y-250;
  gameOver.position.x = restart.position.x = camera.x
  
if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
   
// if((touches.length >  0 ||keyDown("space") && trex.y >= 159)) {
//       camera.position.y - 0.001;
//       trex.y = camera.position.y;
//       trex.velocityY = 5;
//       touches = [];
//     }
if(keyDown("space") && trex.y >= 159) {
  trex.velocityY = -12;
}

trex.velocityY = trex.velocityY + 0.8

if (ground.x < 0){
  ground.x = ground.width/2;
}
  
trex.collide(invisibleGround);
spawnClouds();
spawnObstacles();
  
if(obstaclesGroup.isTouching(trex)|| score> 1000){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || mousePressedOver(restart)) {
      reset();
      touches = []
    }
  }
  
  drawSprites();
  textSize(15)
  fill("red");
  text("Score: "+ score, width/1.3, 50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount%60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,250));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount%100 === 0) {
    var obstacle = createSprite(camera.x+width/2,height-57,10,40);
    obstacle.velocityX = -6;
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }          
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    obstacle.debug = false;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
  
}
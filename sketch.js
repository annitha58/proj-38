var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score, index, trexs;

var gameOver, gameOverImage, restart, restartImage;

var jump, checkPoint, die;

var PLAY = 1;
var END = 0;
var gameState = 1;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkPoint = loadSound("checkPoint.mp3");
}

function setup() {
  canvas = createCanvas(displayWidth - 20, displayHeight - 30);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided); 
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  gameOver = createSprite(displayWidth/2 - 50, displayHeight/2 - 30,30,20);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.8;
  gameOver.visible = false;
  
  restart = createSprite(displayWidth/2 - 80, displayHeight/2 - 50, 20,20);
  restart.addImage(restartImage);
  restart.scale = 0.4;
  restart.visible = false;
  
  score = 0;
}

function draw() {
  background(180);
  
  text("Score: "+ score, displayWidth/2 - 50, displayHeight/2 - 30);
  
  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
  
    if(keyDown("space") && trex.y >= 160) {
      trex.velocityY = -12;
      jump.play();
    }
  
    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if (score>0 && score%100 === 0){
      checkPoint.play();
    }

    spawnClouds();
    spawnObstacles();
     
    if(obstaclesGroup.isTouching(trex) || trexs.distance == 3600){
      gameState = END;
      die.play();
    }
  }
  
  else if(gameState === END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided", trex_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
    gameOver.visible = true;
    restart.visible = true;
  
  }
  trex.collide(invisibleGround);
  trexs = [trex];
  if(mousePressedOver(restart)) {
    reset();
  }

  if(index === trexs.index){
	trex.shapeColor = red;
	camera.position.x = displayWidth/2;
	camera.position.y = trex.y;
  }

  image(ground, 0, -displayHeight*2, displayWidth, displayHeight*3);

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break; 
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  score = 0;
}
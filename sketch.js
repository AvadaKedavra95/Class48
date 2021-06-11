var ironMan;
var bg;
var city, cityImage;
var ironManAnimation, ironManAnimation2;
var enemy, enemyAnimation1;
var enemyGroup;
var repulsor;
var COUNT = 0;
var NOTCOUNT = 1;
var STATE = NOTCOUNT;
var no = 800;
var count = 500;
var Animation1 = 4;
var Animation2 = 5;
var Anim = 4;
var BM;
var homeI;
var gameState = "LEVEL0";
var nextI, next;
var kill = 0;
var invisibleWall;
var restart,restartImg;

function preload() {
  homeI = loadImage("HomePage.jpg")

  nextI = loadImage("Next.png");
  ironManAnimation = loadAnimation("Ironman1/1.png", "Ironman1/2.png", "Ironman1/3.png",
    "Ironman1/4.png");

  ironManAnimation2 = loadAnimation("Ironman2/1.png", "Ironman2/2.png", "Ironman2/3.png",
    "Ironman2/4.png", "Ironman2/5.png", "Ironman2/6.png", "Ironman2/7.png", "Ironman2/8.png",
    "Ironman2/9.png", "Ironman2/10.png", "Ironman2/11.png");

  cityImage = loadImage("Background/1.png");

  enemyFly = loadAnimation("Enemy/1.png", "Enemy/2.png");

  shoot = loadImage("fire.png");

  BM = loadSound("1.flac");

  restartImg = loadImage("Restart.png");

  getBackground()
}



function setup() {

  createCanvas(1200, 500);


  city = createSprite(width / 2, 300, width * 2, 10);
  city.scale = 5;
  city.addImage("City", cityImage);
  city.velocityX = 80;
  enemyGroup = new Group();
  repulsorGroup = new Group();
  ironMan = createSprite(900, 270, 30, 30);
  ironMan.addAnimation("Iron Man", ironManAnimation);
  ironMan.addAnimation("fires", ironManAnimation2);
  ironMan.scale = 0.35;
  next = createSprite(1000, 380);
  next.addImage("next", nextI);
  next.scale = 0.3;
  BM.loop();
  invisibleWall = createSprite(1200, 250, 10, 500);
  invisibleWall.visible = false;

  restart = createSprite(600, 250, 200, 100);
  restart.visible = false;
  restart.addImage("restart",restartImg);


}


function draw() {
  console.log(gameState);
  if (gameState === "LEVEL0") {
    restart.visible = false;
    background(homeI);
    next.visible = true;
    ironMan.visible = false;
    city.visible = false;

    if (mousePressedOver(next)) {
      console.log("pressed")
      gameState = "LEVEL1"
      city.visible = true;
    }
  }

  //console.log(Anim);
  if (gameState === "LEVEL1") {
    ironMan.visible = true;
    next.visible = false;
    background(bg);
    textSize(30);
    fill("red");
    text("Kills =   " + kill, 100, 100);
  
    // scrolling city
    if (city.x > 4900) {
      city.x = -3600;

    }

    // move ironman up
    if (keyDown(UP_ARROW)) {
      ironMan.y -= 10;
    }

    //move iron man down
    if (keyDown(DOWN_ARROW)) {
      ironMan.y += 10;
    }


    // functions to create repulsor
    Repulsor()

    // function to create enemy
    Enemy()

    // Changing Animations.
    if (Anim === Animation1) {

      count = 800;
      if (keyDown("space")) {
        Anim = Animation2;
      }
    }

    if (Anim === Animation2) {

      count -= 16;
      if (count < 0) {
        Anim = Animation1;
        ironMan.changeAnimation("Iron Man", ironManAnimation)
      }
    }

    // Setting a counter for repulsor.
    if (STATE === NOTCOUNT) {
      no = 500;
      count = 800;
      if (keyDown("space")) {
        STATE = COUNT;

      }
    }

    if (STATE === COUNT) {
      no -= 5;
      count -= 1;
      if (no === 0) {
        STATE = NOTCOUNT;
      }
    }

    // destroy the enemy 
    for (var i = 0; i < enemyGroup.length; i++) {
      if (enemyGroup.get(i).isTouching(repulsorGroup)) {
        enemyGroup.get(i).destroy();
        kill += 1
      }
    }

    if (ironMan.y > 500 ||
      ironMan.y < 0 ||
      enemyGroup.isTouching(ironMan) ||
      enemyGroup.isTouching(invisibleWall)
      || keyDown("space")) {
      gameState = "End";
    }
    
  }

  drawSprites();

  if (gameState === "End") {
    textSize(60);
    text("GAME OVER", 100, 200)
    ironMan.visible = false;
    enemyGroup.destroyEach();
    restart.visible = true;
    
    if(mousePressedOver(restart)) {
      //console.log("reset")
      reset()
    }
  }
  
}

function Enemy() {
  if (frameCount % 200 === 0 && gameState === "LEVEL1") {
    enemy = createSprite(-100, random(100, 400), 50, 80);
    enemy.addAnimation("Enemy", enemyFly);
    enemy.debug = true;
    enemy.setCollider("rectangle", -400, 100, 850, 500);
    enemy.scale = 0.27;
    enemy.velocityX = 1;
    enemyGroup.add(enemy);
  }
}

function Repulsor() {
  if (keyDown("space") && STATE === NOTCOUNT) {
    repulsor = createSprite(900, ironMan.y, 20, 20);
    repulsor.addImage("shhots", shoot);
    //repulsor.debug = true;
    repulsor.setCollider("circle", -60, 0, 100);
    repulsor.scale = 0.4;
    repulsor.velocityX = -60

    repulsor.lifetime = 150;
    repulsorGroup.add(repulsor)

    ironMan.changeAnimation("fires", ironManAnimation2);

  }
}

function reset(){
  gameState="LEVEL0"
}

async function getBackground() {

  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();
  console.log(responseJSON);
  var dateTime = responseJSON.datetime;
  console.log(dateTime);
  dateTime.slice(11, 13);


  if (hour >= 6 && hour <= 19) {
    bg = "Day.jpg";
  }

  else {
    bg = "NightSky.jpg";
  }

  backgroundImg = loadImage(bg);
}


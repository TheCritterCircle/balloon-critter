// Created by itsBraian

// Select the canvas
const canvas = document.getElementById("critter");
// Context allows us to draw into the canvas
const context = canvas.getContext("2d");
// Counts frames in "loop"-function
let frames = 0;

// Create const to save the sprite image
const sprite = new Image();
// Load the sprite image
sprite.src = "img/sprite.png";

// Game STATUS
const status = {
  current : 0,
  menu : 0,
  game : 1,
  over : 2
}

// Game Controller
canvas.addEventListener("click", function(evt){
  switch(status.current){
    case status.menu:
      status.current = status.game;
      break;
    case status.game:
      critter.fly()
      break;
    case status.over:
      woods.reset();
      score.reset();
      status.current = status.menu;
      break;
  }
})

// Get Background from the sprite image
const background = {
  spriteX : 0,
  spriteY : 0,
  width : 275,
  height : 226,
  positionX : 0,
  positionY : canvas.height - 226,
  // Draw background into canvas
  draw : function(){
    context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
    this.height, this.positionX, this.positionY, this.width, this.height);
    //Since it's a loop we can draw it twice, one after another
    context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
    this.height, this.positionX + this.width, this.positionY, this.width,
    this.height);
  }
}

// Get Foreground from the sprite image
const foreground = {
  spriteX : 276,
  spriteY : 0,
  width : 224,
  height : 112,
  positionX : 0,
  positionY : canvas.height - 112,
  fgSpeed : 2,
  // Draw foreground into canvas
  draw : function(){
    context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
    this.height, this.positionX, this.positionY, this.width, this.height);
    //Since it's a loop we can draw it twice, one after another
    context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
    this.height, this.positionX + this.width, this.positionY, this.width,
    this.height);
  },
  // Update the foreground
  update : function(){
    if(status.current == status.game){
      this.positionX = (this.positionX - this.fgSpeed)%(this.width/2);
    }
  }
}

// Get Critter from the sprite Image
const critter = {
  //Critter has small animation on the sprite
  animation : [
    {spriteX : 276, spriteY : 113},
    {spriteX : 330, spriteY : 113},
    {spriteX : 384, spriteY : 113},
    {spriteX : 330, spriteY : 113}
  ],
  //Critter properties
  positionX : 50,
  positionY : 150,
  width : 50,
  height : 66,
  frame : 0,
  gravity : 0.15,
  jump : 3.6,
  speed : 0,
  radius : 12,
  // Draw the critter into canvas
  draw : function(){
    let critter = this.animation[this.frame];
    context.drawImage(sprite, critter.spriteX, critter.spriteY, this.width,
    this.height, this.positionX - this.width/2, this.positionY - this.height/2,
    this.width, this.height);
  },
  // Function that makes the critter fly higher after clicking
  fly : function(){
    this.speed = - this.jump;
  },
  // Function that updates the critter
  update: function(){
    // On menu, critter moves slowly
    this.period = status.current == status.menu ? 10 : 5;
    // We keep moving through the frames
    this.frame += frames%this.period == 0 ? 1 : 0;
    // We have 4 frames which will keep repeating
    this.frame = this.frame%this.animation.length;
    // If game status is on menu we have fixed y-position
    if(status.current == status.menu){
        this.positionY = 150;
        this.speed = 0;
    }else{
      this.speed += this.gravity;
      this.positionY += this.speed;
      // If critter touches foreground
      if(this.positionY + this.height/2 >= canvas.height - foreground.height){
        this.positionY = canvas.height - foreground.height - this.height/2;
        if(status.current == status.game){
          status.current = status.over;
        }
      }
      if(this.positionY - this.height/2 < 0){
        this.positionY = this.height/2;
      }
    }
  }
}

// Get Menu from the sprite image
const menu = {
  spriteX : 0,
  spriteY : 228,
  width : 173,
  height : 266,
  positionX : canvas.width/2 - 173/2,
  positionY : 25,
  // Draw background into canvas
  draw : function(){
    if(status.current == status.menu){
      context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
      this.height, this.positionX, this.positionY, this.width, this.height);
    }
  }
}

// Get Game Over from the sprite image
const gameOver = {
  spriteX : 175,
  spriteY : 228,
  width : 225,
  height : 202,
  positionX : canvas.width/2 - 225/2,
  positionY : 90,
  // Draw background into canvas
  draw : function(){
    if(status.current == status.over){
      context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
      this.height, this.positionX, this.positionY, this.width, this.height);
    }
  }
}

// Get Woods from the sprite Image
const woods = {
  position : [],

    top : {
        spriteX : 553,
        spriteY : 0
    },
    bottom:{
        spriteX : 502,
        spriteY : 0
    },

    width : 53,
    height : 400,
    gap : 90,
    maxYPos : -150,
    speed : 2,

    draw : function(){
      for(let i  = 0; i < this.position.length; i++){
          let p = this.position[i];
          let topYPos = p.y;
          let bottomYPos = p.y + this.height + this.gap;

          // Draw the top Wood
          context.drawImage(sprite, this.top.spriteX, this.top.spriteY,
          this.width, this.height, p.x, topYPos, this.width, this.height);

          // Draw the bottom Wood
          context.drawImage(sprite, this.bottom.spriteX, this.bottom.spriteY,
          this.width, this.height, p.x, bottomYPos, this.width, this.height);
      }
    },

    update: function(){
      if(status.current !== status.game) return;
      // Every 100 frames comes next pair of woods
      if(frames%100 == 0){
          this.position.push({
              x : canvas.width,
              y : this.maxYPos * ( Math.random() + 1)
          });
      }
      // Woods move
      for(let i = 0; i < this.position.length; i++){
          let p = this.position[i];
          p.x -= this.speed;
          let bottomWoodYPos = p.y + this.height + this.gap;

          // Collision Detection for Critter with the Woods
          // Top Wood
          if(critter.positionX + critter.radius > p.x &&
          critter.positionX - critter.radius < p.x + this.width &&
          critter.positionY + critter.radius > p.y && critter.positionY-
           critter.radius < p.y + this.height){
            status.current = status.over;
          }
          // Bottom Wood
          if(critter.positionX + critter.radius > p.x &&
          critter.positionX - critter.radius < p.x + this.width &&
          critter.positionY + critter.radius > bottomWoodYPos &&
          critter.positionY - critter.radius < bottomWoodYPos +
          this.height){
            status.current = status.over;
          }

          // When woods go out of the canvas, they get removed
          if(p.x + this.width <= 0){
            this.position.shift();
            score.value += 1;
            score.best = Math.max(score.value, score.best);
            localStorage.setItem("best", score.best);
          }
        }
    },

    reset : function(){
      this.position = [];
    }
}

// Score calculation and display
const score = {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    // Draw Score into canvas
    draw : function(){
        context.fillStyle = "#FFF";
        if(status.current == status.game){
            context.lineWidth = 2;
            context.font = "35px Teko";
            context.fillText(this.value, canvas.width/2, 50);
        }else if(status.current == status.over){
            // Draw the Score Value
            context.font = "25px Teko";
            context.fillText(this.value, 225, 186);
            // Draw the Best Score Value
            context.fillText(this.best, 225, 228);
        }
    },

    reset : function(){
      this.value = 0;
    }
}

// This function is responsible for everything we draw in the canvas
function draw(){
  // We define the background color, the sky
  context.fillStyle = "#c0e5f1";
  // We define the x- and y-Position (top-left corner) of the background
  context.fillRect(0, 0, canvas.width, canvas.height);
  // Call the "Draw Background" function
  background.draw();
  // Call the "Draw Woods" function
  woods.draw();
  // Call the "Draw Foreground" function
  foreground.draw();
  // Call the "Draw Critter" function
  critter.draw();
  // Call the "Draw Menu" function
  menu.draw();
  // Call the "Draw gameOver" function
  gameOver.draw();
  // Call the "Draw Score" function
  score.draw();
}

// This function updates the game
function update(){
  // Call the "Update Critter" function
  critter.update();
  // Call the "Update Foreground" Function
  foreground.update();
  // Call the "Update Woods" Function
  woods.update();
}

// This function calls the "draw"-function every second in a loop
function loop(){
  // Updates the game
  update();
  // Calls the "draw"-function
  draw();
  // Counts frames drawn to the canvas
  frames++;
  // Loops
  requestAnimationFrame(loop);
}
// In result, we only call the loop function once
loop();

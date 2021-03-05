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
sprite.src = "../assets/sprite.png";

// Game STATUS
const status = {
    current: 0,
    menu: 0,
    game: 1,
    over: 2
}

// Game Controller
canvas.addEventListener("click", (evt) => {
    switch (status.current) {
        case status.menu:
            status.current = status.game;
            break;
        case status.game:
            Critter.fly()
            break;
        case status.over:
            Woods.reset();
            Score.reset();
            status.current = status.menu;
            break;
    }
})



// Get Background from the sprite image
class Background {

    static spriteX = 0;

    static spriteY = 0;

    static width = 275;

    static height = 226;

    static positionX = 0;

    static positionY = canvas.height - 226;


    // Draw Background into canvas
    static draw() {
        context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
            this.height, this.positionX, this.positionY, this.width, this.height);
        //Since it's a loop we can draw it twice, one after another
        context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
            this.height, this.positionX + this.width, this.positionY, this.width,
            this.height);
    }

}


// Get Foreground from the sprite image
class Foreground {

    static spriteX = 276;

    static spriteY = 0;

    static width = 224;

    static height = 112;

    static positionX = 0;

    static positionY = canvas.height - 112;

    static fgSpeed = 2;

    // Draw Foreground into canvas
    static draw() {
        context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
            this.height, this.positionX, this.positionY, this.width, this.height);
        //Since it's a loop we can draw it twice, one after another
        context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
            this.height, this.positionX + this.width, this.positionY, this.width,
            this.height);
    }

    static update() {
        if (status.current == status.game) {
            this.positionX = (this.positionX - this.fgSpeed) % (this.width / 2);
        }
    }

}

// Get Critter from the sprite Image
class Critter {

    //Critter has small animation on the sprite
    static animation = [{
            spriteX: 276,
            spriteY: 113
        },
        {
            spriteX: 330,
            spriteY: 113
        },
        {
            spriteX: 384,
            spriteY: 113
        },
        {
            spriteX: 330,
            spriteY: 113
        }
    ];

    //Critter properties
    static positionX = 50;

    static positionY = 150;

    static width = 50;

    static height = 66;

    static frame = 0;

    static gravity = 0.15;

    static jump = 3.6;

    static speed = 0;

    static radius = 12;


    // Draw the Critter into canvas
    static draw() {

        let Critter = this.animation[this.frame];

        context.drawImage(sprite, Critter.spriteX, Critter.spriteY, this.width,
            this.height, this.positionX - this.width / 2, this.positionY - this.height / 2,
            this.width, this.height);
    }

    // Function that makes the Critter fly higher after clicking
    static fly() {
        this.speed = -this.jump;
    }

    // Function that updates the Critter
    static update() {
        // On menu, Critter moves slowly
        this.period = status.current == status.menu ? 10 : 5;
        // We keep moving through the frames
        this.frame += frames % this.period == 0 ? 1 : 0;
        // We have 4 frames which will keep repeating
        this.frame = this.frame % this.animation.length;
        // If game status is on menu we have fixed y-position
        if (status.current == status.menu) {
            this.positionY = 150;
            this.speed = 0;
        } else {
            this.speed += this.gravity;
            this.positionY += this.speed;
            // If Critter touches Foreground
            if (this.positionY + this.height / 2 >= canvas.height - Foreground.height) {
                this.positionY = canvas.height - Foreground.height - this.height / 2;
                if (status.current == status.game) {
                    status.current = status.over;
                }
            }
            if (this.positionY - this.height / 2 < 0) {
                this.positionY = this.height / 2;
            }
        }
    }
}

// Get Menu from the sprite image
class Menu {

    static spriteX = 0;

    static spriteY = 228;

    static width = 173;

    static height = 266;

    static positionX = canvas.width / 2 - 173 / 2;

    static positionY = 25;


    // Draw Background into canvas
    static draw() {
        if (status.current == status.menu) {
            context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
                this.height, this.positionX, this.positionY, this.width, this.height);
        }
    }


}


// Get Game Over from the sprite image
class GameOver {

    static spriteX = 175;

    static spriteY = 228;

    static width = 225;

    static height = 202;

    static positionX = canvas.width / 2 - 225 / 2;

    static positionY = 90;

    // Draw Background into canvas
    static draw() {
        if (status.current == status.over) {
            context.drawImage(sprite, this.spriteX, this.spriteY, this.width,
                this.height, this.positionX, this.positionY, this.width, this.height);
        }
    }
}

// Get Woods from the sprite Image

class Woods {

    static position = [];

    static top = {
        spriteX: 553,
        spriteY: 0
    }

    static bottom = {
        spriteX: 502,
        spriteY: 0
    }

    static width = 53;

    static height = 400;

    static gap = 90;

    static maxYPos = -150;

    static speed = 2;

    static draw() {
        for (let i = 0; i < this.position.length; i++) {
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
    }

    static update() {
        if (status.current !== status.game) return;
        // Every 100 frames comes next pair of woods
        if (frames % 100 == 0) {
            this.position.push({
                x: canvas.width,
                y: this.maxYPos * (Math.random() + 1)
            });
        }
        // Woods move
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= this.speed;
            let bottomWoodYPos = p.y + this.height + this.gap;

            // Collision Detection for Critter with the Woods
            // Top Wood
            if (Critter.positionX + Critter.radius > p.x &&
                Critter.positionX - Critter.radius < p.x + this.width &&
                Critter.positionY + Critter.radius > p.y && Critter.positionY -
                Critter.radius < p.y + this.height) {
                status.current = status.over;
            }
            // Bottom Wood
            if (Critter.positionX + Critter.radius > p.x &&
                Critter.positionX - Critter.radius < p.x + this.width &&
                Critter.positionY + Critter.radius > bottomWoodYPos &&
                Critter.positionY - Critter.radius < bottomWoodYPos +
                this.height) {
                status.current = status.over;
            }

            // When woods go out of the canvas, they get removed
            if (p.x + this.width <= 0) {
                this.position.shift();
                Score.value += 1;
                Score.best = Math.max(Score.value, Score.best);
                localStorage.setItem("best", Score.best);
            }
        }
    }

    static reset() {
        this.position = [];
    }
}


// Score calculation and display
class Score {

    static best = parseInt(localStorage.getItem("best")) || 0;
    static value = 0;

    // Draw Score into canvas
    static draw() {
        context.fillStyle = "#FFF";
        if (status.current == status.game) {
            context.lineWidth = 2;
            context.font = "35px Teko";
            context.fillText(this.value, canvas.width / 2, 50);
        } else if (status.current == status.over) {
            // Draw the Score Value
            context.font = "25px Teko";
            context.fillText(this.value, 225, 186);
            // Draw the Best Score Value
            context.fillText(this.best, 225, 228);
        }
    }

    static reset() {
        this.value = 0;
    }

}

class Renderer {

    // this method is responsible for everything we draw in the canvas 
    static draw() {
        // We define the Background color, the sky
        context.fillStyle = "#c0e5f1";
        // We define the x- and y-Position (top-left corner) of the Background
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Call the "Draw Background" function
        Background.draw();
        // Call the "Draw Woods" function
        Woods.draw();
        // Call the "Draw Foreground" function
        Foreground.draw();
        // Call the "Draw Critter" function
        Critter.draw();
        // Call the "Draw Menu" function
        Menu.draw();
        // Call the "Draw gameOver" function
        GameOver.draw();
        // Call the "Draw Score" function
        Score.draw();
    }
    // this method updates the game
    static update() {
        // Call the "Update Critter" function
        Critter.update();
        // Call the "Update Foreground" Function
        Foreground.update();
        // Call the "Update Woods" Function
        Woods.update();
    }
    // this method calls the "draw"-function every second in a loop
    static loop() {
        // Updates the game
        Renderer.update();
        // Calls the "draw"-function
        Renderer.draw();
        // Counts frames drawn to the canvas
        frames++;
        // Loops
        requestAnimationFrame(Renderer.loop);

    }


}


// In result, we only call the loop method once
Renderer.loop();

// Current Tutorial https://youtu.be/4q2vvZn5aoo?t=2130
// vvv Basic Canvas tutorials vvv
//https://www.linkedin.com/learning/adobe-animate-cc-html5-canvas-and-webgl/welcome?autoplay=true&u=85000002
//https://www.linkedin.com/learning/learning-html-canvas/graphics-programming-with-javascript?autoplay=true&u=85000002

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// Makes the canvas the size of the window
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

const gravity = 0.5;

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 1,
            y: 0
        }
        this.width = 30;
        this.height = 30;
    }

    draw() {
        c.fillStyle = "blue";
        c.fillRect(
            this.position.x, 
            this.position.y,
            this.width,
            this.height
            );
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }
    }
}

class Platform {
    constructor(width, height, x, y) {
        this.position = {
            x: x,
            y: y
        }

        this.width = width
        this.height = height
    }

    draw() {
        c.fillStyle = "green"
        c.fillRect(
            this.position.x, 
            this.position.y,
            this.width,
            this.height
            )

    }
}

const player = new Player();
const platform = new Platform(100, 20, 100, 400);
const wall = new Platform(20, 100, 500, 400);

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

player.draw();

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    platform.draw();
    wall.draw();

    if (keys.right.pressed) {
        player.velocity.x = 8;
    } else if (keys.left.pressed) {
        player.velocity.x = -8;
    } else {
        player.velocity.x = 0;
    }

    if (player.position.y + player.height <= platform.position.y
        && player.position.y + player.height + player.velocity.y >= platform.position.y
        && player.position.x + player.width >= platform.position.x
        && player.position.x <= platform.position.x + platform.width
        ) {
        player.velocity.y = 0;
    }
    if (player.position.y >= platform.position.y
        && player.position.y + player.velocity.y <= platform.position.y
        && player.position.x + player.width >= platform.position.x
        && player.position.x <= platform.position.x + platform.width
        ) {
        player.velocity.y = 0;
    }
}

animate();

window.addEventListener("keydown", (evt) => {
    switch (evt.key) {
        case "a":
            //player.velocity.x = -10;
            keys.left.pressed = true;
            break;
        case "d":
            //player.velocity.x = 10;
            keys.right.pressed = true;
            break;
        case "w":
            if (player.velocity.y == 0) player.velocity.y -= 15;
            break;
        default:
            break;
    }
})

window.addEventListener("keyup", (evt) => {
    switch (evt.key) {
        case "a":
            //player.velocity.x = -10;
            keys.left.pressed = false;
            break;
        case "d":
            //player.velocity.x = 10;
            keys.right.pressed = false;
            break;
        case "w":
            if (player.velocity.y == 0) player.velocity.y -= 20;
            break;
        default:
            break;
    }
})
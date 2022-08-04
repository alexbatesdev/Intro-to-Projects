
// Current Tutorial https://youtu.be/4q2vvZn5aoo?t=2130
// vvv Basic Canvas tutorials vvv
//https://www.linkedin.com/learning/adobe-animate-cc-html5-canvas-and-webgl/welcome?autoplay=true&u=85000002
//https://www.linkedin.com/learning/learning-html-canvas/graphics-programming-with-javascript?autoplay=true&u=85000002

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// Makes the canvas the size of the window
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

class Spawner {
    constructor(x, y) {
        this.position = {
            x: x,
            y: y
        };
        this.width = 25;
        this.height = 25;
        this.spawnDelay = 5;
        this.troops = [];
        this.spawnLoop();
    }

    spawnTroop() {
        this.troops.push(new Troop(this.position.x, this.position.y, 2, 0));
    }

    spawnLoop() {
        let timer = window.setInterval(() => {
            this.spawnTroop();
        }, 3000);
    }

    draw() {
        c.fillStyle = "yellow";
        c.fillRect (
            this.position.x, 
            this.position.y,
            this.width,
            this.height
        );
    }

    update() {
        this.draw();
        this.troops.forEach(troop => {
            troop.update();
        });
    }

}

class Troop {
    constructor(x, y, vX, vY) {
        this.position = {
            x: x,
            y: y
        };
        this.velocity = {
            x: vX,
            y: vY
        };
        this.width = 15;
        this.height = 15;
        this.update()
    }

    draw() {
        c.fillStyle = "black";
        c.fillRect (
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
    }
}

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        };
        this.velocity = {
            x: 1,
            y: 0
        };
        this.width = 30;
        this.height = 30;
        this.moveSpeed = 5;
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
    }
}

class Platform {
    constructor(width, height, x, y) {
        this.position = {
            x: x,
            y: y
        };

        this.width = width;
        this.height = height;
    }

    draw() {
        c.fillStyle = "green";
        c.fillRect(
            this.position.x, 
            this.position.y,
            this.width,
            this.height
            );

    }
}

// //////////////////////////////////////////////////////////////

const player = new Player();
const platform = new Platform(100, 20, 100, 400);
const wall = new Platform(20, 100, 500, 400);
const spawner = new Spawner(150, 150);
const troop1 = new Troop(200,200, 1, 0);

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    },
    down: {
        pressed: false
    }
    
}


function run() {
    requestAnimationFrame(run);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    platform.draw();
    wall.draw();
    spawner.update();
    troop1.update();

    if (keys.right.pressed) {
        player.velocity.x = player.moveSpeed;
    } else if (keys.left.pressed) {
        player.velocity.x = -player.moveSpeed;
    } else {
        player.velocity.x = 0;
    }

    if (keys.up.pressed) {
        player.velocity.y = -player.moveSpeed;
    } else if (keys.down.pressed) {
        player.velocity.y = player.moveSpeed;
    } else {
        player.velocity.y = 0;
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

run();

window.addEventListener("keydown", (evt) => {
    switch (evt.key) {
        case "a":
            keys.left.pressed = true;
            break;
        case "d":
            keys.right.pressed = true;
            break;
        case "w":
            keys.up.pressed = true;
            break;
        case "s":
            keys.down.pressed = true;
            break;
        default:
            break;
    }
})

window.addEventListener("keyup", (evt) => {
    switch (evt.key) {
        case "a":
            keys.left.pressed = false;
            break;
        case "d":
            keys.right.pressed = false;
            break;
        case "w":
            keys.up.pressed = false;
            break;
        case "s":
            keys.down.pressed = false;
            break;
        default:
            break;
    }
})

// Current Tutorial https://youtu.be/4q2vvZn5aoo?t=2130

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

    spawnTroop(vX, vY) {
        this.troops.push(new Troop(this.position.x, this.position.y, vX, vY));
    }

    spawnLoop() {
        let timer = window.setInterval(() => {
            this.spawnTroop(1, 0);
        }, 500);
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

        if (intersectRect(this, pathTurn)) {
            console.log("Gorp");
        }
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

class PathTurn {
    constructor(x, y, sendX, sendY) {
        this.position = {
            x: x,
            y: y
        };
        this.width = 25;
        this.height = 25;
        
        this.sendX = sendX;
        this.sendY = sendY;
    }

    draw() {
        c.fillStyle = "#454545";
        c.fillRect (
            this.position.x, 
            this.position.y,
            this.width,
            this.height
        );
    }
}

function intersectRect(r1, r2) {
    return !(r2.left > r1.right || 
             r2.right < r1.left || 
             r2.top > r1.bottom ||
             r2.bottom < r1.top);
  }

// //////////////////////////////////////////////////////////////

const player = new Player();
const platform = new Platform(100, 20, 100, 400);
const wall = new Platform(20, 100, 500, 400);
const spawner = new Spawner(150, 150);
const troop1 = new Troop(200,200, 1, 0);
const pathTurn = new PathTurn(500, 150, 0, 1);

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
    updateAll();
    drawAll();

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
}

function updateAll() {
    player.update();
    spawner.update();
    troop1.update();
}

function drawAll() {
    platform.draw();
    pathTurn.draw();
    wall.draw();
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
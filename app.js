class SceneBoot extends Phaser.Scene {
    constructor() {
        super({ key: 'boot' });
    }
    preload() {
        console.log('preload');
    }
    create() {
        this.add.text(20, 20, "Loading...", { font: "24px Arial", fill: "#ffffff" });
        console.log("HELLO I AM THE BOOT SCENE");
        this.scene.start('mainMenu');
    }
};

class SceneMainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'mainMenu' });
    }

    preload() {
        this.load.image('background', 'assets/mainMenuTest.png');
        console.log("HELLO I AM THE MAIN MENU SCENE");
    }

    create() {

        this.add.image(400, 300, 'background');
        this.add.text(20, 20, "Main Menu", { font: "24px Arial", fill: "#ffffff" });
        //CREATING PLAY BUTTON
        const startButton = this.add.text(20, 100, "Play", { font: "24px Arial", fill: "#0f0" });
        startButton.setInteractive();
        startButton.on('pointerdown', function () {
            console.log("you clicked play!")
            this.scene.start('game'); //SENDS YOU TO GAME SCENE
        }, this);
        //CREATING HOW TO PLAY BUTTON
        const howToButton = this.add.text(20, 150, "How to Play", { font: "24px Arial", fill: "#0f0" });
        howToButton.setInteractive();
        howToButton.on('pointerdown', function () {
            console.log("you clicked play!")
            this.scene.start('howTo'); //SENDS YOU TO HOWTO SCENE
        }, this);
    }
};

class SceneGame extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
        this.tower = null;
    }

    preload() {
        console.log("starting our game!");
        this.load.image('background', 'assets/map1.png');
        this.load.image("spawner", "assets/spawner.png");
        this.load.image("troop", "assets/troop.png");
        this.load.image("tower", "assets/spawner.png");
        this.load.image("bullet", "assets/star.png");
        
        this.load.json('pathJSON', 'assets/path.json');
    }

    create() {
        //Places background image
        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;
        this.background = this.add.image(centerX, centerY, "background").setOrigin(.5, .5);
        this.background.displayWidth = this.sys.canvas.width;
        this.background.displayHeight = this.sys.canvas.height;

        
        //Places path
        let pathJSON = new Phaser.Curves.Path(this.cache.json.get('pathJSON'));
        
        //Places spawner
        this.spawner = new WaveMachine(this, pathJSON);
        this.spawner.startAutoWaves(5, 1);
        
        this.tower = new Tower(this, 300, 300);
        
        this.background.setInteractive();
        this.background.on('pointerdown', function (pointer) {
            console.log("you clicked the background!")
            let x = pointer.x;
            let y = pointer.y;
            console.log(`${x}, ${y}`);
        }.bind(this));
        
        //Draws path
        let gfx = this.add.graphics();
        gfx.clear();
        gfx.lineStyle(2, 0xffffff, 1);
        pathJSON.draw(gfx);

    }

    update(time, delta) {
        //Draws path
        this.tower.update(time, delta);
        //this.spawner.update(time, delta);
    }
};

class SceneInstructions extends Phaser.Scene {
    constructor() {
        super({ key: 'howTo' });

    }
    preload() {
        this.load.image('background', 'assets/wendussy.jpg');
        console.log("preloaded deez nuts");
        
    }
    create() {
        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;
        this.background = this.add.image(centerX, centerY, "background").setOrigin(.5, .5);
        // Based on your game size, it may "stretch" and distort.
        this.background.displayWidth = this.sys.canvas.width;
        this.background.displayHeight = this.sys.canvas.height;
    }
    update() {
    }
};

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [SceneBoot, SceneMainMenu, SceneGame, SceneInstructions]
};

var game = new Phaser.Game(config);

// ////////////////////////////////////////////////////////////////////////////////////////////////

class Troop extends Phaser.GameObjects.PathFollower {
    
    constructor(scene, path, x, y, key = 'troop') {
        super(scene, path, x, y, key);
        this.scene = scene;
        this.path = path;
        this.health;
        this.speed;
        this.setScale(.5);
    }

};

class WaveMachine {
    constructor(scene, path, secBetweenWaves = 5, travelDurationSec = 21) {
        this.scene = scene;
        this.inProgress = false;
        this.isAuto = false;
        this.secBetweenWaves = secBetweenWaves;
        this.path = path;
        this.waveGroup;
        this.timer;
        this.runChildUpdate = true;

        this.bloonConfig = {
            positionOnPath: true,
            duration: travelDurationSec * 1000,
            repeat: 0,
            yoyo: false,
            rotateToPath: true,
            verticalAdjust: true,
        };
    }

    startWave(roundNum, delaySec, quantity = this.fib(roundNum)) {
        console.log(`Starting wave ${roundNum} with ${quantity} bloons`);
        this.inProgress = true;
        let delayMilli = delaySec * 1000;
        this.waveGroup = new Wave(this.scene);
        this.timer = this.scene.time.addEvent({
            delay: delayMilli,
            callback: () => {
                let troop = new Troop(this.scene, this.path, -50, 0);
                troop.startFollow(this.bloonConfig);
                this.scene.add.existing(troop);
                this.waveGroup.add(troop);
                console.log('Spawned a troop');
                if (this.timer.repeatCount === 0) {
                    this.inProgress = false;
                    if (this.isAuto) {
                        // wait for set amount of seconds after the timer finishes before starting the next wave
                        this.scene.time.addEvent({
                            delay: this.secBetweenWaves * 1000,
                            callback: () => {
                                this.startWave(roundNum + 1, delaySec);
                            }
                        });
                    }
                }
            },
            repeat: quantity - 1
        });
    }

    startAutoWaves(roundNum, delaySec, quantity) {
        this.isAuto = true;
        console.log(`Starting auto waves`);
        this.startWave(roundNum, delaySec, quantity);
    }

    stopAutoWaves() {
        this.isAuto = false;
        this.timer.remove(false);
    }

    stopWave() {
        this.timer.remove(false);
    }

    // a function that takes in an input and returns the value of the fibbonaci sequence at that value
    fib(n) {
        if (n < 2) {
            return n;
        }
        return this.fib(n - 1) + this.fib(n - 2);
    }

    update(time, delta) {
        
    }
};

// Might be completely redundant, will have to get popping of bloons working first
class Wave extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        this.scene = scene;
    }
    
    add(troop) {
        super.add(troop);
    }
};

class Player {
    constructor(scene) {
        this.scene = scene;
        this.money = 100;
        this.health = 100;
    }

    incrementMoney(amount) {
        this.money += Math.abs(amount);
    }

    decrementMoney(amount) {
        this.money -= Math.abs(amount);
    }

    setMoney(amount) {
        this.money = amount;
    }

    incrementHealth(amount) {
        this.health += Math.abs(amount);
    }

    decrementHealth(amount) {
        this.health -= Math.abs(amount);
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////

class Tower extends Phaser.GameObjects.Image{
    constructor(scene, x, y, key = "tower") {
        super(scene, x, y, key);
        this.nextFire = 0;
        this.cost = 100;
        this.bullets = new Phaser.Physics.Arcade.Group(scene);
        this.setScale(.5);
        console.log("Made a tower");
        scene.add.existing(this);
    }
    fire() {
        console.log("firing");
        let bullet = new Bullet(this.scene, this.x, this.y, 5, 5);
        // this.bullets.add(bullet);
    }
    update(time, delta) {
        if (time > this.nextFire) {
            this.nextFire = time + 1000;
            this.fire();
        }
        this.bullets.children.each(function (bullet) {
            bullet.update(time, delta);
        }.bind(this));
    }
};

class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, dx, dy){
        super(scene, x, y, "bullet");
        this.speed = 600;
        this.dx = dx;
        this.dy = dy;
        this.lifespan = 10000000;
        this.setActive(true);
        this.setVisible(true);
        this.setScale(.75);
        scene.add.existing(this);
        //console.log("I am alive!");
    }

    update(time, delta) {
        this.lifespan -= delta;
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);
        this.setPosition(this.x, this.y);
        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
};
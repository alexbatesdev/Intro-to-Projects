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
        this.load.image('MainMenuBackground', 'assets/menubg.png');
        console.log("HELLO I AM THE MAIN MENU SCENE");
    }

    create() {

        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;
        this.background = this.add.image(centerX, centerY, "MainMenuBackground").setOrigin(.5, .5);
        // Based on your game size, it may "stretch" and distort.
        this.background.displayWidth = this.sys.canvas.width;
        this.background.displayHeight = this.sys.canvas.height;

        this.add.image(400, 300, 'MainMenuBackground');
        this.add.text(20, 20, "Steeds & Steel II: Revengeance", { font: "48px Times New Roman", fill: "#ffffff" });
        //CREATING PLAY BUTTON
        const startButton = this.add.text(20, 100, "Play", { font: "24px Arial", fill: "#000", backgroundColor: "#0f0", padding: 10 });
        startButton.setInteractive();
        startButton.on('pointerdown', function () {
            console.log("you clicked play!")
            this.scene
            .launch('game')
            .launch('store')
            .remove(); //SENDS YOU TO GAME SCENE
        }, this);
        //CREATING HOW TO PLAY BUTTON
        const howToButton = this.add.text(20, 150, "How to Play", { font: "24px Arial", fill: "#000", backgroundColor: "#00f", padding: 10 });
        howToButton.setInteractive();
        howToButton.on('pointerdown', function () {
            console.log("you clicked play!")
            this.scene.start('howTo'); //SENDS YOU TO HOWTO SCENE
        }, this);
    }
};
var MenuIsOpen = true;
class SceneStore extends Phaser.Scene {
    constructor() {
        super({ key: 'store',
                width: 200,
                height: 600 });
       
    }
    preload(){
        
        console.log("HELLO I AM THE STORE SCENE");
        this.load.image('UI', 'assets/tempstore.png');
        this.load.image('tower1', 'assets/spawner.png');
        
    }    
    create() {
        
        var gameScene = this.scene.get('game');
        //this.add.image(400,300, 'UI');
        this.storeMenu = this.add.image(400,300, 'UI');
        this.tower1 = this.add.image(676, 158, 'tower1').setScale(0.5);
        this.storeButton = this.add.text(575, 0, "Shop", { font: "20px Berlin Sans FB Demi", fill: "#FFFFFF" });
        this.storeButton.setInteractive();
        this.tower1.setInteractive();
        //drag and drop 
        this.input.setDraggable(this.tower1);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            if(MenuIsOpen == true){
                moveMenu(this.scene, this.storeButton, this.storeMenu, this.tower1);
            }
            gameObject.x = dragX;
            gameObject.y = dragY;
           
        },this);
        this.input.on('dragend', function (pointer, gameObject) {
            if(buyTower(gameScene) == true){
            placeTower(gameScene, gameObject.x, gameObject.y);
            }
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
        
            
            if(MenuIsOpen == false){
            moveMenu(this.scene, this.storeButton, this.storeMenu, this.tower1);
            }
        }, this);

        this.storeButton.on('pointerdown', function(){
            console.log("you clicked shop!")
            moveMenu(this.scene, this.storeButton, this.storeMenu, this.tower1);
        }, this);
    } 


    
};

class SceneGameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOver'});
    }
    preload(){
        this.load.image('background', 'assets/wendussy.jpg');
        
    }    
    create() {
        this.add.text(20, 20, "Game Over", { font: "24px Arial", fill: "#ffffff" });
        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;
        this.background = this.add.image(centerX, centerY, "background").setOrigin(.5, .5);
        // Based on your game size, it may "stretch" and distort.
        this.background.displayWidth = this.sys.canvas.width;
        this.background.displayHeight = this.sys.canvas.height;
    } 

};

class SceneGame extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
        this.player = new Player(this);
        this.towers = new TowerGroup(this);

        this.plrHealthText;
        this.plrMoneyText;
    }

    decrementHealth(i) {
        this.player.health -= Math.abs(i);
    }

    incrementMoney(i) {
        this.player.money += Math.abs(i);
    }
    decrementMoney(i) {
        this.player.money -= Math.abs(i);
    }
    getPlayerMoney(){
        return this.player.money 
    }

    preload() {
        console.log("starting our game!");
        this.load.image('background', 'assets/map1.png');
        this.load.image("spawner", "assets/spawner.png");
        this.load.image("troop", "assets/troop.png");
        this.load.image("tower", "assets/spawner.png");
        this.load.image("bullet", "assets/star.png");

        this.load.image('coin', 'assets/TrumpCoin.png');
        this.load.image('health', 'assets/anatomical-heart.png');
        
        this.load.json('pathJSON', 'assets/path.json');

        
    }

    create() {
        //Places background image
        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;
        this.background = this.add.image(centerX, centerY, "background").setOrigin(.5, .5);
        this.background.displayWidth = this.sys.canvas.width;
        this.background.displayHeight = this.sys.canvas.height;

        //Places ui stuff
        this.coin = this.add.image(30, 25, "coin").setScale(.10); 
        this.health = this.add.image(30, 65, "health").setScale(.33);
        this.plrHealthText = this.add.text(60, 10, this.player.money, { font: "24px Arial", fill: "#ffffff" });
        this.plrMoneyText = this.add.text(60, 50, this.player.health, { font: "24px Arial", fill: "#ffffff" });
        
        //Places path
        let pathJSON = new Phaser.Curves.Path(this.cache.json.get('pathJSON'));
        this.npc = new NPC(this, 100, 100,)
        // this.physics.moveTo(this.npc, 123, 123, 300);
        //Places spawner
        this.spawner = new WaveMachine(this, pathJSON);
        this.spawner.startAutoWaves(5, 1);
        //adds tower group
        this.towers.add(new Tower(this, 300, 300, "tower", ));
        this.towers.add(new Tower(this, 400, 350, "tower", ));
        this.towers.add(new Tower(this, 500, 400, "tower", ));
        

        this.background.setInteractive();
        this.background.on('pointerdown', function (pointer) {
            console.log("you clicked the background!")
            let x = pointer.x;
            let y = pointer.y;
            console.log(`${x}, ${y}`);
            console.log(this.player.health);
            console.log(this.player.money);
        }.bind(this));
        
        //Draws path
        let gfx = this.add.graphics();
        gfx.clear();
        gfx.lineStyle(2, 0xffffff, 1);
        //pathJSON.draw(gfx);
        
    }

    update(time, delta) {
        //this.spawner.update(time, delta);
        this.towers.fireAll(time, delta);
        this.plrHealthText.setText(this.player.money);
        this.plrMoneyText.setText(this.player.health);

        if (this.player.health <= 0) {
            this.scene.start('gameOver');
        }
    }
};

class SceneInstructions extends Phaser.Scene {
    constructor() {
        super({ key: 'howTo' });

    }
    preload() {
        this.load.image('InstructionsBackground', 'assets/sky.png');
        console.log("preloaded deez nuts");
        
    }
    create() {
        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;
        this.background = this.add.image(centerX, centerY, "InstructionsBackground").setOrigin(.5, .5);
        // Based on your game size, it may "stretch" and distort.
        this.background.displayWidth = this.sys.canvas.width;
        this.background.displayHeight = this.sys.canvas.height;

        this.add.rectangle(centerX, centerY, 600, 450, 0x8A3725)
        
        //CREATING HOW TO PLAY BUTTON
        const backButton = this.add.text(25, 25, "Back", { font: "24px Arial", fill: "#000", backgroundColor: "#f00", padding: 10 });
        backButton.setInteractive();
        backButton.on('pointerdown', function () {
            console.log("you clicked Back!")
            this.scene.start('mainMenu'); //SENDS YOU TO HOWTO SCENE
        }, this);



        const startButton = this.add.text(725, 25, "Play", { font: "24px Arial", fill: "#000", backgroundColor: "#0f0", padding: 10 });
        startButton.setInteractive();
        startButton.on('pointerdown', function () {
            console.log("you clicked play!")
            this.scene
            .launch('game')
            .launch('store')
            .remove(); //SENDS YOU TO GAME SCENE
        }, this);
    }
    update() {
    }
};

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [SceneBoot, SceneMainMenu, SceneGame, SceneInstructions, SceneStore],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};

var game = new Phaser.Game(config);

// ////////////////////////////////////////////////////////////////////////////////////////////////

class Troop extends Phaser.GameObjects.PathFollower {
    
    constructor(scene, path, x, y, key = 'troop') {
        super(scene, path, x, y, key);
        this.scene = scene;
        this.path = path;
        this.health;
        this.speed = Phaser.Math.GetSpeed(0, 1);
        this.setScale(.5);
        this.bloonConfig = {
            positionOnPath: true,
            duration: 20 * 1000,
            repeat: 0,
            yoyo: false,
            rotateToPath: true,
            verticalAdjust: true,
            onComplete: this.complete,
            onCompleteScope: this,
            onCompleteParams: [this.scene]
        };

        super.startFollow(this.bloonConfig);
    }

    complete(tween, targets, scene) {
        console.log("troop got in");
        this.destroy();
        scene.decrementHealth(1);
        //scene.incrementMoney(Phaser.Math.Between(2, 5));
    }

    getPos() {
        let position = {
            x: this.x,
            y: this.y
        }
        return position;
    }

    getTroop() {
        return this;
    }

};

class WaveMachine {
    constructor(scene, path, secBetweenWaves = 5, travelDurationSec = 20) {
        this.scene = scene;
        this.inProgress = false;
        this.isAuto = false;
        this.secBetweenWaves = secBetweenWaves;
        this.path = path;
        this.waveGroup = new Wave(this.scene);
        this.timer;
        this.runChildUpdate = true;

        
    }

    startWave(roundNum, delaySec, quantity = this.roundCalc(roundNum)) {
        this.getTroop(0);
        let delayMilli = delaySec * 1000;
        console.log(`Starting wave ${roundNum} with ${quantity} bloons`);
        this.inProgress = true;
        this.timer = this.scene.time.addEvent({
            delay: delayMilli,
            callback: () => {

                // console.log(this.scene)
                let troop = new Troop(this.scene, this.path, -50, 0);
                this.scene.physics.add.existing(troop);
                this.scene.add.existing(troop);
                this.waveGroup.add(troop);
                //console.log('Spawned a troop');


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
    //Way too fast round calc
    fib(n) {
        if (n < 2) {
            return n;
        }
        return this.fib(n - 1) + this.fib(n - 2);
    }
    //untested round calc
    roundCalc(n) {
        return 5 * n;
    }
    
    getTroop(i) {
        try {
            return this.waveGroup.children.entries[i].getTroop();
        } catch (error) {
            return null;
        }
    }

    update(time, delta) {

    }
};

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

    static incrementMoney(amount) {
        this.money += Math.abs(amount);
    }

    static decrementMoney(amount) {
        this.money -= Math.abs(amount);
    }
    static getMoney(){
        console.log("returning money!");
        return this.money;
    }

    setMoney(amount) {
        this.money = amount;
    }

    static incrementHealth(amount) {
        this.health += Math.abs(amount);
    }

   static decrementHealth(amount) {
        this.health -= Math.abs(amount);
    }

    setHealth(amount) {
        this.health = amount;
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////

// A Bullet class that a Tower can shoot

class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.speed = Phaser.Math.GetSpeed(400, 1);
        this.setScale(.5);
        this.setOrigin(0, 0);
        this.setRotation(Phaser.Math.Between(0, 360));
        this.setActive(false);
        this.setVisible(false);
        this.scene.physics.add.sprite(this.x, this.y, 'bullet');
    }
    update(time, delta) {
        this.x += this.speed * delta;
        if (this.x > this.scene.sys.canvas.width) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

// A tower class that can shoot bullets to any nearby troops
// Tower can shoot any troop on the scence within a certain range
// Tower will detect if there is a troop nearby and will shoot at it
// Tower will only shoot at one troop at a time
class Tower extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.setScale(.35);
        this.setOrigin(0, 0);
        // this.setRotation(Phaser.Math.Between(0, 360));
        this.setActive(true);
        this.setVisible(true);
        this.scene.add.existing(this);
        this.bulletSpeed = Phaser.Math.GetSpeed(400, 1);
        this.bullet = new Bullet(this.scene, this.x, this.y, 'bullet');
        this.bullet.setActive(false);
        this.bullet.setVisible(false);
        this.scene.add.existing(this.bullet);
        this.shootTimer = this.scene.time.addEvent({
            delay: 1250,
            callback: () => {
                this.shoot();
            },
            loop: true
        });
    }
    shoot(){
        this.bullet.setActive(true);
        this.bullet.setVisible(true);
        this.bullet.setPosition(this.x, this.y);
        this.bullet.setRotation(this.rotation);
    }
    update(time, delta) {
        this.bullet.update(time, delta);
    }
}

class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key = "star", frame) {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.scene.physics.add.sprite(this.x, this.y, key);
    }
}
// A class that holls all the Towers
class TowerGroup extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        this.scene = scene;
    }
    add(tower) {
        super.add(tower);
    }
    fireAll(time, delta) {
        this.getChildren().forEach(tower => {
            tower.update(time, delta);
        });
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////

function placeTower(scene, x, y) {
    let tower = new Tower(scene, x, y, 'tower');
    scene.add.existing(tower);
    scene.towers.add(tower);
}
function moveMenu(scene, storeButton, storeMenu, tower1){
    if(MenuIsOpen){
        storeMenu.setPosition(570, 300);
        storeButton.setPosition(745, 0);
        tower1.setPosition(850, 300);
        MenuIsOpen = false;
    }
    else{
        storeMenu.setPosition(400, 300);
        storeButton.setPosition(575, 0);
        tower1.setPosition(676, 158);
        MenuIsOpen = true;
    }
}
//Handeling store economy 
function buyTower(scene){
    console.log("buying tower");
    if(scene.getPlayerMoney() >= 50){
        scene.decrementMoney(50);
        return true;
    }
}
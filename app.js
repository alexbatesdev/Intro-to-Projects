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
        this.load.image('tower1', 'assets/farmer.png');
        this.load.image('tower2', 'assets/sniper.png');
        this.load.image('tower3', 'assets/smg.png');
        this.load.image('range', 'assets/rangeCircle.png');
        this.load.image('smgrange', 'assets/smgcircle.png');
        this.load.image('sniperrange', 'assets/sniperCircle.png');
        
    }    
    create() {
        
        var gameScene = this.scene.get('game');
        var rangeCicleVisable = false;
        //this.add.image(400,300, 'UI');
        
        this.storeMenu = this.add.image(400,300, 'UI');

        this.tower1 = this.add.image(665, 180, 'tower1').setScale(0.15);
        this.towerSniper = this.add.image(755, 163, 'tower2').setScale(0.138);
        this.towerSMG = this.add.image(675, 370, 'tower3').setScale(0.15);

        this.circle =this.add.image(400,300, 'range').setVisible(false);
        this.smgCircle =this.add.image(400,300, 'smgrange').setScale(2).setVisible(false);
        this.sniperCircle =this.add.image(400,300, 'sniperrange').setScale(2).setVisible(false);

        this.storeButton = this.add.text(575, 0, "Shop", { font: "20px Berlin Sans FB Demi", fill: "#FFFFFF" });
        this.storeButton.setInteractive();

        this.tower1.setInteractive();
        this.towerSniper.setInteractive();
        this.towerSMG.setInteractive();

        this.towerSniper.on('pointerdown', function () {
            console.log("you clicked sniper!")
        }, this);
        this.towerSMG.on('pointerdown', function () {
            console.log("you clicked SMG!")
        }, this);

        //drag and drop 
        this.input.setDraggable(this.tower1);
        this.input.setDraggable(this.towerSniper);
        this.input.setDraggable(this.towerSMG);

       

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            
            if(gameObject == this.tower1){
                if(MenuIsOpen == true){
                    this.circle.setVisible(true);
                    moveMenu(this.scene, this.storeButton, this.storeMenu, this.tower1, this.towerSniper, this.towerSMG);
                    gameObject.setScale(.2);
                    gameObject.setRotation(5.5);
                }
            }
            if(gameObject == this.towerSniper){
                if(MenuIsOpen == true){
                    this.sniperCircle.setVisible(true);
                    moveMenu(this.scene, this.storeButton, this.storeMenu, this.tower1, this.towerSniper, this.towerSMG);
                    gameObject.setScale(.2);
                    gameObject.setRotation(5.5);
                }
            }
            if(gameObject == this.towerSMG){
                if(MenuIsOpen == true){
                    this.smgCircle.setVisible(true);
                    moveMenu(this.scene, this.storeButton, this.storeMenu, this.tower1, this.towerSniper, this.towerSMG);
                    gameObject.setScale(.2);
                    gameObject.setRotation(5.5);
                }
            }
            
            this.circle.x = dragX;
            this.circle.y = dragY;
            this.smgCircle.x = dragX;
            this.smgCircle.y = dragY;
            this.sniperCircle.x = dragX;
            this.sniperCircle.y = dragY;
            gameObject.x = dragX;
            gameObject.y = dragY;
           
        },this);
        this.input.on('dragend', function (pointer, gameObject) {
            if(gameObject == this.tower1){
            if(buyTower(gameScene) == true){
            placeTower(gameScene, gameObject.x, gameObject.y);
            }
        }
        if(gameObject == this.towerSniper){
            if(buySniperTower(gameScene) == true){
            placeSniperTower(gameScene, gameObject.x, gameObject.y);
            }
        }
        if(gameObject == this.towerSMG){
            if(buySMGTower(gameScene) == true){
            placeSMGTower(gameScene, gameObject.x, gameObject.y);
            }
        }
           
            this.circle.setVisible(false);
            this.smgCircle.setVisible(false);
            this.sniperCircle.setVisible(false);
            
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
            if(gameObject == this.tower1){
                gameObject.setScale(.15);
                gameObject.setRotation(0);
            }
            if(gameObject == this.towerSniper){
                gameObject.setScale(.138);
                gameObject.setRotation(0);
            }
            if(gameObject == this.towerSMG){
                gameObject.setScale(.15);
                gameObject.setRotation(0);
            }
            
        
            
            if(MenuIsOpen == false){
            moveMenu(this.scene, this.storeButton, this.storeMenu, this.tower1, this.towerSniper, this.towerSMG);
            }
        }, this);

        this.storeButton.on('pointerdown', function(){
            console.log("you clicked shop!")
            moveMenu(this.scene, this.storeButton, this.storeMenu, this.tower1, this.towerSniper, this.towerSMG);
        }, this);
    } 


    
};

class SceneGameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOver'});
    }
    preload(){
        this.load.image('gameOver', 'assets/GameOver.png');
        
    }    
    create() {
        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;
        this.add.image(centerX, centerY, "gameOver").setOrigin(.5, .5);
        // Based on your game size, it may "stretch" and distort.
        //this.background.displayWidth = this.sys.canvas.width;
        //this.background.displayHeight = this.sys.canvas.height;
    } 

};

class SceneGame extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
        this.player = new Player(this);
        this.towers = new TowerGroup(this);
        this.bulletGroup = new Phaser.GameObjects.Group(this);
        this.gameOver = false;
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
        this.load.image('background', 'assets/Untitled_Artwork.png');
        this.load.image("spawner", "assets/spawner.png");
        this.load.image("Egg4", "assets/Egg4.png");
        this.load.image("Egg3", "assets/Egg3.png");
        this.load.image("Egg2", "assets/Egg2.png");
        this.load.image("Egg1", "assets/Egg1.png");

        this.load.image("tower", "assets/farmerCrop.png");
        this.load.image("towerSniper", "assets/sniper.png");
        this.load.image("towerSMG", "assets/smg.png");
        this.load.image("bullet", "assets/star.png");
        this.load.image("shotgun", "assets/ShotGunEgg2.png");
        this.load.image('coin', 'assets/TrumpCoin.png');
        this.load.image('health', 'assets/anatomical-heart.png');
        
        this.load.json('pathJSON', 'assets/path copy 2.json');

        
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

        // this.physics.moveTo(this.npc, 123, 123, 300);
        //Places spawner
        this.spawner = new WaveMachine(this, pathJSON);
        this.spawner.startAutoWaves(3, 2);
        // this.sniper = new SniperTower(this, 300, 300, "tower", );
        // this.smg = new SMGTower(this, 180, 330, "tower", );
        //adds tower group
        // this.towers.add(new Tower(this, 300, 300, "tower", ));
        // this.towers.add(new Tower(this, 400, 350, "tower", ));
        // this.towers.add(new Tower(this, 500, 400, "tower", ));
        // this.physics.moveToObject(this.npc, this.npc2, 300);
        this.background.setInteractive();
        this.background.on('pointerdown', function (pointer) {
            console.log("you clicked the background!")
            let x = pointer.x;
            let y = pointer.y;
            console.log(`${x}, ${y}`);
            console.log(this.player.health);
            console.log(this.player.money);
        }.bind(this));
        
        this.physics.add.overlap(this.bulletGroup, this.spawner.waveGroup.getChildren(),
            function(bullet, troop){
                bullet.destroy();
                if(troop.health > 0){
                    troop.health -= bullet.damage;
                    troop.updateTexture();
                }
                if(troop.health <= 0){
                    troop.destroy();
                    this.incrementMoney(Phaser.Math.Between(2, 5));
                }
            }, 
            null, this);
        //Draws path
        let gfx = this.add.graphics();
        gfx.clear();
        gfx.lineStyle(2, 0xffffff, 1);
        //pathJSON.draw(gfx);
        
        this.gameOver = false;
    }

    update(time, delta) {
        //this.spawner.update(time, delta);
        this.towers.fireAll(time, delta);
        this.plrHealthText.setText(this.player.money);
        this.plrMoneyText.setText(Math.floor(this.player.health));

        
        if (this.player.health <= 0 && !this.gameOver) {
            this.scene.launch('gameOver');
            this.scene.stop('store');
            this.gameOver = true;
        }
    }

    WaveText(prompt, scene) {
        //console.log(scene)
        let waveText = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY, prompt, {
            fontSize: '32px',
            fill: '#f00',
            fontFamily: 'Cursive',
            fontStyle: 'bold'

        });
        waveText.setOrigin(0.5);
        waveText.setDepth(1);
        waveText.setScrollFactor(0);

        this.timer = scene.time.addEvent({
            delay: 2000,
            callback: function () {
                waveText.destroy();
            },
            callbackScope: this.scene,
            loop: false
        });
    }
};

class SceneInstructions extends Phaser.Scene {
    constructor() {
        super({ key: 'howTo' });

    }
    preload() {
        this.load.image('instructions', 'assets/instructions.png');
        console.log("preloaded deez nuts");
        
    }
    create() {
        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;
        this.background = this.add.image(centerX, centerY, "instructions").setOrigin(.5, .5);
        // Based on your game size, it may "stretch" and distort.
        this.background.displayWidth = this.sys.canvas.width;
        this.background.displayHeight = this.sys.canvas.height;
        

        
        //CREATING HOW TO PLAY BUTTON
        const backButton = this.add.text(25, 25, "Back", { font: "24px Arial", fill: "#000", backgroundColor: "#f00", padding: 10 });
        backButton.setInteractive();
        backButton.on('pointerdown', function () {
            console.log("you clicked Back!")
            this.scene.start('mainMenu'); //SENDS YOU TO HOWTO SCENE
        }, this);



        const startButton = this.add.text(710, 25, "Play", { font: "24px Arial", fill: "#000", backgroundColor: "#0f0", padding: 10 });
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
    scene: [SceneBoot, SceneMainMenu, SceneGame, SceneInstructions, SceneStore, SceneGameOver],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

var game = new Phaser.Game(config);

// ////////////////////////////////////////////////////////////////////////////////////////////////

class Troop extends Phaser.GameObjects.PathFollower {
    
    constructor(scene, path, health,  x = -50, y = -50) { //TODO: CALC THE START OF THE PATH AND SPAWN THERE
        super(scene, path, x, y, 'Egg4');
        this.scene = scene;
        this.path = path;
        this.health = health;
        this.speed = Phaser.Math.GetSpeed(0, 1);
        this.setScale(.1);
        this.bloonConfig = {
            positionOnPath: true,
            duration: 60 * 1000,
            repeat: 0,
            yoyo: false,
            rotateToPath: false,
            verticalAdjust: true,
            onComplete: this.complete,
            onCompleteScope: this,
            onCompleteParams: [this.scene]
        };
        super.startFollow(this.bloonConfig);
    }

    complete(tween, targets, scene) {
        // console.log("troop got in");
        // console.log(this);
        this.destroy();
        if(this.health > 0) {
            scene.decrementHealth(this.health);
        }
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

    updateTexture() {
        switch (Math.floor(this.health)) {
            case 1:
                this.setTexture("Egg1");
                break;
            case 2:
                this.setTexture("Egg2");
                break;
            case 3:
                this.setTexture("Egg3");
                break;
            case 4:
                this.setTexture("Egg4");
                break;
            default:
                this.setTexture("Egg4");
                break;
        }
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
        this.roundNum = 1;
    }

    startWave(roundNum, delaySec, quantity = this.roundCalc(roundNum)) {
        console.log(`Starting wave ${roundNum} with ${quantity} bloons`);
        let prompt = `Starting wave ${roundNum} with ${quantity} bloons`;
        this.scene.WaveText(prompt, this.scene);
        this.inProgress = true;
        this.timer = this.scene.time.addEvent({
            delay: this.delayCalc(roundNum),
            callback: () => {

                // console.log(this.scene)
                let health = this.healthCalc(roundNum);

                let troop = new Troop(this.scene, this.path, health);
                this.scene.physics.add.existing(troop);
                troop.body.setCircle(troop.width / 2);
                this.scene.add.existing(troop);
                this.scene.physics.add.existing(troop);
                this.waveGroup.add(troop);
                //console.log('Spawned a troop');


                if (this.timer.repeatCount === 0) {
                    this.inProgress = false;

                    
                    
                    if (this.isAuto) {
                        // wait for set amount of seconds after the timer finishes before starting the next wave
                        this.scene.time.addEvent({
                            delay: this.secBetweenWaves * 1000,
                            callback: () => {
                                this.startWave(roundNum + 1, this.delayCalc(roundNum));
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
    
    healthCalc(n) {
        let xMath = Math.floor(Phaser.Math.Between(0, 10) + (n * .3));
        
            if (xMath < 5) return 1;
            else if (5 <= xMath && xMath <= 8) return 2;
            else if (8 < xMath && xMath < 10) return 3;
            else if (xMath >= 10) return 4;
    }

    delayCalc(n) {
        let startDelayMilli = 2000;
        startDelayMilli -= ((n - 1) * 250);
        return Phaser.Math.Clamp(startDelayMilli, 100, 2000);
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

        this.money = 50;
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

class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key = "bullet", frame) {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.damage = 1;
        this.time = 0;
        this.setScale(.5);
        this.speed = Phaser.Math.GetSpeed(0,0.1);
        this.setRotation(Phaser.Math.Between(0, 360));
        this.setActive(true);
        this.setVisible(true);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }

    move(target) {
        if (!target) {
        } else {
            this.body.x = this.x;
            this.body.y = this.y;
            //shift the position of the target ever so slightly
            this.scene.physics.moveToObject(this, target, this.time);
        }
    }
    update(time, delta) {
        // this.x += this.speed * delta;
        // if (this.x > this.scene.sys.canvas.width) {
        //     this.setActive(false);
        //     this.setVisible(false);
        // }
    }
}


// A tower class that can shoot bullets to any nearby troops
// Tower can shoot any troop on the scence within a certain range
// Tower will detect if there is a troop nearby and will shoot at it
// Tower will only shoot at one troop at a time
class Tower extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key = "shotgun", frame);
        this.scene = scene;
        this.setScale(.2);
        this.range = 100;
        this.setActive(true);
        this.setVisible(true);
        this.scene.add.existing(this);
        this.bulletSpeed = Phaser.Math.GetSpeed(400, 1);
        this.bullet = new Bullet(this.scene, this.x, this.y, 'bullet');
        this.bullet.setActive(false);
        this.bullet.setVisible(false);
        this.scene.add.existing(this.bullet);
        this.shootTimer = this.scene.time.addEvent({
            delay: 750,
            callback: () => {
                this.shoot();
            },
            loop: true
        });
    }
    shoot(){
        this.target = this.findTarget();
        if(this.target){
            this.bullet = new Bullet(this.scene, this.x, this.y, 'bullet');
            this.scene.bulletGroup.add(this.bullet);
            this.bullet.time = 250;
            this.bullet.damage = 2;
            this.bullet.move(this.target);
            // this.setAngle(Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y) - 80);
            this.setRotation(Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y) + 90);
        }
    }
    findTarget() {
        if(this.scene.spawner.waveGroup.getChildren().size <= 0){
            console.log('No troops in wave group');
            return 
        }
        else{
            let targets = this.scene.spawner.waveGroup.getChildren();
            let target = targets[0];
            targets.forEach(tar => {
                //find the distance between the tower and the target
                let dist = Phaser.Math.Distance.Between(this.x, this.y, tar.x, tar.y);
                if (dist < Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y)) {
                    target = tar;
                }
            });
            if(target){
                if(Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <= this.range){
                    return target;
                }
            }
            else{
                console.log("No target");
                return; 
            }
        }

    }
    update(time, delta) {
        this.bullet.update(time, delta);
    }
}
class SniperTower extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.setScale(.2);
        this.range = 800;
        this.damage  = 2;
        this.setActive(true);
        this.setVisible(true);
        this.scene.add.existing(this);
        this.bulletSpeed = Phaser.Math.GetSpeed(1500, .25);
        this.bullet = new Bullet(this.scene, this.x, this.y, 'bullet');
        this.bullet.setActive(false);
        this.bullet.setVisible(false);
        this.scene.add.existing(this.bullet);
        this.shootTimer = this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                this.shoot();
            },
            loop: true
        });
    }
    shoot(){
        // this.physics.add.existing(this.npc);
        // this.physics.moveTo(this.npc, 500, 300, 300, 2000);
        this.target = this.findTarget();
        if(this.target){
            this.bullet = new Bullet(this.scene, this.x, this.y, 'bullet');
            this.scene.bulletGroup.add(this.bullet);
            this.bullet.time = 600;
            this.bullet.damage = 5;
            this.bullet.move(this.target);
            // this.setAngle(Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y) - 80);
            this.setRotation(Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y) + 90);
        }
    }
    findTarget() {
        if(this.scene.spawner.waveGroup.getChildren().size <= 0){
            console.log('No troops in wave group');
            return 
        }
        else{
            let targets = this.scene.spawner.waveGroup.getChildren();
            let target = targets[0];
            targets.forEach(tar => {
                //find the distance between the tower and the target
                let dist = Phaser.Math.Distance.Between(this.x, this.y, tar.x, tar.y);
                if (dist < Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y)) {
                    target = tar;
                }
            });
            if(target){
                if(Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <= this.range){
                    return target;
                }
            }
            else{
                console.log("No target");
                return; 
            }
        }

    }
    update(time, delta) {
        this.bullet.update(time, delta);
    }
}

class SMGTower extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.setScale(.2);
        this.range = 350;
        this.damage = 2;
        this.setActive(true);
        this.setVisible(true);
        this.scene.add.existing(this);
        this.bulletSpeed = Phaser.Math.GetSpeed(1500, .25);
        this.bullet = new Bullet(this.scene, this.x, this.y, 'bullet');
        this.bullet.setActive(false);
        this.bullet.setVisible(false);
        this.scene.add.existing(this.bullet);
        this.shootTimer = this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                this.shoot();
            },
            loop: true
        });
    }
    shoot(){
        // this.physics.add.existing(this.npc);
        // this.physics.moveTo(this.npc, 500, 300, 300, 2000);
        this.target = this.findTarget();
        if(this.target){
            this.bullet = new Bullet(this.scene, this.x, this.y, 'bullet');
            this.scene.bulletGroup.add(this.bullet);
            this.bullet.time = 300;
            this.bullet.damage = .3;
            let tar = {
                x: Phaser.Math.Between(this.target.x - 20, this.target.x + 20),
                y: Phaser.Math.Between(this.target.y - 20, this.target.y + 20)
            }
            this.bullet.move(tar);
            // this.setAngle(Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y) - 80);
            this.setAngle(Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y) - 140);
        }
    }
    findTarget() {
        if(this.scene.spawner.waveGroup.getChildren().size <= 0){
            console.log('No troops in wave group');
            return 
        }
        else{
            let targets = this.scene.spawner.waveGroup.getChildren();
            let target = targets[0];
            targets.forEach(tar => {
                //find the distance between the tower and the target
                let dist = Phaser.Math.Distance.Between(this.x, this.y, tar.x, tar.y);
                if (dist < Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y)) {
                    target = tar;
                }
            });

            if(target != null){
                if(Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <= this.range){
                    return target;
                }
            }
            else{
                console.log("No target");
                return; 
            }
        }

    }
    update(time, delta) {
        this.bullet.update(time, delta);
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
function placeSniperTower(scene, x, y) {
    let tower = new SniperTower(scene, x, y, 'towerSniper');
    scene.add.existing(tower);
    scene.towers.add(tower);
}
function placeSMGTower(scene, x, y) {
    let tower = new SMGTower(scene, x, y, 'towerSMG');
    scene.add.existing(tower);
    scene.towers.add(tower);
}
function moveMenu(scene, storeButton, storeMenu, tower1, towerSniper, towerSMG){
    if(MenuIsOpen){
        storeMenu.setPosition(570, 300);
        storeButton.setPosition(745, 0);
        tower1.setPosition(850, 300);
        towerSniper.setPosition(850, 400);
        towerSMG.setPosition(850, 395);

        MenuIsOpen = false;
    }
    else{
        storeMenu.setPosition(400, 300);
        storeButton.setPosition(575, 0);
        tower1.setPosition(665, 180);
        towerSniper.setPosition(755, 163);
        towerSMG.setPosition(675, 370);
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
function buySniperTower(scene){
    console.log("buying sniper tower");
    if(scene.getPlayerMoney() >= 100){
        scene.decrementMoney(100);
        return true;
    }
}
function buySMGTower(scene){
    console.log("buying smg tower");
    if(scene.getPlayerMoney() >= 75){
        scene.decrementMoney(75);
        return true;
    }
}
class BootScene extends Phaser.Scene{
    constructor(){
        super({key: 'BootScene'});
    }

    preload(){
        this.load.image("nave", "assets/nave.png");
        this.load.image("life", "assets/hp.png");
        this.load.image("bullet", "assets/bullet.png");
        this.load.image("planet", "assets/planet.png");
        this.load.image("space", "assets/space.png");
        this.load.spritesheet("asteroidB", "assets/a-big.png", {
            frameWidth: 64, frameHeight: 64
        });
        this.load.spritesheet("asteroidM", "assets/a-med.png", {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet("asteroidS", "assets/a-sml.png", {
            frameWidth: 16, frameHeight: 16
        });
        this.load.spritesheet("explosion", "assets/explosion.png", {
            frameWidth: 96, frameHeight: 96
        });this.load.spritesheet("explosion", "assets/explosion.png", {
            frameWidth: 96, frameHeight: 96
        });
        this.load.audio('somlaser', "assets/laser.wav");
        this.load.audio('somexplosao', "assets/explosionnoise.wav");
        this.load.audio('hit', "assets/normalhit.mp3");
        this.load.audio('deadhit', "assets/deadhit.wav");
        this.load.audio('respawn', "assets/respawn.wav");
    }

    create(){
        this.anims.create({
            key: 'rotateB',
            frames: this.anims.generateFrameNumbers('asteroidB', { start: 0, end: 6}),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'rotateM',
            frames: this.anims.generateFrameNumbers('asteroidM', { start: 0, end: 6}),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'rotateS',
            frames: this.anims.generateFrameNumbers('asteroidS', { start: 0, end: 6}),
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 10}),
            frameRate: 11
        });

        this.scene.start("GameScene");
    }
}
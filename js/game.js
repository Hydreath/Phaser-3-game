let config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1000,
    height: 1000,
    autoresize: true,
    physics:{
        default: 'arcade',
        arcade:{
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [
        BootScene, GameScene
    ]
};

let game = new Phaser.Game(config);
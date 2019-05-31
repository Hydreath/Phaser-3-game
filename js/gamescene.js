class GameScene extends Phaser.Scene{
    constructor(){
        super({key:"GameScene"});
    }

    preload(){
    }

    create(){
        //Fontes
        this.fontS = {font: "36px Arial", fill: "#FFF"};
        this.fontL = {font: "96px Arial", fill: "#FFF"};


        //Space
        this.space = this.add.tileSprite(0,0, this.sys.game.config.width, this.sys.game.config.height, 'space');
        this.space.setOrigin(0,0);

        //Planet
        this.planet = this.physics.add.image(500,500, 'planet');
        this.planetMaxResources = 100;
        this.planetCurrentResources = this.planetMaxResources;

        //Player
        this.player = this.physics.add.image(500, 500, 'nave');
        this.player.setDamping(true);
        this.player.setDrag(0.99);
        this.player.setMaxVelocity(200);
        this.player.setOrigin(0.5, 0.5);
        this.inputs = this.input.keyboard.createCursorKeys();
        this.canFire = true;
        this.playerIsDead = false;
        this.playerMaxLife = 3;
        this.playerCurrentLife = 3;
        this.playerCanTakeDmg = true;
        this.score = 0;
        this.score = 0;

        this.fireTimer =this.time.addEvent({
            delay: 200,
            callback: this.activateFire,
            callbackScope: this,
            loop: true
        });

        //HP
        this.hp = this.add.group({
            key: 'life',
            repeat: this.playerCurrentLife-1,
            setXY:{
                x: 25, y: 150, stepX: 30
            }
        });

        //Bullets
        this.bullets = this.physics.add.group({
            key: 'bullet',
            repeat: 30,
            active: false,
            max: -1
        });
        this.bullets.enableBody = true;

        //AsteroidsBig
        this.bigAsteroids = this.physics.add.group({max:10});
        this.bigAsteroids.enableBody = true;

        this.spawnTimer =this.time.addEvent({
            delay: 2000,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });
        this.physics.add.overlap(this.bullets, this.bigAsteroids, this.bulletHitBigAsteroid, null, this);
        this.physics.add.overlap(this.player, this.bigAsteroids, this.playerHit, null, this);

        this.physics.add.overlap(this.bigAsteroids, this.planet, this.bigAsteroidHit, null, this);

        //AsteroidsMedium
        this.medAsteroids = this.physics.add.group();
        this.medAsteroids.enableBody = true;
        this.physics.add.overlap(this.bullets, this.medAsteroids, this.bulletHitMedAsteroid, null, this);
        this.physics.add.overlap(this.player, this.medAsteroids, this.playerHit, null, this);

        this.physics.add.overlap(this.medAsteroids, this.planet, this.mediumAsteroidHit, null, this);

        //AsteroidsSmall
        this.smlAsteroids = this.physics.add.group();
        this.smlAsteroids.enableBody = true;
        this.physics.add.overlap(this.bullets, this.smlAsteroids, this.bulletHitSmlAsteroid, null, this);
        this.physics.add.overlap(this.player, this.smlAsteroids, this.playerHit, null, this);

        this.physics.add.overlap(this.smlAsteroids, this.planet, this.smallAsteroidHit, null, this);

        //Explosion pool
        this.explosions = this.add.group();
        this.explosions.createMultiple(30, "explosion");

        //Texto
        this.textLabelResources = this.add.text(10,10, "Resources:" , this.fontS);
        this.textResources = this.add.text(10,50, this.planetCurrentResources + "%", this.fontS);
        this.textLife = this.add.text(10,95, "Life:", this.fontS);
        this.textLabelScore = this.add.text(10,170, "Score:" , this.fontS);
        this.textScore = this.add.text(10,210, this.score + "%", this.fontS);
        this.textInfo = this.add.text(500,500, "RESPAWNING...", this.fontL);
        this.textInfo.setOrigin(0.5, 0.5);
        this.textInfo.updateText();
        this.textInfo.visible = false;
    }

    update(){
        this.textResources.setText(this.planetCurrentResources + "%");
        this.textScore.setText(this.score);
        this.space.tilePositionX += 0.1;
        this.bullets.children.iterate(this.offScreenKill);
        this.bigAsteroids.children.iterate(this.screenWrap);
        this.medAsteroids.children.iterate(this.screenWrap);
        this.smlAsteroids.children.iterate(this.screenWrap);
        this.screenWrap(this.player);

        this.planet.angle += 0.05;

        if(this.playerCurrentLife <= 0){
            this.startPlayerRespawn();
        }

        if(this.playerIsDead){

        }

        if (this.inputs.up.isDown)
        {
            this.physics.velocityFromRotation(this.player.rotation, 200, this.player.body.acceleration);
        }
        else
        {
            this.player.setAcceleration(0);
        }

        if (this.inputs.left.isDown)
        {
            this.player.setAngularVelocity(-300);
        }
        else if (this.inputs.right.isDown)
        {
            this.player.setAngularVelocity(300);
        }
        else
        {
            this.player.setAngularVelocity(0);
        }

        if(this.inputs.space.isDown){
            this.fireBullet();
        }
    }

    fireBullet(){
        if(this.canFire && !this.playerIsDead) {
            var bullet = this.bullets.getFirstDead();
            if (bullet) {
                bullet.active = true;
                bullet.rotation = this.player.rotation;
                bullet.body.x = this.player.x;
                bullet.body.y = this.player.y;
                bullet.body.setVelocityX(Math.cos(this.player.rotation) * 400);
                bullet.body.setVelocityY(Math.sin(this.player.rotation) * 400);
                this.canFire = false;
                this.sound.play("somlaser");
            }
        }
    }

    activateFire(){
        this.canFire = true;
    }

    screenWrap (sprite) {
        if (sprite.body.x < 0)
        {
            sprite.body.x = 1000;
        }
        else if (sprite.body.x > 1000)
        {
            sprite.body.x = 0;
        }

        if (sprite.body.y < 0)
        {
            sprite.body.y = 1000;
        }
        else if (sprite.body.y > 1000)
        {
            sprite.body.y = 0;
        }
    }

    spawnAsteroid(){
        var asteroid;
        if(Phaser.Math.Between(0,1) === 0 && this.bigAsteroids.getTotalFree() !== 0){
            asteroid = new Asteroid(this, Phaser.Math.Between(0,1)*1000, Phaser.Math.Between(0, 1000))
        }else{
            asteroid = new Asteroid(this, Phaser.Math.Between(0,1)*1000, Phaser.Math.Between(0, 1000))
        }
        this.bigAsteroids.add(asteroid);
        asteroid.body.setVelocity(Phaser.Math.Between(-100,100), Phaser.Math.Between(-100,100));
    }

    playerHit(){
        if(this.playerCanTakeDmg) {
            this.sound.play("hit");
            this.hp.getChildren()[this.playerCurrentLife-1].visible = false;
            this.cameras.main.shake(25);
            this.playerCurrentLife--;
            this.playerCanTakeDmg = false;
            this.dmgTime = this.time.addEvent({
                delay: 1000,
                callback: this.resetDmg,
                callbackScope: this,
                loop: false
            });
        }
    }

    resetDmg(){
        this.playerCanTakeDmg = true;
    }

    bulletHitBigAsteroid(bullet, asteroid){
        if(bullet.active) {
            this.bigAsteroids.remove(asteroid);
            bullet.active = false;
            this.sound.play("somexplosao");
            var explosion = this.explosions.getFirstDead(true, asteroid.x, asteroid.y, "explosion");
            explosion.play("explode");
            explosion.on('animationcomplete', ()=>{
               explosion.destroy();
            });
            var newast1 = this.medAsteroids.create(asteroid.x, asteroid.y, 'asteroidM');
            var newast2 = this.medAsteroids.create(asteroid.x, asteroid.y, 'asteroidM');
            newast1.play('rotateM');
            newast2.play('rotateM');
            var point1 = new Phaser.Geom.Point(asteroid.body.velocity.x, asteroid.body.velocity.y);
            var point2 = new Phaser.Geom.Point(asteroid.body.velocity.x, asteroid.body.velocity.y);
            var rot1 = Phaser.Math.Rotate(point1, -3.1415/4);
            var rot2 = Phaser.Math.Rotate(point2, 3.1415/4);
            newast1.body.setVelocity(rot1.x, rot1.y);
            newast2.body.setVelocity(rot2.x, rot2.y);
            asteroid.destroy();

            this.score+=200;
        }
    }

    bulletHitMedAsteroid(bullet, asteroid){
        if(bullet.active && asteroid !== null) {
            this.medAsteroids.remove(asteroid);
            bullet.active = false;
            this.sound.play("somexplosao");
            var explosion = this.explosions.getFirstDead(true, asteroid.x, asteroid.y, "explosion");
            explosion.play("explode");
            explosion.on('animationcomplete', ()=>{
                explosion.destroy();
            });
            var newast1 = this.smlAsteroids.create(asteroid.x, asteroid.y, 'asteroidS');
            var newast2 = this.smlAsteroids.create(asteroid.x, asteroid.y, 'asteroidS');
            newast1.play('rotateS');
            newast2.play('rotateS');
            var point1 = new Phaser.Geom.Point(asteroid.body.velocity.x, asteroid.body.velocity.y);
            var point2 = new Phaser.Geom.Point(asteroid.body.velocity.x, asteroid.body.velocity.y);
            var rot1 = Phaser.Math.Rotate(point1, -3.1415/4);
            var rot2 = Phaser.Math.Rotate(point2, 3.1415/4);
            newast1.body.setVelocity(rot1.x, rot1.y);
            newast2.body.setVelocity(rot2.x, rot2.y);
            asteroid.destroy();

            this.score += 400;
        }
    }

    bulletHitSmlAsteroid(bullet, asteroid){
        if(bullet.active && asteroid !== null) {
            this.medAsteroids.remove(asteroid);
            bullet.active = false;
            this.sound.play("somexplosao");
            var explosion = this.explosions.getFirstDead(true, asteroid.x, asteroid.y, "explosion");
            explosion.play("explode");
            explosion.on('animationcomplete', ()=>{
                explosion.destroy();
            });
            asteroid.destroy();

            this.score += 800;
        }
    }

    offScreenKill(bullet){
        if(bullet.active && (bullet.body.x > 1000 || bullet.body.x < 0 || bullet.body.y > 1000 || bullet.body.y < 0))
            bullet.active = false;
    }

    bigAsteroidHit(planet, asteroid){
        if(asteroid != null && planet != null){
            this.planetCurrentResources -=3;
            this.sound.play("somexplosao");
            var explosion = this.explosions.getFirstDead(true, asteroid.x, asteroid.y, "explosion");
            explosion.play("explode");
            explosion.on('animationcomplete', ()=>{
                explosion.destroy();
            });
            asteroid.destroy();
            this.cameras.main.shake(50);
        }
    }

    smallAsteroidHit(planet, asteroid){
        if(asteroid != null && planet != null){
            this.planetCurrentResources -=1;
            this.sound.play("somexplosao");
            var explosion = this.explosions.getFirstDead(true, asteroid.x, asteroid.y, "explosion");
            explosion.play("explode");
            explosion.on('animationcomplete', ()=>{
                explosion.destroy();
            });
            asteroid.destroy();
            this.cameras.main.shake(75);
        }
    }

    mediumAsteroidHit(planet, asteroid){
        if(asteroid != null && planet != null){
            this.planetCurrentResources -=2;
            this.sound.play("somexplosao");
            var explosion = this.explosions.getFirstDead(true, asteroid.x, asteroid.y, "explosion");
            explosion.play("explode");
            explosion.on('animationcomplete', ()=>{
                explosion.destroy();
            });
            asteroid.destroy();
            this.cameras.main.shake(100);
        }
    }

    startPlayerRespawn(){
        this.textInfo.visible = true;
        this.playerIsDead =true;
        this.sound.play("deadhit");
        var explosion = this.explosions.getFirstDead(true, this.player.x, this.player.y, "explosion");
        var sound = explosion.play("explode");
        explosion.on('animationcomplete', ()=>{
            explosion.destroy();
        });
        this.player.disableBody(true,true);
        this.playerCurrentLife = this.playerMaxLife;
        var respTimer = this.time.addEvent({
            delay: 2000,
            callback: this.respawnPlayer,
            callbackScope: this,
            loop: false
        });
    }

    respawnPlayer(){
        this.textInfo.visible = false;
        this.sound.play("respawn");
        this.hp.children.iterate((child)=> child.visible = true);
        this.player.enableBody(true, 500, 500);
        this.player.visible = true;
        this.player.active = true;
        this.planetCurrentResources -= 15;
        this.playerIsDead = false;
    }
}
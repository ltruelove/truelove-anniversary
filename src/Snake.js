MainGame.Snake = function(game, xPos, yPos) {
    this.animFrameCount = 8;
    this.atlasName = 'snake';
    this.atlasPosition = 12;
    this.animFrames = 10;
    this.snakeLeft = true;
    this.name = null;

    Phaser.Sprite.call(this, game, xPos, yPos, this.atlasName, this.atlasPosition);
    game.add.existing(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
};

// set-up the "class" to inherit from 'SomeBaseClass'
MainGame.Snake.prototype = Object.create(Phaser.Sprite.prototype);
// re-set the constructor (so it's not just an alias for 'SomeBaseClass')
MainGame.Snake.prototype.constructor = MainGame.Snake;

    MainGame.Snake.prototype.animateSnake = function (){
        this.body.collideWorldBounds = true;
        this.animFrames = Phaser.Animation.generateFrameNames('snake_walk', 1, 3, '.png', 2);
        this.animations.add('snakewalk',this.animFrames, this.animFrameCount ,true);
        this.anchor.setTo(.5,0);
        this.animations.play('snakewalk',this.aniimFrames,true);
    };

    MainGame.Snake.prototype.update = function() {
        this.body.velocity.x = 0;
        
        //if(this.body.touching.down && this.alive){
            if(this.position.x - ((this.body.width / 2) + 1) <= this.game.world.bounds.x){
                this.snakeLeft = false;
            }

            if(this.position.x >= this.game.world.bounds.right - ((this.body.width / 2) + 1)){
                this.snakeLeft = true;
            }

            if(this.snakeLeft == true){
                //snake moves left
                this.body.velocity.x = -50;
                this.scale.x = +1;
            }else{
                //snake moves right
                this.body.velocity.x = +50;
                this.scale.x = -1;
            }
        //}
        this.animations.play('snakewalk', this.animFrameCount, true);
    };


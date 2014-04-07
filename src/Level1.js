MainGame.BunnyGame = function(game) {
    this.game = game;
    this.playerSprite = null;
    this.goalSprite = null;
    this.map = null;
    this.tileset = null;
    this.layer = null;
    this.cursors = null;
    this.tileWidth = 70;
    this.tileHeight = 70;
    this.tilesWide = 20;
    this.tilesHigh = 52;
    this.music = null;
    this.background = null;
    this.leftButton = null;
    this.rightButton = null;
    this.jumpButton = null;
    this.walkFrames = null;
    this.playerAnimFrames = 15;
    this.slime = null;
    this.slimegroup = null;
    this.isDefeated = false;
    this.timer = null;
    this.ring1 = null;
    this.ring2 = null;
};

MainGame.BunnyGame.prototype = {
    preload: function(){
        this.game.load.atlasJSONHash("levi", "/assets/sprites/levi_spritesheet.png","/assets/sprites/levi_spritesheet.json");
        this.game.load.tilemap("platforms", "/assets/tilemaps/level1.json", null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image("land", "/assets/tilemaps/tiles_spritesheet.png");
        this.game.load.image('ring1', '/assets/sprites/ring1.png');
        this.game.load.image('ring2', '/assets/sprites/ring2.png');
        //game.load.audio('music', ['/resources/L1Audio.mp3']);
        this.game.load.image('L1BG', '/assets/img/level1bg.png');
        this.game.load.image('speech', '/assets/sprites/speech_bubble.png');
        //this.game.load.atlas("enemies", "/resources/enemies.png",
        //"/resources/enemies.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.game.load.atlasJSONHash("snake", "/assets/sprites/snake.png","/assets/sprites/snake.json");
    },
    
    create: function() {
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.map = this.game.add.tilemap("platforms");
        this.game.stage.backgroundColor = '#000';
        this.background = this.game.add.tileSprite(0, 0, 1400, 3640, "L1BG");
        this.map.addTilesetImage('sheet','land');
    
        // now we need to create a game layer, and assign it a tile set and a map
        this.layer = this.map.createLayer('Tile Layer 1');

        this.map.setCollisionByExclusion([]);

        this.layer.resizeWorld();
    
        //add the goal sprite
        this.goalSprite = this.game.add.sprite((this.tilesWide - 1) * this.tileWidth,
                                               this.tileHeight * 2,'levi');
        this.game.physics.enable(this.goalSprite, Phaser.Physics.ARCADE);
        this.goalSprite.name = 'goal';
        this.goalSprite.body.immovable = true;

        //this.music = game.add.audio('music');
        //this.music.play();

        //create an array of objects containing slime positions
        var snakeSpots = [{x: 6, y: 46},
                         {x: 13, y: 43},
                         {x: 3, y: 38},
                         {x: 17, y: 31},
                         {x: 6, y: 32},
                         {x: 19, y: 27},
                         {x: 12, y: 23},
                         {x: 1, y: 22},
                         {x: 14, y: 4},
                         {x: 19, y: 4}];
        
        //add a group of test enemies
        this.snakeGroup = this.game.add.group();
        for(var i = 0; i < 10; i++){
            var snakePos = snakeSpots[i];
            
            var snake = this.game.add.sprite(snakePos.x * this.tileWidth, snakePos.y * this.tileHeight,'snake');
            this.game.physics.enable(snake, Phaser.Physics.ARCADE);
            snake.body.collideWorldBounds = true;

            var walkFrames = Phaser.Animation.generateFrameNames('snake_walk', 1, 3, '.png', 2);
            snake.animations.add('walk', this.walkFrames, 10 ,true);
            snake.animations.play('walk',10,true);

            snake.name = 'snake' + i;
            this.snakeGroup.add(snake);
        }

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.physics.arcade.gravity.y = 1400;
        
        this.playerSprite = new MainGame.Player(this.game, 10, 3300, this.cursors);
        this.playerSprite.body.velocity.setTo(0,0);
        this.playerSprite.animatePlayer();

        //setting the bounds of the entire level
        this.game.world.setBounds(0,0,this.tilesWide*this.tileWidth,this.tilesHigh*this.tileHeight); 

        //bounds lets us set the camera to follow the character
        this.game.camera.follow(this.playerSprite); 
    },
    
    update: function(){
        //make the player collide with the world
        this.game.physics.arcade.collide(this.snakeGroup, this.layer);
        this.game.physics.arcade.collide(this.playerSprite, this.layer);
        this.game.physics.arcade.collide(this.goalSprite, this.layer);
        //this.snakeGroup.forEach(this.snakeUpdate, this);

        //make the test enemy collide with the world
        //this.game.physics.collide(this.slime, this.layer);
        //this.game.physics.collide(this.playerSprite, this.slimeGroup, this.slimePlayerCollision, null, this);
        //this.slimeGroup.callAll('update',null);

        //handle the collision of the player and the goal
        this.game.physics.arcade.collide(this.playerSprite, this.goalSprite, this.goalCollision, null, this);

        // are we moving left?
        if (this.cursors.left.isDown){
            if(this.playerSprite.position.x > 0 && this.game.camera.view.x > 0){
                this.background.tilePosition.x += .1;
            }
        }
        // are we moving right?
        if (this.cursors.right.isDown){
            if(this.playerSprite.position.x < (this.tileWidth * this.tilesWide - this.width)){
                this.background.tilePosition.x -= .1;
            }
        }

        this.playerSprite.updatePlayer();
    },

    render: function(){
        //this.game.debug.body(this.playerSprite);
        //this.game.debug.spriteInfo(this.playerSprite, 20, 32);

    },

    goalCollision: function(player, goal){
        if(!this.isDefeated){
            this.isDefeated = true;
            this.speechBubble = this.game.add.sprite((this.tilesWide - 3) * this.tileWidth,
                                                   this.tileHeight * 2,'speech');
            this.speechBubble.name = 'speechBubble';
            this.game.physics.enable(this.speechBubble, Phaser.Physics.ARCADE);
            this.speechBubble.body.allowGravity = false;

            var text = game.add.text((this.tilesWide - 3) * this.tileWidth + 5,
                2 * this.tileHeight + 5,
                "I've had a pretty great year.\nBut there's one thing that\nwould make it better.",
                {
                    font: "15px Arial",
                    fill: "#000",
                    align: "left"
                });

            this.timer = this.game.time.create(false);
            this.timer.add(2000,this.showRing1,this);
            this.timer.start();
        }

    },

    showRing1: function(){
        this.ring1 = this.game.add.sprite(this.game.camera.x,this.game.camera.y,'ring1');
        this.ring2 = this.game.add.sprite(this.game.camera.x,this.game.camera.y,'ring2');
        this.ring2.alpha = 0;

        this.timer.add(2500,this.showRing2,this);
        this.timer.start();
    },

    showRing2: function(){
        this.game.add.tween(this.ring2).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    },

    nextLevel: function(){
        this.game.state.start('level2');
    },

    snakeUpdate: function(snake){
        this.game.debug.body(this.snakeGroup);
        //this.game.physics.arcade.collide(snake,this.layer);
    },

    slimePlayerCollision: function(bunny, slime){
        //player dies and starts level over
        if(bunny.body.touching.down && slime.body.touching.up){
            //kill the enemy
            //this.slimeGroup.remove(slime);
            slime.squish();
            bunny.body.velocity.y = -350;
            bunny.animations.stop('walk');
            bunny.animations.play('jump',this.playerAnimFrames,true);
        }else{
            bunny.hurtCount = 30;
            if(bunny.body.touching.left && slime.body.touching.right){
                bunny.body.velocity.y = -450;
                bunny.body.velocity.x = 300;
                bunny.animations.stop('walk');
                bunny.animations.play('hurt',this.playerAnimFrames,true);
            }else if(bunny.body.touching.right && slime.body.touching.left){
                bunny.body.velocity.y = -450;
                bunny.body.velocity.x = -300;
                bunny.animations.stop('walk');
                bunny.animations.play('hurt',this.playerAnimFrames,true);
            }else if(bunny.body.touching.up && slime.body.touching.down){
                bunny.body.velocity.y = -450;
                bunny.body.velocity.x = 300;
                bunny.animations.stop('walk');
                bunny.animations.play('hurt',this.playerAnimFrames,true);
            }
        }
    }
}



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
        var snakeSpots = [{x: 6, y: 44},
                         {x: 13, y: 43},
                         {x: 3, y: 38},
                         {x: 17, y: 31},
                         {x: 6, y: 32},
                         {x: 19, y: 27},
                         {x: 12, y: 23},
                         {x: 1, y: 22},
                         {x: 14, y: 4},
                         {x: 19, y: 4}];
        
        //add a group of enemies
        this.snakeGroup = this.game.add.group();
        for(var i = 0; i < 10; i++){
            var snakePos = snakeSpots[i];
            
            var snake = new MainGame.Snake(this.game, snakePos.x * this.tileWidth, snakePos.y * this.tileHeight);
            snake.body.velocity.setTo(0,0);
            snake.animateSnake();
            snake.name = 'snake' + i;
            this.snakeGroup.add(snake);
        }

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.physics.arcade.gravity.y = 1400;
        
        //add the player
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

        //handle the collision of the player and a snake
        this.game.physics.arcade.collide(this.playerSprite, this.snakeGroup, this.snakePlayerCollision, null, this);

        //handle the collision of the player and the goal
        this.game.physics.arcade.collide(this.playerSprite, this.goalSprite, this.goalCollision, null, this);

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

    snakePlayerCollision: function(player, snake){
        //player dies and starts level over
        if(player.body.touching.down && snake.body.touching.up){
            //kill the enemy
            snake.kill();
            //snake.squish();
            player.body.velocity.y = -350;
            player.animations.stop('walk');
            player.animations.play('jump',player.animFrameCount,true);
        }else{
            player.hurtCount = 30;
            if(player.body.touching.left && snake.body.touching.right){
                player.body.velocity.y = -450;
                player.body.velocity.x = 300;
                player.animations.stop('walk');
                player.animations.play('hurt',this.playerAnimFrames,true);
            }else if(player.body.touching.right && snake.body.touching.left){
                player.body.velocity.y = -450;
                player.body.velocity.x = -300;
                player.animations.stop('walk');
                player.animations.play('hurt',this.playerAnimFrames,true);
            }else if(player.body.touching.up && snake.body.touching.down){
                player.body.velocity.y = -450;
                player.body.velocity.x = 300;
                player.animations.stop('walk');
                player.animations.play('hurt',this.playerAnimFrames,true);
            }
        }
    }
}



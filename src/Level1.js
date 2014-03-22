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
    this.slimeGroup = null;
};

MainGame.BunnyGame.prototype = {
    preload: function(){
        this.game.load.tilemap("platforms", "/assets/tilemaps/level1.json", null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image("land", "/assets/tilemaps/tiles_spritesheet.png");
        //, this.tileWidth, this.tileHeight,144,0,1
        this.game.load.image('coin', '/assets/sprites/coinGold.png');
        //game.load.audio('music', ['/resources/L1Audio.mp3']);
        this.game.load.image('L1BG', '/assets/img/level1bg.png');
        //this.game.load.image('speech', '/assets/sprites/speech_bubble.png');
        //this.game.load.atlas("enemies", "/resources/enemies.png",
        //"/resources/enemies.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    },
    
    create: function() {
        this.map = this.game.add.tilemap("platforms");
        this.game.stage.backgroundColor = '#000';
        this.background = this.game.add.tileSprite(0, 0, 1400, 3640, "L1BG");
        this.map.addTilesetImage('sheet','land');
        this.map.setCollisionBetween(1,143);
    
        // now we need to create a game layer, and assign it a tile set and a map
        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
    
        //this.music = game.add.audio('music');
        //this.music.play();

        /*
        //create an array of objects containing slime positions
        var slimeSpots = [{x: 6, y: 47},
                         {x: 13, y: 44},
                         {x: 3, y: 39},
                         {x: 17, y: 32},
                         {x: 6, y: 32},
                         {x: 19, y: 28},
                         {x: 12, y: 24},
                         {x: 1, y: 23},
                         {x: 14, y: 5},
                         {x: 19, y: 5}];
        
        //add a group of test enemies
        this.slimeGroup = this.game.add.group();
        for(var i = 0; i < 10; i++){
            var slimePos = slimeSpots[i];
            slime = new MainGame.Slime(this.game, slimePos.x * this.tileWidth, slimePos.y * this.tileHeight);
            slime.animateSlime();
            slime.name = 'slime';
            this.slimeGroup.add(slime);
        }
        */

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.physics.arcade.gravity.y = 1800;
        
        this.playerSprite = new MainGame.Player(this.game, 10, 3400, this.cursors);
        this.playerSprite.animatePlayer();

        //add the goal sprite
        this.goalSprite = this.game.add.sprite((this.tilesWide - 1) * this.tileWidth,
                                               this.tileHeight * 5,'coin');
        this.game.physics.enable(this.goalSprite, Phaser.Physics.ARCADE);
        this.goalSprite.name = 'goal';
        this.goalSprite.body.immovable = true;
    
        //setting the bounds of the entire level
        this.game.world.setBounds(0,0,this.tilesWide*this.tileWidth,this.tilesHigh*this.tileHeight); 

        //bounds lets us set the camera to follow the character
        this.game.camera.follow(this.playerSprite); 
    },
    
    update: function(){
        //make the player collide with the world
        this.game.physics.arcade.collide(this.playerSprite, this.layer);

        //make the test enemy collide with the world
        //this.game.physics.collide(this.slime, this.layer);
        //this.slimeGroup.forEach(this.slimeUpdate, this);
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

    goalCollision: function(player, goal){
        //goal.destroy();

        this.speechBubble = this.game.add.sprite((this.tilesWide - 3) * this.tileWidth,
                                               this.tileHeight * 2,'speech');
        this.speechBubble.name = 'speechBubble';
        this.speechBubble.body.immovable = true;

        var text = game.add.text((this.tilesWide - 3) * this.tileWidth + 5,
            2 * this.tileHeight + 5,
            "You have defeated level 1!\n Click to move on to level 2.",
            {
                font: "15px Arial",
                fill: "#000",
                align: "left"
            });
        this.game.input.onDown.addOnce(this.nextLevel, this);

    },

    nextLevel: function(){
        this.game.state.start('level2');
    },

    slimeUpdate: function(slime){
        this.game.physics.collide(slime,this.layer);
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



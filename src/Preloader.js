var MainGame = {};

MainGame.Preloader = function(game) {
    this.game = game;
};

MainGame.Preloader.prototype = {
    preload: function(){
        //this.game.load.image('bunny', '/resources/bunny.png');
        this.game.load.image('mainbg', 'assets/img/main_bg.png');
        //this.game.load.spritesheet('alien', '/resources/p3_walk.png', 66, 93, 3);
        //this.game.load.atlas("alien", "/resources/p3_spritesheet.png","/resources/player_atlas.xml", null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
    },
    create: function() {
        this.game.state.start('mainmenu');
    }
}

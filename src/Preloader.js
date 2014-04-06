var MainGame = {};

MainGame.Preloader = function(game) {
    this.game = game;
};

MainGame.Preloader.prototype = {
    preload: function(){
        this.game.load.image('mainbg', 'assets/img/main_bg.png');
        this.game.load.image('loading', 'assets/img/loading.gif');
        this.game.load.atlasJSONHash("player", "/assets/sprites/jen_spritesheet.png","/assets/sprites/jen_spritesheet.json");
        
    },
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start('mainmenu');
    }
}

var game                = {};
game.width              = 3000;
game.height             = 3000;

// Elements
game.$canvas            = $("#canvas");
game.$fps               = $(".fps");
game.$splash            = $(".loading").find('h4');
game.$loading           = $(".loading");

game.paths              = {};
game.paths.images       = "img/";
game.paths.icons        = "img/icon/";

game.load_messages      = ["Constructing Blobs", "Downloading Cars", "Repairing Houses", "Shooing Dragons", "Mining Ores", "Extinguishing Fires", "Banishing Demons", "Rigging RNG", "Hacking Pentagon", "Inhaling Helium", "Contemplating Life", "Inflating Balloons", "Winning Arguments", "Exploring Dungeons", "Following Rainbows", "Grinding Mobs", "Looting Bodies", "Chopping Trees", "Smashing Rocks", "Playing Minecraft", "Punching Trees", "Disliking Videos", "Playing Music", "Inventing Fire"];
game.images             = {};

game.images.grass               = "grass.jpg";
game.images.crater              = "crater.png";
game.images.bush_small          = "bush_small.png";
game.images.gold_ore_small      = "gold_ore_small.png";
game.images.gold_ore_large      = "gold_ore_large.png";
game.images.silver_ore_large    = "silver_ore_large.png";

game.stock              = {};
game.gold               = 0;
game.meat               = 0;
game.wood               = 0;
game.herbs              = 0;

game.ready              = false;
game.loading            = true;
game.over               = true;

game.debug              = {};
game.debug.fps          = 0;
game.debug.lct          = Date.now();
game.debug.delta        = 0;
game.debug.tick         = 0;
game.debug.maxtick      = 50;

game.canvas             = game.$canvas[0];
game.canvas.width       = game.width;
game.canvas.height      = game.height;
game.context            = game.canvas.getContext('2d');

game.mouse              = {};
game.mouse.drag         = {};
game.mouse.down         = false;
game.mouse.x            = 0;
game.mouse.y            = 0;
game.mouse.drag.x       = 0;
game.mouse.drag.y       = 0;

game.init = function(){
    game.preload();
};

// Preload
game.preload = function(){
    if( game.obl( game.images ) == 0 ){
        return game.preload_complete();
    }
    var loaded  = game.images;
    game.images = {};
    game.obk( loaded ).forEach(function(path){
        var image = new Image;
        image.onload = function(){
            game.images[path] = image;
            if( game.obl( game.images ) == game.obl( loaded ) ){
                return setTimeout(function(){
                    game.preload_complete()
                }, 1000);
            }
        };
        image.onerror = function(){
            return game.die({ error : "Unable to preload " + path});
        };
        image.src = game.paths.images + loaded[path];
    });
};

game.preload_complete = function(){
    game.$loading.fadeOut();
    game.tick();
};

game.die = function(e){
    game.$splash.text(e.error);
};

game.slow_tick = function(){
    game.debug.tick = 0;
    game.$fps.text(game.debug.fps);
};

game.tick = function(){
    game.debug.tick > game.debug.maxtick ? game.slow_tick() : game.debug.tick ++;

    game.debug.delta = ( Date.now() - game.debug.lct ) / 1000;
    game.debug.lct = Date.now();
    game.debug.fps = (1 / game.debug.delta).toFixed(0);

    requestAnimationFrame(game.tick);
};

// Extra Useful Functions
game.obk = function(obj){
    return Object.keys(obj);
}

game.obl = function(obj){
    return Object.keys(obj).length;
};

game.randItem = function(arr){
    return arr[Math.floor(Math.random() * arr.length)];
};

window.requestAnimFrame = (function() {
    return
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(c) {window.setTimeout(c, 0);};
})();

// Start!
game.init();
var game                = {};
game.width              = 3000;
game.height             = 3000;

game.viewport           = {};
game.viewport.height    = 700;
game.viewport.width     = 700;

// Elements
game.$canvas            = $("#canvas");
game.$fps               = $(".fps");
game.$mousepos          = $(".mousepos");
game.$rightclick        = $(".rightclick");
game.$mousedrag         = $(".mousedrag");
game.$mousedown         = $(".mousedown");
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
game.canvas.width       = game.viewport.width;
game.canvas.height      = game.viewport.height;
game.context            = game.canvas.getContext('2d');

game.mouse              = {};
game.mouse.drag         = {};
game.mouse.rightclick   = false;
game.mouse.down         = false;
game.mouse.dragging     = false;
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


    // Temp Shit
    game.context.clearRect(0,0,game.width, game.height);
    if(game.mouse.down && game.mouse.dragging){
        game.context.beginPath();
            game.context.fillStyle = "rgba(0,0,0,.1)";
            game.context.strokeStyle = "#FFF";
            game.context.rect(game.mouse.drag.x, game.mouse.drag.y, Math.floor(game.mouse.x - game.mouse.drag.x), Math.floor(game.mouse.y - game.mouse.drag.y));
            game.context.fill();
            game.context.stroke();
        game.context.closePath();
    } else if(game.mouse.down && !game.mouse.dragging){
        game.context.beginPath();
            game.context.fillStyle = "rgba(100,100,255,0.5)";
            game.context.arc(game.mouse.x, game.mouse.y, 10, 0, Math.PI * 2, true);
            game.context.fill();
        game.context.closePath();
    }
    game.$mousedown.text(game.mouse.down);
    game.$mousedrag.text(game.mouse.dragging);
    game.$rightclick.text(game.mouse.rightclick);
    // End Temp Shit
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

game.$canvas.mousedown(function(e){
    if(e.button == 2){
        game.mouse.rightclick = true;
    } else {
        game.mouse.down = true;
        if(!game.mouse.dragging){
            game.mouse.drag.x = game.mouse.x;
            game.mouse.drag.y = game.mouse.y;
        }
    }
});

game.$canvas.mouseup(function(e){
    if(e.button == 2){
        game.mouse.rightclick = false;
    } else {
        game.mouse.down = false ;
        game.mouse.drag.x = game.mouse.x;
        game.mouse.drag.y = game.mouse.y;
    }
});

game.$canvas.mousemove(function(e){
    var off = game.$canvas.offset();
    game.mouse.x = Math.floor(e.pageX - off.left);
    game.mouse.y = Math.floor(e.pageY - off.top);
    if(game.mouse.down && game.mouse.drag.x != game.mouse.x && game.mouse.drag.y != game.mouse.y){
        game.mouse.dragging = true;
    } else {
        game.mouse.dragging = false;
    }
    game.$mousepos.text(game.mouse.x + "," + game.mouse.y);
});

// Start!
game.init();
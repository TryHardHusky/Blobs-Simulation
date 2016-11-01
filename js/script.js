var game                = {};
game.tile               = {};
game.tile.size          = 32;

game.colcount           = 150;
game.rowcount           = 150;
game.tilecount          = game.colcount * game.rowcount;

game.width              = Math.floor(game.colcount * game.tile.size);
game.height             = Math.floor(game.rowcount * game.tile.size);

game.map                = [];
game.objects            = [];
game.buildings          = [];

game.viewport           = {};
game.viewport.old       = {};
game.viewport.old.x     = -1;
game.viewport.old.y     = -1;
game.viewport.x         = 0;
game.viewport.y         = 0;
game.viewport.height    = 700;
game.viewport.width     = 700;
game.viewport.speed     = 10;
game.viewport._speed    = game.viewport.speed;
game.viewport.boost     = 3;

// Elements
game.$minimap           = $("#minimap");
game.$zonebg            = $("#zonebg");
game.$canvas            = $("#canvas");
game.$fps               = $(".fps");
game.$mousepos          = $(".mousepos");
game.$rightclick        = $(".rightclick");
game.$mousedown         = $(".mousedown");
game.$splash            = $(".loading").find('h4');
game.$loading           = $(".loading");
game.$viewport          = $(".viewport");

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
game.stock.gold         = 0;
game.stock.meat         = 0;
game.stock.wood         = 0;
game.stock.herbs        = 0;

game.ready              = false;
game.loading            = true;
game.over               = true;

game.keys               = {};
game.keymap             = {};
game.keymap.w           = 87;
game.keymap.a           = 65;
game.keymap.s           = 83;
game.keymap.d           = 68;
game.keymap.shift       = 16;

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

game.zone               = game.$zonebg[0];
game.zone.width         = game.viewport.width;
game.zone.height        = game.viewport.height;
game.zone_ctx           = game.zone.getContext('2d');

game.minimap            = game.$minimap[0];
game.minimap.width      = 140;
game.minimap.height     = 140;
game.minimap_context    = game.minimap.getContext('2d');

game.mouse              = {};
game.mouse.rightclick   = false;
game.mouse.down         = false;
game.mouse.x            = 0;
game.mouse.y            = 0;

game.tiles                  = {};
game.tiles.none             = 0;
game.tiles.gold_ore_small   = 1;
game.tiles.gold_ore_large   = 2;
game.tiles.silver_ore_small = 3;
game.tiles.silver_ore_large = 4;
game.tiles.bush_small       = 5;

game.init = function(){
    for(var c = 0;c < game.colcount; c++){
        game.map[c] = [];
        game.objects[c] = [];
        game.buildings[c] = [];
        for(var r = 0; r < game.rowcount; r++){
            game.map[c][r] = 0;
            game.objects[c][r] = 0;
            game.buildings[c][r] = 0;
        }
    }
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
                }, 100);
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

game.check_input = function(){
    if(game.keys[game.keymap.shift]){ // Double speed
        if(game.viewport.speed != (game.viewport._speed * game.viewport.boost)){
            game.viewport.speed *= game.viewport.boost;
        }
    } else {
        game.viewport.speed = game.viewport._speed;
    }
    if(game.keys[game.keymap.w]){ // UP
        if(game.viewport.y - game.viewport.speed > 0) game.viewport.y -= game.viewport.speed;
        else game.viewport.y = 0;
    }
    if(game.keys[game.keymap.s]){ // DOWN
        if(game.viewport.y + game.viewport.speed < (game.height - game.viewport.height)) game.viewport.y += game.viewport.speed;
        else game.viewport.y = (game.height - game.viewport.height);
    }
    if(game.keys[game.keymap.a]){ // LEFT
        if(game.viewport.x - game.viewport.speed > 0) game.viewport.x -= game.viewport.speed;
        else game.viewport.x = 0;
    }
    if(game.keys[game.keymap.d]){ // RIGHT
        if(game.viewport.x + game.viewport.speed < (game.width - game.viewport.width)) game.viewport.x += game.viewport.speed;
        else game.viewport.x = (game.width - game.viewport.width);
    }
    // Make sure there are no floats
    game.viewport.x = Math.floor(game.viewport.x);
    game.viewport.y = Math.floor(game.viewport.y);
};

game.draw_background = function(){
    game.zone_ctx.clearRect(0, 0, game.zone.width, game.zone.height);
    for(var c = 0; c < game.colcount; c++){
        for(var r = 0; r < game.rowcount; r++){
            game.zone_ctx.drawImage(
                game.images.grass,
                0,
                0,
                game.tile.size,
                game.tile.size,
                -(game.viewport.x) + (c * game.tile.size),
                -(game.viewport.y) + (r * game.tile.size),
                game.tile.size,
                game.tile.size
            );
            var tile = game.objects[c][r];
            if(tile == game.tiles.gold_ore_large){
                game.context.drawImage(
                    game.images.gold_ore_large,
                    0,
                    0,
                    game.tile.size,
                    game.tile.size,
                    -(game.viewport.x) + (c * game.tile.size),
                    -(game.viewport.y) + (r * game.tile.size),
                    game.tile.size,
                    game.tile.size
                )
            }
            else if(tile == game.tiles.gold_ore_small){
                game.context.drawImage(
                    game.images.gold_ore_small,
                    0,
                    0,
                    game.tile.size,
                    game.tile.size,
                    -(game.viewport.x) + (c * game.tile.size),
                    -(game.viewport.y) + (r * game.tile.size),
                    game.tile.size,
                    game.tile.size
                )
            }
        }
    }
    game.viewport.old.x = game.viewport.x;
    game.viewport.old.y = game.viewport.y;
};

game.tick = function(){
    // Slow tick
    game.debug.tick > game.debug.maxtick ? game.slow_tick() : game.debug.tick ++;
    // Calculate FPS
    game.debug.delta = ( Date.now() - game.debug.lct ) / 1000;
    game.debug.lct = Date.now();
    game.debug.fps = (1 / game.debug.delta).toFixed(0);
    // Handle keypresses for viewport movement
    game.check_input();

    // Temp Shit
    game.context.clearRect(0,0,game.canvas.width, game.canvas.height);
    game.minimap_context.clearRect(0, 0, game.minimap.width, game.minimap.height);

    game.draw_background();

    game.objects[5][5] = game.tiles.gold_ore_large;
    game.objects[6][6] = game.tiles.gold_ore_large;
    game.objects[6][5] = game.tiles.gold_ore_large;
    game.objects[5][6] = game.tiles.gold_ore_small;
    game.objects[140][140] = game.tiles.gold_ore_small;
    game.objects[149][149] = game.tiles.gold_ore_small;

    game.$mousedown.text(game.mouse.down);
    game.$rightclick.text(game.mouse.rightclick);
    game.$viewport.text(
        game.viewport.x + "-" + (game.viewport.x + game.viewport.width) + " " +
        game.viewport.y + "-" + (game.viewport.y + game.viewport.height)
    );

    game.draw_minimap_border();
    // End Temp Shit
    requestAnimationFrame(game.tick);
};

game.draw_minimap_border = function(){
    var nw = game.width / game.minimap.width;
    var nh = game.height / game.minimap.height;
    game.minimap_context.beginPath();
        game.minimap_context.strokeStyle = "#000";
        game.minimap_context.rect(
            game.viewport.x / nw,
            game.viewport.y / nh,
            game.viewport.width / nw,
            game.viewport.height / nh
        );
        game.minimap_context.stroke();
    game.minimap_context.closePath();
};

game.drawImage = function(img, x, y, w, h, c){
    game.context.drawImage( img, x - game.viewport.x, y - game.viewport.y, w, h );
    var nw = game.width / game.minimap.width;
    var nh = game.height / game.minimap.height;
    game.minimap_context.fillStyle = c || "#000";
    game.minimap_context.fillRect(x / nw, y / nh, w / nw, h / nh);
}

game.fillRect = function(x, y, w, h, c){
    game.context.fillStyle = c;
    game.context.fillRect(x - game.viewport.x, y - game.viewport.y, w, h);
    var nw = game.width / game.minimap.width;
    var nh = game.height / game.minimap.height;
    game.minimap_context.fillStyle = c;
    game.minimap_context.fillRect(x / nw, y / nh, w / nw, h / nh);
}

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
    }
});

game.$canvas.mouseup(function(e){
    if(e.button == 2){
        game.mouse.rightclick = false;
    } else {
        game.mouse.down = false ;
    }
});

game.$canvas.mouseout(function(e){
    game.mouse.down = false;
    game.mouse.rightclick = false;
});

game.$canvas.mousemove(function(e){
    var off = game.$canvas.offset();
    game.mouse.x = Math.floor(e.pageX - off.left);
    game.mouse.y = Math.floor(e.pageY - off.top);
    game.$mousepos.text(game.mouse.x + "," + game.mouse.y);
});

document.onkeydown = function(e){
    game.keys[e.keyCode] = true;
}
document.onkeyup = function(e){
    game.keys[e.keyCode] = false;
}

// Start!
game.init();
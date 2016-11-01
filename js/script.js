var game                = {};
game.tile               = {};
game.tile.size          = 32;

game.colcount           = 99;
game.rowcount           = 99;
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
game.viewport.col       = {};
game.viewport.row       = {};
game.viewport.col.min   = 0;
game.viewport.col.max   = 25;
game.viewport.row.min   = 0;
game.viewport.row.max   = 25;

// Elements
game.$minimap           = $("#minimap");
game.$zonebg            = $("#zonebg");
game.$canvas            = $("#canvas");
game.$fps               = $(".fps");
game.$mousepos          = $(".mousepos");
game.$mousecords        = $(".mousecords");
game.$rightclick        = $(".rightclick");
game.$mousedown         = $(".mousedown");
game.$splash            = $(".loading").find('h4');
game.$loading           = $(".loading");
game.$viewport          = $(".viewport");
game.$selected          = $("section.selected");
game.$help              = $("#help");
game.$viewmax           = $(".viewmax");

game.paths              = {};
game.paths.images       = "img/";
game.paths.icons        = "img/icon/";

game.load_messages      = ["Constructing Blobs", "Downloading Cars", "Repairing Houses", "Shooing Dragons", "Mining Ores", "Extinguishing Fires", "Banishing Demons", "Rigging RNG", "Hacking Pentagon", "Inhaling Helium", "Contemplating Life", "Inflating Balloons", "Winning Arguments", "Exploring Dungeons", "Following Rainbows", "Grinding Mobs", "Looting Bodies", "Chopping Trees", "Smashing Rocks", "Playing Minecraft", "Punching Trees", "Disliking Videos", "Playing Music", "Inventing Fire"];
game.images             = {};

game.images.grass_dark          = "grass_dark.png";
game.images.cracked_earth       = "cracked_earth.png";
game.images.grass_light         = "grass_light.png";
game.images.dirt_dark           = "dirt_dark.png";
game.images.dirt_light          = "dirt_light.png";
game.images.crater              = "crater.png";

game.images.bush_small          = "bush_small.png";
game.images.gold_ore_small      = "gold_ore_small.png";
game.images.gold_ore_large      = "gold_ore_large.png";
game.images.silver_ore_small    = "silver_ore_small.png";
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
game.minimap_disabled   = false;

game.mouse              = {};
game.mouse.rightclick   = false;
game.mouse.down         = false;
game.mouse.x            = 0;
game.mouse.y            = 0;
game.mouse.tx           = 0;
game.mouse.ty           = 0;
game.mouse.selected     = {};
game.mouse.selected.x   = -1;
game.mouse.selected.y   = -1;

game.tiles                  = {};

game.tiles.none = {};
game.tiles.gold_ore_small = {
    type : 1,
    name : "Gold Ore",
    img  : game.paths.images + game.images.gold_ore_small,
    max  : 100,
    min  : 50,
    res  : "gold",
    color: "#ffd700"
};
game.tiles.gold_ore_large = {
    type : 2,
    name : "Gold Ore",
    img  : game.paths.images + game.images.gold_ore_large,
    max  : 500,
    min  : 250,
    res  : "gold",
    color: "#ffd700"
};
game.tiles.silver_ore_small = {
    type : 3,
    name : "Silver Ore",
    img  : game.paths.images + game.images.silver_ore_small,
    max  : 100,
    min  : 50,
    res  : "silver",
    color: "#c0c0c0"
};
game.tiles.silver_ore_large = {
    type : 4,
    name : "Silver Ore",
    img  : game.paths.images + game.images.silver_ore_large,
    max  : 500,
    min  : 250,
    res  : "silver",
    color: "#c0c0c0"
};
game.tiles.bush_small = {
    type : 5,
    name : "Small Bush",
    img  : game.paths.images + game.images.bush_small,
    max  : 10,
    min  : 1,
    res  : "wood",
    color: "#007300"
};

game.tileimg = {
    0 : null,
    1 : "gold_ore_small",
    2 : "gold_ore_large",
    3 : "silver_ore_small",
    4 : "silver_ore_large",
    5 : "bush_small"
};

game.clusters = {};
game.clusters.gold_a = [
    [0,1,0],
    [1,1,2],
    [2,2,0]
];
game.clusters.gold_b = [
    [0,0,0],
    [0,1,0],
    [0,1,0]
];
game.clusters.gold_c = [
    [0,0,0],
    [0,1,1],
    [0,0,0]
];
game.clusters.silver_a = [
    [3,3,3],
    [0,4,0],
    [0,3,0]
];
game.clusters.silver_b = [
    [0,4,3],
    [4,4,3],
    [4,4,0]
];
game.clusters.silver_c = [
    [0,0,0],
    [4,3,0],
    [0,0,0]
];

game.init = function(){
    for(var c = 0;c < game.colcount; c++){
        game.map[c] = [];
        game.objects[c] = [];
        game.buildings[c] = [];
        for(var r = 0; r < game.rowcount; r++){
            game.map[c][r] = 0;
            game.objects[c][r] = {};
            game.buildings[c][r] = 0;
        }
    }

    var loop = 100;
    for(var i = 0; i < loop; i++){
        var o = game.rand(1, 6);
        var x = game.rand(0, game.rowcount);
        var y = game.rand(0, game.colcount);
        switch(o){
            case 1:
                game.spawn_cluster(x, y, game.clusters.gold_a);break;
            case 2:
                game.spawn_cluster(x, y, game.clusters.gold_b);break;
            case 3:
                game.spawn_cluster(x, y, game.clusters.silver_a);break;
            case 4:
                game.spawn_cluster(x, y, game.clusters.silver_b);break;
            case 5:
                game.spawn_cluster(x, y, game.clusters.gold_c);break;
            case 6:
                game.spawn_cluster(x, y, game.clusters.silver_c);break;
        }

    }

    game.preload();
};

game.spawn_cluster = function(ox, oy, pattern){
    for(var col in pattern){
        for(var row in pattern[col]){
            var x = ox - row + 1;
            var y = oy - col + 1;
            if(pattern[col][row] != 0 && game.can_spawn(x,y)){
                game.objects[x][y] = new _resource(game.tiles[ game.tileimg[ pattern[col][row] ] ]);
            }
        }
    }
}

game.can_spawn  = function(x, y){
    try{
        return game.obl(game.objects[x][y]) === 0;
    } catch(e) {
        return false;
    }
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
    setTimeout(function(){
        game.$help.fadeOut();
    }, 2500);
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
    // Minmax to prevent massive loops on a large map
    game.viewport.col.min = Math.floor(game.viewport.x / 32) - 5;
    if(game.viewport.col.min < 0) game.viewport.col.min = 0;
    game.viewport.col.max = game.viewport.col.min + 30;
    if(game.viewport.col.max > game.colcount) game.viewport.col.max = game.colcount;
    game.viewport.row.min = Math.floor(game.viewport.y / 32) - 5;
    if(game.viewport.row.min < 0) game.viewport.row.min = 0;
    game.viewport.row.max = game.viewport.row.min + 30;
    if(game.viewport.row.max > game.rowcount) game.viewport.row.max = game.rowcount;
};

game.render_minimap = function(){
    for(var c = 0; c < game.colcount; c++){
        for(var r = 0; r < game.rowcount; r++){
            var tile = game.objects[c][r];
            if(game.tileimg[tile.type] != null){
                game.fillRect(
                    (c * game.tile.size),
                    (r * game.tile.size),
                    game.tile.size,
                    game.tile.size,
                    game.tiles[game.tileimg[tile.type]].color
                )
            }
        }
    }
};

game.draw = function(){
    game.zone_ctx.clearRect(0, 0, game.zone.width, game.zone.height);
    if(!game.minimap_disabled && game.colcount < 100 && game.rowcount < 100) game.render_minimap();
    else{
        game.minimap_disabled = true;
        game.$minimap.hide();
    }
    for(var c = game.viewport.col.min; c < game.viewport.col.max; c++){
        for(var r = game.viewport.row.min; r < game.viewport.row.max; r++){
            game.zone_ctx.drawImage(
                game.images.grass_dark,
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
            if(game.tileimg[tile.type] != null){
                game.context.drawImage(
                    game.images[ game.tileimg[tile.type] ],
                    0,
                    0,
                    game.tile.size,
                    game.tile.size,
                    -(game.viewport.x) + (c * game.tile.size),
                    -(game.viewport.y) + (r * game.tile.size),
                    game.tile.size,
                    game.tile.size
                );
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

    game.draw();

    game.$mousedown.text(game.mouse.down);
    game.$rightclick.text(game.mouse.rightclick);
    game.$mousecords.text(game.mouse.tx + "," + game.mouse.ty);
    game.$viewport.text(
        game.viewport.x + "-" + (game.viewport.x + game.viewport.width) + " " +
        game.viewport.y + "-" + (game.viewport.y + game.viewport.height)
    );
    game.$viewmax.text(
        game.viewport.row.min + "," + game.viewport.row.max +
        " - " +
        game.viewport.col.min + "," + game.viewport.col.max
    )

    for(var i in game.stock){
        var item = game.stock[i];
        $("li[data-type='" + i + "'] span").eq(1).text(item);
    }

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

game.fillRect = function(x, y, w, h, c){
    if(game.minimap_disabled) return;
    var nw = game.width / game.minimap.width;
    var nh = game.height / game.minimap.height;
    game.minimap_context.fillStyle = c;
    game.minimap_context.fillRect(x / nw, y / nh, w / nw, h / nh);
}

// Classes
function _resource(tile){
    this.name       = tile.name;
    this.type       = tile.type;
    this.image      = tile.img;
    this.resname    = tile.res;
    this.stock      = game.rand(tile.min, tile.max);
    this.id         = "#" + game.rand(0, 999999);
}



// Extra Useful Functions
game.rand = function(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

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
    game.mouse.x = Math.floor(e.pageX - off.left) + (game.viewport.x);
    game.mouse.y = Math.floor(e.pageY - off.top)  + (game.viewport.y);
    if(game.mouse.x < 0) game.mouse.x = 0;
    if(game.mouse.y < 0) game.mouse.y = 0;
    if(game.mouse.x > game.width)  game.mouse.x = game.width;
    if(game.mouse.y > game.height) game.mouse.y = game.height;

    game.mouse.tx = Math.floor(game.mouse.x / game.tile.size);
    game.mouse.ty = Math.floor(game.mouse.y / game.tile.size);

    game.$mousepos.text(game.mouse.x + "," + game.mouse.y);
});

game.$canvas.click(function(){
    var tile = game.objects[game.mouse.tx][game.mouse.ty];
    if(game.obl(tile) > 0){
        game.mouse.selected = {
            x : game.mouse.tx,
            y : game.mouse.ty
        };
        if(game.$selected.css("display") == "none") game.$selected.show();
        game.$selected.find(".count").text(tile.stock + " " + tile.resname + " Remaining");
        game.$selected.find('h4').text(tile.name + " " + tile.id);
        game.$selected.find('img').attr('src', tile.image);
    } else {
        game.$selected.hide();
        game.mouse.selected = {
            x : -1,
            y : -1
        };
    }
});

document.onkeydown = function(e){
    game.keys[e.keyCode] = true;
}
document.onkeyup = function(e){
    game.keys[e.keyCode] = false;
}

// Start!
game.init();
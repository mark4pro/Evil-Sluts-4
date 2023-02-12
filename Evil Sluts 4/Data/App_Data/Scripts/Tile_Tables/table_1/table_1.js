const this_table_1_image_data = {
	0:new imageData("tile_1", config.tileTablesPath+"table_1/Images/wall.png", new Vector2(32, 32)),
	1:new imageData("tile_2", config.tileTablesPath+"table_1/Images/floor.png", new Vector2(64, 64)),
};
const this_table_1 = {
	0:new Sprite(1, new baseObject(false, new nameTag("dungeon_wall_collide", "tile"), new Vector2(32, 32), new Vector2(), this_table_1_image_data[0].getColor(), new Shadow(new Vector2(32, 32), "rgba(0,0,0,0.5)", 10))),
	1:new Sprite(1, new baseObject(false, new nameTag("dungeon_floor", "tile"), new Vector2(32, 32), new Vector2(), this_table_1_image_data[1].getColor())),
	"length":1
};
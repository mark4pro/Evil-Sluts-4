const this_table_1_image_data = [
	imageD("tile_1", config.tileTablesPath+"table_1/Images/wall.png", Vec2(32, 32)),
	imageD("tile_2", config.tileTablesPath+"table_1/Images/floor.png", Vec2(64, 64)),
];
const this_table_1 = [
	sprite(1, base(false, nt("dungeon_wall_collide", "tile"), Vec2(32, 32), Vec2(), this_table_1_image_data[0].getColor(), shadow(Vec2(32, 32), "rgba(0,0,0,0.5)", 10))),
	sprite(1, base(false, nt("dungeon_floor", "tile"), Vec2(32, 32), Vec2(), this_table_1_image_data[1].getColor())),
];
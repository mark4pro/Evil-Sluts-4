//Setup
screen.setResolution(Vec2(1280, 720));
engineSettings.Addons = ["mapRenderer", "mapEditor"];
loadAddons();

//Global vars
let thisLoaded = false;

const mainMenu = function() {
	this.background = rectangle(1, base(false, nt("background", "menu"), Vec2(1280, 720), screen.halfResolution, colorD("#1f9359")));
	this.title = text(2, "Map Editor", base(false, nt("title", "menu"), Vec2("30px Arial", false, "center"), Vec2(640, 100), colorData("white"), shadow(Vec2(2, 2), "black", 10)));
	this.newMapBttn = rectangle(2, base(false, nt("newMapBttn", "menu"), Vec2(200, 50), Vec2(640, 300), colorD("grey"), shadow(Vec2(5, 5), "black", 10)));
	this.newMapTxt = text(3, "New Map", base(false, nt("newMapTxt", "menu"), Vec2("30px Arial", false, "center"), Vec2(640, 300), colorData("white"), shadow(Vec2(2, 2), "black", 10)));
	const newMapFunc = bttnL(this.newMapBttn, this.newMapTxt, recCollision, () => {
		gameState = 1;
	}, Vec2(colorD("grey"), colorD("lightgrey")));
	this.loadMapBttn = rectangle(2, base(false, nt("loadMapBttn", "menu"), Vec2(200, 50), Vec2(640, 360), colorD("grey"), shadow(Vec2(5, 5), "black", 10)));
	this.loadMapTxt = text(3, "Load Map", base(false, nt("loadMapTxt", "menu"), Vec2("30px Arial", false, "center"), Vec2(640, 360), colorData("white"), shadow(Vec2(2, 2), "black", 10)));
	const loadMapFunc = bttnL(this.loadMapBttn, this.loadMapTxt, recCollision, () => {
		gameState = 1;
	}, Vec2(colorD("grey"), colorD("lightgrey"))); 
	const update = () => this.update();
	this.update = function() {
		if (typeof gameState != "undefined" && gameState == 0) {
			//Add menu
			if (getByNameTag(this.background.base.nameTag) == null) {
				newMapFunc.link();
				loadMapFunc.link();
				addObject(this.loadMapTxt);
				addObject(this.loadMapBttn);
				addObject(this.newMapTxt);
				addObject(this.newMapBttn);
				addObject(this.title);
				addObject(this.background);
			}
		} else {
			//Delete menu
			if (getByNameTag(this.background.base.nameTag) != null) {
				newMapFunc.unlink();
				loadMapFunc.unlink();
				deleteByNameTag(this.loadMapTxt.base.nameTag);
				deleteByNameTag(this.loadMapBttn.base.nameTag);
				deleteByNameTag(this.newMapTxt.base.nameTag);
				deleteByNameTag(this.newMapBttn.base.nameTag);
				deleteByNameTag(this.title.base.nameTag);
				deleteByNameTag(this.background.base.nameTag);
			}
		}
	}
	addUpdate(update, "mainMenu");
}

const menu = new mainMenu();
let mapEditor = null;

const mainUpdate = () => {
	//Inits after all scripts are loaded
	if (typeof editor != "undefined" && !thisLoaded) {
		config.scale = 5;
		config.tileTables = [tileTL("table_1", "this_table_1")];
		loadTileTables();
		mapEditor = new editor();
		thisLoaded = true;
	}
};
addUpdate(mainUpdate, "mainUpdate"); 

//Controls
let moveUpBttn = K(
	"Up",
	[
		keyD("w", 0)
	],
	Vec2(() => {if (currentMap() != null) {currentMap().dir.y = 1}}, () => {if (currentMap() != null) {currentMap().dir.y = 0}}),
	true
);
let moveDownBttn = K(
	"Down",
	[
		keyD("s", 0)
	],
	Vec2(() => {if (currentMap() != null) {currentMap().dir.y = -1}}, () => {if (currentMap() != null) {currentMap().dir.y = 0}}),
	true
);
let moveLeftBttn = K(
	"Left",
	[
		keyD("a", 0)
	],
	Vec2(() => {if (currentMap() != null) {currentMap().dir.x = 1}}, () => {if (currentMap() != null) {currentMap().dir.x = 0}}),
	true
);
let moveRightBttn = K(
	"Right",
	[
		keyD("d", 0)
	],
	Vec2(() => {if (currentMap() != null) {currentMap().dir.x = -1}}, () => {if (currentMap() != null) {currentMap().dir.x = 0}}),
	true
);
let reloadBttn = K(
	"Reload",
	[
		keyD("r", 0)
	],
	Vec2(() => {mapEditor.reload = true;}, null),
	true
);
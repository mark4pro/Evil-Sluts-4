//Setup
screen.setResolution(new Vector2(1280, 720));
engineSettings.Addons = ["mapRenderer"];
loadAddons();

//Images
let playerImg = new imageData("player", imagePath+"player_1.png", new Vector2(64, 128));
let bullet_1_Img = new imageData("tear", imagePath+"tear.png", new Vector2(59, 91));

//Global vars
let thisLoaded = false;
let saveData = {
	"mapPos":null,
	"playerPos":null,
};

const menu = new mainMenu();

function mainMenu() {
	this.background = new Rectangle(1, new baseObject(false, new nameTag("background", "menu"), new Vector2(1280, 720), screen.halfResolution, new colorData("#1f9359")));
	this.title = new Text(2, "Ball Slayer", new baseObject(false, new nameTag("title", "menu"), new Vector2("30px Arial", false, "center"), new Vector2(640, 100), colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.startBttn = new Rectangle(2, new baseObject(false, new nameTag("startBttn", "menu"), new Vector2(200, 50), new Vector2(640, 360), new colorData("grey"), new Shadow(new Vector2(5, 5), "black", 10)));
	this.startBttnTxt = new Text(3, "Play", new baseObject(false, new nameTag("startBttnTxt", "menu"), new Vector2("30px Arial", false, "center"), new Vector2(640, 360), colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	const startBttnFunc = new buttonLink(this.startBttn, this.startBttnTxt, recCollision, () => {
		gameState = 1;
	}, new Vector2(new colorData("grey"), new colorData("lightgrey"))); 
	const update = () => {
		if (typeof gameState != "undefined" && gameState == 0) {
			//Add menu
			if (getByNameTag(this.background.base.nameTag) == null) {
				startBttnFunc.link();
				addObject(this.startBttnTxt);
				addObject(this.startBttn);
				addObject(this.title);
				addObject(this.background);
			}
		} else {
			//Delete menu
			if (getByNameTag(this.background.base.nameTag) != null) {
				startBttnFunc.unlink();
				deleteByNameTag(this.startBttnTxt.base.nameTag);
				deleteByNameTag(this.startBttn.base.nameTag);
				deleteByNameTag(this.title.base.nameTag);
				deleteByNameTag(this.background.base.nameTag);
			}
		}
	}
	addUpdate(update, "mainMenu");
}

const mainUpdate = () => {
	//Inits after all scripts are loaded
	if (typeof map != "undefined") {
		if (!thisLoaded) {
			config.scale = 5;
			config.tileTables = [new tileTableLink("table_1", "this_table_1")];
			loadTileTables();
			config.maps = ["test_map"];
			loadMaps();
			thisLoaded = true;
		}
		if (currentMap() != null && currentMap().loaded && !currentPlayer.loaded) {
			let wallTiles = objectArray.filter((i) => i.base.nameTag.name == "dungeon_wall");
			for (let i=0,length=wallTiles.length;i<length;i++) {
				wallTiles[i].layerNumber++;
			}
			loaded = false;
			currentPlayer.load(currentMap().playerPosInit);
		}
	}
};
addUpdate(mainUpdate, "mainUpdate"); 

function weapon(name="", imageData=null, amountPerShot=1, fireTime=new Vector2(1, 10), size=ONE, speed=5, range=100, damage=new Vector2(), spreadPattern=[0]) {
	this.name = name;
	this.imageData = imageData;
	this.amountPerShot = amountPerShot;
	if (this.amountPerShot <= 0) {
		this.amountPerShot = 1;
	}
	this.fireTime = fireTime; //x- speed for timer, y- max time
	this.size = size;
	this.speed = speed;
	this.range = range;
	this.damage = damage;
	this.spreadPattern = spreadPattern;
}

const weaponTable = {
	0:new weapon("test", bullet_1_Img.getColor(), 5, new Vector2(1, 10), new Vector2(10,10), 10, 300, new Vector2(5, 10), [-12.5, -6.25, 0, 6.26, 12.5]),
}

const currentPlayer = new player(100, 10, [0], 100);

function player(maxHealth=100, defence=10, weapons=[], ammo=100) {
	this.maxHealth = maxHealth;
	this.defence = defence;
	this.weapons = weapons;
	this.ammo = ammo;
	
	this.lockWeapon = false;
	let fireTime = 0;
	let bulletAmount = 0;
	this.size = new Vector2(32, 32);
	this.loaded = false;
	this.nameTag = new nameTag("player","player");
	this.pos = new Vector2();
	this.health = 0;
	this.dead = false;
	this.currentWeapon = 0;
	this.currentWeaponData = null;
	this.playerOBJ = null;
	this.playerDir = 1;
	this.bulletSpawn = new Vector2();
	this.controller = new playerController(false, "player", this.playerOBJ, 5, new Vector2(0.1, 0.2), new Vector2(100, 1180), new Vector2(100, 620));
	
	this.load = function(pos=null) {
		if (pos != null) {
			this.pos = pos;
		}
		this.health = this.maxHealth;
		this.playerOBJ = new Sprite(4, new baseObject(true, this.nameTag, this.size.multi(config.scale), this.pos, playerImg.getColor()));
		this.controller.object = this.playerOBJ;
		this.controller.activate();
		this.loaded = true;
	}
	this.unload = function() {
		deleteByNameTag(this.nameTag);
		this.controller.deactivate();
		this.loaded = false;
	}
	const update = () => {
		deleteByMarked();
		if (typeof gameState != "undefined") {
			if (gameState == 0) {
				if (this.loaded) {
					this.unload();
				}
			} else {
				if (this.controller.moveDir.x != 0) {
					this.playerDir = -this.controller.moveDir.x;
				}
				if (this.playerOBJ != null) {
					this.playerOBJ.scale.x = this.playerDir;
				}
				switch (this.playerDir) {
					case -1:
						this.bulletSpawn = new Vector2(10, -60);
					break;
					case 1:
						this.bulletSpawn = new Vector2(-10, -60);
					break;
				}
				if (currentMap() != null) {
					if (this.controller.touchEdge.x) {
						currentMap().dir.x = -this.controller.moveDir.x;
					} else {
						currentMap().dir.x = 0;
					}
					if (this.controller.touchEdge.y) {
						currentMap().dir.y = -this.controller.moveDir.y;
					} else {
						currentMap().dir.y = 0;
					}
				}
				if (mousePressed[0] && !isPaused && !this.lockWeapon && this.currentWeaponData != null) {
					if (fireTime == 0 && this.ammo > 0) {
						for (let i=0;i<this.currentWeaponData.amountPerShot;i++) {
							let newBullet = new Sprite(5, new baseObject(false, new nameTag("bullet_"+bulletAmount,this.currentWeaponData.name), this.currentWeaponData.size.duplicate(), this.playerOBJ.base.position.duplicate().addV(this.bulletSpawn.duplicate()), this.currentWeaponData.imageData.duplicate()));
							let angle = this.playerOBJ.base.position.getRotation(Cursor.cursor.base.position, false)+180;
							newBullet.base.nameTag.name = newBullet.base.nameTag.name+i;
							newBullet.base.position.r = degToRad(this.currentWeaponData.spreadPattern[i]+angle);
							newBullet.base.position.s = -this.currentWeaponData.speed;
							bulletAmount++;
							addObject(newBullet);
						}
						this.ammo--;
					}
					fireTime += this.currentWeaponData.fireTime.x*delta;
					if (fireTime > this.currentWeaponData.fireTime.y) {
						fireTime = 0;
					}
				}
				if (!mousePressed[0]) {
					fireTime = 0;
				}
				if (bulletAmount > 1000) {
					bulletAmount = 0;
				}
				let bulletsSpawned = getByNameTag(new nameTag("bullet_"), 1, false, true);
				if (bulletsSpawned != null) {
					for (let i=0;i<bulletsSpawned.length;i++) {
						let dist = bulletsSpawned[i].base.startPosition.distance(bulletsSpawned[i].base.position);
						if (dist > this.currentWeaponData.range) {
							bulletsSpawned[i].base.marked = true;
						}
					}
				}
				if (!this.loaded) {
					this.load();
				}
				this.currentWeaponData = weaponTable[this.currentWeapon];
				if (this.currentWeapon > this.weapons.length-1) {
					this.currentWeapon = this.weapons.length-1;
				}
				if (this.currentWeapon < 0) {
					this.currentWeapon = 0;
				}
			}
		}
	};
	addUpdate(update, "player");
}

function baseItems(rariety=1, imageData=null) {
	this.rariety = rariety;
	this.imageData = imageData;
}

function drugs(type="", base=new baseItems()) {
	this.type = type;
	this.base = base;
}

const itemTable = [
	new drugs("heroin", new baseItems(1)),
	new drugs("crack", new baseItems(1)),
	new drugs("cocaine", new baseItems(2)),
	new drugs("lsd", new baseItems(5)),
	new drugs("mushroom", new baseItems(4)),
	new drugs("crocodile", new baseItems(1)),
	new drugs("bath salts", new baseItems(2)),
	new drugs("DMT", new baseItems(6)),
	new drugs("meth", new baseItems(1)),
	new drugs("smack", new baseItems(3)),
	new drugs("chese", new baseItems(10)),
	new drugs("your mom", new baseItems(7)),
];

//Controls
let moveUpBttn = new key(
	"moveUp",
	[
		new keyData("w", 0)
	],
	new Vector2(() => {currentPlayer.controller.moveDir.y = -1}, () => {currentPlayer.controller.moveDir.y = 0}),
	false
);
let moveDownBttn = new key(
	"moveDown",
	[
		new keyData("s", 0)
	],
	new Vector2(() => {currentPlayer.controller.moveDir.y = 1}, () => {currentPlayer.controller.moveDir.y = 0}),
	false
);
let moveLeftBttn = new key(
	"moveLeft",
	[
		new keyData("a", 0)
	],
	new Vector2(() => {currentPlayer.controller.moveDir.x = -1}, () => {currentPlayer.controller.moveDir.x = 0}),
	false
);
let moveRightBttn = new key(
	"moveRight",
	[
		new keyData("d", 0)
	],
	new Vector2(() => {currentPlayer.controller.moveDir.x = 1}, () => {currentPlayer.controller.moveDir.x = 0}),
	false
);


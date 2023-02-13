//Setup
screen.setResolution(new Vector2(1280, 720));
engineSettings.Addons = ["mapRenderer"];
loadAddons();

//Images
let playerImg = new imageData("player", imagePath+"player_1.png", new Vector2(64, 128));
let bullet_1_Img = new imageData("tear", imagePath+"tear.png", new Vector2(59, 91));

//Global vars
let thisLoaded = false;
let loadedCollisionArray = false;
let collisionArray = null;
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

function statusBar(obj=BLANK_OBJECT, value=0, maxValue=100, color=new Vector2()) {
	this.obj = obj;
	this.value = value;
	this.maxValue = maxValue;
	this.color = color; //x- start color, y- end color, r- alpha
	this.gradient = new Rainbow();
	this.setColors = (color=new Vector2()) => {
		this.gradient.setSpectrum(this.color.x, this.color.y);
	}
	this.gradient.setNumberRange(0, this.maxValue);
	this.setColors(this.color);
	let sizeX = this.obj.base.size.duplicate().x;
	this.update = () => {
		//this.gradient.setNumberRange(0, this.maxValue);
		this.obj.base.color = new colorData("#"+this.gradient.colorAt(this.value), this.color.r);
		this.obj.base.size.x = sizeX*(this.value/(this.maxValue/100)/100);
	}
}

function baseItem(rariety=1, imageData=null) {
	this.rariety = rariety;
	this.imageData = imageData;
	this.duplicate = () => {
		return new baseItem(this.rariety, this.imageData);
	}
}

function drugsItem(type="", base=new baseItems()) {
	this.type = type;
	this.base = base;
	this.itemType = "drug";
	this.mainType = "items"; //What inventory array it goes into
	this.duplicate = () => {
		return new drugsItem(this.type, this.base.duplicate());
	}
}

function weaponItem(weaponId=0, base=new baseItems()) {
	this.weaponId = weaponId;
	this.base = base;
	this.itemType = "weapon";
	this.mainType = "weapons"; //What inventory array it goes into
	this.equip = () => {
		if (currentPlayer.loaded && currentPlayer.weapons.filter((i) => i.weaponId == this.weaponId).length == 0) {
			currentPlayer.weapons.push(this);
		}
	}
	this.unequip = () => {
		if (currentPlayer.loaded && currentPlayer.weapons.filter((i) => i.weaponId == this.weaponId).length != 0) {
			currentPlayer.weapons.forEach((w, i) => {
				if (w.weaponId == this.weaponId) {
					currentPlayer.weapons.splice(i, 1);
				}
			});
		}
	}
	this.duplicate = () => {
		return new weaponItem(this.weaponId, this.base.duplicate());
	}
}

const itemTable = [
	//Items
	new drugsItem("heroin", new baseItem(1)),
	new drugsItem("crack", new baseItem(1)),
	new drugsItem("cocaine", new baseItem(2)),
	new drugsItem("lsd", new baseItem(5)),
	new drugsItem("mushroom", new baseItem(4)),
	new drugsItem("crocodile", new baseItem(1)),
	new drugsItem("bath salts", new baseItem(2)),
	new drugsItem("DMT", new baseItem(6)),
	new drugsItem("meth", new baseItem(1)),
	new drugsItem("smack", new baseItem(3)),
	new drugsItem("chese", new baseItem(10)),
	new drugsItem("your mom", new baseItem(7)),
	//Weapons
	new weaponItem(0, new baseItem(1)),
];

const getItemsByType = (type="", mode=0) => {
	if (mode < 0) {
		mode = 0;
	}
	if (mode > 1) {
		mode = 1;
	}
	switch (mode) {
	case 0:
		return itemTable.filter((i) => type.includes(i.itemType));
	break;
	case 1:
		return itemTable.filter((i) => !type.includes(i.itemType));
	break;
	}
}

const addToInventory = (item=null) => {
	if (item != null) {
		inventory[item.mainType].push(item);
	}
}

const inventory = {
	"weapons":[getItemsByType("weapon")[0]],
	"items":[],
};

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

const currentPlayer = new player(100, new Vector2(50, 0.1), 10, [getItemsByType("weapon")[0]], new Vector2(100, 100));

function player(maxHealth=100, maxStamina=new Vector2(50, 0.1), defence=10, weapons=[], ammo=new Vector2(100, 100)) {
	this.defence = defence;
	this.weapons = weapons;
	this.ammo = ammo; //x- current ammo, y- max ammo
	
	this.lockWeapon = false;
	let fireTime = 0;
	let bulletAmount = 0;
	this.size = new Vector2(32, 32);
	this.loaded = false;
	this.nameTag = new nameTag("Jesus","player");
	this.pos = new Vector2();
	this.health = new Vector2(maxHealth, maxHealth); //x- current health, y- max health
	this.dead = false;
	this.currentWeapon = 0;
	this.currentWeaponData = null;
	this.playerOBJ = null;
	this.playerDir = 1;
	this.bulletSpawn = new Vector2();
	this.playerSpeed = new Vector2(3, 5); //x- normal speed, y- running speed
	this.run = false;
	this.stamina = new Vector2(maxStamina.x, maxStamina.x, maxStamina.y); //x- current stamina, y- max stamina, r- stamina recharge
	this.controller = new playerController(false, "player", this.playerOBJ, this.playerSpeed.x, new Vector2(1, 0.5), new Vector2(100, 1180), new Vector2(100, 620));
	
	this.healthBarTxt = new Text(8, "Health", new baseObject(false, new nameTag("healthBarTxt", "UI"), new Vector2("30px Arial", false, "center"), new Vector2(640, 615), new colorData("white", 0.75), new Shadow(new Vector2(5, 5), "black", 5)));
	this.healthBar = new Rectangle(8, new baseObject(false, new nameTag("healthBar", "UI"), new Vector2(200, 25), new Vector2(640, 640), new colorData("black"), new Shadow(new Vector2(5, 5), "black", 5)));
	this.healthBarLink = new statusBar(this.healthBar, this.health.x, this.health.y, new Vector2("darkred", "darkgreen", 0.75));
	
	this.staminaBarTxt = new Text(8, "Stamina", new baseObject(false, new nameTag("staminaBarTxt", "UI"), new Vector2("30px Arial", false, "center"), new Vector2(640, 670), new colorData("white", 0.75), new Shadow(new Vector2(5, 5), "black", 5)));
	this.staminaBar = new Rectangle(8, new baseObject(false, new nameTag("staminaBar", "UI"), new Vector2(200, 25), new Vector2(640, 695), new colorData("black"), new Shadow(new Vector2(5, 5), "black", 5)));
	this.staminaBarLink = new statusBar(this.staminaBar, this.stamina.x, this.stamina.y, new Vector2("ghostwhite", "darkblue", 0.75));
	
		
	this.weaponNameTxt = new Text(8, "Weapon Name", new baseObject(false, new nameTag("weaponNameTxt", "UI"), new Vector2("30px Arial", false, "left"), new Vector2(10, 10), new colorData("purple", 0.75), new Shadow(new Vector2(5, 5), "black", 5)));
	
		
	this.ammoCountTxt = new Text(8, "Ammo Count", new baseObject(false, new nameTag("ammoCount", "UI"), new Vector2("30px Arial", false, "left"), new Vector2(10, 45), new colorData("orange", 0.75), new Shadow(new Vector2(5, 5), "black", 5)));
	
	this.load = function(pos=null) {
		if (pos != null) {
			this.pos = pos;
		}
		this.playerOBJ = new Sprite(4, new baseObject(true, this.nameTag, this.size.multi(config.scale), this.pos, playerImg.getColor(), new Shadow(new Vector2(-5, -5), "black", 10)));
		this.controller.object = this.playerOBJ;
		this.controller.activate();
		addObject(this.healthBarTxt);
		addObject(this.healthBar);
		addObject(this.staminaBarTxt);
		addObject(this.staminaBar);
		addObject(this.weaponNameTxt);
	    addObject(this.ammoCountTxt);
		mousePressed[0] = false; //fixes shooting bullets after clicking play on the main menu
		this.loaded = true;
	}
	this.unload = function() {
		deleteByNameTag(this.nameTag);
		deleteByNameTag(this.healthBar.base.nameTag);
		deleteByNameTag(this.healthBarTxt.base.nameTag);
		deleteByNameTag(this.staminaBar.base.nameTag);
		deleteByNameTag(this.staminaBarTxt.base.nameTag);
		deleteByNameTag(this.weaponName.base.nameTag);
		deleteByNameTag(this.weaponNameTxt.base.nameTag);
		deleteByNameTag(this.ammoCount.base.nameTag);
		deleteByNameTag(this.ammoCountTxt.base.nameTag);
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
				this.healthBarLink.value = this.health.x;
				this.healthBarLink.maxValue = this.health.y;
				this.healthBarLink.update();
				this.staminaBarLink.value = this.stamina.x;
				this.staminaBarLink.maxValue = this.stamina.y;
				this.staminaBarLink.update();
				if(this.currentWeaponData != null){ 
				this.weaponNameTxt.text = "Weapon Name: "+this.currentWeaponData.name;
				}
				this.ammoCountTxt.text = "Ammo: "+this.ammo.x;
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
				if (mousePressed[0] && !isPaused && !this.lockWeapon && this.currentWeaponData != null && !SettingsMenu.iconHovered && this.playerOBJ != null) {
					if (fireTime == 0 && this.ammo.x > 0) {
						for (let i=0;i<this.currentWeaponData.amountPerShot;i++) {
							let newBullet = new Sprite(5, new baseObject(false, new nameTag("bullet_"+bulletAmount,this.currentWeaponData.name), this.currentWeaponData.size.duplicate(), this.playerOBJ.base.position.duplicate().addV(this.bulletSpawn.duplicate()), this.currentWeaponData.imageData.duplicate()));
							let angle = this.playerOBJ.base.position.getRotation(Cursor.cursor.base.position, false)+180;
							newBullet.base.nameTag.name = newBullet.base.nameTag.name+i;
							newBullet.base.position.r = degToRad(this.currentWeaponData.spreadPattern[i]+angle);
							newBullet.base.position.s = -this.currentWeaponData.speed;
							bulletAmount++;
							addObject(newBullet);
						}
						this.ammo.x--;
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
				if (mouseWheel > 0) {
					this.currentWeapon--;
					mouseWheel = 0;
				}
				if (mouseWheel < 0) {
					this.currentWeapon++;
					mouseWheel = 0;
				}
				if (this.currentWeapon > this.weapons.length-1) {
					this.currentWeapon = 0;
				}
				if (this.currentWeapon < 0) {
					this.currentWeapon = this.weapons.length-1;
				}
				if (this.weapons[this.currentWeapon] != undefined) {
					this.currentWeaponData = weaponTable[this.weapons[this.currentWeapon].weaponId];
				} else {
					this.currentWeaponData = null;
				}
			}
		}
	};
	addUpdate(update, "player");
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
		if (currentMap() != null && currentMap().loaded) {
			if (!currentPlayer.loaded) {
				currentPlayer.load(currentMap().playerPosInit);
			}
			if (!loadedCollisionArray) {
				collisionArray = getByNameTag(new nameTag("collide", ""), 1, false, true);
				if (collisionArray != null) {
					loadedCollisionArray = true;
				}
			} else {
				if (currentPlayer.loaded) {
					let distanceFilter = collisionArray.filter((o) => currentPlayer.playerOBJ.base.position.distance(o.base.position) <= 320);
					for (let i=0,length=distanceFilter.length;i<length;i++) {
						cirPolyCollision(currentPlayer.playerOBJ, distanceFilter[i], currentPlayer.controller, false);
					}
				}
			}
		}
	}
};
addUpdate(mainUpdate, "mainUpdate"); 

//Controls
let moveUpBttn = new key(
	"Up",
	[
		new keyData("w", 0)
	],
	new Vector2(() => {currentPlayer.controller.moveDir.y = -1}, () => {currentPlayer.controller.moveDir.y = 0}),
	false
);
let moveDownBttn = new key(
	"Down",
	[
		new keyData("s", 0)
	],
	new Vector2(() => {currentPlayer.controller.moveDir.y = 1}, () => {currentPlayer.controller.moveDir.y = 0}),
	false
);
let moveLeftBttn = new key(
	"Left",
	[
		new keyData("a", 0)
	],
	new Vector2(() => {currentPlayer.controller.moveDir.x = -1}, () => {currentPlayer.controller.moveDir.x = 0}),
	false
);
let moveRightBttn = new key(
	"Right",
	[
		new keyData("d", 0)
	],
	new Vector2(() => {currentPlayer.controller.moveDir.x = 1}, () => {currentPlayer.controller.moveDir.x = 0}),
	false
);
let runBttn = new key(
	"Run",
	[
		new keyData("Shift", 1)
	],
	new Vector2(() => {console.log("test")}, () => {}),
	false
);


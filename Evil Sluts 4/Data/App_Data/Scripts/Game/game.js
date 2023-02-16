//Setup
screen.setResolution(new Vector2(1280, 720));
engineSettings.Addons = ["mapRenderer"];
loadAddons();

//Custom paths
const weaponPath = "Weapons/";
const itemPath = "Items/";

//Images
//Player
let player_Img = new imageData("player", imagePath+"player_1.png", new Vector2(64, 128));
//Weapons
let bullet_1_Img = new imageData("tear", imagePath+weaponPath+"tear.png", new Vector2(59, 91));
//Items
let bath_salts_Img = new imageData("bath_salts", imagePath+itemPath+"bath_salts.png", new Vector2(32, 32));
let cocaine_Img = new imageData("cocaine", imagePath+itemPath+"cocaine.png", new Vector2(32, 32));
let crack_Img = new imageData("crack", imagePath+itemPath+"crack.png", new Vector2(32, 32));
let crocodile_Img = new imageData("crocodile", imagePath+itemPath+"crocodile.png", new Vector2(32, 32));
let dmt_Img = new imageData("dmt", imagePath+itemPath+"dmt.png", new Vector2(32, 32));
let heroin_Img = new imageData("heroin", imagePath+itemPath+"heroin.png", new Vector2(32, 32));
let lsd_Img = new imageData("lsd", imagePath+itemPath+"lsd.png", new Vector2(32, 32));
let meth_Img = new imageData("meth", imagePath+itemPath+"meth.png", new Vector2(32, 32));
let mushroom_Img = new imageData("mushroom", imagePath+itemPath+"mushroom.png", new Vector2(32, 32));
let smack_Img = new imageData("smack", imagePath+itemPath+"smack.png", new Vector2(32, 32));
let your_mom_Img = new imageData("your_mom", imagePath+itemPath+"your_mom.png", new Vector2(32, 32));
let chese_Img = new imageData("chese", imagePath+itemPath+"chese.png", new Vector2(32, 32));
//UI
let pick_up_bttn_Img = new imageData("pick_up_bttn", imagePath+"pick_up.png", new Vector2(64, 32));

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
	this.title = new Text(2, "Evil Sluts 4", new baseObject(false, new nameTag("title", "menu"), new Vector2("30px Arial", false, "center"), new Vector2(640, 100), colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
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

function baseItem(id=0, rariety=1, size=new Vector2(16, 16), imageData=null) {
	this.id = id;
	this.rariety = rariety;
	this.size = size;
	this.imageData = imageData;
	this.duplicate = () => {
		return new baseItem(this.id, this.rariety, this.size, this.imageData);
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
	new drugsItem("heroin", new baseItem(0, 1, new Vector2(32, 32), heroin_Img.getColor())),
	new drugsItem("crack", new baseItem(1, 1, new Vector2(32, 32), crack_Img.getColor())),
	new drugsItem("cocaine", new baseItem(2, 2, new Vector2(32, 32), cocaine_Img.getColor())),
	new drugsItem("lsd", new baseItem(3, 5, new Vector2(32, 32), lsd_Img.getColor())),
	new drugsItem("mushroom", new baseItem(4, 4, new Vector2(32, 32), mushroom_Img.getColor())),
	new drugsItem("crocodile", new baseItem(5, 1, new Vector2(32, 32), crocodile_Img.getColor())),
	new drugsItem("bath salts", new baseItem(6, 2, new Vector2(32, 32), bath_salts_Img.getColor())),
	new drugsItem("DMT", new baseItem(7, 6, new Vector2(32, 32), dmt_Img.getColor())),
	new drugsItem("meth", new baseItem(8, 1, new Vector2(32, 32), meth_Img.getColor())),
	new drugsItem("smack", new baseItem(9, 3, new Vector2(32, 32), smack_Img.getColor())),
	new drugsItem("chese", new baseItem(10, 10, new Vector2(32, 32), chese_Img.getColor())),
	new drugsItem("your mom", new baseItem(11, 7, new Vector2(32, 32), your_mom_Img.getColor())),
	//Weapons
	new weaponItem(0, new baseItem(101, 1, new Vector2(32, 32), bullet_1_Img.getColor())),
];

const getItemById = (id=0) => {
	return itemTable.filter((i) => i.base.id == id)[0];
	
}

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

const dropItem = (itemType="items", index=0) => {
	let inventoryItem = inventory[itemType][index];
	if (inventoryItem != undefined) {
		let dup = inventoryItem.duplicate();
		switch (currentPlayer.playerDir) {
			case -1:
				pos = currentPlayer.playerOBJ.base.position.addV(new Vector2(-30, 80));
			break;
			case 1:
				pos = currentPlayer.playerOBJ.base.position.addV(new Vector2(30, 80));
			break;
		}
		let droppedItem = new Sprite(2, new baseObject(true, new nameTag("itemDrop", "item_"+currentMap().nameTag.name), dup.base.size, pos, dup.base.imageData, new Shadow(new Vector2(5, -5), "black", 5)));
		droppedItem.item = inventoryItem.duplicate();
		droppedItem.pickUp = () => {
			addToInventory(droppedItem.item);
			droppedItem.base.marked = true;
		}
		if (typeof inventoryItem.unequip != "undefined") {
			inventoryItem.unequip();
		}
		inventory[itemType].splice(index, 1);
	}
}

const getDroppedItems = () => {
	let droppedItems = getByNameTag(new nameTag("itemDrop"), 1);
	if (droppedItems != null && typeof droppedItems.length == "undefined") {
		droppedItems = [droppedItems];
	}
	if (droppedItems != null) {
		return droppedItems.filter((i) => cirPolyCollision(currentPlayer.playerOBJ, i));
	} else {
		return null;
	}
}

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

const currentPlayer = new player(100, new Vector2(3, 7), new Vector2(100, 0.5, 0.1), 10, [getItemsByType("weapon")[0]], new Vector2(100, 100));

function player(maxHealth=100, playerSpeed=new Vector2(3, 7), maxStamina=new Vector2(100, 0.1), defence=10, weapons=[], ammo=new Vector2(100, 100)) {
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
	this.playerDir = -1;
	this.bulletSpawn = new Vector2();
	this.playerSpeed = new Vector2(playerSpeed.x, playerSpeed.y); //x- normal speed, y- running speed
	this.run = false;
	this.stamina = new Vector2(maxStamina.x, maxStamina.x, maxStamina.y, maxStamina.r); //x- current stamina, y- max stamina, r- stamina recharge
	this.controller = new playerController(false, "player", this.playerOBJ, this.playerSpeed.x, new Vector2(1, 0.5), new Vector2(100, 1180), new Vector2(100, 620));
	this.bttns = [];
	
	//UI
	//Health
	this.healthBarTxt = new Text(8, "Health", new baseObject(false, new nameTag("healthBarTxt", "UI"), new Vector2("30px Arial", false, "center"), new Vector2(640, 615), new colorData("white", 0.75), new Shadow(new Vector2(5, 5), "black", 5)));
	this.healthBar = new Rectangle(8, new baseObject(false, new nameTag("healthBar", "UI"), new Vector2(200, 25), new Vector2(640, 640), new colorData("black"), new Shadow(new Vector2(5, 5), "black", 5)));
	this.healthBarLink = new statusBar(this.healthBar, this.health.x, this.health.y, new Vector2("darkred", "darkgreen", 0.75));
	//Stamina
	this.staminaBarTxt = new Text(8, "Stamina", new baseObject(false, new nameTag("staminaBarTxt", "UI"), new Vector2("30px Arial", false, "center"), new Vector2(640, 670), new colorData("white", 0.75), new Shadow(new Vector2(5, 5), "black", 5)));
	this.staminaBar = new Rectangle(8, new baseObject(false, new nameTag("staminaBar", "UI"), new Vector2(200, 25), new Vector2(640, 695), new colorData("black"), new Shadow(new Vector2(5, 5), "black", 5)));
	this.staminaBarLink = new statusBar(this.staminaBar, this.stamina.x, this.stamina.y, new Vector2("ghostwhite", "darkblue", 0.75));
	//Weapon name
	this.weaponNameTxt = new Text(8, "Weapon Name", new baseObject(false, new nameTag("weaponNameTxt", "UI"), new Vector2("30px Arial", false, "left"), new Vector2(10, 20), new colorData("purple", 0.75), new Shadow(new Vector2(5, 5), "black", 5)));
	//Ammo count
	this.ammoCountTxt = new Text(8, "Ammo Count", new baseObject(false, new nameTag("ammoCount", "UI"), new Vector2("30px Arial", false, "left"), new Vector2(10, 50), new colorData("orange", 0.75), new Shadow(new Vector2(5, 5), "black", 5)));
	//Pick up bttn
	this.pickUpBttn = new Sprite(8, new baseObject(false, new nameTag("pickUpBttn", "UI_BTTN"), new Vector2(128, 64), new Vector2(1216, 688), pick_up_bttn_Img.getColor()));
	this.droppedItemsTxt = new Text(8, "0", new baseObject(false, new nameTag("droppedItemsTxt", "UI"), new Vector2("30px Arial", false, "center"), new Vector2(1152, 656), new colorData("white", 0.75), new Shadow(new Vector2(5, 5), "black", 5)));
	this.pickUpBttnLink = new buttonLink(this.pickUpBttn, this.droppedItemsTxt, recCollision, () => {
		
	}, new Vector2(pick_up_bttn_Img.getColor(0.75), pick_up_bttn_Img.getColor(1)), new Vector2(new colorData("white", 0.75), new colorData("white", 1)), null, new Vector2("rgba(0,0,0,192)", "rgba(0,0,0,256)"));
	
	this.respawn = function(pos) {
		if (pos != null) {
			this.pos = pos;
		}
		this.health.x = this.health.y;
		this.stamina.x = this.stamina.y;
		this.ammo.x = this.ammo.y;
		this.load(this.pos);
	}
	
	this.load = function(pos=null) {
		if (pos != null) {
			this.pos = pos;
		}
		currentMap().unload();
		this.playerOBJ = new Sprite(4, new baseObject(true, this.nameTag, this.size.multi(config.scale), this.pos, player_Img.getColor(), new Shadow(new Vector2(5, -5), "black", 10)));
		this.playerOBJ.scale.x = this.playerDir;
		this.controller.object = this.playerOBJ;
		this.controller.activate();
		addObject(this.healthBarTxt);
		addObject(this.healthBar);
		addObject(this.staminaBarTxt);
		addObject(this.staminaBar);
		addObject(this.weaponNameTxt);
	    addObject(this.ammoCountTxt);
		addObject(this.pickUpBttn);
		addObject(this.droppedItemsTxt);
		this.pickUpBttnLink.link();
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
		deleteByNameTag(this.pickUpBttn.base.nameTag);
		deleteByNameTag(this.droppedItemsTxt.base.nameTag);
		this.pickUpBttnLink.unlink();
		this.controller.deactivate();
		this.loaded = false;
	}
	
	this.damagePlayer = (damage=10) => {
		console.log(damage*(damage/this.defence));
		this.health.x -= clamp(damage*(damage/this.defence), 0, this.health.y);
	}
	
	const update = () => {
		deleteByMarked();
		if (typeof gameState != "undefined") {
			if (gameState == 0) {
				if (this.loaded) {
					this.unload();
				}
			} else {
				//UI
				if (this.bttns.length == 0 && getByNameTag(new nameTag("", "BTTN"), 2, false, true) != null) {
					if (typeof getByNameTag(new nameTag("", "BTTN"), 2, false, true).length != "undefined") {
						this.bttns = getByNameTag(new nameTag("", "BTTN"), 2, false, true);
					} else {
						this.bttns = [getByNameTag(new nameTag("", "BTTN"), 2, false, true)];
					}
				}
				if (this.bttns != null) {
					if (typeof this.bttns.length != "undefined") {
						let isTouchBttns = this.bttns.some((b) => recCollision(Cursor.cursor, b)); 
						if (isTouchBttns) {
							this.lockWeapon = true;
						} else {
							this.lockWeapon = false;
						}
					}
				}
				this.healthBarLink.value = this.health.x;
				this.healthBarLink.maxValue = this.health.y;
				this.healthBarLink.update();
				this.health.x = clamp(this.health.x, 0, this.health.y);
				if (this.health.x == 0) {
					this.dead = true;
				} else {
					this.dead = false;
				}
				this.staminaBarLink.value = this.stamina.x;
				this.staminaBarLink.maxValue = this.stamina.y;
				this.staminaBarLink.update();
				this.stamina.x = clamp(this.stamina.x, 0, this.stamina.y);
				if(this.currentWeaponData != null){ 
					this.weaponNameTxt.text = "Weapon Name: "+this.currentWeaponData.name;
				}
				this.ammoCountTxt.text = "Ammo: "+this.ammo.x;
				if (getDroppedItems() != null) {
					if (getDroppedItems().length > 100) {
						this.droppedItemsTxt.text = "100+";
					} else {
						this.droppedItemsTxt.text = getDroppedItems().length;
					}
				} else {
					this.droppedItemsTxt.text = "0";
				}
				//Player movement
				if (this.controller.moveDir.x != 0) {
					this.playerDir = -this.controller.moveDir.x;
				}
				if (this.controller.moveDir.x != 0 || this.controller.moveDir.y != 0) {
					if (this.run && this.stamina.x > 0) {
						this.controller.maxSpeed = this.playerSpeed.y;
						this.stamina.x -= this.stamina.r*delta;
					} else {
						this.controller.maxSpeed = this.playerSpeed.x;
					}
				}
				if (!this.run) {
					if (this.stamina.x < this.stamina.y) {
						this.stamina.x += this.stamina.o*delta;
					}
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
				if (mousePressed[0] && !isPaused && !this.lockWeapon && this.currentWeaponData != null && !SettingsMenu.iconHovered && this.playerOBJ != null && !this.dead) {
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
				if (this.dead) {
					deleteByNameTag(this.nameTag);
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
	new Vector2(() => {
		if (currentPlayer.loaded) {
			if (!currentPlayer.dead) {
				currentPlayer.controller.moveDir.y = -1;
			} else {
				currentPlayer.controller.moveDir.y = 0;
			}
		}
	}, () => {currentPlayer.controller.moveDir.y = 0}),
	true
);
let moveDownBttn = new key(
	"Down",
	[
		new keyData("s", 0)
	],
	new Vector2(() => {
		if (currentPlayer.loaded) {
			if (!currentPlayer.dead) {
				currentPlayer.controller.moveDir.y = 1;
			} else {
				currentPlayer.controller.moveDir.y = 0;
			}
		}
	}, () => {currentPlayer.controller.moveDir.y = 0}),
	true
);
let moveLeftBttn = new key(
	"Left",
	[
		new keyData("a", 0)
	],
	new Vector2(() => {
		if (currentPlayer.loaded) {
			if (!currentPlayer.dead) {
				currentPlayer.controller.moveDir.x = -1;
			} else {
				currentPlayer.controller.moveDir.x = 0;
			}
		}
	}, () => {currentPlayer.controller.moveDir.x = 0}),
	true
);
let moveRightBttn = new key(
	"Right",
	[
		new keyData("d", 0)
	],
	new Vector2(() => {
		if (currentPlayer.loaded) {
			if (!currentPlayer.dead) {
				currentPlayer.controller.moveDir.x = 1;
			} else {
				currentPlayer.controller.moveDir.x = 0;
			}
		}
	}, () => {currentPlayer.controller.moveDir.x = 0}),
	true
);
let runBttn = new key(
	"Run",
	[
		new keyData("Shift", 1)
	],
	new Vector2(() => {
		if (currentPlayer.loaded) {
			if (!currentPlayer.dead) {
				currentPlayer.run = true;
			} else {
				currentPlayer.run = false;
			}
		}
	}, () => {
		if (currentPlayer.loaded) {
			currentPlayer.run = false;
		}
	}),
	false
);


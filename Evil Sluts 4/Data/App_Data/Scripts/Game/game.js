//Setup
screen.setResolution(new Vector2(1280, 720));
Cursor.cursor.base.size = (new Vector2(14, 14));
Cursor.offset = Cursor.cursor.base.size.div(2);
engineSettings.Settings_Menu.Image_Smoothing = false;
engineSettings.Settings_Menu.Show_Debug_Cursor = false;
engineSettings.Addons = ["mapRenderer"];
loadAddons();
controllerManager.players = 1;

//Custom paths
const weaponPath = "Weapons/";
const itemPath = "Items/";

//Images
//Player
let player_Img = new imageData("player", imagePath+"player_1.png", new Vector2(64, 128));
//Weapons
let bullet_1_Img = new imageData("heart", imagePath+weaponPath+"Heart.png", new Vector2(59, 91));
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
		mousePressed[0] = false; //Fixes shooting when hitting play
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

//Dialogue
function  dialogueUI(){
	this.showing = true;
	this.showingOP1 = true;
	this.showingOP2 = true;
    this.dialogueBox = null;
	let dialogue = null;
	this.option1 = null;
	let option1Txt = null;
	this.option2 = null;
	let option2Txt = null;
	const update = () => {
		if(getByNameTag(name("dialogueBox"), 1) == null && this.showing && valuate(gameState)){
			this.dialogueBox = new Rectangle(8, new baseObject(true, new nameTag("dialogueBox", "UI"), Vec2(screen.resolution.x, 100), Vec2(screen.halfResolution.x, screen.resolution.y-50), new colorData("grey", 0.75)));
			//this.option1 = new Rectangle(8, new baseObject(true, new nameTag("option1", "UI"), Vec2(40, 30),this.dialogueBox.base.position.subV(Vec2(25, -50)), new colorData("darkgrey", 0.75), new shadow("black", FillVec2(5), 5)));
		}
	}
	addUpdate(update, "dialogueUI");
}

function option(text="", nextId=0) {
	this.text = text;
	this.nextId = nextId;
}

function convo(id=0, text="", options=null) {
	this.id = id;
	this.text = text;
	this.options = options;
	dialogueMG.addConvo(this);
}

const dialogueMG = new dialogueManager();
const dUI = new dialogueUI();

function dialogueManager() {
	let convos = [];
	let thisConvo = null;
	this.addConvo = (convo) => {
		convos.push(convo);
	}
	this.readConvo = (id=0) => {
		thisConvo = convos.filter(c => c.id == id);
	}
	const update = () => {
		if (thisConvo != null) {
			
		}
	}
	addUpdate(update, "dialogueMG");
} 

//Item pickup menu
const dropMenu = new pickUpMenu();

const defaultContainerStyle = new ContainerStyle();
function ContainerStyle(visColor="darkgrey", visTxtColor="white", visTxtFont="25px Arial", visTxtShadow=new Shadow(new Vector2(5, 5), "black", 5), visBttnColor=new Vector2("#686868", "#959595"), visSize=25) {
	this.visColor = visColor;
	this.visTxtColor = visTxtColor;
	this.visTxtFont = visTxtFont;
	this.visTxtShadow = visTxtShadow;
	this.visBttnColor = visBttnColor;
	this.visSize = visSize;
	this.duplicate = function() {
		return new ContainerStyle(this.visColor, this.visTxtColor, this.visTxtFont, this.visTxtShadow, this.visBttnColor, this.visSize);
	}
	this.dup = this.duplicate;
}

//Container object for the menu
function Container(layerNumber=1, base=EMPTY_OBJECT, objs=[], style=null) {
	this.layerNumber = layerNumber;
	this.base = base;
	this.objs = objs;
	this.containerStyle = defaultContainerStyle.dup();
	if (style != null) {
		this.containerStyle = style;
	}
	this.type = "container";
	let points_1 = [];
	let points_2 = [];
	this.getPoints = function() {
		return points_1;
	}
	this.getPoints2 = function() {
		return points_2;
	}
	this.duplicate = function() {
		return new Container(this.layerNumber, this.base.dup(), this.objs, this.containerStyle.dup());
	}
	this.dup = this.duplicate;
	this.draw = function() {
		//Background
		setupObject(this.base, DEFAULT_LINE);
		points_1 = [
			this.base.rotOrigin.rotateVector2(new Vector2(-this.base.size.x/2+this.base.position.x, -this.base.size.y/2+this.base.position.y), this.base.position.r),
			this.base.rotOrigin.rotateVector2(new Vector2(this.base.size.x/2+this.base.position.x, -this.base.size.y/2+this.base.position.y), this.base.position.r),
			this.base.rotOrigin.rotateVector2(new Vector2(this.base.size.x/2+this.base.position.x, this.base.size.y/2+this.base.position.y), this.base.position.r),
			this.base.rotOrigin.rotateVector2(new Vector2(-this.base.size.x/2+this.base.position.x, this.base.size.y/2+this.base.position.y), this.base.position.r),
			this.base.rotOrigin.rotateVector2(new Vector2(-this.base.size.x/2+this.base.position.x, -this.base.size.y/2+this.base.position.y), this.base.position.r)];
		let thisPath = new Path2D();
		thisPath.moveTo(this.base.position.x, this.base.position.y);
		for (let i=0;i<points_1.length;i++) {
			thisPath.lineTo(points_1[i].x, points_1[i].y);
		}
		ctx.fill(thisPath);
		ctx.save();
		ctx.clip(thisPath);
		//Vis bg
		let visSize = new Vector2(this.base.size.x, this.objs.length*this.containerStyle.visSize);
		points_2 = [
				this.base.rotOrigin.rotateVector2(new Vector2(-visSize.x/2+this.base.position.x, -visSize.y+this.base.position.y-this.base.size.div(2).y), this.base.position.r),
				this.base.rotOrigin.rotateVector2(new Vector2(visSize.x/2+this.base.position.x, -visSize.y+this.base.position.y-this.base.size.div(2).y), this.base.position.r),
				this.base.rotOrigin.rotateVector2(new Vector2(visSize.x/2+this.base.position.x, visSize.y+this.base.position.y-this.base.size.div(2).y), this.base.position.r),
				this.base.rotOrigin.rotateVector2(new Vector2(-visSize.x/2+this.base.position.x, visSize.y+this.base.position.y-this.base.size.div(2).y), this.base.position.r),
				this.base.rotOrigin.rotateVector2(new Vector2(-visSize.x/2+this.base.position.x, -visSize.y+this.base.position.y-this.base.size.div(2).y), this.base.position.r)];
		let thisPath2 = new Path2D();
		thisPath2.moveTo(this.base.position.x, this.base.position.y);
		for (let i=0;i<points_2.length;i++) {
			thisPath2.lineTo(points_2[i].x, points_2[i].y);
		}
		ctx.fillStyle = this.containerStyle.visColor;
		ctx.fill(thisPath2);
		//Vis txt
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.font = this.containerStyle.visTxtFont;
		ctx.fillStyle = this.containerStyle.visTxtColor;
		if (engineSettings.Allow_Shadows) {
			ctx.shadowColor = this.containerStyle.visTxtShadow.color;
			ctx.shadowBlur = this.containerStyle.visTxtShadow.blur;
			ctx.shadowOffsetX = this.containerStyle.visTxtShadow.offset.x;
			ctx.shadowOffsetY = this.containerStyle.visTxtShadow.offset.y;
		} else {
			ctx.shadowColor = NO_SHADOW.color;
			ctx.shadowBlur = NO_SHADOW.blur;
			ctx.shadowOffsetX = NO_SHADOW.offset.x;
			ctx.shadowOffsetY = NO_SHADOW.offset.y;
		}
		for (let i=1,length=this.objs.length;i<=length;i++) {
			ctx.fillText(getItemName(this.objs[i-1].item), this.base.position.x-this.base.size.div(2).x+5, ((i-1)*this.containerStyle.visSize)+(this.base.position.y-this.base.size.div(2).y)+(this.containerStyle.visSize/2));
		}
		//Vis bttn
		let visBttnSize = new Vector2(170, this.containerStyle.visSize);
		ctx.shadowColor = NO_SHADOW.color;
		ctx.shadowBlur = NO_SHADOW.blur;
		ctx.shadowOffsetX = NO_SHADOW.offset.x;
		ctx.shadowOffsetY = NO_SHADOW.offset.y;
		for (let i=1,length=this.objs.length;i<=length;i++) {
			let visBttnPos = new Vector2((this.base.position.x+this.base.size.div(2).x)-visBttnSize.div(2).x, ((i-1)*this.containerStyle.visSize)+(this.base.position.y-this.base.size.div(2).y));
			if (recCollision({"base":{"position":Cursor.cursor.base.position, "size":ONE}}, {"base":{"position":visBttnPos.addV(visBttnSize.div(2)), "size":visBttnSize}}) && recCollision(Cursor.cursor, this)) {
				ctx.fillStyle = this.containerStyle.visBttnColor.y;
				if (mousePressed[0]) {
					this.objs[i-1].pickUp();
					mousePressed[0] = false;
				}
			} else {
				ctx.fillStyle = this.containerStyle.visBttnColor.x;
			}
			ctx.fillRect(visBttnPos.x, visBttnPos.y, visBttnSize.x, visBttnSize.y);
		}
		//Vis bttn txt
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.font = this.containerStyle.visTxtFont;
		ctx.fillStyle = this.containerStyle.visTxtColor;
		if (engineSettings.Allow_Shadows) {
			ctx.shadowColor = this.containerStyle.visTxtShadow.color;
			ctx.shadowBlur = this.containerStyle.visTxtShadow.blur;
			ctx.shadowOffsetX = this.containerStyle.visTxtShadow.offset.x;
			ctx.shadowOffsetY = this.containerStyle.visTxtShadow.offset.y;
		} else {
			ctx.shadowColor = NO_SHADOW.color;
			ctx.shadowBlur = NO_SHADOW.blur;
			ctx.shadowOffsetX = NO_SHADOW.offset.x;
			ctx.shadowOffsetY = NO_SHADOW.offset.y;
		}
		for (let i=1,length=this.objs.length;i<=length;i++) {
			ctx.fillText("Pick up", (this.base.position.x+this.base.size.div(2).x)-visBttnSize.div(2).x, ((i-1)*this.containerStyle.visSize)+(this.base.position.y-this.base.size.div(2).y)+(this.containerStyle.visSize/2));
		}
		ctx.restore();
	}
	if (this.base.autoAdd && this.layerNumber >= 1 && this.layerNumber <= 8) {
		layer[this.layerNumber].push(this);
		loaded = false;
	}
}

function pickUpMenu() {
	this.size = new Vector2(600, 375);
	this.pos = screen.halfResolution.dup();
	
	let items = [];
	let itemVis = [];
	let count = 1;
	this.updateFrequence = 1;
	this.maxUpdateTime = 10;
	
	this.isShowing = false;
	this.isClickedOn = false;
	
	this.tag = "pickup_menu";
	this.componentTable = {
		"Background":null,
		"MenuTitle":null,
		"CloseBttn":null,
		"CloseBttnLink":null,
		"ItemContainer":null,
	}
	
	this.init = () => {
		if (!this.isShowing) {
			const compList = this.componentTable;
			//Window setup
			compList.Background = new Rectangle(8, new baseObject(true, new nameTag("Background", this.tag), this.size.duplicate(), this.pos.dup(), new colorData("grey", 0.6), new Shadow(new Vector2(5, 5), "black", 10)));
			compList.MenuTitle = new Text(8, "Ground Items", new baseObject(true, new nameTag("MenuTitle", this.tag), new Vector2("25px Arial", false, "center"), new Vector2(0, (this.size.y/2)-15), new colorData("white", 0), new Shadow(new Vector2(5, 5), "black", 10)));
			compList.MenuTitle.base.overridePositionUpdateFunction = true;
			compList.MenuTitle.base.loaded = false;
			compList.MenuTitle.base.updatePosition = () => {
				if (isPaused) {
					compList.MenuTitle.base.position = compList.Background.base.position.subV(compList.MenuTitle.base.startPosition);
					compList.MenuTitle.base.loaded = true;
				}
				if (compList.MenuTitle.base.loaded) {
					compList.MenuTitle.base.color.alpha = 0.6;
				}
			}
			compList.MenuTitle.base.updatePosition();
			compList.CloseBttn = new Sprite(8, new baseObject(true, new nameTag("CloseBttn", this.tag), new Vector2(20, 20), new Vector2(-((this.size.x/2)-12.5), (this.size.y/2)-12.5), Close_UI.getColor(0), new Shadow(new Vector2(5, 5), "black", 10)));
			compList.CloseBttn.base.overridePositionUpdateFunction = true;
			compList.CloseBttn.base.loaded = false;
			compList.CloseBttn.base.updatePosition = () => {
				if (isPaused) {
					compList.CloseBttn.base.position = compList.Background.base.position.subV(compList.CloseBttn.base.startPosition);
					compList.CloseBttn.base.loaded = true;
				}
				if (compList.CloseBttn.base.loaded) {
					compList.CloseBttn.base.color.alpha = 0.6;
				}
			}
			compList.CloseBttn.base.updatePosition();
			compList.CloseBttnLink = new buttonLink(compList.CloseBttn, null, recCollision, () => {
				this.hide();
				mousePressed[0] = false;
			}, new Vector2(Close_UI.getColor(0.75), Close_UI_Hover.getColor(0.75)));
			compList.CloseBttnLink.link();
			compList.ItemContainer = new Container(8, new baseObject(true, new nameTag("ItemContainer", this.tag), new Vector2(this.size.x, this.size.y-25), new Vector2(0, -12.5), new colorData("lightgrey", 0)), []);
			compList.ItemContainer.base.overridePositionUpdateFunction = true;
			compList.ItemContainer.base.loaded = false;
			compList.ItemContainer.base.updatePosition = () => {
				if (isPaused) {
					compList.ItemContainer.base.position = compList.Background.base.position.subV(compList.ItemContainer.base.startPosition);
					compList.ItemContainer.base.loaded = true;
				}
				if (compList.ItemContainer.base.loaded) {
					compList.ItemContainer.base.color.alpha = 0.5;
				}
			}
			this.isShowing = true;
		}
	}
	
	this.hide = () => {
		deleteByNameTag(new nameTag("", this.tag), 2, true);
		this.componentTable.CloseBttnLink.unlink();
		isPaused = false;
		this.isShowing = false;
	}
	
	//Resets the item ui
	this.resetVis = () => {
		for (let i=0,length=itemVis.length;i<length;i++) {
			itemVis[i].base.destroy();
			if (i == length-1) {
				itemVis = [];
			}
		}
	}
	
	const update = () => {
		//Updates item list
		if (this.isShowing) {
			isPaused = true;
			count += this.updateFrequence*delta;
			if (count > this.maxUpdateTime) {
				//Get items from ground by distance to player
				let result = getDroppedItems();
				if (result != null) {
					items = result;
				} else {
					items = [];
				}
				//Reset counter
				count = 1;
			}
			this.componentTable.ItemContainer.objs = items;
		}
	}
	addUpdate(update, "pickUpMenu");
}

function statusBar(obj=BLANK_OBJECT, value=0, maxValue=100, color=new Vector2()) {
	this.obj = obj;
	this.value = value;
	this.maxValue = maxValue;
	this.color = color; //x- end color, y- start color, r- alpha
	this.gradient = new Rainbow();
	this.setColors = (color=new Vector2()) => {
		this.gradient.setSpectrum(this.color.x, this.color.y);
	}
	this.gradient.setNumberRange(0, this.maxValue);
	this.setColors(this.color);
	let sizeX = this.obj.base.size.duplicate().x;
	this.update = () => {
		this.obj.base.color = new colorData("#"+this.gradient.colorAt(this.value), this.color.r);
		this.obj.base.size.x = sizeX*(this.value/(this.maxValue/100)/100);
	}
}

function weapon(name="", imageData=null, amountPerShot=1, fireTime=new Vector2(1, 10), size=ONE, spreadPattern=[0], _speedRange=ONE, _rangeRange=ONE, _damageRange=ONE) {
	this.name = name;
	this.imageData = imageData;
	this.amountPerShot = amountPerShot;
	if (this.amountPerShot <= 0) {
		this.amountPerShot = 1;
	}
	this.fireTime = fireTime; //x- speed for timer, y- max time
	this.size = size;
	let speedRange = _speedRange;
	this.speed = 0;
	let rangeRange = _rangeRange;
	this.range = 0;
	let damageRange = _damageRange;
	this.damage = 0; //x- min damage, y- max damage
	this.spreadPattern = spreadPattern;
	this.genStats = () => {
		this.speed = rangeFloat(speedRange.x, speedRange.y);
		this.range = rangeFloat(rangeRange.x, rangeRange.y);
		this.damage = Vec2(rangeFloat(damageRange.x, damageRange.y), rangeFloat(damageRange.r, damageRange.o));
	}
	this.duplicate = () => {
		let newWeapon = new weapon(this.name, this.imageData, this.amountPerShot, this.fireTime, this.size, this.spreadPattern, speedRange, rangeRange, damageRange);
		newWeapon.speed = this.speed;
		newWeapon.range = this.range;
		newWeapon.damage = this.damage;
		return newWeapon;
	}
}

const weaponTable = {
	0:new weapon("Test", bullet_1_Img.getColor(), 5, new Vector2(1, 10), new Vector2(10,10), [-12.5, -6.25, 0, 6.26, 12.5], Vec2(10, 15), Vec2(50, 100), Vec2(1, 2, 5, 10)),
}

let armorTypes = {
	0:"Head",
	1:"Chest",
	2:"Legs",
	3:"Feet"
}

function armor(name="", imageData=null, size=ONE, armorType="", _defenceStatRange=ONE) {
	this.name = name;
	this.imageData = imageData;
	this.size = size;
	this.armorType = armorType;
	let defenceStatRange = _defenceStatRange;
	this.defenceStat = 0;
	this.genStats = () => {
			this.defenceStat = rangeFloat(defenceStatRange.x, defenceStatRange.y);
	}
	this.duplicate = () => {
		let newArmor = new armor(this.name, this.imageData, this.size, this.armorType, defenceStatRange);
		newArmor.defenceStat = this.defenceStat;
		return newArmor;
	}
}

const armorTable = {
	0:new armor("Test", null, ONE, armorTypes[0], Vec2(1,5)),
}

function baseItem(id=0, rariety=1, cost=0, size=new Vector2(16, 16), imageData=null) {
	this.id = id;
	this.rariety = rariety;
	this.cost = cost;
	this.size = size;
	this.imageData = imageData;
	this.duplicate = () => {
		return new baseItem(this.id, this.rariety, this.cost, this.size, this.imageData);
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

function weaponItem(weaponId=0, base=new baseItems(), veriant=null) {
	this.weaponId = weaponId;
	this.base = base;
	this.itemType = "weapon";
	this.mainType = "weapons"; //What inventory array it goes into
	this.weaponVeriant = veriant;
	if (veriant == null) {
		this.weaponVeriant = weaponTable[this.weaponId].duplicate();
		this.weaponVeriant.genStats();
	}
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
	this.duplicate = (copyVeriant=false) => {
		if (!copyVeriant) {
			return new weaponItem(this.weaponId, this.base.duplicate());
		} else {
			return new weaponItem(this.weaponId, this.base.duplicate(), this.weaponVeriant);
		}
	}
}

function armorItems(armorId=0, base=new baseItems(), veriant=null) {
	this.armorId = armorId; 
	this.base = base;
	this.itemType = "armor";
	this.mainType = "armor";
	this.armorVeriant = veriant;
	if (veriant == null) {
		this.armorVeriant = armorTable[this.armorId].duplicate();
		this.armorVeriant.genStats();
	}
	this.equip = () => {
		if (currentPlayer.loaded && currentPlayer.armor.filter((i) => armorTable[i.armorId].armorType == armorTable[this.armorId].armorType).length == 0) {
			currentPlayer.armor.push(this);
		}
	}
	this.unequip = () => {
		if (currentPlayer.loaded && currentPlayer.armor.filter((i) => i.armorId == this.armorId).length != 0){
			currentPlayer.armor.forEach((w, i) => {
				if (w.armorId == this.armorId) {
					currentPlayer.armor.splice(i, 1);
				}
			});
		} 
	}
	this.duplicate = (copyVeriant=false) => {
		if (!copyVeriant) {
			return new armorItems(this.armorId, this.base.duplicate());
		} else {
			return new armorItems(this.armorId, this.base.duplicate(), this.armorVeriant);
		}
	}
}

const globalExcludedDrops = [];

const itemTable = [
	//Items
	new drugsItem("heroin", new baseItem(0, 1, 0, Vec2(32, 32), heroin_Img.getColor())),
	new drugsItem("crack", new baseItem(1, 1, 0, Vec2(32, 32), crack_Img.getColor())),
	new drugsItem("cocaine", new baseItem(2, 2, 0, Vec2(32, 32), cocaine_Img.getColor())),
	new drugsItem("lsd", new baseItem(3, 5, 0, Vec2(32, 32), lsd_Img.getColor())),
	new drugsItem("mushroom", new baseItem(4, 4, 0, Vec2(32, 32), mushroom_Img.getColor())),
	new drugsItem("crocodile", new baseItem(5, 1, 0, Vec2(32, 32), crocodile_Img.getColor())),
	new drugsItem("bath salts", new baseItem(6, 2, 0, Vec2(32, 32), bath_salts_Img.getColor())),
	new drugsItem("DMT", new baseItem(7, 6, 0, Vec2(32, 32), dmt_Img.getColor())),
	new drugsItem("meth", new baseItem(8, 1, 0, Vec2(32, 32), meth_Img.getColor())),
	new drugsItem("smack", new baseItem(9, 3, 0, Vec2(32, 32), smack_Img.getColor())),
	new drugsItem("chese", new baseItem(10, 10, 0, Vec2(32, 32), chese_Img.getColor())),
	new drugsItem("your mom", new baseItem(11, 7, 0, Vec2(32, 32), your_mom_Img.getColor())),
	//Weapons
	new weaponItem(0, new baseItem(101, 1, 0, Vec2(32, 32), bullet_1_Img.getColor())),
	//Armor
	new armorItems(0, new baseItem(201, 1, 0, Vec2(32, 32), bullet_1_Img.getColor())),
];

const getItemName = (item) => {
	let result = null;
	switch (item.mainType) {
		case "items":
			result = item.type;
		break;
		case "weapons":
			result = weaponTable[item.weaponId].name;
		break;
		case "armor":
			result = armorTable[item.armorId].name;
		break;
	}
	return result;
}

//Gets all item types
const getItemTypes = (exclude=[]) => {
	let result = [];
	let done = false;
	itemTable.forEach((t, i) => {
		if (!exclude.every((e) => e == t.itemType) || exclude.length == 0) {
			let resultIncludes = result.some((r) => r == t.itemType);
			if (!resultIncludes) {
				result.push(t.itemType);
			}
		}
		if (i >= itemTable.length-1) {
			done = true;
		}
	});
	if (done) {
		return result;
	}
}

//Gets an item by it's id
const getItemById = (id=0) => {
	return itemTable.filter((i) => i.base.id == id)[0];
}

const getItemsByType = (type="", mode=0, excluded=[]) => {
	if (mode < 0) {
		mode = 0;
	}
	if (mode > 1) {
		mode = 1;
	}
	switch (mode) {
	case 0:
		if (excluded.length != 0) {
			return itemTable.filter((i) => (type.includes(i.itemType) && !excluded.every((e) => getItemName(i) == e)));
		} else {
			return itemTable.filter((i) => type.includes(i.itemType));
		}
	break;
	case 1:
		if (excluded.length != 0) {
			return itemTable.filter((i) => (!type.includes(i.itemType) && !excluded.every((e) => getItemName(i) == e)));
		} else {
			return itemTable.filter((i) => !type.includes(i.itemType));
		}
	break;
	}
}

//Random loot by type
const getRandomByType = (type="", rarietyRange=new Vector2(1, 10), nameExclude=[]) => {
	if (rarietyRange.x < 1) {
		rarietyRange.x = 0;
	}
	if (rarietyRange.x > rarietyRange.y) {
		rarietyRange.x = rarietyRange.y;
	}
	if (rarietyRange.y > 10) {
		rarietyRange.y = 10;
	}
	if (rarietyRange.y < rarietyRange.x) {
		rarietyRange.y = rarietyRange.x;
	}
	const typeArray = getItemsByType(type, 0, globalExcludedDrops.concat(nameExclude)).filter((i) => i.base.rariety >= rarietyRange.x && i.base.rariety <= rarietyRange.y);
	if (typeArray.length != 0) {
		return typeArray[rangeInt(0, typeArray.length-1)];
	} else {
		return null;
	}
}

//Random loot
const lootGen = (rarietyRange=new Vector2(1, 10), typeExclude=[], nameExclude=[]) => {
	if (rarietyRange.x < 1) {
		rarietyRange.x = 0;
	}
	if (rarietyRange.x > rarietyRange.y) {
		rarietyRange.x = rarietyRange.y;
	}
	if (rarietyRange.y > 10) {
		rarietyRange.y = 10;
	}
	if (rarietyRange.y < rarietyRange.x) {
		rarietyRange.y = rarietyRange.x;
	}
	const types = getItemTypes(typeExclude);
	const randType = types[rangeInt(0, types.length-1)];
	const items = getItemsByType(randType, 0, globalExcludedDrops.concat(nameExclude));
	const itemRarietyPool = items.filter((i) => i.base.rariety >= rarietyRange.x && i.base.rariety <= rarietyRange.y);
	return itemRarietyPool[rangeInt(0, itemRarietyPool.length-1)];
}

const getLootTable = (amountRange=new Vector2(1, 10), rarietyRange=new Vector2(1, 10), typeExclude=[], nameExclude=[]) => {
	if (amountRange.x < 1) {
		amountRange.x = 0;
	}
	if (amountRange.x > amountRange.y) {
		amountRange.x = amountRange.y;
	}
	if (amountRange.y < amountRange.x) {
		amountRange.y = amountRange.x;
	}
	if (rarietyRange.x < 1) {
		rarietyRange.x = 0;
	}
	if (rarietyRange.x > rarietyRange.y) {
		rarietyRange.x = rarietyRange.y;
	}
	if (rarietyRange.y > 10) {
		rarietyRange.y = 10;
	}
	if (rarietyRange.y < rarietyRange.x) {
		rarietyRange.y = rarietyRange.x;
	}
	const lootTable = [];
	let done = false;
	for (let i=0,length=rangeInt(amountRange.x, amountRange.y);i<length;i++) {
		let thisLoot = lootGen(rarietyRange, typeExclude, nameExclude);
		lootTable.push(thisLoot);
		if (i == length-1) {
			done = true;
		}
	}
	if (done) {
		return lootTable;
	}
}

//Spawns an item
const spawnItem = (id=0, dropPos=ZERO) => {
	let thisItem = id;
	if (typeof id == "number") {
		thisItem = getItemById(id);
	}
	if (thisItem != undefined) {
		if (!Array.isArray(id)) {
			let dup = thisItem.duplicate();
			let droppedItem = new Sprite(2, new baseObject(true, new nameTag("itemDrop", "item"), dup.base.size, dropPos, dup.base.imageData, new Shadow(new Vector2(5, -5), "black", 5)));
			droppedItem.base.overridePositionUpdateFunction = true;
			droppedItem.base.updatePosition = () => {
				if (!isPaused && currentMap() != null) {
					droppedItem.base.position = droppedItem.base.startPosition.duplicate().addV(currentMap().mapPos);
				}
			}
			droppedItem.item = dup;
			droppedItem.pickUp = () => {
				addToInventory(droppedItem.item);
				droppedItem.base.marked = true;
			}
		} else {
			for (let i=0,length=id.length;i<length;i++) {
				let dup = thisItem[i].duplicate();
				let droppedItem = new Sprite(2, new baseObject(true, new nameTag("itemDrop", "item"), dup.base.size, dropPos, dup.base.imageData, new Shadow(new Vector2(5, -5), "black", 5)));
				droppedItem.base.overridePositionUpdateFunction = true;
				droppedItem.base.updatePosition = () => {
					if (!isPaused && currentMap() != null) {
						droppedItem.base.position = droppedItem.base.startPosition.duplicate().addV(currentMap().mapPos);
					}
				}
				droppedItem.item = dup;
				droppedItem.pickUp = () => {
					addToInventory(droppedItem.item);
					droppedItem.base.marked = true;
				}
			}
		}
	}
}

//Adds item to inventory
const addToInventory = (item=null) => {
	if (item != null) {
		inventory[item.mainType].push(item);
	}
}

const inventory = {
	"weapons":[getItemsByType("weapon")[0]],
	"armor":[],
	"items":[],
};

//Drops item from the players inventory
const dropItem = (itemType="items", index=0) => {
	let inventoryItem = inventory[itemType][index];
	if (inventoryItem != undefined) {
		let dup = inventoryItem.duplicate(true);
		let droppedItem = new Sprite(2, new baseObject(true, new nameTag("itemDrop", "item"), dup.base.size, currentPlayer.playerItemDropPos, dup.base.imageData, new Shadow(new Vector2(5, -5), "black", 5)));
		droppedItem.base.overridePositionUpdateFunction = true;
		droppedItem.base.updatePosition = () => {
			if (!isPaused && currentMap() != null) {
				droppedItem.base.position = droppedItem.base.startPosition.duplicate().addV(currentMap().mapPos);
			}
		}
		droppedItem.item = dup;
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

//Gets all drops items
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

const currentPlayer = new player(100, new Vector2(3, 7), new Vector2(100, 0.5, 0.1), 10, [inventory.weapons[0]], [], new Vector2(100, 100));

//TODO: Implement armor functionality
function player(maxHealth=100, playerSpeed=new Vector2(3, 7), maxStamina=new Vector2(100, 0.1), defence=10, weapons=[], armor=[], ammo=new Vector2(100, 100)) {
	this.defence = defence;
	this.armor = armor;
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
	this.playerItemDropPos = new Vector2();
	this.bulletSpawn = new Vector2();
	this.playerSpeed = new Vector2(playerSpeed.x, playerSpeed.y); //x- normal speed, y- running speed
	this.run = false;
	this.stamina = new Vector2(maxStamina.x, maxStamina.x, maxStamina.y, maxStamina.r); //x- current stamina, y- max stamina, r- stamina recharge
	this.controller = new playerController(false, "player", this.playerOBJ, this.playerSpeed.x, new Vector2(1, 0.5), new Vector2(100, 1180), new Vector2(100, 620));
	this.bttns = [];
	this.playerBullets = [];
	
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
		dropMenu.init();
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
		this.unload();
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
		deleteByNameTag(this.weaponNameTxt.base.nameTag);
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
				} else {
					this.weaponNameTxt.text = "Weapon Name: None";
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
					switch (this.playerDir) {
						case -1:
							this.playerItemDropPos = this.playerOBJ.base.position.addV(new Vector2(-30, 80));
						break;
						case 1:
							this.playerItemDropPos = this.playerOBJ.base.position.addV(new Vector2(30, 80));
						break;
					}
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
				//Player shooting
				if (mousePressed[0] && !isPaused && !this.lockWeapon && this.currentWeaponData != null && !SettingsMenu.iconHovered && this.playerOBJ != null && !this.dead) {
					if (fireTime == 0 && this.ammo.x > 0) {
						for (let i=0;i<this.currentWeaponData.amountPerShot;i++) {
							let newBullet = new Sprite(5, new baseObject(false, new nameTag("bullet_"+bulletAmount,"player_bullet_"+this.currentWeaponData.name), this.currentWeaponData.size.duplicate(), this.playerOBJ.base.position.duplicate().addV(this.bulletSpawn.duplicate()), this.currentWeaponData.imageData.duplicate()));
							let angle = this.playerOBJ.base.position.getRotation(Cursor.cursor.base.position, false)+180;
							newBullet.base.nameTag.name = newBullet.base.nameTag.name+i;
							newBullet.base.position.r = degToRad(this.currentWeaponData.spreadPattern[i]+angle);
							newBullet.base.position.s = -this.currentWeaponData.speed;
							newBullet.damage = rangeFloat(this.currentWeaponData.damage.x, this.currentWeaponData.damage.y);
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
				this.playerBullets = getByNameTag(new nameTag("", "player_bullet"), 2, false, true);
				if (this.playerBullets != null) {
					for (let i=0;i<this.playerBullets.length;i++) {
						let dist = this.playerBullets[i].base.startPosition.distance(this.playerBullets[i].base.position);
						if (dist > this.currentWeaponData.range) {
							this.playerBullets[i].base.marked = true;
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
					this.currentWeaponData = this.weapons[this.currentWeapon].weaponVeriant;
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

//Add enemy spawn array / randomly get from array
function enemySpawner(enemyName="", enemySize=new Vector2(), enemyPositions=[new Vector2()], imgData=null, shadowData=NO_SHADOW, spawnAmount=0, spawnSpeed=new Vector2(0.5, 5), maxHealth=100, defense=10, speed=new Vector2(4, 5, 6, 7, 0.25), stopDistance=200, weaponId=0/**damage=new Vector2(6, 8)**/, confirmedDrop=null, lootAmount=new Vector2(1, 4), drugAmount=new Vector2(1, 1), dropRariety=new Vector2(1, 3), dropTypeExclude=[], dropNameExclude=[]) {
	this.enemyName = enemyName;
	this.enemySize = enemySize;
	this.enemyPositions = enemyPositions; //can be an array of positions
	this.imgData = imgData;
	this.shadowData = shadowData;
	this.spawnAmount = spawnAmount;
	this.spawnSpeed = spawnSpeed; //x- speed, y- max time
	this.maxHealth = maxHealth;
	this.defense = defense;
	this.speed = speed; //x- min normal speed, y- max normal speed, r- min agro speed, o- max agro speed, s- health agro percent
	this.stopDistance = stopDistance;
	this.weaponId = weaponId;
	//this.damage = damage; //x- min damage, y- max damage
	this.confirmedDrop = confirmedDrop; //drops this item when killed
	this.lootAmount = lootAmount;
	this.drugAmount = drugAmount; //x- min drugs, y- max drugs
	this.dropRariety = dropRariety; //x- min rariety, y- max rariety
	this.dropTypeExclude = dropTypeExclude; //array of item types to exclude from the loot table
	this.dropNameExclude = dropNameExclude; //array of item names to exclude from the loot table
	
	this.enemies = [];
	this.time = 0;
	this.count = 0;
	let enemyPos = new Vector2();
	
	this.spawn = () => {
		if (typeof this.enemyPositions.length == "undefined") {
			enemyPos = this.enemyPositions;
		} else {
			enemyPos = this.enemyPositions[rangeInt(0, this.enemyPositions.length-1)];
		}
		if (this.count < this.spawnAmount) {
			let enemyHealthBar = new Rectangle(4, new baseObject(false, new nameTag(this.enemyName+"_"+this.count+"_healthBar", "enemy_healthBar"), new Vector2(100, 5), enemyPos.subV(new Vector2(0, this.enemySize.div(2).y+10)), new colorData("darkgreen", 0.75), new Shadow(new Vector2(5, 5), "black", 5)));
			let enemyHealthBarLink = new statusBar(enemyHealthBar, this.maxHealth, this.maxHealth, new Vector2("darkred", "darkgreen", 0.75));
			let enemy = new Sprite(4, new baseObject(false, new nameTag(this.enemyName+"_"+this.count, "enemy"), this.enemySize, enemyPos, this.imgData, this.shadowData));
			//Overwrite the movement function to fix janky enemy movement
			enemy.base.overridePositionUpdateFunction = true; //Fixes movement jitter caused by the position update function not updating when the speed is 0
			enemy.base.updatePosition = () => {
				if (!isPaused && currentMap() != null) {
					let velocity = new Vector2(((enemy.base.position.s*Math.sin(enemy.base.position.o))*delta), -((enemy.base.position.s*Math.cos(enemy.base.position.o))*delta));
					enemy.base.startPosition = enemy.base.startPosition.duplicate().addV(velocity);
					enemy.base.position = enemy.base.startPosition.duplicate().addV(currentMap().mapPos);
				}
			}
			
			enemy.weapon = weaponTable[this.weaponId].duplicate();
			enemy.weapon.genStats();
			enemy.speed = new Vector2(rangeFloat(this.speed.x, this.speed.y, 1), rangeFloat(this.speed.r, this.speed.o, 1));
			enemy.defense = this.defense;
			enemy.health = this.maxHealth;
			enemy.maxHealth = this.maxHealth;
			enemy.healthBar = enemyHealthBar;
			enemy.healthBarLink = enemyHealthBarLink;
			enemy.agro = false;
			enemy.inRange = false;
			
			enemy.damage = (damage=10) => {
				if (enemy.defense != 0) {
					enemy.health -= clamp(damage*(damage/this.defense), 0, enemy.maxHealth);
				} else {
					enemy.health -= clamp(damage, 0, enemy.maxHealth);
				}
			}
			
			this.enemies.push(enemy);
			addObject(enemyHealthBar);
			addObject(enemy);
			this.count++;
		}
	}
	
	this.shoot = () => {
		for(enemy of this.enemies) {
			let bulletTime = T(MSecond(enemy.weapon.fireTime.y), true, false, () => {
				let newBullet = new Sprite(5, new baseObject(false, new nameTag(enemy.weapon.name, "bullets"), enemy.weapon.size, enemy.base.position.dup(), enemy.weapon.imageData));
				newBullet.base.position.s = -enemy.weapon.speed;
				newBullet.base.position.r = newBullet.base.position.getRotation(currentPlayer.playerOBJ.base.position)+degToRad(180);
				addObject(newBullet);
			}, "Bullet_Timer");
			if(enemy.inRange){
				console.log("TEST");
				if (!bulletTime.active) {
					bulletTime.start(true);
				}
			} else {
				if (bulletTime.active) {
					bulletTime.pause();
				}
			}
		}
	}
	
	const update = () => {
		this.shoot();
		//Spawns enemies
		if (this.count < this.spawnAmount) {
			this.time += this.spawnSpeed.x*delta;
		}
		if (this.time >= this.spawnSpeed.y) {
			this.spawn();
			currentMap().removeMap = true;
			this.time = 0;
		}
		//Kill enemies when health reaches 0
		if (this.enemies.length != 0) {
			let enemyHealthFilter = this.enemies.filter((e) => e.health <= 0);
			enemyHealthFilter.forEach((e) => {
				//Add explosion effect
				e.healthBar.base.marked = true;
				e.base.marked = true;
			});
		}
		//Discards killed enemies from the enemies array (Garbage clean up)
		let cleanArray = this.enemies.some((e) => e.base.marked);
		if (cleanArray) {
			this.enemies = this.enemies.filter((e) => !e.base.marked);
		}
		if (this.enemies.length != 0 && currentPlayer.loaded) {
			for (let i=0,length=this.enemies.length;i<length;i++) {
				let thisEnemy = this.enemies[i];
				let thisAngle = thisEnemy.base.position.getRotation(currentPlayer.playerOBJ.base.position);
				let thisDistance = thisEnemy.base.position.distance(currentPlayer.playerOBJ.base.position);
				//Clamp health
				thisEnemy.health = clamp(thisEnemy.health, 0, thisEnemy.maxHealth);
				//Health bar code
				thisEnemy.healthBar.base.position = thisEnemy.base.position.subV(new Vector2(0, this.enemySize.div(2).y+10));
				thisEnemy.healthBarLink.value = thisEnemy.health;
				thisEnemy.healthBarLink.update();
				//Agro check
				if (thisEnemy.health <= (thisEnemy.maxHealth*thisEnemy.speed.s)) {
					thisEnemy.agro = true;
				}
				//Enemy movement code
				if (thisDistance <= this.stopDistance) {
					thisEnemy.base.position.s = 0;
					thisEnemy.inRange = true;
				} else {
					thisEnemy.base.position.o = thisAngle;
					thisEnemy.inRange = false;
					let enemyDistanceFilter = collisionArray.filter((o) => thisEnemy.base.position.distance(o.base.position) <= 320);
					let isTouchingWall = enemyDistanceFilter.some((w) => cirPolyCollision(thisEnemy, w));
					for (let i=0,length=enemyDistanceFilter.length;i<length;i++) {
						cirPolyCollision(thisEnemy, enemyDistanceFilter[i], null, false);
					}
					if (!isTouchingWall) {
						if (!thisEnemy.agro) {
							thisEnemy.base.position.s = thisEnemy.speed.x;
						} else {
							thisEnemy.base.position.s = thisEnemy.speed.y;
						}
					} else {
						thisEnemy.base.position.s = 0;
					}
				}
				//Player bullet collisions
				if (currentPlayer.playerBullets != null) {
					for (let b=0,length=currentPlayer.playerBullets.length;b<length;b++) {
						let thisBullet = currentPlayer.playerBullets[b];
						if (cirPolyCollision(thisEnemy, thisBullet)) {
							thisEnemy.damage(thisBullet.damage);
							//drops
							if (thisEnemy.health <= 0) {
								if (this.confirmedDrop != null) {
									let dropPos = new Vector2(rangeFloat(thisEnemy.base.position.duplicate().subV(new Vector2(50, 0)).x, thisEnemy.base.position.duplicate().addV(new Vector2(50, 0)).x), rangeFloat(thisEnemy.base.position.duplicate().subV(new Vector2(0, 50)).y, thisEnemy.base.position.duplicate().addV(new Vector2(0, 50)).y)).subV(currentMap().mapPos);
									spawnItem(this.confirmedDrop, dropPos);
								}
								for (let i=0,length=rangeInt(this.lootAmount.x, this.lootAmount.y);i<length;i++) {
									let dropPos = new Vector2(rangeFloat(thisEnemy.base.position.duplicate().subV(new Vector2(50, 0)).x, thisEnemy.base.position.duplicate().addV(new Vector2(50, 0)).x), rangeFloat(thisEnemy.base.position.duplicate().subV(new Vector2(0, 50)).y, thisEnemy.base.position.duplicate().addV(new Vector2(0, 50)).y)).subV(currentMap().mapPos);
									spawnItem(getLootTable(this.lootAmount, this.dropRariety, this.dropTypeExclude, this.dropNameExclude), dropPos);
								}
								let dropDrugAmount = rangeInt(this.drugAmount.x, this.drugAmount.y);
								for (let i=0;i<dropDrugAmount;i++) {
									let dropPos = new Vector2(rangeFloat(thisEnemy.base.position.duplicate().subV(new Vector2(50, 0)).x, thisEnemy.base.position.duplicate().addV(new Vector2(50, 0)).x), rangeFloat(thisEnemy.base.position.duplicate().subV(new Vector2(0, 50)).y, thisEnemy.base.position.duplicate().addV(new Vector2(0, 50)).y)).subV(currentMap().mapPos);
									spawnItem(getRandomByType("drug", this.dropRariety, this.dropNameExclude), dropPos);
								}
							}
							thisBullet.base.destroy();
						}
					}
				}
			}
		}
	}
	addUpdate(update, "enemySpawner");
}


//Death screen ya bitch
const death_screen = new deathScreen();

function deathScreen (){
	let thisNameTag = tag("deathScreen");
	this.isShowing = getByNameTag(thisNameTag, 2, false, true) != null;
	this.show = () => {
		if (!this.isShowing && currentPlayer.dead) {
			let background = new Rectangle(8, new baseObject(true, new nameTag("background", "deathScreen"), screen.resolution, screen.halfResolution, new colorData("black")));
			let deathText = new Text(8, "You are dead...", new baseObject(true, new nameTag("deathtxt", "deathScreen"), new Vector2("80px Arial"), new Vector2(screen.halfResolution.x, 50), new  colorData("red")));
			let deadButton = new Rectangle(8, new baseObject(true, new nameTag("deathButton", "deathScreen"), new Vector2(200, 50), screen.halfResolution, new colorData("grey", 1), new Shadow(new Vector2(5, 5), "rgba(255, 255, 255, 0.2)", 5)));
			let deadButtonTxt = new Text(8, "RESPAWN", new baseObject(true, new nameTag("deathButtontxt", "deathScreen"), new Vector2("30px Arial"), screen.halfResolution, new colorData("white")));
			deadButtonLink.object = deadButton;
			deadButtonLink.textObj = deadButtonTxt;
			deadButtonLink.link();
		}
	}
	this.hide = () => {
		if (this.isShowing && currentPlayer.dead) {
			deadButtonLink.unlink();
			deleteByNameTag(thisNameTag, 2, true);
			currentPlayer.respawn();
		}
	}
	let deadButtonLink = new buttonLink(null, null, recCollision, this.hide, null, null, new Vector2("rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 1)"), null);
	const update =() =>{
		this.isShowing = getByNameTag(thisNameTag, 2, false, true) != null;
		if (this.isShowing) {
			deadButtonLink.update();
		}
		this.show();
	}
	addUpdate(update, "death_screen");
}

const mainUpdate = () => {
	deleteByMarked();
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
		if (currentMap() == null) {
			deleteByNameTag(new nameTag("", "enemy"), 2, true);
			deleteUpdate(1, "enemySpawner");
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
				//Collisions
				if (currentPlayer.loaded) {
					let playerDistanceFilter = collisionArray.filter((o) => currentPlayer.playerOBJ.base.position.distance(o.base.position) <= 320);
					for (let i=0,length=playerDistanceFilter.length;i<length;i++) {
						cirPolyCollision(currentPlayer.playerOBJ, playerDistanceFilter[i], currentPlayer.controller, false);
					}
					if (currentPlayer.playerBullets != null && currentPlayer.playerBullets.length == undefined) {
						currentPlayer.playerBullets = [currentPlayer.playerBullets];
					}
					if (currentPlayer.playerBullets != null && currentPlayer.playerBullets.length != undefined && currentPlayer.playerBullets.length != 0) {
						let playerBulletsDistanceFilter = collisionArray.filter((o) => currentPlayer.playerBullets.some((b) => b.base.position.distance(o.base.position) <= 320));
						for (let i=0,length=playerBulletsDistanceFilter.length;i<length;i++) {
							for (let b=0,length=currentPlayer.playerBullets.length;b<length;b++) {
								if (cirPolyCollision(currentPlayer.playerBullets[b], playerBulletsDistanceFilter[i])) {
									currentPlayer.playerBullets[b].base.destroy();
								}
							}
						}
					}
				}
			}
		}
	}
};
addUpdate(mainUpdate, "mainUpdate"); 

//rayCasting


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

let playerMovement = new controllerAxisBinding(1, (e)=>{
	if (currentPlayer.loaded){
		if (!isPaused){
			if(!e.r && !currentPlayer.dead) {
				if (e.x != 0) {
					if (e.x < 0) {
						currentPlayer.controller.moveDir.x = Math.floor(e.x);
					}
					if (e.x > 0) {
						currentPlayer.controller.moveDir.x = Math.ceil(e.x);
					}
				} else {
					currentPlayer.controller.moveDir.x = 0;
				}
				if (e.y != 0) {
					if (e.y < 0) {
						currentPlayer.controller.moveDir.y = Math.floor(e.y);
					}
					if (e.y > 0) {
						currentPlayer.controller.moveDir.y = Math.ceil(e.y);
					}
				} else {
					currentPlayer.controller.moveDir.y = 0;
				}
			}
			if (e.r || currentPlayer.dead) {
				currentPlayer.controller.moveDir.x = 0;
				currentPlayer.controller.moveDir.y = 0;
			}
		} else {
			currentPlayer.controller.moveDir.x = 0;
			currentPlayer.controller.moveDir.y = 0;
		}
	}
}, "playerMovement", 0);


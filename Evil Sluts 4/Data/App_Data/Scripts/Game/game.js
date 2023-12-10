//Setup
screen.setResolution(Vec2(1280, 720));
getCursor().base.size = (Vec2(14, 14));
Cursor.offset = getCursor().base.size.div(2);
engineSettings.Settings_Menu.Image_Smoothing = false;
engineSettings.Settings_Menu.Show_Debug_Cursor = false;
engineSettings.Addons = ["mapRenderer"];
loadAddons();
controllerManager.players = 1;

//Custom paths
const weaponPath = "Weapons/";
const itemPath = "Items/";
const effectPath = "Effects/";

//Images
//Player
let player_Img = imageD("player", imagePath+"player_1.png", Vec2(64, 128));
//Weapons
let bullet_1_Img = imageD("heart", imagePath+weaponPath+"Heart.png", Vec2(59, 91));
//Items
let bath_salts_Img = imageD("bath_salts", imagePath+itemPath+"bath_salts.png", Vec2(32, 32));
let cocaine_Img = imageD("cocaine", imagePath+itemPath+"cocaine.png", Vec2(32, 32));
let crack_Img = imageD("crack", imagePath+itemPath+"crack.png", Vec2(32, 32));
let crocodile_Img = imageD("crocodile", imagePath+itemPath+"crocodile.png", Vec2(32, 32));
let dmt_Img = imageD("dmt", imagePath+itemPath+"dmt.png", Vec2(32, 32));
let heroin_Img = imageD("heroin", imagePath+itemPath+"heroin.png", Vec2(32, 32));
let lsd_Img = imageD("lsd", imagePath+itemPath+"lsd.png", Vec2(32, 32));
let meth_Img = imageD("meth", imagePath+itemPath+"meth.png", Vec2(32, 32));
let mushroom_Img = imageD("mushroom", imagePath+itemPath+"mushroom.png", Vec2(32, 32));
let smack_Img = imageD("smack", imagePath+itemPath+"smack.png", Vec2(32, 32));
let your_mom_Img = imageD("your_mom", imagePath+itemPath+"your_mom.png", Vec2(32, 32));
let cheese_Img = imageD("cheese", imagePath+itemPath+"cheese.png", Vec2(32, 32));
//UI
let pick_up_bttn_Img = imageD("pick_up_bttn", imagePath+"pick_up.png", Vec2(64, 32));
//FX
let explosion_Img = imageD("explosion", imagePath+effectPath+"Explosion_Frame_1.png", Vec2(45, 45));

//Global vars
let thisLoaded = false;
let loadedCollisionArray = false;
let collisionArray = null;
let oldLocationId = -1;
let saveData = {
	"mapPos":null,
	"playerPos":null,
};

const menu = new mainMenu();

function mainMenu() {
	this.background = rectangle(1, base(false, nt("background", "menu"), Vec2(1280, 720), screen.halfResolution, colorD("#1f9359")));
	this.title = text(2, "Evil Sluts 4", base(false, nt("title", "menu"), Vec2("30px Arial", false, "center"), Vec2(640, 100), colorData("white"), shadow(Vec2(2, 2), "black", 10)));
	this.startBttn = rectangle(2, base(false, nt("startBttn", "menu"), Vec2(200, 50), Vec2(640, 360), colorD("grey"), shadow(Vec2(5, 5), "black", 10)));
	this.startBttnTxt = text(3, "Play", base(false, nt("startBttnTxt", "menu"), Vec2("30px Arial", false, "center"), Vec2(640, 360), colorData("white"), shadow(Vec2(2, 2), "black", 10)));
	const startBttnFunc = bttnL(this.startBttn, this.startBttnTxt, recCollision, () => {
		mousePressed[0] = false; //Fixes shooting when hitting play
		gameState = 1;
	}, Vec2(colorD("grey"), colorD("lightgrey"))); 
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
	this.pauseLatch = false;
    this.dialogueBox = null;
	this.dialogue = null;
	this.option1 = null;
	this.option1Txt = null;
	this.option2 = null;
	this.option2Txt = null;
	this.resetText = () => {
		if (this.dialogue != null) {
			this.dialogue.text = "";
		}
		if (this.option1Txt != null) {
			this.option1Txt.text = "";
		}
		if (this.option2Txt != null) {
			this.option2Txt.text = "";
		}
	}
	const update = () => {
		if(this.showing && valuate(gameState)) {
			if (getByNameTag(name("dialogueBox"), 1) == null) {
				this.dialogueBox = rectangle(8, base(true, nt("dialogueBox", "UI"), Vec2(screen.resolution.x, 180), Vec2(screen.halfResolution.x, screen.resolution.y-90), colorD("grey", 0.75)));
			}
			if (getByNameTag(name("dialogue"), 1) == null) {
				this.dialogue = text(8, "", base(true, nt("dialogue", "UI"), Vec2("30px arial", false, "left"), Vec2(10, screen.resolution.y-150), colorD("white", 0.75), shadow(Vec2(5, 5), "black", 10)));
			}
			if (this.showingOP1) {
				if (getByNameTag(name("option1"), 1) == null) {
					this.option1 = rectangle(8, base(true, nt("option1", "UI"), Vec2(600, 50), this.dialogueBox.base.position.subV(Vec2(320, -65)), colorD("darkgrey", 0.25)));
				}
				if (getByNameTag(name("option1Txt"), 1) == null) {
					this.option1Txt = text(8, "", base(true, nt("option1Txt", "UI"), Vec2("30px arial", false, "center"), this.dialogueBox.base.position.subV(Vec2(320, -65)), colorD("white", 0.75), shadow(Vec2(5, 5), "black", 10)));
				}
			} else {
				if (getByNameTag(name("option1"), 1) != null) {
					deleteByNameTag(this.option1.base.nameTag);
				}
				if (getByNameTag(name("option1Txt"), 1) != null) {
					deleteByNameTag(this.option1Txt.base.nameTag);
				}
			}
			if (this.showingOP2) {
				if (getByNameTag(name("option2"), 1) == null) {
					this.option2 = rectangle(8, base(true, nt("option2", "UI"), Vec2(600, 50), this.dialogueBox.base.position.subV(Vec2(-320, -65)), colorD("darkgrey", 0.25)));
				}
				if (getByNameTag(name("option2Txt"), 1) == null) {
				this.option2Txt = text(8, "", base(true, nt("option2Txt", "UI"), Vec2("30px arial", false, "center"), this.dialogueBox.base.position.subV(Vec2(-320, -65)), colorD("white", 0.75), shadow(Vec2(5, 5), "black", 10)));
				}
			} else {
				if (getByNameTag(name("option2"), 1) != null) {
					deleteByNameTag(this.option2.base.nameTag);
				}
				if (getByNameTag(name("option2Txt"), 1) != null) {
					deleteByNameTag(this.option2Txt.base.nameTag);
				}
			}
			if (this.showingOP1 && this.showingOP2) {
				this.option1.base.position.x = this.dialogueBox.base.position.x-320;
				this.option1.base.size.x = 600;
				this.option2.base.position.x = this.dialogueBox.base.position.x+320;
				this.option2.base.size.x = 600;
			}
			if (this.showingOP1 && !this.showingOP2) {
				this.option1.base.position.x = this.dialogueBox.base.position.x;
				this.option1.base.size.x = 1240;
			}
			if (!this.showingOP1 && this.showingOP2) {
				this.option2.base.position.x = this.dialogueBox.base.position.x;
				this.option2.base.size.x = 1240;
			}
		}
		if (getByNameTag(name("dialogueBox"), 1) != null && !this.showing) {
			deleteByNameTag(this.dialogueBox.base.nameTag);
			deleteByNameTag(this.dialogue.base.nameTag);
			if (getByNameTag(name("option1"), 1) != null) {
				deleteByNameTag(this.option1.base.nameTag);
			}
			if (getByNameTag(name("option2"), 1) != null) {
				deleteByNameTag(this.option2.base.nameTag);
			}
		}
		if (gameState == 0) {
			this.showing = false;
			this.showingOP1 = false;
			this.showingOP2 = false;
		}
	}
	addUpdate(update, "dialogueUI");
}

function option(text="", nextId=0) {
	this.text = text;
	this.nextId = nextId;
}

function convo(name="", id=0, text="", options=null, nextId=null) {
	this.name = name;
	this.id = id;
	this.text = text;
	this.options = options; //Vec2 of options
	this.nextId = nextId;
	dialogueMG.addConvo(this);
}

const dialogueMG = new dialogueManager();
const dUI = new dialogueUI();

function dialogueManager() {
	this.dSpeed = 100;
	let convos = [];
	let thisConvo = null;
	let thisTextTimer = null;
	this.addConvo = (convo) => {
		convos.push(convo);
	}
	this.readConvo = (id=0) => {
		dUI.resetText();
		if (thisTextTimer != null) {
			thisTextTimer.reset();
		}
		if (typeof id == "number") {
			thisConvo = convos.filter(c => c.id == id)[0];
		} else {
			thisConvo = convos.filter(c => c.name == id)[0];
		}
	}
	const update = () => {
		if (thisConvo != null) {
			dUI.showing = true;
			if (thisTextTimer == null) {
				thisTextTimer = T(MSecond(this.dSpeed), true, true, true, ()=>{
					let length = dUI.dialogue.text.length;
					if (thisConvo != null && length != thisConvo.text.length) {
						dUI.dialogue.text = dUI.dialogue.text+thisConvo.text[length];
					}
				}, "Text_Animation_1");
			} else {
				if (!thisTextTimer.active) {
					thisTextTimer.start(true);
				}
			}
			if (thisConvo.options != null) {
				if (thisConvo.options != null && thisConvo.options.x != 0) {
					dUI.showingOP1 = true;
					if (dUI.dialogue != null && dUI.dialogue.text.length == thisConvo.text.length) {
						dUI.option1Txt.text = thisConvo.options.x.text;
						if (cVpCollision(getCursor(), dUI.option1)) {
							dUI.option1.base.color.alpha = 0.75;
							if (mousePressed[0]) {
								this.readConvo(thisConvo.options.x.nextId);
							}
						} else {
							dUI.option1.base.color.alpha = 0.25;
						}
					}
				} else {
					dUI.showingOP1 = false;
				}
				if (thisConvo.options != null && thisConvo.options.y != 0) {
					dUI.showingOP2 = true;
					if (dUI.dialogue != null && dUI.dialogue.text.length == thisConvo.text.length) {
						dUI.option2Txt.text = thisConvo.options.y.text;
						if (cVpCollision(getCursor(), dUI.option2)) {
							dUI.option2.base.color.alpha = 0.75;
							if (mousePressed[0]) {
								this.readConvo(thisConvo.options.y.nextId);
							}
						} else {
							dUI.option2.base.color.alpha = 0.25;
						}
					}
				} else {
					dUI.showingOP2 = false;
				}
			} else {
				dUI.showingOP1 = false;
				dUI.showingOP2 = false;
			}
			if (dUI.dialogue != null && dUI.dialogue.text.length == thisConvo.text.length && mousePressed[0]) {
				if (thisConvo.nextId != null) {
					this.readConvo(thisConvo.nextId);
				} else {
					if (thisConvo.options == null) {
						thisTextTimer.pause();
						thisConvo = null;
						mousePressed[0] = false;
					}
				}
			}
		} else {
			dUI.showing = false;
			dUI.showingOP1 = false;
			dUI.showingOP2 = false;
		}
	}
	addUpdate(update, "dialogueMG");
}

//Test
let testDialogue_1 = new convo("Test_1", 0, "Hello, how are you?", Vec2(new option("Good I guess...", 2), new option("...", 1)));
let testDialogue_2 = new convo("Test_2", 1, "... Okay guess you ain't a talker.");
let testDialogue_3 = new convo("Test_3", 2, "Cool I guess.");

//Item pickup menu
const dropMenu = new pickUpMenu();

const defaultContainerStyle = new ContainerStyle();
function ContainerStyle(visColor="darkgrey", visTxtColor="white", visTxtFont="25px Arial", visTxtShadow=shadow(Vec2(5, 5), "black", 5), visBttnColor=Vec2("#686868", "#959595"), visSize=25, visOverflowColor="black") {
	this.visColor = visColor;
	this.visTxtColor = visTxtColor;
	this.visTxtFont = visTxtFont;
	this.visTxtShadow = visTxtShadow;
	this.visBttnColor = visBttnColor;
	this.visSize = visSize;
	this.visOverflowColor = visOverflowColor;
	this.duplicate = function() {
		return new ContainerStyle(this.visColor, this.visTxtColor, this.visTxtFont, this.visTxtShadow, this.visBttnColor, this.visSize, this.visOverflowColor);
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
	let overflow = false;
	let scrollLock = false;
	let scrollPos = 0;
	let scrollClamp = Vec2(0, 0);
	let points = [];
	this.getPoints = function() {
		return points;
	}
	this.duplicate = function() {
		return new Container(this.layerNumber, this.base.dup(), this.objs, this.containerStyle.dup());
	}
	this.dup = this.duplicate;
	this.draw = function() {
		//Scroll code
		if (!scrollLock) {
			switch (mouseWheel) {
				case -1:
					if (scrollPos > scrollClamp.x) {
						scrollPos -= this.containerStyle.visSize;
					}
				break;
				case 1:
					if (scrollPos < scrollClamp.y) {
						scrollPos += this.containerStyle.visSize;
					}
				break;
			}
		}
		scrollPos = clamp(scrollPos, scrollClamp.x, scrollClamp.y);
		//Background
		setupObject(this.base, DEFAULT_LINE);
		points = [
			Vec2(-this.base.size.x/2+this.base.position.x, -this.base.size.y/2+this.base.position.y),
			Vec2(this.base.size.x/2+this.base.position.x, -this.base.size.y/2+this.base.position.y),
			Vec2(this.base.size.x/2+this.base.position.x, this.base.size.y/2+this.base.position.y),
			Vec2(-this.base.size.x/2+this.base.position.x, this.base.size.y/2+this.base.position.y),
			Vec2(-this.base.size.x/2+this.base.position.x, -this.base.size.y/2+this.base.position.y)];
		let thisPath = new Path2D();
		thisPath.moveTo(points[0].x, points[0].y);
		for (let i=0;i<points.length;i++) {
			thisPath.lineTo(points[i].x, points[i].y);
		}
		ctx.fill(thisPath);
		ctx.save();
		ctx.clip(thisPath);
		//Vis bg
		let visSize = Vec2(this.base.size.x, this.containerStyle.visSize);
		ctx.shadowColor = NO_SHADOW.color;
		ctx.shadowBlur = NO_SHADOW.blur;
		ctx.shadowOffsetX = NO_SHADOW.offset.x;
		ctx.shadowOffsetY = NO_SHADOW.offset.y;
		ctx.fillStyle = this.containerStyle.visColor;
		for (let i=1,length=this.objs.length;i<=length;i++) {
			let visPos = Vec2(this.base.position.x-(this.base.size.x/2), (((i-1)*this.containerStyle.visSize)+(this.base.position.y-this.base.size.div(2).y))-scrollPos);
			if (i == length) {
				if ((visPos.y+visSize.y/2) <= (this.base.position.y+this.base.size.y/2)) {
					overflow = false;
				} else {
					overflow = true;
				}
				if (((visPos.y+scrollPos)+visSize.y/2) <= (this.base.position.y+this.base.size.y/2)) {
					scrollLock = true;
					scrollClamp.y = 0;
				} else {
					scrollLock = false;
					scrollClamp.y = Math.abs((this.base.position.y+this.base.size.y/2)-((visPos.y+scrollPos)+visSize.y));
				}
			}
			ctx.fillRect(visPos.x, visPos.y, visSize.x, visSize.y);
		}
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
			ctx.fillText(getItemName(this.objs[i-1].item), this.base.position.x-this.base.size.div(2).x+5, (((i-1)*this.containerStyle.visSize)+(this.base.position.y-this.base.size.div(2).y)+(this.containerStyle.visSize/2)+2.5)-scrollPos);
		}
		//Vis bttn
		let visBttnSize = Vec2(170, this.containerStyle.visSize);
		ctx.shadowColor = NO_SHADOW.color;
		ctx.shadowBlur = NO_SHADOW.blur;
		ctx.shadowOffsetX = NO_SHADOW.offset.x;
		ctx.shadowOffsetY = NO_SHADOW.offset.y;
		for (let i=1,length=this.objs.length;i<=length;i++) {
			let visBttnPos = Vec2((this.base.position.x+this.base.size.div(2).x)-visBttnSize.div(2).x, (((i-1)*this.containerStyle.visSize)+(this.base.position.y-this.base.size.div(2).y))-scrollPos);
			if (recCollision({"base":{"position":getCursor().base.position, "size":ONE}}, {"base":{"position":visBttnPos.addV(visBttnSize.div(2)), "size":visBttnSize}}) && recCollision(getCursor(), this)) {
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
			ctx.fillText("Pick up", (this.base.position.x+this.base.size.div(2).x)-visBttnSize.div(2).x, (((i-1)*this.containerStyle.visSize)+(this.base.position.y-this.base.size.div(2).y)+(this.containerStyle.visSize/2))-scrollPos);
		}
		if (scrollPos != 0) {
			ctx.shadowColor = this.containerStyle.visOverflowColor;
			ctx.shadowBlur = 20;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 10;
			ctx.fillStyle = this.containerStyle.visOverflowColor;
			ctx.fillRect((this.base.position.x-this.base.size.x/2), (this.base.position.y-this.base.size.y/2)-20, this.base.size.x, 20);
		}
		if (overflow) {
			ctx.shadowColor = this.containerStyle.visOverflowColor;
			ctx.shadowBlur = 20;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = -10;
			ctx.fillStyle = this.containerStyle.visOverflowColor;
			ctx.fillRect((this.base.position.x-this.base.size.x/2), (this.base.position.y+this.base.size.y/2), this.base.size.x, 20);
		}
		ctx.restore();
	}
	if (this.base.autoAdd && this.layerNumber >= 1 && this.layerNumber <= 8) {
		layer[this.layerNumber].push(this);
		loaded = false;
	}
}

function pickUpMenu() {
	this.size = Vec2(600, 375);
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
			compList.Background = rectangle(8, base(true, nt("Background", this.tag), this.size.duplicate(), this.pos.dup(), colorD("grey", 0.6), shadow(Vec2(5, 5), "black", 10)));
			compList.MenuTitle = text(8, "Ground Items", base(true, nt("MenuTitle", this.tag), Vec2("25px Arial", false, "center"), Vec2(0, (this.size.y/2)-15), colorD("white", 0), shadow(Vec2(5, 5), "black", 10)));
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
			compList.CloseBttn = sprite(8, base(true, nt("CloseBttn", this.tag), Vec2(20, 20), Vec2(-((this.size.x/2)-12.5), (this.size.y/2)-12.5), Close_UI.getColor(0), shadow(Vec2(5, 5), "black", 10)));
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
			compList.CloseBttnLink = bttnL(compList.CloseBttn, null, recCollision, () => {
				this.hide();
				mousePressed[0] = false;
			}, Vec2(Close_UI.getColor(0.75), Close_UI_Hover.getColor(0.75)));
			compList.CloseBttnLink.link();
			compList.ItemContainer = new Container(8, base(true, nt("ItemContainer", this.tag), Vec2(this.size.x, this.size.y-25), Vec2(0, -12.5), colorD("lightgrey", 0)), []);
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
		deleteByNameTag(nt("", this.tag), 2, true);
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

//Status bar updater
function statusBar(obj=BLANK_OBJECT, value=0, maxValue=100, color=Vec2()) {
	this.obj = obj;
	this.value = value;
	this.maxValue = maxValue;
	this.color = color; //x- end color, y- start color, r- alpha
	this.gradient = new Rainbow();
	this.setColors = (color=Vec2()) => {
		this.gradient.setSpectrum(this.color.x, this.color.y);
	}
	this.gradient.setNumberRange(0, this.maxValue);
	this.setColors(this.color);
	let sizeX = this.obj.base.size.duplicate().x;
	this.update = () => {
		this.obj.base.color = colorD("#"+this.gradient.colorAt(this.value), this.color.r);
		this.obj.base.size.x = sizeX*(this.value/(this.maxValue/100)/100);
	}
}

//Weapons
function weapon(name="", imageData=null, amountPerShot=1, fireTime=ONE, size=ONE, spreadPattern=[0], _speedRange=ONE, _rangeRange=ONE, _damageRange=ONE) {
	this.name = name;
	this.imageData = imageData;
	this.amountPerShot = amountPerShot;
	if (this.amountPerShot <= 0) {
		this.amountPerShot = 1;
	}
	this.fireTime = fireTime;
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
	0:new weapon("Test", bullet_1_Img.getColor(), 5, Vec2(1,10), Vec2(10,10), [-12.5, -6.25, 0, 6.26, 12.5], Vec2(10, 15), Vec2(100, 200), Vec2(1, 2, 5, 10)),
}

//Armor
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
	0:new armor("Test", null, ONE, armorTypes[0], Vec2(1,6)),
	1:new armor("Test2", null, ONE, armorTypes[1], Vec2(4,10)),
	2:new armor("Test3", null, ONE, armorTypes[2], Vec2(2,8)),
	3:new armor("Test4", null, ONE, armorTypes[3], Vec2(1,4)),
}

//Item shit
function baseItem(id=0, rariety=1, cost=0, size=Vec2(16, 16), imageData=null, description="") {
	this.id = id;
	this.rariety = rariety;
	this.cost = cost;
	this.size = size;
	this.imageData = imageData;
	this.description = description;
	this.duplicate = () => {
		return new baseItem(this.id, this.rariety, this.cost, this.size, this.imageData);
	}
}

function drugsItem(type="", base=new baseItems(), arrgs=[], func=null) {
	this.type = type;
	this.base = base;
	this.arrgs = arrgs;
	this.func = func;
	this.itemType = "drug";
	this.mainType = "items"; //What inventory array it goes into
	this.stack = 1;
	this.use = () => {
		if (this.func != null) {
			this.func(this.arrgs);
			this.stack--;
		}
	}
	this.duplicate = (includeStack=true) => {
		if (includeStack) {
			let duppedItem = new drugsItem(this.type, this.base.duplicate(), this.arrgs, this.func);
			duppedItem.stack = this.stack;
			return duppedItem;
		} else {
			return new drugsItem(this.type, this.base.duplicate(), this.arrgs, this.func);
		}
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
	this.getWeapon = () => {
		return this.weaponVeriant;
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
	this.getArmor = () => {
		return this.armorVeriant;
	}
	this.duplicate = (copyVeriant=false) => {
		if (!copyVeriant) {
			return new armorItems(this.armorId, this.base.duplicate());
		} else {
			return new armorItems(this.armorId, this.base.duplicate(), this.armorVeriant);
		}
	}
}

const globalExcludedDrops = []; //Loot tables won't include these items. Good for boss items and dev items.

const itemTable = [
	//Items
	new drugsItem("Heroin", new baseItem(0, 1, 0, Vec2(32, 32), heroin_Img.getColor(), "Slows you down.")),
	new drugsItem("Crack", new baseItem(1, 1, 0, Vec2(32, 32), crack_Img.getColor(), "Speed boost.")),
	new drugsItem("Cocaine", new baseItem(2, 2, 0, Vec2(32, 32), cocaine_Img.getColor(), "Greater speed boost.")),
	new drugsItem("LSD", new baseItem(3, 5, 0, Vec2(32, 32), lsd_Img.getColor(), "Go goofy mode...")),
	new drugsItem("Shrooms", new baseItem(4, 4, 0, Vec2(32, 32), mushroom_Img.getColor(), "Gives health.")),
	new drugsItem("Crocodile", new baseItem(5, 1, 0, Vec2(32, 32), crocodile_Img.getColor(), "Green man...")),
	new drugsItem("Bath Salts", new baseItem(6, 2, 0, Vec2(32, 32), bath_salts_Img.getColor(), "Defence boost.")),
	new drugsItem("DMT", new baseItem(7, 6, 0, Vec2(32, 32), dmt_Img.getColor(), "Limited invincibility.")),
	new drugsItem("Meth", new baseItem(8, 1, 0, Vec2(32, 32), meth_Img.getColor(), "Attack boost.")),
	new drugsItem("Smack", new baseItem(9, 3, 0, Vec2(32, 32), smack_Img.getColor(), "Range boost.")),
	new drugsItem("Cheese", new baseItem(10, 10, 0, Vec2(32, 32), cheese_Img.getColor(), "Stamina boost.")),
	new drugsItem("Your Mom", new baseItem(11, 7, 0, Vec2(32, 32), your_mom_Img.getColor(), "Literally your mom...")),
	//Weapons
	new weaponItem(0, new baseItem(101, 1, 0, Vec2(32, 32), bullet_1_Img.getColor(), "Test weapon 1")),
	//Armor
	new armorItems(0, new baseItem(201, 1, 0, Vec2(32, 32), bullet_1_Img.getColor(), "Test armor 1")),
	new armorItems(1, new baseItem(202, 1, 0, Vec2(32, 32), bullet_1_Img.getColor(), "Test armor 2")),
	new armorItems(2, new baseItem(203, 1, 0, Vec2(32, 32), bullet_1_Img.getColor(), "Test armor 3")),
	new armorItems(3, new baseItem(204, 1, 0, Vec2(32, 32), bullet_1_Img.getColor(), "Test armor 4")),
];

const getItemName = (item, includeStack=true) => {
	let result = null;
	switch (item.mainType) {
		case "items":
			if (includeStack) {
				switch (item.itemType) {
					case "drug":
						result = item.type+" x"+item.stack;
					break;
					default:
						result = item.type;
					break;
				}
			} else {
				result = item.type;
			}
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
const getRandomByType = (type="", rarietyRange=Vec2(1, 10), nameExclude=[]) => {
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
const lootGen = (rarietyRange=Vec2(1, 10), typeExclude=[], nameExclude=[]) => {
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

const getLootTable = (amountRange=Vec2(1, 10), rarietyRange=Vec2(1, 10), typeExclude=[], nameExclude=[]) => {
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
		switch (thisLoot.itemType) {
			case "drug":
				let check = lootTable.filter(i => i.type == thisLoot.type);
				if (check.length == 0) {
					lootTable.push(thisLoot);
				} else {
					check[0].stack += thisLoot.stack;
				}
			break;
			default:
				lootTable.push(thisLoot);
			break;
		}
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
			let droppedItem = sprite(2, base(true, nt("itemDrop", "item"), dup.base.size, dropPos, dup.base.imageData, shadow(Vec2(5, -5), "black", 5)));
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
				let droppedItem = sprite(2, base(true, nt("itemDrop", "item"), dup.base.size, dropPos, dup.base.imageData, shadow(Vec2(5, -5), "black", 5)));
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
		switch (item.itemType) {
			case "drug":
				let check = inventory[item.mainType].filter(i => i.type == item.type);
				if (check.length == 0) {
					inventory[item.mainType].push(item);
				} else {
					check[0].stack += item.stack;
				}
			break;
			default:
				inventory[item.mainType].push(item);
			break;
		}
	}
}

const inventory = {
	"weapons":[getItemsByType("weapon")[0]],
	"armor":[getItemsByType("armor")[0],getItemsByType("armor")[1],getItemsByType("armor")[2],getItemsByType("armor")[3]],
	"items":[],
};

//Drops item from the players inventory
const dropItem = (itemType="items", index=0) => {
	let inventoryItem = inventory[itemType][index];
	if (inventoryItem != undefined) {
		let dup = inventoryItem.duplicate(true);
		let droppedItem = sprite(2, base(true, nt("itemDrop", "item"), dup.base.size, currentPlayer.playerItemDropPos, dup.base.imageData, shadow(Vec2(5, -5), "black", 5)));
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
	let droppedItems = getByNameTag(nt("itemDrop"), 1);
	if (droppedItems != null && typeof droppedItems.length == "undefined") {
		droppedItems = [droppedItems];
	}
	if (droppedItems != null) {
		return droppedItems.filter((i) => cirPolyCollision(currentPlayer.playerOBJ, i));
	} else {
		return null;
	}
}

const currentPlayer = new player(100, Vec2(3, 7), Vec2(100, 0.5, 0.1), 10, [inventory.weapons[0]], [inventory.armor[0]], Vec2(100, 100));

//TODO: Implement armor functionality
function player(maxHealth=100, playerSpeed=Vec(3, 7), maxStamina=Vec2(100, 0.1), baseDefence=10, weapons=[], armor=[], ammo=Vec2(100, 100)) {
	this.baseDefence = baseDefence;
	this.armor = armor;
	this.defence = this.baseDefence;
	this.weapons = weapons;
	this.ammo = ammo; //x- current ammo, y- max ammo
	
	this.lockWeapon = false;
	let fireTime = 0;
	let bulletAmount = 0;
	this.size = Vec2(32, 32);
	this.loaded = false;
	this.nameTag = nt("Jesus","player");
	this.pos = Vec2();
	this.health = Vec2(maxHealth, maxHealth); //x- current health, y- max health
	this.dead = false;
	this.currentWeapon = 0;
	this.currentWeaponData = null;
	this.playerOBJ = null;
	this.playerDir = -1;
	this.playerItemDropPos = Vec2();
	this.bulletSpawn = Vec2();
	this.playerSpeed = Vec2(playerSpeed.x, playerSpeed.y); //x- normal speed, y- running speed
	this.run = false;
	this.stamina = Vec2(maxStamina.x, maxStamina.x, maxStamina.y, maxStamina.r); //x- current stamina, y- max stamina, r- stamina recharge
	this.controller = playerC(false, "player", this.playerOBJ, this.playerSpeed.x, Vec2(1, 0.5), Vec2(100, 1180), Vec2(100, 620));
	this.bttns = [];
	this.playerBullets = [];
	
	//UI
	//Health
	this.healthBarTxt = text(8, "Health", base(false, nt("healthBarTxt", "UI"), Vec2("30px Arial", false, "center"), Vec2(640, 615), colorD("white", 0.75), shadow(Vec2(5, 5), "black", 5)));
	this.healthBar = rectangle(8, base(false, nt("healthBar", "UI"), Vec2(200, 25), Vec2(640, 640), colorD("black"), shadow(Vec2(5, 5), "black", 5)));
	this.healthBarLink = new statusBar(this.healthBar, this.health.x, this.health.y, Vec2("darkred", "darkgreen", 0.75));
	//Stamina
	this.staminaBarTxt = text(8, "Stamina", base(false, nt("staminaBarTxt", "UI"), Vec2("30px Arial", false, "center"), Vec2(640, 670), colorD("white", 0.75), shadow(Vec2(5, 5), "black", 5)));
	this.staminaBar = rectangle(8, base(false, nt("staminaBar", "UI"), Vec2(200, 25), Vec2(640, 695), colorD("black"), shadow(Vec2(5, 5), "black", 5)));
	this.staminaBarLink = new statusBar(this.staminaBar, this.stamina.x, this.stamina.y, Vec2("ghostwhite", "darkblue", 0.75));
	//Weapon name
	this.weaponNameTxt = text(8, "Weapon Name", base(false, nt("weaponNameTxt", "UI"), Vec2("30px Arial", false, "left"), Vec2(10, 20), colorD("purple", 0.75), shadow(Vec2(5, 5), "black", 5)));
	//Ammo count
	this.ammoCountTxt = text(8, "Ammo Count", base(false, nt("ammoCount", "UI"), Vec2("30px Arial", false, "left"), Vec2(10, 50), colorD("orange", 0.75), shadow(Vec2(5, 5), "black", 5)));
	//Pick up bttn
	this.pickUpBttn = sprite(8, base(false, nt("pickUpBttn", "UI_BTTN"), Vec2(128, 64), Vec2(1216, 688), pick_up_bttn_Img.getColor()));
	this.droppedItemsTxt = text(8, "0", base(false, nt("droppedItemsTxt", "UI"), Vec2("30px Arial", false, "center"), Vec2(1152, 656), colorD("white", 0.75), shadow(Vec2(5, 5), "black", 5)));
	this.pickUpBttnLink = bttnL(this.pickUpBttn, this.droppedItemsTxt, recCollision, () => {
		dropMenu.init();
	}, Vec2(pick_up_bttn_Img.getColor(0.75), pick_up_bttn_Img.getColor(1)), Vec2(colorD("white", 0.75), colorD("white", 1)), null, Vec2("rgba(0,0,0,192)", "rgba(0,0,0,256)"));
	
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
		this.playerOBJ = sprite(4, base(true, this.nameTag, this.size.multi(config.scale), this.pos, player_Img.getColor(), shadow(Vec2(5, -5), "black", 10)));
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
	
	this.calPlayerDefence = () => {
		let value = this.baseDefence;
		this.armor.forEach((a) => {
			value = value+a.getArmor().defenceStat;
		});
		return value;
	}
	
	const update = () => {
		if (typeof gameState != "undefined") {
			if (gameState == 0) {
				if (this.loaded) {
					this.unload();
				}
			} else {
				for (let i=0,length=inventory.items.length;i<length;i++){
					if(typeof inventory.items[i].stack != "undefined" && inventory.items[i].stack == 0){
						inventory.items.splice(i, 1);
					}
				}
				//UI
				if (dUI.showing) {
					this.healthBar.base.setAlpha(0);
					this.healthBarTxt.base.setAlpha(0);
					this.staminaBar.base.setAlpha(0);
					this.staminaBarTxt.base.setAlpha(0);
					this.weaponNameTxt.base.setAlpha(0);
					this.ammoCountTxt.base.setAlpha(0);
					this.pickUpBttn.base.setAlpha(0);
					this.droppedItemsTxt.base.setAlpha(0);
					this.pickUpBttnLink.unlink();
					isPaused = true;
					dUI.pauseLatch = false;
				}
				if (!dUI.showing) {
					this.healthBar.base.setAlpha(0.75);
					this.healthBarTxt.base.setAlpha(0.75);
					this.staminaBar.base.setAlpha(0.75);
					this.staminaBarTxt.base.setAlpha(0.75);
					this.weaponNameTxt.base.setAlpha(0.75);
					this.ammoCountTxt.base.setAlpha(0.75);
					this.pickUpBttn.base.setAlpha(0.75);
					this.droppedItemsTxt.base.setAlpha(0.75);
					this.healthBarLink.update();
					this.staminaBarLink.update();
					this.pickUpBttnLink.link();
					if (!dUI.pauseLatch) {
						isPaused = false;
						dUI.pauseLatch = true;
					}
				}
				if (this.bttns.length == 0 && getByNameTag(nt("", "BTTN"), 2, false, true) != null) {
					if (typeof getByNameTag(nt("", "BTTN"), 2, false, true).length != "undefined") {
						this.bttns = getByNameTag(nt("", "BTTN"), 2, false, true);
					} else {
						this.bttns = [getByNameTag(nt("", "BTTN"), 2, false, true)];
					}
				}
				if (this.bttns != null) {
					if (typeof this.bttns.length != "undefined") {
						let isTouchBttns = this.bttns.some((b) => recCollision(getCursor(), b)); 
						if (isTouchBttns) {
							this.lockWeapon = true;
						} else {
							this.lockWeapon = false;
						}
					}
				}
				this.healthBarLink.value = this.health.x;
				this.healthBarLink.maxValue = this.health.y;
				this.health.x = clamp(this.health.x, 0, this.health.y);
				if (this.health.x == 0) {
					this.dead = true;
				} else {
					this.dead = false;
				}
				this.staminaBarLink.value = this.stamina.x;
				this.staminaBarLink.maxValue = this.stamina.y;
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
				//Calculate player defence
				this.defence = this.calPlayerDefence();
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
							this.playerItemDropPos = this.playerOBJ.base.position.addV(Vec2(-30, 80));
						break;
						case 1:
							this.playerItemDropPos = this.playerOBJ.base.position.addV(Vec2(30, 80));
						break;
					}
				}
				switch (this.playerDir) {
					case -1:
						this.bulletSpawn = Vec2(10, -60);
					break;
					case 1:
						this.bulletSpawn = Vec2(-10, -60);
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
							let newBullet = sprite(5, base(false, nt("bullet_"+bulletAmount,"player_bullet_"+this.currentWeaponData.name), this.currentWeaponData.size.duplicate(), this.playerOBJ.base.position.duplicate().addV(this.bulletSpawn.duplicate()), this.currentWeaponData.imageData.duplicate()));
							let angle = this.playerOBJ.base.position.getRotation(getCursor().base.position, false)+180;
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
				this.playerBullets = getByNameTag(nt("", "player_bullet"), 2, false, true);
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
					this.currentWeaponData = this.weapons[this.currentWeapon].getWeapon();
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
function enemySpawner(enemyName="", enemySize=Vec2(), enemyPositions=[Vec2()], imgData=null, shadowData=NO_SHADOW, spawnAmount=0, spawnSpeed=Vec2(0.5, 5), maxHealth=100, defense=10, speed=Vec2(4, 5, 6, 7, 0.25), stopDistance=200, weaponId=0/**damage=Vec2(6, 8)**/, confirmedDrop=null, lootAmount=Vec2(1, 4), drugAmount=Vec2(1, 1), dropRariety=Vec2(1, 3), dropTypeExclude=[], dropNameExclude=[]) {
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
	this.explosions = [];
	this.time = 0;
	this.count = 0;
	let enemyPos = Vec2();
	
	this.spawn = () => {
		if (typeof this.enemyPositions.length == "undefined") {
			enemyPos = this.enemyPositions;
		} else {
			enemyPos = this.enemyPositions[rangeInt(0, this.enemyPositions.length-1)];
		}
		if (this.count < this.spawnAmount) {
			let enemyHealthBar = rectangle(4, base(false, nt(this.enemyName+"_"+this.count+"_healthBar", "enemy_healthBar"), Vec2(100, 5), enemyPos.subV(Vec2(0, this.enemySize.div(2).y+10)), colorD("darkgreen", 0.75), shadow(Vec2(5, 5), "black", 5)));
			let enemyHealthBarLink = new statusBar(enemyHealthBar, this.maxHealth, this.maxHealth, Vec2("darkred", "darkgreen", 0.75));
			let enemy = sprite(4, base(false, nt(this.enemyName+"_"+this.count, "enemy"), this.enemySize, enemyPos, this.imgData, this.shadowData));
			//Overwrite the movement function to fix janky enemy movement
			enemy.base.overridePositionUpdateFunction = true; //Fixes movement jitter caused by the position update function not updating when the speed is 0
			enemy.base.updatePosition = () => {
				if (!isPaused && currentMap() != null) {
					let velocity = Vec2(((enemy.base.position.s*Math.sin(enemy.base.position.o))*delta), -((enemy.base.position.s*Math.cos(enemy.base.position.o))*delta));
					enemy.base.startPosition = enemy.base.startPosition.duplicate().addV(velocity);
					enemy.base.position = enemy.base.startPosition.duplicate().addV(currentMap().mapPos);
				}
			}
			
			enemy.weapon = weaponTable[this.weaponId].duplicate();
			enemy.weapon.genStats();
			enemy.speed = Vec2(rangeFloat(this.speed.x, this.speed.y, 1), rangeFloat(this.speed.r, this.speed.o, 1));
			enemy.defense = this.defense;
			enemy.health = this.maxHealth;
			enemy.maxHealth = this.maxHealth;
			enemy.healthBar = enemyHealthBar;
			enemy.healthBarLink = enemyHealthBarLink;
			enemy.fireTime = 0;
			enemy.bulletAmount = 0;
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
	
	//TODO: Add bullet offsets
	this.shoot = () => {
		if (!isPaused) {
			for(enemy of this.enemies) {
				if (enemy.inRange) {
					if (enemy.fireTime == 0) {
						for (let i=0;i<enemy.weapon.amountPerShot;i++) {
							let newBullet = sprite(5, base(false, nt("bullet_"+enemy.bulletAmount, "enemy_bullet_"+enemy.weapon.name), enemy.weapon.size, enemy.base.position.dup(), enemy.weapon.imageData));
							let angle = newBullet.base.position.getRotation(currentPlayer.playerOBJ.base.position)+degToRad(180);
							newBullet.base.position.s = -enemy.weapon.speed;
							newBullet.base.position.r = degToRad(enemy.weapon.spreadPattern[i])+angle;
							newBullet.damage = rangeFloat(enemy.weapon.damage.x, enemy.weapon.damage.y);
							newBullet.range = enemy.weapon.range;
							enemy.bulletAmount++;
							addObject(newBullet);
						}
					}
					enemy.fireTime += enemy.weapon.fireTime.x*delta;
					if (enemy.fireTime > enemy.weapon.fireTime.y) {
						enemy.fireTime = 0;
					}
				}
				if (enemy.bulletAmount > 1000) {
					enemy.bulletAmount = 0;
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
				let newExplosion = sprite(6, base(true, nt(this.enemyName+"_explosion", "explosion"), Vec2(200, 200), e.base.startPosition.dup(), explosion_Img.getColor()), multiImgA([frameD(1, Vec2(45, 45), Vec2(0.25, 0.25)), frameD(2, Vec2(119, 113), Vec2(0.5, 0.5)), frameD(3, Vec2(196, 191), Vec2(0.75, 0.75)), frameD(4, Vec2(354, 342), Vec2(1, 1)), frameD(5, Vec2(345, 333), Vec2(0.8, 0.8)), frameD(6, Vec2(193,208), Vec2(0.75, 0.75)), frameD(7, Vec2(126, 136), Vec2(0.6, 0.6))], "Explosion_Frame_", "png", 7, 20, false, true, imagePath+effectPath));
				newExplosion.base.overridePositionUpdateFunction = true;
				newExplosion.base.updatePosition = () => {
					if (!isPaused && currentMap() != null) {
						newExplosion.base.position = newExplosion.base.startPosition.duplicate().addV(currentMap().mapPos);
					}
				}
				this.explosions.push(newExplosion);
				e.healthBar.base.marked = true;
				e.base.marked = true;
			});
		}
		//Deletes explosions
		this.explosions.forEach((e, i) => {
			if (!e.animator.play) {
				e.base.destroy();
				this.explosions.splice(i, 1);
			}
		});
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
				thisEnemy.healthBar.base.position = thisEnemy.base.position.subV(Vec2(0, this.enemySize.div(2).y+10));
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
									let dropPos = Vec2(rangeFloat(thisEnemy.base.position.duplicate().subV(Vec2(50, 0)).x, thisEnemy.base.position.duplicate().addV(Vec2(50, 0)).x), rangeFloat(thisEnemy.base.position.duplicate().subV(Vec2(0, 50)).y, thisEnemy.base.position.duplicate().addV(Vec2(0, 50)).y)).subV(currentMap().mapPos);
									spawnItem(this.confirmedDrop, dropPos);
								}
								for (let i=0,length=rangeInt(this.lootAmount.x, this.lootAmount.y);i<length;i++) {
									let dropPos = Vec2(rangeFloat(thisEnemy.base.position.duplicate().subV(Vec2(50, 0)).x, thisEnemy.base.position.duplicate().addV(Vec2(50, 0)).x), rangeFloat(thisEnemy.base.position.duplicate().subV(Vec2(0, 50)).y, thisEnemy.base.position.duplicate().addV(Vec2(0, 50)).y)).subV(currentMap().mapPos);
									spawnItem(getLootTable(this.lootAmount, this.dropRariety, this.dropTypeExclude, this.dropNameExclude), dropPos);
								}
								let dropDrugAmount = rangeInt(this.drugAmount.x, this.drugAmount.y);
								for (let i=0;i<dropDrugAmount;i++) {
									let dropPos = Vec2(rangeFloat(thisEnemy.base.position.duplicate().subV(Vec2(50, 0)).x, thisEnemy.base.position.duplicate().addV(Vec2(50, 0)).x), rangeFloat(thisEnemy.base.position.duplicate().subV(Vec2(0, 50)).y, thisEnemy.base.position.duplicate().addV(Vec2(0, 50)).y)).subV(currentMap().mapPos);
									spawnItem(getRandomByType("drug", this.dropRariety, this.dropNameExclude), dropPos);
								}
							}
							thisBullet.base.destroy();
						}
					}
				}
				//Enemy bullet code
				let enemyBullets = getByNameTag(nt("", "enemy_bullet"), 2, false, true);
				if (enemyBullets != null) {
					for (let i=0;i<enemyBullets.length;i++) {
						let dist = enemyBullets[i].base.startPosition.distance(enemyBullets[i].base.position);
						if (dist > enemyBullets[i].range) {
							enemyBullets[i].base.marked = true;
						}
						if (cirPolyCollision(enemyBullets[i], currentPlayer.playerOBJ)) {
							currentPlayer.damagePlayer(enemyBullets[i].damage);
							enemyBullets[i].base.destroy();
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
			let background = rectangle(8, base(true, nt("background", "deathScreen"), screen.resolution, screen.halfResolution, colorD("black")));
			let deathText = text(8, "You are dead...", base(true, nt("deathtxt", "deathScreen"), Vec2("80px Arial"), Vec2(screen.halfResolution.x, 50), new  colorData("red")));
			let deadButton = rectangle(8, base(true, nt("deathButton", "deathScreen"), Vec2(200, 50), screen.halfResolution, colorD("grey", 1), shadow(Vec2(5, 5), "rgba(255, 255, 255, 0.2)", 5)));
			let deadButtonTxt = text(8, "RESPAWN", base(true, nt("deathButtontxt", "deathScreen"), Vec2("30px Arial"), screen.halfResolution, colorD("white")));
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
	let deadButtonLink = bttnL(null, null, recCollision, this.hide, null, null, Vec2("rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 1)"), null);
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
			config.tileTables = [tileTL("table_1", "this_table_1")];
			loadTileTables();
			config.maps = ["test_map", "new_test_map"];
			loadMaps();
			thisLoaded = true;
		}
		if (oldLocationId != locationId) {
			deleteByNameTag(nt("", "enemy"), 2, true);
			deleteUpdate(1, "enemySpawner");
			currentPlayer.loaded = false;
			loadedCollisionArray = false;
			oldLocationId = locationId;
		}
		if (currentMap() != null && currentMap().loaded) {
			if (!currentPlayer.loaded) {
				currentPlayer.load(currentMap().playerPosInit);
			}
			if (!loadedCollisionArray) {
				collisionArray = getByNameTag(nt("collide", ""), 1, false, true);
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
let moveUpBttn = K(
	"Up",
	[
		keyD("w", 0)
	],
	Vec2(() => {
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
let moveDownBttn = K(
	"Down",
	[
		keyD("s", 0)
	],
	Vec2(() => {
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
let moveLeftBttn = K(
	"Left",
	[
		keyD("a", 0)
	],
	Vec2(() => {
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
let moveRightBttn = K(
	"Right",
	[
		keyD("d", 0)
	],
	Vec2(() => {
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
let runBttn = K(
	"Run",
	[
		keyD("Shift", 1)
	],
	Vec2(() => {
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

let playerMovement = contAxisB(1, (e)=>{
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

contBttnB(1, (e)=>{
	if(e.pressed){
		if(currentPlayer.loaded){
		if(!currentPlayer.dead){
			currentPlayer.run = true;
		}else{
			currentPlayer.run = false;
		}
	}
	}else{
		if(currentPlayer.loaded){
			currentPlayer.run = false;
		}
	}
}, "playerRun", "ls", false);

let playerShoot = contAxisB(1, (e)=>{
	if (currentPlayer.loaded){
		if (!isPaused){
			if(!e.r && !currentPlayer.dead) {
				
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
}, "playerShoot", 1);
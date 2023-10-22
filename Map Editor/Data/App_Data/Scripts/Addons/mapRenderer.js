//Add image import to tile table link
const tileTableLink = function(fileName="", funcName="") {
	this.fileName = fileName;
	this.funcName = funcName;
}

//Shorthand function
const tileTL = (fileName="", funcName="") => {
	return new tileTableLink(fileName, funcName);
}

//Map Addon Config
const config = {
	scale:2,
	mapScrollSpeed:5,
	tileTablesPath:"./Scripts/Tile_Tables/",
	tileTables:[],
	mapsPath:"./Scripts/Maps/",
	maps:[],
};

let tileTableDiv = document.createElement('div');
tileTableDiv.id = "tileTables";
document.body.appendChild(tileTableDiv);

const loadTileTables = () => {
	config.tileTables.forEach((t) => {
		if (document.getElementById(t.fileName) == null) {
			let script = document.createElement('script');
			script.id = t.fileName;
			script.src = config.tileTablesPath+t.fileName+"/"+t.fileName+".js";
			tileTableDiv.appendChild(script);
		}
	});
}
loadTileTables();

let mapDiv = document.createElement('div');
mapDiv.id = "maps";
document.body.appendChild(mapDiv);

const loadMaps = () => {
	config.maps.forEach((m) => {
		if (document.getElementById(m) == null) {
			let script = document.createElement('script');
			script.id = m;
			script.src = config.mapsPath+m+".js";
			mapDiv.appendChild(script);
		}
	});
}
loadMaps();

//Global vars
let gameState = 0; //0- Main menu, 1- Gameplay
let locationId = 0;

const tile = function(tableId=0, pos=ZERO, layerNum=1, tileTable=null) {
	this.tableId = tableId;
	this.pos = pos;
	if (this.pos.x <= 0) {
		this.pos.x = 1;
	}
	if (this.pos.y <= 0) {
		this.pos.y = 1;
	}
	this.layerNum = layerNum;
	this.tileTable = tileTable;
	this.duplicate = function() {
		return new tile(this.tableId, this.pos, this.layerNum, this.tileTable);
	}
}

//Shorthand function
const Tile = (tableId=0, pos=ZERO, layerNum=1, tileTable=null) => {
	return new tile(tableId, pos, layerNum, tileTable);
}

const maps = [];

const map = function(locationId=0, thisNameTag=nt(), mapSize=Vec2(20, 20), mapPosInit=ZERO, playerPosInit=ZERO, tileSize=Vec2(16, 16), tiles=[]) {
	this.locationId = locationId;
	this.nameTag = thisNameTag;
	this.mapSize = mapSize;
	this.mapPosInit = mapPosInit;
	this.playerPosInit = playerPosInit;
	this.tileSize = tileSize;
	this.tiles = tiles;
	
	this.loaded = false;
	this.dir = Vec2();
	this.oldMapPos = Vec2();
	this.mapPos = this.mapPosInit;
	this.mapSizeReal = Vec2();
	this.mapHalfSizeReal = Vec2();
	this.movingMap = false;
	this.removeMap = false;
	
	let mapObjs = [];
	let oldLength = 0;
	
	this.getTileByMapPos = (mapPos=Vec2(), layerNumber=1) => {
		return objectArray.filter((o) => (o.base.nameTag.tag == this.nameTag.name && o.mapPos.same(mapPos) && o.layerNumber == layerNumber));
	}
	
	this.load = (mapPos=null) => {
		if (mapPos != null) {
			this.mapPos = mapPos;
		}
		for (let i=0;i<this.tiles.length;i++) {
			let thisTile = Tile(this.tiles[i].tableId, Vec2(this.tiles[i].pos.x, this.tiles[i].pos.y), this.tiles[i].layerNum, this.tiles[i].tileTable);
			if (typeof thisTile.tileTable == "string") {
				thisTile.tileTable = eval(thisTile.tileTable);
			}
			if (thisTile.pos.x <= this.mapSize.x && thisTile.pos.y <= this.mapSize.y) {
				let thisTilePos = Vec2((thisTile.pos.x*this.tileSize.x*config.scale)-((this.tileSize.x*config.scale)/2), (thisTile.pos.y*this.tileSize.y*config.scale)-((this.tileSize.y*config.scale)/2));
				let newTileOBJ = thisTile.tileTable[thisTile.tableId].duplicate();
				newTileOBJ.layerNumber = thisTile.layerNum;
				newTileOBJ.mapPos = thisTile.pos;
				newTileOBJ.base.nameTag.tag = this.nameTag.name;
				newTileOBJ.base.size = newTileOBJ.base.size.multi(config.scale);
				newTileOBJ.base.position = thisTilePos.addV(this.mapPos).duplicate();
				newTileOBJ.base.startPosition = thisTilePos.duplicate();
				addObject(newTileOBJ);
			}
		}
		this.loaded = true;
		addUpdate(update, this.nameTag.name);
	}
	
	this.unload = () => {
		deleteByNameTag(nt("", this.nameTag.name), 2, true);
		this.loaded = false;
		deleteUpdate(1, this.nameTag.name);
	}
	
	const update = () => {
		let speedVector = this.dir.multi(config.mapScrollSpeed);
		this.mapPos = this.mapPos.addV(speedVector.multi(delta));
		let objArrayLength = objectArray.length;
		if (oldLength != objArrayLength) {
			mapObjs = objectArray.filter((o) => o.base.nameTag.tag.includes(this.nameTag.name));
			oldLength = objArrayLength;
		}
		if (!this.oldMapPos.same(this.mapPos)) {
			for (let i=0,length=mapObjs.length;i<length;i++) {
				let objectBase = mapObjs[i].base;
				objectBase.position = objectBase.startPosition.addV(this.mapPos);
				if (i == length-1) {
					this.oldMapPos = this.mapPos;
				}
			}
		}
		if (this.dir.same(ZERO)) {
			this.movingMap = false;
		} else {
			this.movingMap = true;
		}
		this.mapSizeReal = this.mapSize.multiV(this.tileSize).multi(config.scale);
		this.mapHalfSizeReal = this.mapSizeReal.div(2);
	}
	maps.push(this);
}

//Shorthand function
const M = (locationId=0, thisNameTag=nt(), mapSize=Vec2(20, 20), mapPosInit=ZERO, playerPosInit=ZERO, tileSize=Vec2(16, 16), tiles=[]) => {
	return new map(locationId, thisNameTag, mapSize, mapPosInit, playerPosInit, tileSize, tiles);
}

//Gets current map
const currentMap = () => {
	for (let i=0,mapsLength=maps.length;i<mapsLength;i++) {
		if (maps[i].loaded) {
			return maps[i];
		}
	};
}

//Gets position of a tile
const getMapTilePos = (vec2=ONE) => {
	let thisMapSize = currentMap().mapSize;
	let thisTileSize = currentMap().tileSize;
	let thisMapPos = currentMap().mapPos;
	if (vec2.x < 1) {
		vec2.x = 0;
	}
	if (vec2.x > thisMapSize.x) {
		vec2.x = thisMapSize.x;
	}
	if (vec2.y < 1) {
		vec2.y = 0;
	}
	if (vec2.y > thisMapSize.y) {
		vec2.y = thisMapSize.y;
	}
	return vec2.multiV(thisTileSize).multi(config.scale).addV(thisMapPos).subV(thisTileSize.multi(config.scale).div(2));
}

//Gets map by nameTag
const getMap = (thisNameTag=nt()) => {
	for (let i=0,mapsLength=maps.length;i<mapsLength;i++) {
		if (maps[i].nameTag.same(thisNameTag)) {
			return maps[i];
		}
	};
}

//Deletes map by nameTag
const deleteMap = (thisNameTag=nt()) => {
	for (let i=0,mapsLength=maps.length;i<mapsLength;i++) {
		if (maps[i].nameTag.same(thisNameTag)) {
			deleteByNameTag(nt("", maps[i].nameTag.name), 2);
			maps.splice(i, 1);
		}
	};
}

//Loads maps
const mapLoader = () => {
	if (gameState == 1) {
		maps.forEach((i) => {
			if (i.locationId == locationId) {
				if (!i.loaded) {
					if (typeof saveData != "undefined" && saveData.mapPos != null) {
						i.load(saveData.mapPos);
					} else {
						i.load(i.mapPosInit);
					}
				}
			} else {
				if (i.loaded) {
					i.unload();
				}
			}
		});
	}
}
addUpdate(mapLoader, "mapLoader");
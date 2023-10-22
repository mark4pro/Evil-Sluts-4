function editor() {
	this.locationId = 0;
	this.nameTag = nt("newMap", "mapTag");
	this.mapSize = Vec2();
	this.mapPosInit = Vec2();
	this.playerPosInit = Vec2();
	this.tileSize = Vec2();
	this.tiles = [];
	
	this.oldNameTag = nt("newMap", "mapTag");
	this.oldTileSize = Vec2(32, 32);
	this.gridNameTag = nt("gridTile", "grid");
	this.gridSize = Vec2();
	this.thisGridTile = null;
	this.currentGridTile = null;
	this.oldCurrentTileNumber = -1;
	this.currentTileNumber = 0;
	this.thisTile = [];
	this.currentTile = null;
	this.reload = false;
	this.placeLatch = false;
	this.deleteLatch = false;
	this.currentLayer = 1;
	this.currentTileTableNumber = 1;
	this.currentTileTable = null;
	this.currentTileTableName = null;
	
	let thisMap = null;
	let oldMapPos = Vec2();
	let movingGrid = false;
	
	getCursor().base.size = Vec2(1, 1);
	
	let gridTiles = [];
	let oldLength = 0;
	let stopHide = false;
	
	//Gets map as a string
	this.getTrueMap = function() {
	return "M("+this.locationId+", nt('"+this.nameTag.name+"', '"+this.nameTag.tag+"'), Vec2("+this.mapSize.x+", "+this.mapSize.y+"), Vec2("+this.mapPosInit.x+", "+this.mapPosInit.y+"), Vec2("+this.playerPosInit.x+", "+this.playerPosInit.y+"), Vec2("+this.tileSize.x+", "+this.tileSize.y+"), "+JSON.stringify(this.tiles).replace("'", "")+");";
	}
	
	//Save map
	this.saveMap = function() {
		localStorage.setItem(this.nameTag.name, JSON.stringify(thisMap));
		localStorage.setItem(this.nameTag.name+"_tile_data", JSON.stringify(this.tiles));
	}
	
	//Load map
	this.loadMap = function() {
		let data = JSON.parse(localStorage.getItem(this.nameTag.name));
		let data_tiles = JSON.parse(localStorage.getItem(this.nameTag.name+"_tile_data"));
		this.idTxtBox.value = String(data.locationId);
		this.nameTxtBox.value = String(data.nameTag.name);
		this.sizeXTxtBox.value = String(data.mapSize.x);
		this.sizeYTxtBox.value = String(data.mapSize.y);
		this.startPosXTxtBox.value = String(data.mapPosInit.x);
		this.startPosYTxtBox.value = String(data.mapPosInit.y);
		this.playerPosXTxtBox.value = String(data.playerPosInit.x);
		this.playerPosYTxtBox.value = String(data.playerPosInit.y);
		this.tileSizeXTxtBox.value = String(data.tileSize.x);
		this.tileSizeYTxtBox.value = String(data.tileSize.y);
		this.tiles = data.tiles;
	}
	
	//UI
	this.panel = rectangle(8, base(false, nt("editorPanel", "editor"), Vec2(400, 720), Vec2(1080, 360), colorD("lightgrey", 1)));
	this.nameTxt = text(8, "Name:", base(false, nt("nameTxt", "editor"), Vec2("30px Arial", false, "left"), Vec2(940, 50), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.nameTxtBox = textBox(8, "30px Arial", "white", base(false, nt("nameTxtBox", "editor"), Vec2(100, 50), Vec2(1085, 50), colorD("black", 1)));
	this.nameTxtBox.value = "newMap";
	this.idTxt = text(8, "Id:", base(false, nt("idTxt", "editor"), Vec2("30px Arial", false, "left"), Vec2(940, 120), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.idTxtBox = textBox(8, "30px Arial", "white", base(false, nt("idTxtBox", "editor"), Vec2(50, 50), Vec2(1005, 120), colorD("black", 1)));
	this.idTxtBox.value = "0";
	this.sizeXTxt = text(8, "Size: X-", base(false, nt("sizeXTxt", "editor"), Vec2("30px Arial", false, "left"), Vec2(940, 190), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.sizeXTxtBox = textBox(8, "30px Arial", "white", base(false, nt("sizeXTxtBox", "editor"), Vec2(50, 50), Vec2(1075, 190), colorD("black", 1)));
	this.sizeXTxtBox.value = "0";
	this.sizeYTxt = text(8, "Y-", base(false, nt("sizeYTxt", "editor"), Vec2("30px Arial", false, "left"), Vec2(1110, 190), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.sizeYTxtBox = textBox(8, "30px Arial", "white", base(false, nt("sizeYTxtBox", "editor"), Vec2(50, 50), Vec2(1167, 190), colorD("black", 1)));
	this.sizeYTxtBox.value = "0";
	this.startPosXTxt = text(8, "Start: X-", base(false, nt("startPosXTxt", "editor"), Vec2("30px Arial", false, "left"), Vec2(940, 260), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.startPosXTxtBox = textBox(8, "30px Arial", "white", base(false, nt("startPosXTxtBox", "editor"), Vec2(50, 50), Vec2(1080, 260), colorD("black", 1)));
	this.startPosXTxtBox.value = "0";
	this.startPosYTxt = text(8, "Y-", base(false, nt("startPosYTxt", "editor"), Vec2("30px Arial", false, "left"), Vec2(1110, 260), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.startPosYTxtBox = textBox(8, "30px Arial", "white", base(false, nt("startPosYTxtBox", "editor"), Vec2(50, 50), Vec2(1167, 260), colorD("black", 1)));
	this.startPosYTxtBox.value = "0";
	this.playerPosXTxt = text(8, "Player: X-", base(false, nt("playerPosXTxt", "editor"), Vec2("30px Arial", false, "left"), Vec2(940, 330), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.playerPosXTxtBox = textBox(8, "30px Arial", "white", base(false, nt("playerPosXTxtBox", "editor"), Vec2(50, 50), Vec2(1100, 330), colorD("black", 1)));
	this.playerPosXTxtBox.value = "0";
	this.playerPosYTxt = text(8, "Y-", base(false, nt("playerPosYTxt", "editor"), Vec2("30px Arial", false, "left"), Vec2(1130, 330), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.playerPosYTxtBox = textBox(8, "30px Arial", "white", base(false, nt("playerPosYTxtBox", "editor"), Vec2(50, 50), Vec2(1190, 330), colorD("black", 1)));
	this.playerPosYTxtBox.value = "0";
	this.tileSizeXTxt = text(8, "Tile: X-", base(false, nt("tileSizeXTxt", "editor"), Vec2("30px Arial", false, "left"), Vec2(940, 400), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.tileSizeXTxtBox = textBox(8, "30px Arial", "white", base(false, nt("tileSizeXTxtBox", "editor"), Vec2(50, 50), Vec2(1065, 400), colorD("black", 1)));
	this.tileSizeXTxtBox.value = "32";
	this.tileSizeYTxt = text(8, "Y-", base(false, nt("tileSizeYTxt", "editor"), Vec2("30px Arial", false, "left"), Vec2(1100, 400), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.tileSizeYTxtBox = textBox(8, "30px Arial", "white", base(false, nt("tileSizeYTxtBox", "editor"), Vec2(50, 50), Vec2(1160, 400), colorD("black", 1)));
	this.tileSizeYTxtBox.value = "32";
	this.currentTileTxt = text(8, "none", base(false, nt("currentTileTxt", "editor"), Vec2("30px Arial", false, "center"), Vec2(1150, 550), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.leftBttn = rectangle(8, base(false, nt("leftBttn", "editor"), Vec2(50, 50), Vec2(1100, 600), colorD("grey", 1)));
	this.leftBttnTxt = text(8, "<", base(false, nt("leftBttnTxt", "editor"), Vec2("30px Arial", false, "center"), Vec2(1100, 600), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.leftBttnLink = bttnL(this.leftBttn, this.leftBttnTxt, recCollision, () => {
		if (this.currentTileTable != null && this.currentTileNumber > 0) {
			this.currentTileNumber--;
		} else {
			this.currentTileTableNumber--;
			this.currentTileNumber = this.currentTileTable.length;
		}
	}, Vec2(colorD("grey"), colorD("darkgrey")));
	this.rightBttn = rectangle(8, base(false, nt("rightBttn", "editor"), Vec2(50, 50), Vec2(1200, 600), colorD("grey", 1)));
	this.rightBttnTxt = text(8, ">", base(false, nt("rightBttnTxt", "editor"), Vec2("30px Arial", false, "center"), Vec2(1200, 600), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.rightBttnLink = bttnL(this.rightBttn, this.rightBttnTxt, recCollision, () => {
		if (this.currentTileTable != null && this.currentTileNumber < this.currentTileTable.length) {
			this.currentTileNumber++;
		} else {
			this.currentTileNumber = 0;
			this.currentTileTableNumber++;
		}
	}, Vec2(colorD("grey"), colorD("darkgrey")));
	this.currentTileNumberTxt = text(8, "0", base(false, nt("currentTileNumberTxt", "editor"), Vec2("30px Arial", false, "center"), Vec2(1150, 600), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.layerTxt = text(8, "Layer", base(false, nt("currentLayerTxt", "editor"), Vec2("30px Arial", false, "center"), Vec2(1150, 645), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.leftLayerBttn = rectangle(8, base(false, nt("leftLayerBttn", "editor"), Vec2(50, 50), Vec2(1100, 690), colorD("grey", 1)));
	this.leftLayerBttnTxt = text(8, "<", base(false, nt("leftLayerBttnTxt", "editor"), Vec2("30px Arial", false, "center"), Vec2(1100, 690), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.leftLayerBttnLink = bttnL(this.leftLayerBttn, this.leftLayerBttnTxt, recCollision, () => {
		this.currentLayer--;
	}, Vec2(colorD("grey"), colorD("darkgrey")));
	this.rightLayerBttn = rectangle(8, base(false, nt("rightLayerBttn", "editor"), Vec2(50, 50), Vec2(1200, 690), colorD("grey", 1)));
	this.rightLayerBttnTxt = text(8, ">", base(false, nt("rightLayerBttnTxt", "editor"), Vec2("30px Arial", false, "center"), Vec2(1200, 690), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	this.rightLayerBttnLink = bttnL(this.rightLayerBttn, this.rightLayerBttnTxt, recCollision, () => {
		this.currentLayer++;
	}, Vec2(colorD("grey"), colorD("darkgrey")));
	this.currentLayerTxt = text(8, "1", base(false, nt("currentLayerTxt", "editor"), Vec2("30px Arial", false, "center"), Vec2(1150, 690), colorD("white"), shadow(Vec2(2, 2), "black", 10)));
	
	//Reset map
	this.resetMap = () => {
		if (currentMap() != undefined) {
			oldMapPos = currentMap().mapPos;
			currentMap().dir = Vec2();
		}
		deleteMap(this.nameTag);
	}
	
	//Tools
	this.fillLatch = false;
	this.fill = (mapPos=Vec2(), size=Vec2()) => {
		if (gridTiles != null) {
			for (let x=0;x<size.x;x++) {
				for (let y=0;y<size.y;y++) {
					let thisMapPos = mapPos.duplicate().addV(Vec2(x, y));
					//this.thisTile = currentMap().getTileByMapPos(thisMapPos, this.currentLayer);
					if (currentMap().getTileByMapPos(thisMapPos, this.currentLayer).length == 0) {
						let newTile = Tile(this.currentTileNumber, thisMapPos.duplicate(), this.currentLayer, this.currentTileTableName);
						this.tiles.push(newTile.duplicate());
						if (x == size.x-1 && y == size.y-1) {
							this.resetMap();
						}
					}
				}
			}
		}
	}
	
	const update = () => {
		if (gameState == 1) {
			//Checks
			if (this.currentTileTableNumber < 1) {
				this.currentTileTableNumber = 1;
			}
			if (this.currentTileTableNumber > config.tileTables.length) {
				this.currentTileTableNumber = config.tileTables.length;
			}
			this.currentTileTableName = config.tileTables[this.currentTileTableNumber-1].funcName;
			this.currentTileTable = eval(this.currentTileTableName);
			locationId = this.locationId;
			if (this.currentTileTable != null) {
				if (this.currentTileNumber > this.currentTileTable.length) {
					this.currentTileNumber = this.currentTileTable.length;
				}
				if (this.currentTileNumber < 0) {
					this.currentTileNumber = 0;
				}
				this.currentTile = this.currentTileTable[this.currentTileNumber];
			}
			if (this.currentLayer > layer.length) {
				this.currentLayer = layer.length;
			}
			if (this.currentLayer <= 0) {
				this.currentLayer = 1;
			}
			//Load UI
			if (getByNameTag(this.panel.base.nameTag) == null) {
				addObject(this.panel);
				addObject(this.nameTxt);
				addObject(this.nameTxtBox);
				addObject(this.idTxt);
				addObject(this.idTxtBox);
				addObject(this.sizeXTxt);
				addObject(this.sizeXTxtBox);
				addObject(this.sizeYTxt);
				addObject(this.sizeYTxtBox);
				addObject(this.startPosXTxt);
				addObject(this.startPosXTxtBox);
				addObject(this.startPosYTxt);
				addObject(this.startPosYTxtBox);
				addObject(this.playerPosXTxt);
				addObject(this.playerPosXTxtBox);
				addObject(this.playerPosYTxt);
				addObject(this.playerPosYTxtBox);
				addObject(this.tileSizeXTxt);
				addObject(this.tileSizeXTxtBox);
				addObject(this.tileSizeYTxt);
				addObject(this.tileSizeYTxtBox);
				addObject(this.currentTileTxt);
				addObject(this.leftBttn);
				addObject(this.leftBttnTxt);
				this.leftBttnLink.link();
				addObject(this.rightBttn);
				addObject(this.rightBttnTxt);
				this.rightBttnLink.link();
				addObject(this.currentTileNumberTxt);
				addObject(this.layerTxt);
				addObject(this.leftLayerBttn);
				addObject(this.leftLayerBttnTxt);
				this.leftLayerBttnLink.link();
				addObject(this.rightLayerBttn);
				addObject(this.rightLayerBttnTxt);
				this.rightLayerBttnLink.link();
				addObject(this.currentLayerTxt);
			}
			//Update UI and Vars
			if (!this.nameTxtBox.isSelected()) {
				this.nameTag.name = this.nameTxtBox.value;
			}
			this.locationId = parseInt(this.idTxtBox.value);
			if (!this.sizeXTxtBox.isSelected() && !this.sizeYTxtBox.isSelected()) {
				this.mapSize = Vec2(parseInt(this.sizeXTxtBox.value), parseInt(this.sizeYTxtBox.value));
			}
			this.mapPosInit = Vec2(parseFloat(this.startPosXTxtBox.value), parseFloat(this.startPosYTxtBox.value));
			this.playerPosInit = Vec2(parseFloat(this.playerPosXTxtBox.value), parseFloat(this.playerPosYTxtBox.value));
			if (!this.tileSizeXTxtBox.isSelected() && !this.tileSizeYTxtBox.isSelected()) {
				this.tileSize = Vec2(parseFloat(this.tileSizeXTxtBox.value), parseFloat(this.tileSizeYTxtBox.value));
			}
			if (this.currentTile != null) {
				this.currentTileTxt.text = this.currentTile.base.nameTag.name;
			}
			this.currentTileNumberTxt.text = this.currentTileTableNumber+"-"+this.currentTileNumber;
			this.currentLayerTxt.text = this.currentLayer;
			
			if (getMap(this.nameTag) == undefined) {
				maps.length = 0;
				thisMap = new map(this.locationId, this.nameTag, this.mapSize, oldMapPos, this.playerPosInit, this.tileSize, this.tiles);
			}
			
			//Load grid
			if (!this.gridSize.same(this.mapSize) || this.reload) {
				if (this.mapSize.same(ZERO)) {
					this.gridSize = this.mapSize;
				}
				deleteByNameTag(this.nameTag, 0, true);
				deleteByNameTag(this.gridNameTag, 0, true);
				for (let x=1;x<=this.mapSize.x;x++) {
					for (let y=1;y<=this.mapSize.y;y++) {
						let thisPos = Vec2((x*this.tileSize.x*config.scale)-((this.tileSize.x*config.scale)/2), (y*this.tileSize.y*config.scale)-((this.tileSize.y*config.scale)/2));
						let thisNewPos = thisPos.addV(oldMapPos);
						let gridTile = rectangle(8, base(false, nt(this.gridNameTag.name+"_"+x+"_"+y, this.gridNameTag.tag), this.tileSize.multi(config.scale), thisNewPos, colorD("grey", 0.25)));
						gridTile.mapPos = Vec2(x, y);
						gridTile.base.startPosition = thisPos.duplicate();
						layer[8].unshift(gridTile);
						loaded = false;
						if (x == this.mapSize.x && y == this.mapSize.y) {
							gridTiles = getByNameTag(this.gridNameTag, mode=0, false, true);
							this.gridSize = this.mapSize.duplicate();
						}
						if (y >= this.mapSize.y) {
							this.resetMap();
							this.reload = false;
						}
					}
				}
			}
			if (currentMap() != undefined) {
				if (!currentMap().movingMap) {
					//Move Grid
					if (!oldMapPos.same(currentMap().mapPos) || this.reload) {
						for (let i=0,length=gridTiles.length;i<length;i++) {
							let objectBase = gridTiles[i].base;
							movingGrid = true;
							objectBase.position = objectBase.startPosition.addV(currentMap().mapPos);
							if (i == length-1) {
								movingGrid = false;
								oldMapPos = currentMap().mapPos;
							}
						}
					}
					if (!recCollision(Cursor.cursor, this.panel) && !isPaused) {
						//Hover highlight/Place tiles
						if (gridTiles != null) {
							for (let i=0,length=gridTiles.length;i<length;i++) {
								let thisObj = gridTiles[i];
								let objectBase = thisObj.base;
								if (recCollision(Cursor.cursor, thisObj)) {
									objectBase.color.alpha = 0.5;
									this.thisGridTile = thisObj;
									this.thisTile = currentMap().getTileByMapPos(this.thisGridTile.mapPos, this.currentLayer);
									if (mousePressed[0] && !this.placeLatch && this.thisTile.length == 0) {
										this.currentGridTile = this.thisGridTile;
										let newTile = Tile(this.currentTileNumber, this.currentGridTile.mapPos.duplicate(), this.currentLayer, this.currentTileTableName);
										this.tiles.push(newTile.duplicate());
										this.resetMap();
										this.placeLatch = true;
									}
								} else {
									objectBase.color.alpha = 0.25;
								}
							}
						}
						//Delete tiles
						if (this.thisTile.length != 0 && mousePressed[2] && !this.deleteLatch) {
							deleteByNameTag(this.thisTile[0].base.nameTag);
							this.tiles = this.tiles.filter((o) => {
								if (o.pos.same(this.thisTile[0].mapPos) && o.layerNum == this.thisTile[0].layerNumber) {
									return false;
								} else {
									return true;
								}
							});
							this.resetMap();
							this.deleteLatch = true;
						}
					}
					//Unhides the grid after moving the map
					if (stopHide) {
						gridTiles.forEach((o, i) => {
							if (o.base.color.alpha == 0) {
								o.base.color.alpha = 0.25;
							}
							if (i == gridTiles.length-1) {
								stopHide = false;
							}
						});
					}
				} else {
					//Hides the map while moving the grid
					if (!stopHide) {
						gridTiles.forEach((o, i) => {
							if (o.base.color.alpha != 0) {
								o.base.color.alpha = 0;
							}
							if (i == gridTiles.length-1) {
								stopHide = true;
							}
						});
					}
				}
			}
			//Update UI
			let visCurrentTileNameTag = nt("visCurrentTile", "editor");
			if (this.currentTileNumber != this.oldCurrentTileNumber || getByNameTag(visCurrentTileNameTag) == null) {
				if (this.currentTile != null) {
					deleteByNameTag(visCurrentTileNameTag);
					let visCurrentTile = this.currentTile.duplicate();
					visCurrentTile.layerNumber = 8;
					visCurrentTile.base.nameTag = visCurrentTileNameTag;
					visCurrentTile.base.size = Vec2(64, 64);
					visCurrentTile.base.position = Vec2(1150, 500);
					addObject(visCurrentTile);
				}
				this.oldCurrentTileNumber = this.currentTileNumber;
			}
			if (!this.oldNameTag.same(this.nameTag)) {
				deleteByNameTag(nt("", this.oldNameTag.name), 2);
				this.resetMap();
				this.oldNameTag = this.nameTag.duplicate();
			}
			if (!this.oldTileSize.same(this.tileSize)) {
				this.reload = true;
				this.oldTileSize = this.tileSize.duplicate();
			}
			if (!mousePressed[0] && this.placeLatch) {
				this.placeLatch = false;
			}
			if (!mousePressed[2] && this.deleteLatch) {
				this.deleteLatch = false;
			}
		} else {
			//Unload UI
			if (getByNameTag(this.panel.base.nameTag) != null) {
				deleteByNameTag(this.currentLayerTxt.base.nameTag);
				this.rightLayerBttnLink.unlink();
				deleteByNameTag(this.rightLayerBttnTxt.base.nameTag);
				deleteByNameTag(this.rightLayerBttn.base.nameTag);
				this.leftLayerBttnLink.unlink();
				deleteByNameTag(this.leftLayerBttnTxt.base.nameTag);
				deleteByNameTag(this.leftLayerBttn.base.nameTag);
				deleteByNameTag(this.layerTxt.base.nameTag);
				deleteByNameTag(this.currentTileNumberTxt.base.nameTag);
				this.rightBttnLink.unlink();
				deleteByNameTag(this.rightBttnTxt.base.nameTag);
				deleteByNameTag(this.rightBttn.base.nameTag);
				this.leftBttnLink.unlink();
				deleteByNameTag(this.leftBttnTxt.base.nameTag);
				deleteByNameTag(this.leftBttn.base.nameTag);
				deleteByNameTag(this.currentTileTxt.base.nameTag);
				deleteByNameTag(this.tileSizeYTxtBox.base.nameTag);
				deleteByNameTag(this.tileSizeYTxt.base.nameTag);
				deleteByNameTag(this.tileSizeXTxtBox.base.nameTag);
				deleteByNameTag(this.tileSizeXTxt.base.nameTag);
				deleteByNameTag(this.playerPosYTxtBox.base.nameTag);
				deleteByNameTag(this.playerPosYTxt.base.nameTag);
				deleteByNameTag(this.playerPosXTxtBox.base.nameTag);
				deleteByNameTag(this.playerPosXTxt.base.nameTag);
				deleteByNameTag(this.startPosYTxtBox.base.nameTag);
				deleteByNameTag(this.startPosYTxt.base.nameTag);
				deleteByNameTag(this.startPosXTxtBox.base.nameTag);
				deleteByNameTag(this.startPosXTxt.base.nameTag);
				deleteByNameTag(this.sizeYTxtBox.base.nameTag);
				deleteByNameTag(this.sizeYTxt.base.nameTag);
				deleteByNameTag(this.sizeXTxtBox.base.nameTag);
				deleteByNameTag(this.sizeXTxt.base.nameTag);
				deleteByNameTag(this.idTxtBox.base.nameTag);
				deleteByNameTag(this.idTxt.base.nameTag);
				deleteByNameTag(this.nameTxtBox.base.nameTag);
				deleteByNameTag(this.nameTxt.base.nameTag);
				deleteByNameTag(this.panel.base.nameTag);
			}
			if (getByNameTag(this.gridNameTag, 0, false, true) != null) {
				this.mapSize = Vec2();
				this.gridSize = Vec2();
				layer[8] = [];
			}
		}
	}
	addUpdate(update, "editor");
}
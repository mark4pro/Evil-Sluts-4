const MAX_LAYERS = 12; // The amount of render layers there are
const CHUNK_SIZE = 128; // Amount of tiles in each chunk

const MAP_PATH = "./Scripts/Maps/";
//const TILE_MAP_PATH = "./Tile_Map.json";

let setting = {
    scale: 2,
    scroll_speed: 5,
}

const map = function(width, height, tileSize) {
    this.width = width;
    this.height = height;

    this.tileSize = tileSize;

    this.layers = [];

    this.position = Vec2();

    this.addLayer = (layer) => {
        this.layers.push(layer);
    }
}

const tileLayer = function(map, name = "") {
    this.map = map;
    this.name = name;

    // index = x + y * map.width
    this.tiles = new Array(map.width * map.height).fill(0);

    this.chunks = new Map();

    this.getTile = (x, y) => {
        if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
            return 0;
        }

        return this.tiles[x + y * map.width];
    }

    this.setTile = (x, y, tileID) => {
        if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
            return;
        }

        this.tiles[x + y * map.width] = tileID;
    }

    this.getChunk = (chunkX, chunkY) => {

        const key = `${chunkX},${chunkY}`;

        let chunk = this.chunks.get(key);

        if (chunk == null) {
            chunk = new tileChunk(this, chunkX, chunkY);
            this.chunks.set(key, chunk);
        }

        return chunk;
    }

    this.getChunkAtTile = (tileX, tileY) => {

        const chunkX = Math.floor(tileX / CHUNK_SIZE);
        const chunkY = Math.floor(tileY / CHUNK_SIZE);

        return this.getChunk(chunkX, chunkY);
    }
}

const tileChunk = function(layer, chunkX, chunkY) {
    this.layer = layer;

    this.x = chunkX;
    this.y = chunkY;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.dirty = true;

    this.tileStartX = chunkX * CHUNK_SIZE;
    this.tileStartY = chunkY * CHUNK_SIZE;

    this.tileEndX = Math.min(
        this.tileStartX + CHUNK_SIZE,
        layer.map.width
    );

    this.tileEndY = Math.min(
        this.tileStartY + CHUNK_SIZE,
        layer.map.height
    );
}

//TEST DATA
const testMap = new map(
    256,             // width in tiles
    256,             // height in tiles
    Vec2(16, 16)     // tile size
);

const ground = new tileLayer(testMap, "Ground");

testMap.addLayer(ground);

for (let y = 0; y < testMap.height; y++) {
    for (let x = 0; x < testMap.width; x++) {

        let tileID = 1;

        // Border
        if (
            x === 0 ||
            y === 0 ||
            x === testMap.width - 1 ||
            y === testMap.height - 1
        ) {
            tileID = 4;
        }

        // Water area
        if (
            x >= 20 &&
            x < 50 &&
            y >= 20 &&
            y < 50
        ) {
            tileID = 3;
        }

        // Dirt path
        if (
            x >= 60 &&
            x < 100 &&
            y >= 60 &&
            y < 70
        ) {
            tileID = 2;
        }

        ground.setTile(x, y, tileID);
    }
}

ground.getChunk(0, 0);

console.log(testMap);
console.log(ground.getTile(25, 25));
console.log(ground.getChunkAtTile(25, 25));

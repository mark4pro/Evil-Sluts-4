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

    // index = x + y * this.map.width
    this.tiles = new Array(this.map.width * this.map.height).fill(0);

    this.chunks = new Map();

    this.getTile = (x, y) => {
        if (x < 0 || y < 0 || x >= this.map.width || y >= map.height) {
            return 0;
        }

        return this.tiles[x + y * this.map.width];
    };

    this.setTile = (x, y, tileID) => {
        if (x < 0 || y < 0 || x >= this.map.width || y >= this.map.height) {
            return;
        }

        this.tiles[x + y * this.map.width] = tileID;
    };

    this.getChunk = (chunkX, chunkY) => {

        const key = `${chunkX},${chunkY}`;

        let chunk = this.chunks.get(key);

        if (chunk == null) {
            chunk = new tileChunk(this, chunkX, chunkY);
            this.chunks.set(key, chunk);
        }

        return chunk;
    };

    this.getChunkAtTile = (tileX, tileY) => {

        const chunkX = Math.floor(tileX / CHUNK_SIZE);
        const chunkY = Math.floor(tileY / CHUNK_SIZE);

        return this.getChunk(chunkX, chunkY);
    };

    this.map.addLayer(this);
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
        this.layer.map.width
    );

    this.tileEndY = Math.min(
        this.tileStartY + CHUNK_SIZE,
        this.layer.map.height
    );

    this.build = () => {
        const tileWidth = this.layer.map.tileSize.x;
        const tileHeight = this.layer.map.tileSize.y;

        const width = (this.tileEndX - this.tileStartX) * tileWidth;
        const height = (this.tileEndY - this.tileStartY) * tileHeight;

        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx.clearRect(0, 0, width, height);

        for (let y = this.tileStartY; y < this.tileEndY; y++) {
            for (let x = this.tileStartX; x < this.tileEndX; x++) {
                const tileID = this.layer.getTile(x, y);

                if (tileID === 0) {
                    continue;
                }

                switch (tileID) {
                    case 1:
                        this.ctx.fillStyle = "#4caf50";
                        break;

                    case 2:
                        this.ctx.fillStyle = "#a67c52";
                        break;

                    case 3:
                        this.ctx.fillStyle = "#3498db";
                        break;

                    case 4:
                        this.ctx.fillStyle = "#555555";
                        break;

                    default:
                        this.ctx.fillStyle = "#ff00ff";
                        break;
                }

                //Chunk position
                const localX = (x - this.tileStartX) * tileWidth;
                const localY = (y - this.tileStartY) * tileHeight;

                this.ctx.fillRect(
                    localX,
                    localY,
                    tileWidth,
                    tileHeight
                );
            }
        }

        this.dirty = false;
    };
}

const mapRenderer = function() {
    let currentMap = null;

    this.radius = 1;

    this.setMap = (map) => {
        currentMap = map;
    };

    this.draw = () => {
        if (currentMap == null) {
            return;
        }

        ctx.clearRect(0, 0, screen.resolution.x, screen.resolution.y);

        const tileWidth = currentMap.tileSize.x;
        const tileHeight = currentMap.tileSize.y;

        const chunkPixelWidth = CHUNK_SIZE * tileWidth;
        const chunkPixelHeight = CHUNK_SIZE * tileHeight;

        const centerChunkX = Math.floor(
            -currentMap.position.x / chunkPixelWidth
        );

        const centerChunkY = Math.floor(
            -currentMap.position.y / chunkPixelHeight
        );

        for (let layerIndex = 0; layerIndex < currentMap.layers.length; layerIndex++) {

            const layer = currentMap.layers[layerIndex];

            for (
                let chunkY = centerChunkY - this.radius;
                chunkY <= centerChunkY + this.radius;
                chunkY++
            ) {
                for (
                    let chunkX = centerChunkX - this.radius;
                    chunkX <= centerChunkX + this.radius;
                    chunkX++
                ) {

                    // Don't render chunks outside the map.
                    if (chunkX < 0 || chunkY < 0) {
                        continue;
                    }

                    const chunk = layer.getChunk(chunkX, chunkY);

                    if (chunk.dirty) {
                        chunk.build();
                    }

                    const drawX =
                    chunkX * chunkPixelWidth +
                    currentMap.position.x;

                    const drawY =
                    chunkY * chunkPixelHeight +
                    currentMap.position.y;

                    ctx.drawImage(
                        chunk.canvas,
                        drawX,
                        drawY
                    );
                }
            }
        }
    };
}

//TEST DATA
const testMap = new map(
    256,             // width in tiles
    256,             // height in tiles
    Vec2(16, 16)     // tile size
);

const ground = new tileLayer(testMap, "Ground");

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

const tm_renderer = new mapRenderer();
tm_renderer.setMap(testMap);


// TEST MOVEMENT
let testSpeed = 10;

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            testMap.position.x += testSpeed;
            break;

        case "ArrowRight":
            testMap.position.x -= testSpeed;
            break;

        case "ArrowUp":
            testMap.position.y += testSpeed;
            break;

        case "ArrowDown":
            testMap.position.y -= testSpeed;
            break;
    }
});

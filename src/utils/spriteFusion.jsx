// Función para cargar y generar un mapa desde un archivo JSON
async function loadMapSpriteFusion(mapData, pathTileset, tilesetWidthTiles, tilesetHeightTiles) {
    // Cargar el tileset
    let tileSize = mapData.tileSize;

    const tilesX = tilesetWidthTiles / tileSize;
    const tilesY = tilesetHeightTiles / tileSize;

    // genera todos los tiles para su posterior inicializacion
    generateSprites(tilesX, tilesY, tileSize, pathTileset);

    // utilizar las capas con un z del mayor al menor
    let i = mapData.layers.length * 100;
    // Iterar sobre cada capa del mapa
    mapData.layers.forEach(layer => {
        console.log(typeof layer.collider);

        const layerZ = add([
            z(i),
        ])
        // Crear sprites para cada tile en la capa actual
        layer.tiles.forEach(tile => {
            
                if(layer.collider){
                    layerZ.add([
                        // quitando los dos primeros sprites que son los por defecto de kaboom js
                        sprite(tile.id == 0 || tile.id == 1 ? tile.id +"+" : tile.id),	
                        pos(tile.x * tileSize, tile.y * tileSize),
                        area({ shape: new Rect(vec2(0, 0), 25, 25) }),
                        body({ isStatic: true }),
                    ])
                }else{
                    layerZ.add([
                        // quitando los dos primeros sprites que son los por defecto de kaboom js
                        sprite(tile.id == 0 || tile.id == 1 ? tile.id +"+" : tile.id),	
                        pos(tile.x * tileSize, tile.y * tileSize),
                    ])
                }
                
        });

        i--;
    });


    /* add([
        sprite("100"),
        pos(1000,500),
        area(),
        body({ isStatic: true }),
    ]) */
}

const generateSprites = (tilesX, tilesY, tileSize, pathTileset) => {
    const objects = {};


    const cantidadTiles = tilesX * tilesY;
    //console.log("cantidad de tiles : ", cantidadTiles + "tiles en x : " + tilesX + "tiles en y : " + tilesY + "tileSize : " + tileSize + "pathTileset : " + pathTileset);

    // borar por defecto los sprites de kaboom

    for (let i = 0; i < cantidadTiles; i++) {
        const {x , y} = indexToCoordinates(i+1, tileSize, tilesX);

        //console.log(x,y);
        // quitando los dos primeros sprites que son los por defecto de kaboom js
        objects[i == 0 || i == 1 ? i +"+" : i] = {
            x: x,
            y: y,
            width: tileSize,
            height: tileSize,
            sliceX: 1,
        }
    }


    
    const atlas = loadSpriteAtlas(pathTileset, objects)
}

function indexToCoordinates(index, tileSize, numCols) {
    const row = Math.ceil(index / numCols); // Obtener la fila del índice
    const col = index % numCols === 0 ? numCols : index % numCols; // Obtener la columna del índice
    const x = (col - 1) * tileSize; // Calcular la coordenada x
    const y = (row - 1) * tileSize; // Calcular la coordenada y
    return { x, y };
}


export { loadMapSpriteFusion };
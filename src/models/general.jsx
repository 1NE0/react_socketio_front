import kaboom from "kaboom";
import { Player } from "./player";
import { socket } from "../App";
import tiledKaboom from 'tiled-kaboom'
import map from '../maps/map.json'
import { loadMapSpriteFusion } from "../utils/spriteFusion";
export class GeneralGame{

    players = [];
    playerLocal;
    speed = 200;
    moveSpeed = 200;
    k;
    init (canvas){
        // inicializar kaboom
        this.k = kaboom({
            font: "pixelmix",
            canvas: document.querySelector(canvas),
            fullscreen: true,
            /* width: 1000,
            height: 1000, */
            background: [255, 255, 255],
            plugins: [tiledKaboom],
        })

        // slice a spritesheet and add anims manually
        loadSprite("player", "/public/assets/player.png", {
            sliceX: 4, // Número de divisiones horizontales en el spritesheet (para las 4 direcciones)
            sliceY: 4, // Número de divisiones verticales en el spritesheet (1 porque no hay sub-secciones)
            anims: {
              // Definir animaciones para cada dirección
              up: {
                from: 4, // Índice de la sub-imagen de la dirección hacia arriba
                to: 7,   // Mismo índice que "from" porque solo hay una sub-imagen para cada dirección
                loop: true
            },
              down: {
                from: 0, // Índice de la sub-imagen de la dirección hacia abajo
                to: 3,
                loop: true
              },
              left: {
                from: 8, // Índice de la sub-imagen de la dirección hacia la izquierda
                to: 11,
                loop: true
              },
              right: {
                from: 12, // Índice de la sub-imagen de la dirección hacia la derecha
                to: 15,
                loop: true
              },
            },
        });
    }

    initializePlayerLocal(data){
        const player = add([
            z(1000),
            sprite("player"),
            scale(3),
            anchor("center"),
            pos(width()/2,height()/2),
            area({ shape: new Rect(vec2(0, 6), 10, 5) }),
            health(8),
            body(),
            {
             
            },
        ])

        player.play("down");

        player.onUpdate(() => {
            camPos(player.pos)
        })

        player.onPhysicsResolve(() => {
            camPos(player.pos)
        })

        // llamar al servidor 
        socket.emit('user joined in', {
            "id" : data.id,
            "nombre" : data.name,
            "pos_x" : width()/2,
            "pos_y" : height()/2
        });

        return player;

    }


    userJoined(data){
        
        const player = add([
            sprite("player"),
            z(1000),
            scale(3),
            anchor("center"),
            pos(data.pos_x, data.pos_y),
            area({ shape: new Rect(vec2(0, 6), 12, 12) }),
            health(8),
            body(),
            "player",
            {
                /* dead: false,
                speed: 240, */
            },
        ]);
        
        const playerObj = new Player(data.id, data.name, player);
        
        player.play("down");

        return playerObj;
    }

    async generateMap(){
        // cargar tiled map
        loadMapSpriteFusion(map, "../../public/assets/tilesets/spritesheet2.png", 256, 448 );
    }

    update() {
        // Función para mover al jugador en una dirección específica
        const movePlayer = (dir) => {
            this.playerLocal.objPlayer.move(dir.scale(this.moveSpeed));
            // Emitir movimiento al servidor
            socket.emit('user moved', {
                playerId: this.playerLocal.id,
                pos: { x: this.playerLocal.objPlayer.pos.x, y: this.playerLocal.objPlayer.pos.y },
                dir: dir // También puedes enviar la dirección si es necesaria para la animación en los clientes
            });
        }
    
        // Mover al jugador en la dirección correspondiente al presionar las teclas
        onKeyDown("up", () => movePlayer(vec2(0, -1)));
        onKeyDown("down", () => movePlayer(vec2(0, 1)));
        onKeyDown("left", () => movePlayer(vec2(-1, 0)));
        onKeyDown("right", () => movePlayer(vec2(1, 0)));
    
        // Cambiar animaciones
        onKeyPress("up", () => this.playerLocal.objPlayer.play("up"));
        onKeyPress("down", () => this.playerLocal.objPlayer.play("down"));
        onKeyPress("left", () => this.playerLocal.objPlayer.play("left"));
        onKeyPress("right", () => this.playerLocal.objPlayer.play("right"));
    }

}
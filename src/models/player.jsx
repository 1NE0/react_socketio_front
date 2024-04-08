


export class Player{

    id = "";
    name = "";
    objPlayer = null;

    constructor(id, name, playerGame, posx, posy) {
        this.id = id;
        this.name = name;
        this.objPlayer = playerGame
    }


    tojson() {
        return {
            id: this.id,
            name: this.name,
        }
    }

    static fromJson(json) {
        const { id, name, pos_x, pos_y } = json;
        return new Player(id, name, pos_x, pos_y);
    }

}
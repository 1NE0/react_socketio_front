


export class Player{

    id = "";
    name = "";
    objPlayer = null;
    messages = [];

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

    addMessage(msg){
        this.messages.push(msg);
    }

    getMessages(){
        return this.messages;
    }

    getFirstMessage(){
        return this.messages[0];
    }

}
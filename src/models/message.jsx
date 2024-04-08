

export class Message {

    avatar = ''
    name = ''
    message = ''
    isMine = false


    constructor(avatar, name, message, isMine) {
        this.avatar = avatar
        this.name = name
        this.message = message
        this.isMine = isMine
    }


    getAvatar() {
        return this.avatar  
    }   

    getName() { 
        return this.name
    }

    getMessage() {
        return this.message
    }

    getIsMine() {
        return this.isMine
    }
}
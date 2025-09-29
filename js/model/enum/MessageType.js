export class MessageType{
    #name;

    static INFO = new MessageType("INFO");
    static WARNING = new MessageType("WARNING");
    static SUCCESS = new MessageType("SUCCESS");
    static ERROR = new MessageType("ERROR");
    
    constructor(name){
        this.#name = name;
    }

    name(){
        return this.#name;
    }

    static values(){
        return [
        Filtertype.INFO,
        Filtertype.WARNING,
        Filtertype.SUCCESS,
        Filtertype.ERROR];
    }
}
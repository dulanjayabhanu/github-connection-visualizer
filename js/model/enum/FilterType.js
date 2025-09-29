export class Filtertype{
    #name;

    static FANS_ONLY = new Filtertype("FANS_ONLY");
    static UNFOLLOWERS_ONLY = new Filtertype("UNFOLLOWERS_ONLY");
    static MIXED_RESULT = new Filtertype("MIXED_RESULT");
    static SETTLED_RESULT = new Filtertype("SETTLED_RESULT");

    constructor(name){
        this.#name = name;
    }

    name(){
        return this.#name;
    }

    static values(){
        return [
        Filtertype.FANS_ONLY,
        Filtertype.UNFOLLOWERS_ONLY,
        Filtertype.MIXED_RESULT,
        Filtertype.SETTLED_RESULT];
    }
}
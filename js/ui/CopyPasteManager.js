export class CopyPasteManager{
    static #singleton;

    constructor(){
        if(CopyPasteManager.#singleton){
            throw new Error("CopyPasteManager has a private consturctor");
        }
    }

    static getInstance(){
        if(!CopyPasteManager.#singleton){
            CopyPasteManager.#singleton = new CopyPasteManager();
        }

        return CopyPasteManager.#singleton;
    }

    async copy(targetContent){

        let message = null;

        try{
            await navigator.clipboard.writeText(targetContent);
            message = "Copied";

        }catch(Error){
            message = "Failed To Copy";
        }

        return message;
    }
}